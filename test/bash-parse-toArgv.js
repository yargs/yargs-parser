/* global describe, it */

const toArgv = require('../').toArgv

require('chai').should()

describe('Parser.toArgv() - bash-parse string of arguments to argv', function () {
  it('handles trivial string', function () {
    var args = toArgv('--foo ab cd ef')
    args.should.deep.equal(['--foo', 'ab', 'cd', 'ef'])
  })

  it('handles trivial string with additional spaces', function () {
    var args = toArgv('--foo   ab  cd  ef  ')
    args.should.deep.equal(['--foo', 'ab', 'cd', 'ef'])
  })

  it('handles quoted separated string', function () {
    var args = toArgv('--foo ab "cd ef"')
    args.should.deep.equal(['--foo', 'ab', 'cd ef'])
  })

  it('handles escaped delimiter', function () {
    var args = toArgv(String.raw`--foo ab cd\ ef`)
    args.should.deep.equal(['--foo', 'ab', 'cd ef'])
  })

  it('handles escaped special character', function () {
    var args = toArgv(String.raw`--foo ab\ncd`)
    args.should.deep.equal(['--foo', 'abncd'])
  })

  it('handles single quotes within double quotes', function () {
    var args = toArgv(String.raw`--foo ab "c\'d" ef`)
    args.should.deep.equal(['--foo', 'ab', "c\\'d", 'ef'])
  })

  it('handles double quotes within single quotes', function () {
    var args = toArgv(String.raw`--foo ab '"cd"' ef`)
    args.should.deep.equal(['--foo', 'ab', '"cd"', 'ef'])
  })

  it('handles double quoted empty strings', function () {
    var args = toArgv(String.raw`--foo ab "" cd ""`)
    args.should.deep.equal(['--foo', 'ab', '', 'cd', ''])
  })

  it('handles single quoted empty strings', function () {
    var args = toArgv(String.raw`--foo ab '' cd ''`)
    args.should.deep.equal(['--foo', 'ab', '', 'cd', ''])
  })

  it('handles escaped double quotes', function () {
    var args = toArgv(String.raw`--foo ab \"cd ef\"`)
    args.should.deep.equal(['--foo', 'ab', '"cd', 'ef"'])
  })

  it('handles escaped single quotes', function () {
    var args = toArgv(String.raw`--foo 'a'\''b'`)
    args.should.deep.equal(['--foo', "a'b"])
  })

  it('handles quoted string with no spaces', function () {
    var args = toArgv("--foo 'hello'")
    args.should.deep.equal(['--foo', 'hello'])
  })

  it('handles single quoted string with spaces', function () {
    var args = toArgv("--foo 'hello world' --bar='foo bar'")
    args.should.deep.equal(['--foo', 'hello world', '--bar=foo bar'])
  })

  it('handles double quoted string with spaces', function () {
    var args = toArgv('--foo "hello world" --bar="foo bar"')
    args.should.deep.equal(['--foo', 'hello world', '--bar=foo bar'])
  })
})
