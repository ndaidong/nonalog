// eval.js

import { logger, debug, error, trace } from './main.js'

console.log('Work with default methods')
debug('This is debug message')
error('This is error message')
trace('This is trace message')

console.log('Work with `logger` factory')
const myappLog = logger('myapp')
myappLog.debug('myapp: This is debug message')
myappLog.error('myapp: This is error message')
myappLog.trace('myapp: This is trace message')

console.log('Work with instance `serviceLogA` created from `myappLog`')
const serviceLogA = myappLog.branch('myServiceLogA')
serviceLogA.debug('serviceLogA: This is debug message')
serviceLogA.error('serviceLogA: This is error message')
serviceLogA.trace('serviceLogA: This is trace message')

console.log('Work with instance `serviceLogB` created from `myappLog`')
const serviceLogB = myappLog.branch('myServiceLogB')
serviceLogB.debug('serviceLogB: This is debug message')
serviceLogB.error('serviceLogB: This is error message')
serviceLogB.trace('serviceLogB: This is trace message')

console.log('Work with log from a module belong to `serviceLogA`')
const moduleLogA1 = serviceLogA.branch('myModuleA1')
moduleLogA1.debug('moduleLogA1: This is debug message')
moduleLogA1.error('moduleLogA1: This is error message')
moduleLogA1.trace('moduleLogA1: This is trace message')

console.log('Work with log from a module belong to `serviceLogB`')
const moduleLogB1 = serviceLogB.branch('myModuleB1')
moduleLogB1.debug('moduleLogB1: This is debug message')
moduleLogB1.error('moduleLogB1: This is error message')

console.log('Another way to create `myModuleA1` and `myModuleB1`')
const moduleLogA1X = logger('myapp:myServiceLogA:myModuleA1')
moduleLogA1X.debug('moduleLogA1X: This is debug message')
moduleLogA1X.error('moduleLogA1X: This is error message')
const moduleLogB1X = logger('myapp:myServiceLogB:myModuleB1')
moduleLogB1X.debug('moduleLogB1X: This is debug message')
moduleLogB1X.error('moduleLogB1X: This is error message')
