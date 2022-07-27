# nonalog

**No**de.js **na**tive **log**ger

![nonalog](https://res.cloudinary.com/pwshub/image/upload/v1658918465/documentation/Screenshot-nonalog.jpg)


## Why was `nanolog` created?

Because I just need a very simple logger to view log messages in terminal.

I have used many loggers and they are all good, but their great features I almost never use.


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
import { logger, debug, error, trace } from 'article-parser'

// regular usage
debug('This is debug message')
// --> {PID} | {TIME} | DEBUG | This is debug message
error('This is error message')
// --> {PID} | {TIME} | ERROR | This is error message
trace('This is trace message')
// --> {PID} | {trace} | TRACE | This is error message
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

### logger(String namespace, Object options)

- `namespace`: optional, e.g "servicename", "service:module", "node1:serviceX:module8", etc
- `options`: optional
  - `enable`: Boolean, enable logger or not (default: `true`)
  - `print`: Boolean, print out log or not (default: `true`)
  - `event`: Boolean, trigger events or not (default: `false`)

Returns a logger instance, with the following methods:

- `debug()`: print out debug log
- `error()`: print out error log
- `trace()`: print out trace log and tracing data
- `brance()`: create logger instance at sub level of current instance

*Note*:

- No problem to create multi logger instances with the same namesapce
- `logger('service:module')` and `logger('service').branch('module')` are similar:


### debug(argurments)
### error(argurments)
### trace(argurments)

## Events

### onDebug(Function)
### onError(Function)
### onTrace(Function)

// continue working...
