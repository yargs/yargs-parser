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
      strictEqual(looksLikeNumber('0x10'), true)

      strictEqual(looksLikeNumber('0100'), false)
      strictEqual(looksLikeNumber('apple'), false)
    })
  })
})
