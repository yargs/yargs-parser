/* global describe, it */

const { strictEqual } = require('assert')
const { camelCase, decamelize, looksLikeNumber } = require('../build/index.cjs')

describe('string-utils', function () {
  describe('camelCase', () => {
    it('converts string with hypen in middle to camel case', () => {
      strictEqual(camelCase('hello-world'), 'helloWorld')
    })
    it('removes leading hyphens', () => {
      strictEqual(camelCase('-goodnight-moon'), 'goodnightMoon')
    })
    it('camelCase string stays as is', () => {
      strictEqual(camelCase('iAmCamelCase'), 'iAmCamelCase')
    })
    it('uppercase string with underscore to camel case', () => {
      strictEqual(camelCase('NODE_VERSION'), 'nodeVersion')
    })
  })
  describe('decamelize', () => {
    it('adds hyphens back to camelcase string', () => {
      strictEqual(decamelize('helloWorld'), 'hello-world')
    })
  })
  describe('looksLikeNumber', () => {
    it('it detects strings that could be parsed as numbers', () => {
      strictEqual(looksLikeNumber('3293'), true)
      strictEqual(looksLikeNumber('0x10'), true)
      strictEqual(looksLikeNumber('.1'), true)
      strictEqual(looksLikeNumber('0.1'), true)
      strictEqual(looksLikeNumber('0.10'), true)

      strictEqual(looksLikeNumber('00.1'), false)
      strictEqual(looksLikeNumber('0100'), false)
      strictEqual(looksLikeNumber('apple'), false)
    })
  })
})
