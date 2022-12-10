// main.test

/* eslint-env jest */

import { isFunction, isObject, hasProperty } from 'bellajs'

import { logger, debug, error, trace, onDebug, onError, onTrace } from './main.js'

describe('test core APIs', () => {
  test('Check if logger function is ready', () => {
    expect(isFunction(logger)).toBeTruthy()
  })
  test('Check if default methods are ready', () => {
    expect(isFunction(debug)).toBeTruthy()
    expect(isFunction(error)).toBeTruthy()
    expect(isFunction(trace)).toBeTruthy()
  })
  test('test debug output messages', () => {
    const output = debug('this is debug message')
    expect(output.includes('DEBUG')).toBeTruthy()
    expect(output.includes('this is debug message')).toBeTruthy()
    expect(debug() === null).toBeTruthy()
  })
  test('test error output messages', () => {
    const output = error('this is error message')
    expect(output.includes('ERROR')).toBeTruthy()
    expect(output.includes('this is error message')).toBeTruthy()
    expect(error() === null).toBeTruthy()
  })
  test('test trace output messages', () => {
    const output = trace('this is trace message')
    expect(output.includes('TRACE')).toBeTruthy()
    expect(output.includes('this is trace message')).toBeTruthy()
    expect(trace() === null).toBeTruthy()
  })
})

describe('test logger instance and its sub level', () => {
  const sublogger = logger('sub')
  test("Check if sublogger's methods are ready", () => {
    expect(isFunction(sublogger.debug)).toBeTruthy()
    expect(isFunction(sublogger.error)).toBeTruthy()
    expect(isFunction(sublogger.trace)).toBeTruthy()
    expect(isFunction(sublogger.branch)).toBeTruthy()
  })

  test('test debug output messages', () => {
    const output = sublogger.debug('this is debug message')
    expect(output.includes('sub')).toBeTruthy()
    expect(output.includes('DEBUG')).toBeTruthy()
    expect(output.includes('this is debug message')).toBeTruthy()
  })

  test('test error output messages', () => {
    const output = sublogger.error('this is error message')
    expect(output.includes('sub')).toBeTruthy()
    expect(output.includes('ERROR')).toBeTruthy()
    expect(output.includes('this is error message')).toBeTruthy()
  })

  test('test trace output messages', () => {
    const output = sublogger.trace('this is trace message')
    expect(output.includes('sub')).toBeTruthy()
    expect(output.includes('TRACE')).toBeTruthy()
    expect(output.includes('this is trace message')).toBeTruthy()
  })

  test('Test child instance created from sub level', () => {
    const subOfSubLogger = sublogger.branch('child')
    expect(isFunction(subOfSubLogger.debug)).toBeTruthy()
    expect(isFunction(subOfSubLogger.error)).toBeTruthy()
    expect(isFunction(subOfSubLogger.trace)).toBeTruthy()
    expect(isFunction(subOfSubLogger.branch)).toBeTruthy()
  })
})

describe('test log events', () => {
  test('Check if logger events is ready', () => {
    expect(isFunction(onDebug)).toBeTruthy()
    expect(isFunction(onError)).toBeTruthy()
    expect(isFunction(onTrace)).toBeTruthy()
  })

  const eventLogger = logger('event:test', { event: true })
  test('test onDebug event', () => {
    onDebug((data) => {
      console.log(data)
      expect(isObject(data)).toBeTruthy()
      expect(hasProperty(data, 'level')).toBeTruthy()
      expect(data.level === 'debug').toBeTruthy()
      expect(hasProperty(data, 'message')).toBeTruthy()
      expect(data.message.includes('this is debug message')).toBeTruthy()
    })
    eventLogger.debug('this is debug message')
  })
  test('test onError event', () => {
    onError((data) => {
      expect(isObject(data)).toBeTruthy()
      expect(hasProperty(data, 'level')).toBeTruthy()
      expect(data.level === 'error').toBeTruthy()
      expect(hasProperty(data, 'message')).toBeTruthy()
      expect(data.message.includes('this is error message')).toBeTruthy()
    })
    eventLogger.error('this is error message')
  })
  test('test onTrace event', () => {
    onTrace((data) => {
      expect(isObject(data)).toBeTruthy()
      expect(hasProperty(data, 'level')).toBeTruthy()
      expect(data.level === 'trace').toBeTruthy()
      expect(hasProperty(data, 'message')).toBeTruthy()
      expect(data.message.includes('this is trace message')).toBeTruthy()
    })
    eventLogger.trace('this is trace message')
  })
})
