/* global describe, it */

const { expect } = require('chai')
const { camelCase, decamelize } = require('../build/index.cjs')

describe('string-utils', function () {
  describe('camelCase', () => {
    it('converts string with hypen in middle to camel case', () => {
      expect(camelCase('hello-world')).to.equal('helloWorld')
    })
    it('removes leading hyphens', () => {
      expect(camelCase('-goodnight-moon')).to.equal('goodnightMoon')
    })
  })
  describe('decamelize', () => {
    it('adds hyphens back to camelcase string', () => {
      expect(decamelize('helloWorld')).to.equal('hello-world')
    })
  })
})
