// index.test

import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import { isFunction, isObject, hasProperty } from 'bellajs'

import { logger, debug, info, error, trace, onDebug, onInfo, onError, onTrace } from './index.js'

describe('test core APIs', () => {
  test('Check if logger function is ready', () => {
    assert.equal(isFunction(logger), true)
  })
  test('Check if default methods are ready', () => {
    assert.equal(isFunction(debug), true)
    assert.equal(isFunction(info), true)
    assert.equal(isFunction(error), true)
    assert.equal(isFunction(trace), true)
  })
  test('test debug output messages', () => {
    const output = debug('this is debug message')
    assert.equal(output.includes('DEBUG'), true)
    assert.equal(output.includes('this is debug message'), true)
    assert.equal(debug(), null)
  })
  test('test info output messages', () => {
    const output = info('this is info message')
    assert.equal(output.includes('INFO'), true)
    assert.equal(output.includes('this is info message'), true)
    assert.equal(info(), null)
  })
  test('test error output messages', () => {
    const output = error('this is error message')
    assert.equal(output.includes('ERROR'), true)
    assert.equal(output.includes('this is error message'), true)
    assert.equal(error(), null)
  })
  test('test trace output messages', () => {
    const output = trace('this is trace message')
    assert.equal(output.includes('TRACE'), true)
    assert.equal(output.includes('this is trace message'), true)
    assert.equal(trace(), null)
  })
})

describe('test logger instance and its sub level', () => {
  const sublogger = logger('sub')
  test('Check if sublogger\'s methods are ready', () => {
    assert.equal(isFunction(sublogger.debug), true)
    assert.equal(isFunction(sublogger.info), true)
    assert.equal(isFunction(sublogger.error), true)
    assert.equal(isFunction(sublogger.trace), true)
    assert.equal(isFunction(sublogger.branch), true)
  })

  test('test debug output messages', () => {
    const output = sublogger.debug('this is debug message')
    assert.equal(output.includes('sub'), true)
    assert.equal(output.includes('DEBUG'), true)
    assert.equal(output.includes('this is debug message'), true)
  })

  test('test info output messages', () => {
    const output = sublogger.info('this is info message')
    assert.equal(output.includes('sub'), true)
    assert.equal(output.includes('INFO'), true)
    assert.equal(output.includes('this is info message'), true)
  })

  test('test error output messages', () => {
    const output = sublogger.error('this is error message')
    assert.equal(output.includes('sub'), true)
    assert.equal(output.includes('ERROR'), true)
    assert.equal(output.includes('this is error message'), true)
  })

  test('test trace output messages', () => {
    const output = sublogger.trace('this is trace message')
    assert.equal(output.includes('sub'), true)
    assert.equal(output.includes('TRACE'), true)
    assert.equal(output.includes('this is trace message'), true)
  })

  test('Test child instance created from sub level', () => {
    const subOfSubLogger = sublogger.branch('child')
    assert.equal(isFunction(subOfSubLogger.debug), true)
    assert.equal(isFunction(subOfSubLogger.info), true)
    assert.equal(isFunction(subOfSubLogger.error), true)
    assert.equal(isFunction(subOfSubLogger.trace), true)
    assert.equal(isFunction(subOfSubLogger.branch), true)
  })
})

describe('test log events', () => {
  test('Check if logger events is ready', () => {
    assert.equal(isFunction(onDebug), true)
    assert.equal(isFunction(onInfo), true)
    assert.equal(isFunction(onError), true)
    assert.equal(isFunction(onTrace), true)
  })

  const eventLogger = logger('event:test', { event: true })

  test('test onDebug event', () => {
    onDebug((data) => {
      assert.equal(isObject(data), true)
      assert.equal(hasProperty(data, 'level'), true)
      assert.equal(data.level === 'debug', true)
      assert.equal(hasProperty(data, 'message'), true)
      assert.equal(data.message.includes('this is debug message'), true)
    })
    eventLogger.debug('this is debug message')
  })

  test('test onInfo event', () => {
    onInfo((data) => {
      assert.equal(isObject(data), true)
      assert.equal(hasProperty(data, 'level'), true)
      assert.equal(data.level === 'info', true)
      assert.equal(hasProperty(data, 'message'), true)
      assert.equal(data.message.includes('this is info message'), true)
    })
    eventLogger.info('this is info message')
  })

  test('test onError event', () => {
    onError((data) => {
      assert.equal(isObject(data), true)
      assert.equal(hasProperty(data, 'level'), true)
      assert.equal(data.level === 'error', true)
      assert.equal(hasProperty(data, 'message'), true)
      assert.equal(data.message.includes('this is error message'), true)
    })
    eventLogger.error('this is error message')
  })

  test('test onTrace event', () => {
    onTrace((data) => {
      assert.equal(isObject(data), true)
      assert.equal(hasProperty(data, 'level'), true)
      assert.equal(data.level === 'trace', true)
      assert.equal(hasProperty(data, 'message'), true)
      assert.equal(data.message.includes('this is trace message'), true)
    })
    eventLogger.trace('this is trace message')
  })
})
