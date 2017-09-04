/* global describe, it */

var tokenizeArgString = require('../lib/tokenize-arg-string')

require('chai').should()
var expect = require('chai').expect

describe('TokenizeArgString', function () {
  it('handles unquoted string', function () {
    var args = tokenizeArgString('--foo 99')
    args[0].should.equal('--foo')
    args[1].should.equal('99')
  })

  it('handles quoted string with no spaces', function () {
    var args = tokenizeArgString("--foo 'hello'")
    args[0].should.equal('--foo')
    args[1].should.equal('hello')
  })

  it('handles single quoted string with spaces', function () {
    var args = tokenizeArgString("--foo 'hello world' --bar='foo bar'")
    args[0].should.equal('--foo')
    args[1].should.equal('hello world')
    args[2].should.equal('--bar=foo bar')
  })

  it('handles double quoted string with spaces', function () {
    var args = tokenizeArgString('--foo "hello world" --bar="foo bar"')
    args[0].should.equal('--foo')
    args[1].should.equal('hello world')
    args[2].should.equal('--bar=foo bar')
  })

  it('handles quoted string with embeded quotes', function () {
    var args = tokenizeArgString('--foo "hello \'world\'" --bar=\'foo "bar"\'')
    args[0].should.equal('--foo')
    args[1].should.equal('hello \'world\'')
    args[2].should.equal('--bar=foo "bar"')
  })

  it('multiple spaces only counted in quotes', function () {
    var args = tokenizeArgString('foo  bar  "foo  bar"')
    args[0].should.equal('foo')
    expect(args[1]).equal('bar')
    expect(args[2]).equal('foo  bar')
  })
})
