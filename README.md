# nonalog

**No**de.js **na**tive **log**ger

[![NPM](https://badge.fury.io/js/nonalog.svg)](https://badge.fury.io/js/nonalog)
![CI test](https://github.com/ndaidong/nonalog/workflows/ci-test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/nonalog/badge.svg)](https://coveralls.io/github/ndaidong/nonalog)
![CodeQL](https://github.com/ndaidong/nonalog/workflows/CodeQL/badge.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


![nonalog](https://res.cloudinary.com/pwshub/image/upload/v1658918465/documentation/Screenshot-nonalog.jpg)


## Why was `nonalog` created?

Because I just need a very simple logger to view log messages in terminal.

I have used many loggers and they are all good, but their great features I almost never use.

In addition, I don't like the complexity of the concepts `formatter`, `transport`, etc.


## Features

- print out the logs to terminal, different colors for each type of log
- allow distinguishing where the log comes from using namespace
- trigger events to add more handlers, e.g saving to a database
- extremely fast, only native `console.log` and `console.error` with very little tweaking

## Install

- Node.js

  ```bash
  npm i nanolog

  # pnpm
  pnpm i nanolog

  # yarn
  yarn add nanolog
  ```

### Usage

```js
import { logger, debug, error, trace } from 'nonalog'

// regular usage
debug('This is debug message')
// --> {PID} | {TIME} | DEBUG | This is debug message
error('This is error message')
// --> {PID} | {TIME} | ERROR | This is error message
trace('This is trace message')
// --> {PID} | {TIME} | TRACE | This is error message
// tracing data

// create logger instance for service `dataminer`
const dataminerLog = logger('dataminer')
dataminerLog.debug('Connecting to Postgres Database')
// --> {PID} | {TIME} | dataminer | DEBUG | Connecting to Postgres Database
dataminerLog.error('Could not connect to Postgres Database')
// --> {PID} | {TIME} | dataminer | ERROR | Could not connect to Postgres Database

// create logger instance for module `normalizer` in service `dataminer`
const normalizerLog = dataminerLog.branch('normalizer')
normalizerLog.debug('Fill the missing values')
// --> {PID} | {TIME} | dataminer / normalizer | DEBUG | Fill the missing values
normalizerLog.debug('Resolve inconsistent data')
// --> {PID} | {TIME} | dataminer / normalizer | DEBUG | Resolve inconsistent data
```

## APIs

### `logger(String namespace, Object options)`

- `namespace`: optional, e.g "servicename", "service:module", "node1:serviceX:module8", etc
- `options`: optional
  - `enable`: Boolean, enable logger or not (default: `true`)
  - `print`: Boolean, print out log or not (default: `true`)
  - `event`: Boolean, trigger events or not (default: `false`)
  - `separator`: String, to display the namespace by level (default: ` / `)

Returns a logger instance, with the following methods:

- `debug()`: print out debug log
- `error()`: print out error log
- `trace()`: print out trace log and tracing data
- `brance()`: create logger instance at sub level of current instance

*Note*:

- No problem to create multi logger instances with the same namesapce
- `logger('service:module:component')` and `logger('service').branch('module').branch('component')` are similar


### `debug(argurments)`

Print out debug message.

```js
import { debug } from 'nonalog'

debug('This is debug message')
// --> 201374 | 2022-07-27T13:02:13.240Z | DEBUG | This is debug message

debug('Welcome message', { name: 'Alice' }, [1, 2, 3, 4, 5])
// --> 201374 | 2022-07-27T13:02:13.243Z | DEBUG | Welcome message { name: 'Alice' } [ 1, 2, 3, 4, 5 ]
```

### `error(argurments)`

Print out error message.

```js
import { error } from 'nonalog'

error('Error occurred while sending email', { subject: 'Hello', body: 'hi Bob, Long time no see' })
// --> 204753 | 2022-07-27T13:05:53.395Z | ERROR | Error occurred while sending email { subject: 'Hello', body: 'hi Bob, Long time no see' }
```

### `trace(argurments)`

Print out tracing log and data.

```js
import { trace } from 'nonalog'

trace(new Error('Something went wrong'))
```

![nonalog tracing](https://res.cloudinary.com/pwshub/image/upload/v1658927360/documentation/nonalog_-_tracing.png)


## Events

Event listener allows to add more actions on the logs when they are printed out, such as write to file, insert into database or send to somewhere.

This simple approach frees the lazy developers like me from the unnecessary confusions.

Events will be applied to all existing logger instances, which have `event` option enabled.

### `onDebug(Function callback)`

```js
import Database from 'better-sqlite3'
import { logger, onDebug } from 'nonalog'

const appLog = logger('myapp', { event: true })

const logDB = new Database('/path/to/applogs.sqlite3', {
  timeout: 1e4
})

onDebug((msg) => {
  // insert into sqlite db
  const sql = logDB.prepare(`
    INSERT INTO logs (message) VALUES (?)
  `)
  sql.run(msg)
})

appLog.debug('Load user data from backup file')
```

### `onError(Function callback)`

Same as `onDebug()`, but triggered with `error` log.

### `onTrace(Function callback)`

Same as `onDebug()`, but triggered with `trace` log.

## Test

```bash
git clone https://github.com/ndaidong/nonalog.git
cd nonalog
pnpm i
npm test
```

# License

The MIT License (MIT)
