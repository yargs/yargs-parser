/* global describe, it */

const tokenizeArgString = require('../lib/tokenize-arg-string')

require('chai').should()
const expect = require('chai').expect

describe('TokenizeArgString', function () {
  it('handles unquoted string', function () {
    const args = tokenizeArgString('--foo 99')
    args[0].should.equal('--foo')
    args[1].should.equal('99')
  })

  it('handles unquoted numbers', function () {
    const args = tokenizeArgString(['--foo', 9])
    args[0].should.equal('--foo')
    args[1].should.equal('9')
  })

  it('handles quoted string with no spaces', function () {
    const args = tokenizeArgString("--foo 'hello'")
    args[0].should.equal('--foo')
    args[1].should.equal("'hello'")
  })

  it('handles single quoted string with spaces', function () {
    const args = tokenizeArgString("--foo 'hello world' --bar='foo bar'")
    args[0].should.equal('--foo')
    args[1].should.equal("'hello world'")
    args[2].should.equal("--bar='foo bar'")
  })

  it('handles double quoted string with spaces', function () {
    const args = tokenizeArgString('--foo "hello world" --bar="foo bar"')
    args[0].should.equal('--foo')
    args[1].should.equal('"hello world"')
    args[2].should.equal('--bar="foo bar"')
  })

  it('handles single quoted empty string', function () {
    const args = tokenizeArgString('--foo \'\' --bar=\'\'')
    args[0].should.equal('--foo')
    args[1].should.equal("''")
    args[2].should.equal("--bar=''")
  })

  it('handles double quoted empty string', function () {
    const args = tokenizeArgString('--foo "" --bar=""')
    args[0].should.equal('--foo')
    args[1].should.equal('""')
    args[2].should.equal('--bar=""')
  })

  it('handles quoted string with embedded quotes', function () {
    var args = tokenizeArgString('--foo "hello \'world\'" --bar=\'foo "bar"\'')
    args[0].should.equal('--foo')
    args[1].should.equal('"hello \'world\'"')
    args[2].should.equal('--bar=\'foo "bar"\'')
  })

  // https://github.com/yargs/yargs-parser/pull/100
  // https://github.com/yargs/yargs-parser/pull/106
  it('ignores unneeded spaces', function () {
    const args = tokenizeArgString('  foo  bar  "foo  bar"  ')
    args[0].should.equal('foo')
    expect(args[1]).equal('bar')
    expect(args[2]).equal('"foo  bar"')
  })
})
