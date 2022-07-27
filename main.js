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

const getColor = (type) => {
  const conf = {
    debug: STYLE.cyan,
    error: STYLE.red,
    trace: STYLE.yellow
  }
  return conf[type]
}

const createLogLine = (args, namespace, separator, type) => {
  const parts = [pid]

  parts.push(`${STYLE.green}${(new Date()).toISOString()}${STYLE.reset}`)

  const namespaces = [...new Set(namespace.split(':').filter(ns => ns !== ''))]
  if (namespaces.length > 0) {
    parts.push(`${STYLE.bold}${STYLE.magenta}${namespaces.join(separator)}${STYLE.reset}`)
  }

  parts.push(`${STYLE.bold}${getColor(type)}${type.toUpperCase()}${STYLE.reset}`)

  const msg = args.map((item) => {
    return format(item)
  }).join(' ')
  parts.push(`${getColor(type)}${msg}${STYLE.reset}`)

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

const triggerEvent = (evt, message) => {
  event[evt].forEach((fn) => {
    fn(message)
  })
}

const _debug = (args, namespace, options) => {
  const { print = true, event = false, separator = ' / ' } = options
  const txt = createLogLine(args, namespace, separator, 'debug')
  if (print) console.debug(txt)
  if (event) triggerEvent('debug', txt)
  return txt
}

const _error = (args, namespace, options) => {
  const { print = true, event = false, separator = ' / ' } = options
  const txt = createLogLine(args, namespace, separator, 'error')
  if (print) console.error(txt)
  if (event) triggerEvent('error', txt)
  return txt
}

const _trace = (args, namespace, options) => {
  const { print = true, event = false, separator = ' / ' } = options
  const txt = createLogLine(args, namespace, separator, 'trace')
  if (print) {
    console.log('-'.repeat(80))
    console.trace(txt)
    console.log('-'.repeat(80))
  }
  if (event) triggerEvent('trace', txt)
  return txt
}

export const logger = (namespace = '', options = {}) => {
  const { enable = true } = options
  const instance = {
    debug: (...args) => {
      return args.length ? enable && _debug(args, namespace, options) : null
    },
    error: (...args) => {
      return args.length ? enable && _error(args, namespace, options) : null
    },
    trace: (...args) => {
      return args.length ? enable && _trace(args, namespace, options) : null
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
