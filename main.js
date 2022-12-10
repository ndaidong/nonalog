// logger

import { pid } from 'node:process'
import { format } from 'util'

const STYLE = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

const getColor = (level) => {
  const conf = {
    debug: STYLE.cyan,
    error: STYLE.red,
    trace: STYLE.yellow
  }
  return conf[level]
}

const createLogLine = (args, namespace, separator, level, ts) => {
  const parts = [pid]

  parts.push(`${STYLE.green}${ts}${STYLE.reset}`)

  const namespaces = [...new Set(namespace.split(':').filter(ns => ns !== ''))]
  if (namespaces.length > 0) {
    parts.push(`${STYLE.bold}${STYLE.magenta}${namespaces.join(separator)}${STYLE.reset}`)
  }

  parts.push(`${STYLE.bold}${getColor(level)}${level.toUpperCase()}${STYLE.reset}`)

  const msg = args.map((item) => {
    return format(item)
  }).join(' ')
  parts.push(`${getColor(level)}${msg}${STYLE.reset}`)

  return parts.join(' | ')
}

const event = {
  debug: [],
  error: [],
  trace: []
}

export const onDebug = (fn) => {
  event.debug.push(fn)
}

export const onError = (fn) => {
  event.error.push(fn)
}

export const onTrace = (fn) => {
  event.trace.push(fn)
}

const triggerEvent = (evt, data = {}) => {
  event[evt].forEach((fn) => {
    fn(data)
  })
}

const log = (args, namespace, options, level) => {
  const ts = (new Date()).toISOString()
  const { print = true, event = false, separator = ' / ' } = options
  const message = createLogLine(args, namespace, separator, level, ts)
  if (print) {
    if (level === 'trace') {
      console.log('-'.repeat(80))
      console.trace(message)
      console.log('-'.repeat(80))
    } else if (level === 'error') {
      console.error(message)
    } else {
      console.debug(message)
    }
  }
  if (event) {
    const msg = args.map((item) => {
      return format(item)
    }).join(' ')
    triggerEvent(level, {
      namespace,
      level,
      ts,
      args,
      message: msg
    })
  }
  return message
}

export const logger = (namespace = '', options = {}) => {
  const { enable = true } = options
  const instance = {
    debug: (...args) => {
      return args.length ? enable && log(args, namespace, options, 'debug') : null
    },
    error: (...args) => {
      return args.length ? enable && log(args, namespace, options, 'error') : null
    },
    trace: (...args) => {
      return args.length ? enable && log(args, namespace, options, 'trace') : null
    },
    branch: (name, opts = {}) => {
      return logger(`${namespace}:${name}`, opts)
    }
  }
  return instance
}

const defaultLogger = logger()

export const debug = defaultLogger.debug
export const error = defaultLogger.error
export const trace = defaultLogger.trace
