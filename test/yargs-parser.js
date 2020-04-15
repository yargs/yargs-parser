/* global beforeEach, describe, it */

require('chai').should()

const { expect } = require('chai')
const fs = require('fs')
const parser = require('../')
const path = require('path')

describe('yargs-parser', function () {
  it('should parse a "short boolean"', function () {
    var parse = parser(['-b'])
    parse.should.not.have.property('--')
    parse.should.have.property('b').to.be.ok.and.be.a('boolean')
    parse.should.have.property('_').with.length(0)
  })

  it('should parse a "long boolean"', function () {
    var parse = parser('--bool')
    parse.should.not.have.property('--')
    parse.should.have.property('bool', true)
    parse.should.have.property('_').with.length(0)
  })

  it('should place bare options in the _ array', function () {
    var parse = parser('foo bar baz')
    parse.should.have.property('_').and.deep.equal(['foo', 'bar', 'baz'])
  })

  it('should set the value of the final option in a group to the next supplied value', function () {
    var parse = parser(['-cats', 'meow'])
    parse.should.have.property('c', true)
    parse.should.have.property('a', true)
    parse.should.have.property('t', true)
    parse.should.have.property('s', 'meow')
    parse.should.have.property('_').with.length(0)
  })

  it('should set the value of a single long option to the next supplied value', function () {
    var parse = parser(['--pow', 'xixxle'])
    parse.should.have.property('pow', 'xixxle')
    parse.should.have.property('_').with.length(0)
  })

  it('should set the value of a single long option to the next supplied value, even if the value is empty', function () {
    var parse = parser(['--pow', ''])
    parse.should.have.property('pow', '')
    parse.should.have.property('_').with.length(0)
  })

  it('should set the value of a single long option if an = was used', function () {
    var parse = parser(['--pow=xixxle'])
    parse.should.have.property('pow', 'xixxle')
    parse.should.have.property('_').with.length(0)
  })

  it('should set the value of multiple long options to the next supplied values relative to each', function () {
    var parse = parser(['--host', 'localhost', '--port', '555'])
    parse.should.have.property('host', 'localhost')
    parse.should.have.property('port', 555)
    parse.should.have.property('_').with.length(0)
  })

  it('should set the value of multiple long options if = signs were used', function () {
    var parse = parser(['--host=localhost', '--port=555'])
    parse.should.have.property('host', 'localhost')
    parse.should.have.property('port', 555)
    parse.should.have.property('_').with.length(0)
  })

  it('should still set values appropriately if a mix of short, long, and grouped short options are specified', function () {
    var parse = parser(['-h', 'localhost', '-fp', '555', 'script.js'])
    parse.should.have.property('f', true)
    parse.should.have.property('p', 555)
    parse.should.have.property('h', 'localhost')
    parse.should.have.property('_').and.deep.equal(['script.js'])
  })

  it('should still set values appropriately if a mix of short and long options are specified', function () {
    var parse = parser(['-h', 'localhost', '--port', '555'])
    parse.should.have.property('h', 'localhost')
    parse.should.have.property('port', 555)
    parse.should.have.property('_').with.length(0)
  })

  it('should explicitly set a boolean option to false if preceded by "--no-"', function () {
    var parse = parser(['--no-moo'])
    parse.should.have.property('moo', false)
    parse.should.have.property('_').with.length(0)
  })

  it('should still set values appropriately if we supply a comprehensive list of various types of options', function () {
    var parse = parser([
      '--name=meowmers', 'bare', '-cats', 'woo',
      '-h', 'awesome', '--multi=quux',
      '--key', 'value',
      '-b', '--bool', '--no-meep', '--multi=baz',
      '--', '--not-a-flag', '-', '-h', '-multi', '--', 'eek'
    ], {
      configuration: {
        'populate--': false
      }
    })
    parse.should.have.property('c', true)
    parse.should.have.property('a', true)
    parse.should.have.property('t', true)
    parse.should.have.property('s', 'woo')
    parse.should.have.property('h', 'awesome')
    parse.should.have.property('b', true)
    parse.should.have.property('bool', true)
    parse.should.have.property('key', 'value')
    parse.should.have.property('multi').and.deep.equal(['quux', 'baz'])
    parse.should.have.property('meep', false)
    parse.should.have.property('name', 'meowmers')
    parse.should.have.property('_').and.deep.equal(['bare', '--not-a-flag', '-', '-h', '-multi', '--', 'eek'])
  })

  it('should parse numbers appropriately', function () {
    var argv = parser([
      '-x', '1234',
      '-y', '5.67',
      '-z', '1e7',
      '-w', '10f',
      '--hex', '0xdeadbeef',
      '789'
    ])
    argv.should.have.property('x', 1234).and.be.a('number')
    argv.should.have.property('y', 5.67).and.be.a('number')
    argv.should.have.property('z', 1e7).and.be.a('number')
    argv.should.have.property('w', '10f').and.be.a('string')
    argv.should.have.property('hex', 0xdeadbeef).and.be.a('number')
    argv.should.have.property('_').and.deep.equal([789])
    argv._[0].should.be.a('number')
  })

  // addresses: https://github.com/yargs/yargs-parser/issues/33
  it('should handle parsing negative #s', function () {
    var argv = parser([
      '-33', '-177', '33',
      '--n1', '-33',
      '-n', '-44',
      '--n2=-55',
      '--foo.bar', '-33',
      '-o=-55',
      '--bounds', '-180', '99', '-180', '90',
      '--other', '-99', '-220'
    ], {
      array: 'bounds',
      narg: { other: 2 }
    })

    argv._.should.deep.equal([-33, -177, 33])
    argv.n1.should.equal(-33)
    argv.n.should.equal(-44)
    argv.n2.should.equal(-55)
    argv.foo.bar.should.equal(-33)
    argv.o.should.equal(-55)
    argv.bounds.should.deep.equal([-180, 99, -180, 90])
    argv.other.should.deep.equal([-99, -220])
  })

  it('should handle negative (and positive) numbers with decimal places, with or without a leading 0', function () {
    var argv = parser([
      '-0.1', '-1.1', '-.5', '-.1', '.1', '.5',
      '--bounds', '-5.1', '-.1', '.1',
      '--other', '.9', '-.5'
    ], {
      array: 'bounds',
      narg: { other: 2 }
    })

    argv._.should.deep.equal([-0.1, -1.1, -0.5, -0.1, 0.1, 0.5])
    argv.bounds.should.deep.equal([-5.1, -0.1, 0.1])
    argv.other.should.deep.equal([0.9, -0.5])
  })

  it('should set the value of a single short option to the next supplied value, even if the value is empty', function () {
    var parse = parser(['-p', ''])
    parse.should.have.property('p', '')
    parse.should.have.property('_').with.length(0)
  })

  it('should not set the next value as the value of a short option if that option is explicitly defined as a boolean', function () {
    var parse = parser(['-t', 'moo'], {
      boolean: 't'
    })
    parse.should.have.property('t', true).and.be.a('boolean')
    parse.should.have.property('_').and.deep.equal(['moo'])
  })

  it('should set boolean options values if the next value is "true" or "false"', function () {
    var parse = parser(['--verbose', 'false', 'moo', '-t', 'true'], {
      boolean: ['t', 'verbose'],
      default: {
        verbose: true
      }
    })
    parse.should.have.property('verbose', false).and.be.a('boolean')
    parse.should.have.property('t', true).and.be.a('boolean')
    parse.should.have.property('_').and.deep.equal(['moo'])
  })

  it('should not set boolean options values if the next value only contains the words "true" or "false"', function () {
    var parse = parser(['--verbose', 'aaatrueaaa', 'moo', '-t', 'aaafalseaaa'], {
      boolean: ['t', 'verbose']
    })
    parse.should.have.property('verbose', true).and.be.a('boolean')
    parse.should.have.property('t', true).and.be.a('boolean')
    parse.should.have.property('_').and.deep.equal(['aaatrueaaa', 'moo', 'aaafalseaaa'])
  })

  it('should not use next value for boolean/number/string configured with zero narg', function () {
    var parse = parser(['--bool', 'false', '--nr', '7', '--str', 'foo'], {
      boolean: ['bool'],
      number: ['nr'],
      string: ['str'],
      narg: { bool: 0, nr: 0, str: 0 }
    })
    parse.should.have.property('bool', true).and.be.a('boolean')
    parse.should.have.property('nr', undefined).and.be.a('undefined')
    parse.should.have.property('str', '').and.be.a('string')
    parse.should.have.property('_').and.deep.equal(['false', 7, 'foo'])
  })

  it('should allow defining options as boolean in groups', function () {
    var parse = parser(['-x', '-z', 'one', 'two', 'three'], {
      boolean: ['x', 'y', 'z']
    })
    parse.should.have.property('x', true).and.be.a('boolean')
    parse.should.not.have.property('y')
    parse.should.have.property('z', true).and.be.a('boolean')
    parse.should.have.property('_').and.deep.equal(['one', 'two', 'three'])
  })

  it('should correctly parse dot-notation boolean flags', function () {
    var parse = parser(['--nested', '--n.v', '--n.y', 'foo'], {
      boolean: ['nested', 'n.v']
    })

    parse.should.have.property('nested', true).and.be.a('boolean')
    parse.should.have.property('n').and.deep.equal({
      v: true,
      y: 'foo'
    })
  })

  it('should preserve newlines in option values', function () {
    var args = parser(['-s', 'X\nX'])
    args.should.have.property('_').with.length(0)
    args.should.have.property('s', 'X\nX')
    // reproduce in bash:
    // VALUE="new
    // line"
    // node program.js --s="$VALUE"
    args = parser(['--s=X\nX'])
    args.should.have.property('_').with.length(0)
    args.should.have.property('s', 'X\nX')
  })

  it('should not convert numbers to type number if explicitly defined as strings', function () {
    var s = parser(['-s', '0001234'], {
      string: 's'
    }).s
    s.should.be.a('string').and.equal('0001234')
    var x = parser(['-x', '56'], {
      string: ['x']
    }).x
    x.should.be.a('string').and.equal('56')
  })

  it('should default numbers to undefined', function () {
    var n = parser(['-n'], {
      number: ['n']
    }).n
    expect(n).to.equal(undefined)
  })

  it('should default number to NaN if value is not a valid number', function () {
    var n = parser(['-n', 'string'], {
      number: ['n']
    }).n
    expect(n).to.deep.equal(NaN)
  })

  // Fixes: https://github.com/bcoe/yargs/issues/68
  it('should parse flag arguments with no right-hand value as strings, if defined as strings', function () {
    var s = parser(['-s'], {
      string: ['s']
    }).s
    s.should.be.a('string').and.equal('')

    s = parser(['-sf'], {
      string: ['s']
    }).s
    s.should.be.a('string').and.equal('')

    s = parser(['--string'], {
      string: ['string']
    }).string
    s.should.be.a('string').and.equal('')
  })

  it('should leave all non-hyphenated values as strings if _ is defined as a string', function () {
    var s = parser(['  ', '  '], {
      string: ['_']
    })._
    s.should.have.length(2)
    s[0].should.be.a('string').and.equal('  ')
    s[1].should.be.a('string').and.equal('  ')
  })

  describe('normalize', function () {
    it('should normalize redundant paths', function () {
      var a = parser(['-s', ['', 'tmp', '..', ''].join(path.sep)], {
        alias: {
          s: ['save']
        },
        normalize: 's'
      })
      a.should.have.property('s', path.sep)
      a.should.have.property('save', path.sep)
    })

    it('should normalize redundant paths when a value is later assigned', function () {
      var a = parser(['-s'], {
        normalize: ['s']
      })
      a.should.have.property('s', true)
      a.s = ['', 'path', 'to', 'new', 'dir', '..', '..', ''].join(path.sep)
      a.s.should.equal(['', 'path', 'to', ''].join(path.sep))
    })

    it('should normalize when key is also an array', function () {
      var a = parser(['-s', ['', 'tmp', '..', ''].join(path.sep), ['', 'path', 'to', 'new', 'dir', '..', '..', ''].join(path.sep)], {
        alias: {
          s: ['save']
        },
        normalize: 's',
        array: 's'
      })
      var expected = [path.sep, ['', 'path', 'to', ''].join(path.sep)]
      a.should.have.property('s').and.deep.equal(expected)
      a.should.have.property('save').and.deep.equal(expected)
    })

    it('should allow normalized keys to be enumerated', () => {
      var a = parser(['-s', ['', 'tmp', '..', ''].join(path.sep)], {
        alias: {
          s: ['save']
        },
        normalize: 's'
      })
      Object.keys(a).should.include('s')
    })
  })

  describe('alias', function () {
    it('should set alias value to the same value as the full option', function () {
      var argv = parser(['-f', '11', '--zoom', '55'], {
        alias: {
          z: ['zoom']
        }
      })
      argv.should.have.property('zoom', 55)
      argv.should.have.property('z', 55)
      argv.should.have.property('f', 11)
    })

    it('should allow multiple aliases to be specified', function () {
      var argv = parser(['-f', '11', '--zoom', '55'], {
        alias: {
          z: ['zm', 'zoom']
        }
      })

      argv.should.have.property('zoom', 55)
      argv.should.have.property('z', 55)
      argv.should.have.property('zm', 55)
      argv.should.have.property('f', 11)
    })

    // regression, see https://github.com/chevex/yargs/issues/63
    it('should not add the same key to argv multiple times, when creating camel-case aliases', function () {
      var argv = parser(['--health-check=banana', '--second-key', 'apple', '-t=blarg'], {
        alias: {
          h: ['health-check'],
          'second-key': ['s'],
          'third-key': ['t']
        },
        default: {
          h: 'apple',
          'second-key': 'banana',
          'third-key': 'third'
        }
      })

      // before this fix, yargs failed parsing
      // one but not all forms of an arg.
      argv.secondKey.should.eql('apple')
      argv.s.should.eql('apple')
      argv['second-key'].should.eql('apple')

      argv.healthCheck.should.eql('banana')
      argv.h.should.eql('banana')
      argv['health-check'].should.eql('banana')

      argv.thirdKey.should.eql('blarg')
      argv.t.should.eql('blarg')
      argv['third-key'].should.eql('blarg')
    })

    it('should allow transitive aliases to be specified', function () {
      var argv = parser(['-f', '11', '--zoom', '55'], {
        alias: {
          z: 'zm',
          zm: 'zoom'
        }
      })

      argv.should.have.property('zoom', 55)
      argv.should.have.property('z', 55)
      argv.should.have.property('zm', 55)
      argv.should.have.property('f', 11)
    })

    it('should merge two lists of aliases if they collide', function () {
      var argv = parser(['-f', '11', '--zoom', '55'], {
        alias: {
          z: 'zm',
          zoom: 'zoop',
          zm: 'zoom'
        }
      })

      argv.should.have.property('zoom', 55)
      argv.should.have.property('zoop', 55)
      argv.should.have.property('z', 55)
      argv.should.have.property('zm', 55)
      argv.should.have.property('f', 11)
    })

    it('should set single-digit boolean alias', function () {
      var argv = parser(['-f', '11', '-0'], {
        alias: {
          0: 'print0'
        },
        boolean: [
          'print0'
        ]
      })
      argv.should.have.property('print0', true)
      argv.should.have.property('f', 11)
    })

    it('should not set single-digit alias if no alias defined', function () {
      var argv = parser(['-f', '11', '-0', '-1'])
      argv.should.have.property('f', 11)
      argv._.should.deep.equal([-0, -1])
    })

    it('should not set single-digit boolean alias if no boolean defined', function () {
      var argv = parser(['-f', '11', '-9'], {
        alias: {
          0: 'print0'
        }
      })
      argv.should.have.property('f', 11)
      argv._.should.deep.equal([-9])
    })

    it('should be able to negate set single-digit boolean alias', function () {
      var argv = parser(['--no-9'], {
        alias: {
          9: 'max'
        },
        boolean: [
          'max'
        ]
      })
      argv.should.have.property('max', false)
    })
  })

  it('should assign data after forward slash to the option before the slash', function () {
    var parse = parser(['-I/foo/bar/baz'])
    parse.should.have.property('_').with.length(0)
    parse.should.have.property('I', '/foo/bar/baz')
    parse = parser(['-xyz/foo/bar/baz'])
    parse.should.have.property('x', true)
    parse.should.have.property('y', true)
    parse.should.have.property('z', '/foo/bar/baz')
    parse.should.have.property('_').with.length(0)
  })

  const jsonPath = path.resolve(__dirname, './fixtures/config.json')
  describe('config', function () {
    // See: https://github.com/chevex/yargs/issues/12
    it('should load options and values from default config if specified', function () {
      var argv = parser(['--foo', 'bar'], {
        alias: {
          z: 'zoom'
        },
        default: {
          settings: jsonPath
        },
        config: 'settings'
      })

      argv.should.have.property('herp', 'derp')
      argv.should.have.property('zoom', 55)
      argv.should.have.property('foo').and.deep.equal('bar')
    })

    it('should use value from config file, if argv value is using default value', function () {
      var argv = parser([], {
        alias: {
          z: 'zoom'
        },
        config: ['settings'],
        default: {
          settings: jsonPath,
          foo: 'banana'
        }
      })

      argv.should.have.property('herp', 'derp')
      argv.should.have.property('zoom', 55)
      argv.should.have.property('foo').and.deep.equal('baz')
    })

    it('should combine values from config file and argv, if argv value is an array', function () {
      var argv = parser(['--foo', 'bar'], {
        config: ['settings'],
        array: ['foo'],
        default: {
          settings: jsonPath
        },
        configuration: {
          'combine-arrays': true
        }
      })

      argv.should.have.property('foo').and.deep.equal(['bar', 'baz'])
    })

    it('should use value from config file, if argv key is a boolean', function () {
      var argv = parser([], {
        config: ['settings'],
        default: {
          settings: jsonPath
        },
        boolean: ['truthy']
      })

      argv.should.have.property('truthy', true)
    })

    it('should use value from cli, if cli overrides boolean argv key', function () {
      var argv = parser(['--no-truthy'], {
        config: ['settings'],
        default: {
          settings: jsonPath
        },
        boolean: ['truthy']
      })

      argv.should.have.property('truthy', false)
    })

    it('should use cli value, if cli value is set and both cli and default value match', function () {
      var argv = parser(['--foo', 'banana'], {
        alias: {
          z: 'zoom'
        },
        config: ['settings'],
        default: {
          settings: jsonPath,
          foo: 'banana'
        }
      })

      argv.should.have.property('herp', 'derp')
      argv.should.have.property('zoom', 55)
      argv.should.have.property('foo').and.deep.equal('banana')
    })

    it("should allow config to be set as flag in 'option'", function () {
      var argv = parser(['--settings', jsonPath, '--foo', 'bar'], {
        alias: {
          z: 'zoom'
        },
        config: ['settings']
      })

      argv.should.have.property('herp', 'derp')
      argv.should.have.property('zoom', 55)
      argv.should.have.property('foo').and.deep.equal('bar')
    })

    it('should load options and values from a JS file when config has .js extention', function () {
      var jsPath = path.resolve(__dirname, './fixtures/settings.js')
      var argv = parser(['--settings', jsPath, '--foo', 'bar'], {
        config: ['settings']
      })

      argv.should.have.property('herp', 'derp')
      argv.should.have.property('foo', 'bar')
      argv.should.have.property('calculate').and.be.a('function')
    })

    it('should raise an appropriate error if JSON file is not found', function () {
      var argv = parser.detailed(['--settings', 'fake.json', '--foo', 'bar'], {
        alias: {
          z: 'zoom'
        },
        config: ['settings']
      })

      argv.error.message.should.equal('Invalid JSON config file: fake.json')
    })

    // see: https://github.com/bcoe/yargs/issues/172
    it('should not raise an exception if config file is set as default argument value', function () {
      var argv = parser.detailed([], {
        default: {
          config: 'foo.json'
        },
        config: ['config']
      })

      expect(argv.error).to.equal(null)
    })

    it('should load nested options from config file', function () {
      var jsonPath = path.resolve(__dirname, './fixtures/nested_config.json')
      var argv = parser(['--settings', jsonPath, '--nested.foo', 'bar'], {
        config: ['settings']
      })

      argv.should.have.property('a', 'a')
      argv.should.have.property('b', 'b')
      argv.should.have.property('nested').and.deep.equal({
        foo: 'bar',
        bar: 'bar'
      })
    })

    it('should use nested value from config file, if argv value is using default value', function () {
      var jsonPath = path.resolve(__dirname, './fixtures/nested_config.json')
      var argv = parser(['--settings', jsonPath], {
        config: ['settings'],
        default: {
          'nested.foo': 'banana'
        }
      })

      argv.should.have.property('a', 'a')
      argv.should.have.property('b', 'b')
      argv.should.have.property('nested').and.deep.equal({
        foo: 'baz',
        bar: 'bar'
      })
    })

    it('allows a custom parsing function to be provided', function () {
      var jsPath = path.resolve(__dirname, './fixtures/config.txt')
      var argv = parser(['--settings', jsPath, '--foo', 'bar'], {
        config: {
          settings: function (configPath) {
            // as an example, parse an environment
            // variable style config:
            // FOO=99
            // BATMAN=grumpy
            var config = {}
            var txt = fs.readFileSync(configPath, 'utf-8')
            txt.split(/\r?\n/).forEach(function (l) {
              var kv = l.split('=')
              config[kv[0].toLowerCase()] = kv[1]
            })
            return config
          }
        }
      })

      argv.batman.should.equal('grumpy')
      argv.awesome.should.equal('banana')
      argv.foo.should.equal('bar')
    })

    it('allows a custom parsing function to be provided as an alias', function () {
      var jsPath = path.resolve(__dirname, './fixtures/config.json')
      var argv = parser(['--settings', jsPath, '--foo', 'bar'], {
        config: {
          s: function (configPath) {
            return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
          }
        },
        alias: {
          s: ['settings']
        }
      })

      argv.should.have.property('herp', 'derp')
      argv.should.have.property('foo', 'bar')
    })

    it('outputs an error returned by the parsing function', function () {
      var argv = parser.detailed(['--settings=./package.json'], {
        config: {
          settings: function (configPath) {
            return Error('someone set us up the bomb')
          }
        }
      })

      argv.error.message.should.equal('someone set us up the bomb')
    })

    it('outputs an error if thrown by the parsing function', function () {
      var argv = parser.detailed(['--settings=./package.json'], {
        config: {
          settings: function (configPath) {
            throw Error('someone set us up the bomb')
          }
        }
      })

      argv.error.message.should.equal('someone set us up the bomb')
    })

    it('should not pollute the prototype', function () {
      const argv = parser(['--foo', 'bar'], {
        alias: {
          z: 'zoom'
        },
        default: {
          settings: jsonPath
        },
        config: 'settings'
      })

      argv.should.have.property('herp', 'derp')
      argv.should.have.property('zoom', 55)
      argv.should.have.property('foo').and.deep.equal('bar')

      expect({}.bbb).to.equal(undefined)
      expect({}.aaa).to.equal(undefined)
    })
  })

  describe('config objects', function () {
    it('should load options from config object', function () {
      var argv = parser(['--foo', 'bar'], {
        configObjects: [{
          apple: 'apple',
          banana: 42,
          foo: 'baz',
          gotcha: null
        }]
      })

      argv.should.have.property('apple', 'apple')
      argv.should.have.property('banana', 42)
      argv.should.have.property('foo', 'bar')
      argv.should.have.property('gotcha', null)
    })

    it('should use value from config object, if argv value is using default value', function () {
      var argv = parser([], {
        configObjects: [{
          apple: 'apple',
          banana: 42,
          foo: 'baz'
        }],
        default: {
          foo: 'banana'
        }
      })

      argv.should.have.property('apple', 'apple')
      argv.should.have.property('banana', 42)
      argv.should.have.property('foo', 'baz')
    })

    it('should use value from config object to all aliases', function () {
      var argv = parser([], {
        configObjects: [{
          apple: 'apple',
          banana: 42,
          foo: 'baz'
        }],
        alias: {
          a: ['apple'],
          banana: ['b']
        }
      })

      argv.should.have.property('apple', 'apple')
      argv.should.have.property('a', 'apple')
      argv.should.have.property('banana', 42)
      argv.should.have.property('b', 42)
      argv.should.have.property('foo', 'baz')
    })

    it('should load nested options from config object', function () {
      var argv = parser(['--nested.foo', 'bar'], {
        configObjects: [{
          a: 'a',
          nested: {
            foo: 'baz',
            bar: 'bar'
          },
          b: 'b'
        }]
      })

      argv.should.have.property('a', 'a')
      argv.should.have.property('b', 'b')
      argv.should.have.property('nested').and.deep.equal({
        foo: 'bar',
        bar: 'bar'
      })
    })

    it('should use nested value from config object, if argv value is using default value', function () {
      var argv = parser([], {
        configObjects: [{
          a: 'a',
          nested: {
            foo: 'baz',
            bar: 'bar'
          },
          b: 'b'
        }],
        default: {
          'nested.foo': 'banana'
        }
      })

      argv.should.have.property('a', 'a')
      argv.should.have.property('b', 'b')
      argv.should.have.property('nested').and.deep.equal({
        foo: 'baz',
        bar: 'bar'
      })
    })

    it('should load objects with first object having greatest priority', function () {
      var argv = parser(['--foo', 'bar'], {
        configObjects: [{
          bar: 'baz'
        }, {
          bar: 'quux',
          foo: 'spam'
        }]
      })

      argv.should.have.property('foo', 'bar')
      argv.should.have.property('bar', 'baz')
    })

    it('should combine array typed options with alias and camel-case', function () {
      var argv = parser(['--camEl', 'foo', '--camEl', 'bar', '-a', 'red'], {
        array: ['cam-el', 'apple'],
        alias: { apple: 'a' },
        configObjects: [{ camEl: 'baz' }, { a: 'sweet' }],
        configuration: {
          'combine-arrays': true,
          'camel-case-expansion': true
        }
      })

      argv['cam-el'].should.deep.equal(['foo', 'bar', 'baz'])
      argv.apple.should.deep.equal(['red', 'sweet'])
    })
  })

  describe('dot notation', function () {
    it('should allow object graph traversal via dot notation', function () {
      var argv = parser([
        '--foo.bar', '3', '--foo.baz', '4',
        '--foo.quux.quibble', '5', '--foo.quux.o_O',
        '--beep.boop'
      ])
      argv.should.have.property('foo').and.deep.equal({
        bar: 3,
        baz: 4,
        quux: {
          quibble: 5,
          o_O: true
        }
      })
      argv.should.have.property('beep').and.deep.equal({ boop: true })
    })

    it('should apply defaults to dot notation arguments', function () {
      var argv = parser([], {
        default: {
          'foo.bar': 99
        }
      })

      argv.foo.bar.should.eql(99)
    })

    // see #279
    it('should allow default to be overridden when an alias is provided', function () {
      var argv = parser(['--foo.bar', '200'], {
        default: {
          'foo.bar': 99
        }
      })

      argv.foo.bar.should.eql(200)
    })

    // see #279
    it('should also override alias', function () {
      var argv = parser(['--foo.bar', '200'], {
        alias: {
          'foo.bar': ['f']
        },
        default: {
          'foo.bar': 99
        }
      })

      argv.f.should.eql(200)
    })

    // see #279
    it('should not set an undefined dot notation key', function () {
      var argv = parser(['--foo.bar', '200'], {
        default: {
          'foo.bar': 99
        },
        alias: {
          'foo.bar': ['f']
        }
      })

        ; ('foo.bar' in argv).should.equal(false)
    })

    it('should respect .string() for dot notation arguments', function () {
      var argv = parser(['--foo.bar', '99', '--bar.foo=99'], {
        string: ['foo.bar']
      })

      argv.foo.bar.should.eql('99')
      argv.bar.foo.should.eql(99)
    })

    it('should populate aliases when dot notation is used', function () {
      var argv = parser(['--foo.bar', '99'], {
        alias: {
          foo: ['f']
        }
      })

      argv.f.bar.should.eql(99)
      argv.foo.bar.should.eql(99)
    })

    // see #267
    it('should populate aliases when dot notation is used on camel-cased option', function () {
      var argv = parser(['--foo-baz.bar', '99'], {
        alias: {
          'foo-baz': ['f']
        }
      })

      argv.f.bar.should.eql(99)
      argv['foo-baz'].bar.should.eql(99)
      argv.fooBaz.bar.should.eql(99)
    })

    it('should populate aliases when nested dot notation is used', function () {
      var argv = parser(['--foo.bar.snuh', '99', '--foo.apple', '33', '--foo.bar.cool', '11'], {
        alias: {
          foo: ['f']
        }
      })

      argv.f.bar.snuh.should.eql(99)
      argv.foo.bar.snuh.should.eql(99)

      argv.f.apple.should.eql(33)
      argv.foo.apple.should.eql(33)

      argv.f.bar.cool.should.eql(11)
      argv.foo.bar.cool.should.eql(11)
    })

    it("should allow flags to use dot notation, when separated by '='", function () {
      var argv = parser(['-f.foo=99'])
      argv.f.foo.should.eql(99)
    })

    it("should allow flags to use dot notation, when separated by ' '", function () {
      var argv = parser(['-f.foo', '99'])
      argv.f.foo.should.eql(99)
    })

    it('should allow flags to use dot notation when no right-hand-side is given', function () {
      var argv = parser(['-f.foo', '99', '-f.bar'])
      argv.f.foo.should.eql(99)
      argv.f.bar.should.eql(true)
    })

    it('should not pollute the prototype', function () {
      parser(['-f.__proto__.foo', '99', '-x.y.__proto__.bar', '100', '--__proto__', '200'])
      Object.keys({}.__proto__).length.should.equal(0) // eslint-disable-line
      expect({}.foo).to.equal(undefined)
      expect({}.bar).to.equal(undefined)
    })
  })

  it('should set boolean and alias using explicit true', function () {
    var aliased = ['-h', 'true']
    var aliasedArgv = parser(aliased, {
      boolean: ['h'],
      alias: {
        h: ['herp']
      }
    })

    aliasedArgv.should.have.property('herp', true)
    aliasedArgv.should.have.property('h', true)
    aliasedArgv.should.have.property('_').with.length(0)
  })

  // regression, see https://github.com/substack/node-optimist/issues/71
  it('should set boolean and --x=true', function () {
    var parsed = parser(['--boool', '--other=true'], {
      boolean: ['boool']
    })
    parsed.should.have.property('boool', true)
    parsed.should.have.property('other', 'true')
    parsed = parser(['--boool', '--other=false'], {
      boolean: ['boool']
    })
    parsed.should.have.property('boool', true)
    parsed.should.have.property('other', 'false')
  })

  // regression, see https://github.com/chevex/yargs/issues/66
  it('should set boolean options values if next value is "true" or "false" with = as separator', function () {
    var argv = parser(['--bool=false'], {
      boolean: ['b'],
      alias: {
        b: ['bool']
      },
      default: {
        b: true
      }
    })

    argv.bool.should.eql(false)
  })

  describe('short options', function () {
    it('should set the value of multiple single short options to the next supplied values relative to each', function () {
      var parse = parser(['-h', 'localhost', '-p', '555'])
      parse.should.have.property('h', 'localhost')
      parse.should.have.property('p', 555)
      parse.should.have.property('_').with.length(0)
    })

    it('should set the value of a single short option to the next supplied value', function () {
      var parse = parser(['-h', 'localhost'])
      parse.should.have.property('h', 'localhost')
      parse.should.have.property('_').with.length(0)
    })

    it('should expand grouped short options to a hash with a key for each', function () {
      var parse = parser(['-cats'])
      parse.should.have.property('c', true)
      parse.should.have.property('a', true)
      parse.should.have.property('t', true)
      parse.should.have.property('s', true)
      parse.should.have.property('_').with.length(0)
    })

    it('should set n to the numeric value 123', function () {
      var argv = parser(['-n123'])
      argv.should.have.property('n', 123)
    })

    it('should set n to the numeric value 123, with n at the end of a group', function () {
      var argv = parser(['-ab5n123'])
      argv.should.have.property('a', true)
      argv.should.have.property('b', true)
      argv.should.have.property('5', true)
      argv.should.have.property('n', 123)
      argv.should.have.property('_').with.length(0)
    })

    it('should set n to the numeric value 123, with = as separator', function () {
      var argv = parser(['-n=123'])
      argv.should.have.property('n', 123)
    })

    it('should set n to the numeric value 123, with n at the end of a group and = as separator', function () {
      var argv = parser(['-ab5n=123'])
      argv.should.have.property('a', true)
      argv.should.have.property('b', true)
      argv.should.have.property('5', true)
      argv.should.have.property('n', 123)
      argv.should.have.property('_').with.length(0)
    })
  })

  describe('whitespace', function () {
    it('should be whitespace', function () {
      var argv = parser(['-x', '\t'])
      argv.should.have.property('x', '\t')
    })
  })

  describe('boolean modifier function', function () {
    it('should prevent yargs from sucking in the next option as the value of the first option', function () {
      // Arrange & Act
      var result = parser(['-b', '123'], {
        boolean: ['b']
      })
      // Assert
      result.should.have.property('b').that.is.a('boolean').and.is.true // eslint-disable-line
      result.should.have.property('_').and.deep.equal([123])
    })
  })

  describe('defaults', function () {
    function checkNoArgs (opts, hasAlias) {
      it('should set defaults if no args', function () {
        var result = parser([], opts)
        result.should.have.property('flag', true)
        if (hasAlias) {
          result.should.have.property('f', true)
        }
      })
    }

    function checkExtraArg (opts, hasAlias) {
      it('should set defaults if one extra arg', function () {
        var result = parser(['extra'], opts)
        result.should.have.property('flag', true)
        result.should.have.property('_').and.deep.equal(['extra'])
        if (hasAlias) {
          result.should.have.property('f', true)
        }
      })
    }

    function checkStringArg (opts, hasAlias) {
      it('should set defaults even if arg looks like a string', function () {
        var result = parser(['--flag', 'extra'], opts)
        result.should.have.property('flag', true)
        result.should.have.property('_').and.deep.equal(['extra'])
        if (hasAlias) {
          result.should.have.property('f', true)
        }
      })
    }

    describe('for options with aliases', function () {
      var opts = {
        alias: {
          flag: ['f']
        },
        default: {
          flag: true
        }
      }

      checkNoArgs(opts, true)
      checkExtraArg(opts, true)
    })

    describe('for typed options without aliases', function () {
      var opts = {
        boolean: ['flag'],
        default: {
          flag: true
        }
      }

      checkNoArgs(opts)
      checkExtraArg(opts)
      checkStringArg(opts)
    })

    describe('for typed options with aliases', function () {
      var opts = {
        alias: {
          flag: ['f']
        },
        boolean: ['flag'],
        default: {
          flag: true
        }
      }

      checkNoArgs(opts, true)
      checkExtraArg(opts, true)
      checkStringArg(opts, true)
    })

    describe('for boolean options', function () {
      [true, false, undefined, null].forEach(function (def) {
        describe('with explicit ' + def + ' default', function () {
          var opts = {
            default: {
              flag: def
            },
            boolean: ['flag']
          }

          it('should set true if --flag in arg', function () {
            parser(['--flag'], opts).flag.should.be.true // eslint-disable-line
          })

          it('should set false if --no-flag in arg', function () {
            parser(['--no-flag'], opts).flag.should.be.false // eslint-disable-line
          })

          it('should set ' + def + ' if no flag in arg', function () {
            expect(parser([], opts).flag).to.equal(def)
          })
        })
      })

      describe('without any default value', function () {
        var opts = null

        beforeEach(function () {
          opts = {
            boolean: ['flag']
          }
        })

        it('should set true if --flag in arg', function () {
          parser(['--flag'], opts).flag.should.be.true // eslint-disable-line
        })

        it('should set false if --no-flag in arg', function () {
          parser(['--no-flag'], opts).flag.should.be.false // eslint-disable-line
        })

        it('should not add property if no flag in arg', function () {
          parser([''], opts).should.not.have.property('flag')
        })
      })

      // Fixes: https://github.com/bcoe/yargs/issues/341
      it('should apply defaults to camel-case form of argument', function () {
        var argv = parser([], {
          default: {
            'foo-bar': 99
          }
        })

        argv.fooBar.should.equal(99)
      })

      // Fixes: https://github.com/yargs/yargs-parser/issues/77
      it('should combine dot-notation and camel-case expansion', function () {
        var argv = parser(['--dot-notation.foo.bar'])

        argv.should.satisfy(function (args) {
          return args.dotNotation.foo.bar
        })
      })
    })

    it('should define option as boolean and set default to true', function () {
      var argv = parser([], {
        boolean: ['sometrue'],
        default: {
          sometrue: true
        }
      })
      argv.should.have.property('sometrue', true)
    })

    it('should define option as boolean and set default to false', function () {
      var argv = parser([], {
        default: {
          somefalse: false
        },
        boolean: ['somefalse']
      })
      argv.should.have.property('somefalse', false)
    })

    it('should set boolean options to false by default', function () {
      var parse = parser(['moo'], {
        boolean: ['t', 'verbose'],
        default: {
          verbose: false,
          t: false
        }
      })
      parse.should.have.property('verbose', false).and.be.a('boolean')
      parse.should.have.property('t', false).and.be.a('boolean')
      parse.should.have.property('_').and.deep.equal(['moo'])
    })

    describe('track defaulted', function () {
      it('should log defaulted options - not specified by user', function () {
        var parsed = parser.detailed('', {
          default: { foo: 'abc', 'bar.prop': 33, baz: 'x' },
          configObjects: [{ baz: 'xyz' }]
        })
        expect(parsed.argv).to.eql({ _: [], baz: 'xyz', foo: 'abc', bar: { prop: 33 } })
        parsed.defaulted.should.deep.equal({ foo: true, 'bar.prop': true })
      })

      it('should not log defaulted options - specified without value', function () {
        var parsed = parser.detailed('--foo --bar.prop', {
          default: { foo: 'abc', 'bar.prop': 33 }
        })
        parsed.argv.should.deep.equal({ _: [], foo: 'abc', bar: { prop: 33 } })
        parsed.defaulted.should.deep.equal({})
      })

      it('should log defaulted options - no aliases included', function () {
        var parsed = parser.detailed('', {
          default: { kaa: 'abc' },
          alias: { foo: 'kaa' }
        })
        parsed.argv.should.deep.equal({ _: [], kaa: 'abc', foo: 'abc' })
        parsed.defaulted.should.deep.equal({ kaa: true })
      })

      it('setting an alias excludes associated key from defaulted', function () {
        var parsed = parser.detailed('--foo abc', {
          default: { kaa: 'abc' },
          alias: { foo: 'kaa' }
        })
        parsed.argv.should.deep.equal({ _: [], kaa: 'abc', foo: 'abc' })
        parsed.defaulted.should.deep.equal({})
      })
    })
  })

  describe('camelCase', function () {
    function runTests (strict) {
      if (!strict) {
        // Skip this test in strict mode because this option is not specified
        it('should provide options with dashes as camelCase properties', function () {
          var result = parser(['--some-option'])

          result.should.have.property('some-option').that.is.a('boolean').and.is.true // eslint-disable-line
          result.should.have.property('someOption').that.is.a('boolean').and.is.true // eslint-disable-line
        })
      }

      it('should provide count options with dashes as camelCase properties', function () {
        var result = parser(['--some-option', '--some-option', '--some-option'], {
          count: ['some-option']
        })

        result.should.have.property('some-option', 3)
        result.should.have.property('someOption', 3)
      })

      it('should provide options with dashes and aliases as camelCase properties', function () {
        var result = parser(['--some-option'], {
          alias: {
            'some-horse': 'o'
          }
        })

        result.should.have.property('some-option').that.is.a('boolean').and.is.true // eslint-disable-line
        result.should.have.property('someOption').that.is.a('boolean').and.is.true // eslint-disable-line
      })

      it('should provide defaults of options with dashes as camelCase properties', function () {
        var result = parser([], {
          default: {
            'some-option': 'asdf'
          }
        })

        result.should.have.property('some-option', 'asdf')
        result.should.have.property('someOption', 'asdf')
      })

      it('should provide aliases of options with dashes as camelCase properties', function () {
        var result = parser([], {
          default: {
            'some-option': 'asdf'
          },
          alias: {
            'some-option': ['o']
          }
        })

        result.should.have.property('o', 'asdf')
        result.should.have.property('some-option', 'asdf')
        result.should.have.property('someOption', 'asdf')
      })

      it('should not apply camel-case logic to 1-character options', function () {
        var result = parser(['-p', 'hello'], {
          alias: {
            p: 'parallel',
            P: 'parallel-series'
          }
        })

        result.should.not.have.property('P', 'hello')
        result.should.not.have.property('parallel-series', 'hello')
        result.should.not.have.property('parallelSeries', 'hello')
        result.should.have.property('parallel', 'hello')
        result.should.have.property('p', 'hello')
      })

      it('should provide aliases of options with dashes as camelCase properties', function () {
        var result = parser([], {
          alias: {
            o: ['some-option']
          },
          default: {
            o: 'asdf'
          }
        })

        result.should.have.property('o', 'asdf')
        result.should.have.property('some-option', 'asdf')
        result.should.have.property('someOption', 'asdf')
      })

      it('should provide aliases with dashes as camelCase properties', function () {
        var result = parser(['--some-option', 'val'], {
          alias: {
            o: 'some-option'
          }
        })

        result.should.have.property('o').that.is.a('string').and.equals('val')
        result.should.have.property('some-option').that.is.a('string').and.equals('val')
        result.should.have.property('someOption').that.is.a('string').and.equals('val')
      })

      // https://github.com/yargs/yargs-parser/issues/95
      it('should not duplicate option values when equivalent dashed aliases are provided', function () {
        var result = parser(['--someOption', 'val'], {
          alias: {
            someOption: 'some-option'
          }
        })

        result.should.have.property('some-option').that.is.a('string').and.equals('val')
        result.should.have.property('someOption').that.is.a('string').and.equals('val')
      })
    }

    describe('dashes and camelCase', function () {
      runTests()
    })

    describe('dashes and camelCase (strict)', function () {
      runTests(true)
    })
  })

  describe('-', function () {
    it('should set - as value of n', function () {
      var argv = parser(['-n', '-'])
      argv.should.have.property('n', '-')
      argv.should.have.property('_').with.length(0)
    })

    it('should set - as a non-hyphenated value', function () {
      var argv = parser(['-'])
      argv.should.have.property('_').and.deep.equal(['-'])
    })

    it('should set - as a value of f', function () {
      var argv = parser(['-f-'])
      argv.should.have.property('f', '-')
      argv.should.have.property('_').with.length(0)
    })

    it('should set b to true and set - as a non-hyphenated value when b is set as a boolean', function () {
      var argv = parser(['-b', '-'], {
        boolean: ['b']
      })

      argv.should.have.property('b', true)
      argv.should.have.property('_').and.deep.equal(['-'])
    })

    it('should set - as the value of s when s is set as a string', function () {
      var argv = parser(['-s', '-'], {
        string: ['s']
      })

      argv.should.have.property('s', '-')
      argv.should.have.property('_').with.length(0)
    })
  })

  describe('count', function () {
    it('should count the number of times a boolean is present', function () {
      var parsed

      parsed = parser(['-x'], {
        count: ['verbose']
      })
      parsed.verbose.should.equal(0)

      parsed = parser(['--verbose'], {
        count: ['verbose']
      })
      parsed.verbose.should.equal(1)

      parsed = parser(['--verbose', '--verbose'], {
        count: ['verbose']
      })
      parsed.verbose.should.equal(2)

      parsed = parser(['-vvv'], {
        alias: {
          v: ['verbose']
        },
        count: ['verbose']
      })
      parsed.verbose.should.equal(3)

      parsed = parser(['--verbose', '--verbose', '-v', '--verbose'], {
        count: ['verbose'],
        alias: {
          v: ['verbose']
        }
      })
      parsed.verbose.should.equal(4)

      parsed = parser(['--verbose', '--verbose', '-v', '-vv'], {
        count: ['verbose'],
        alias: {
          v: ['verbose']
        }
      })
      parsed.verbose.should.equal(5)
    })

    it('should not consume the next argument', function () {
      var parsed = parser(['-v', 'moo'], {
        count: 'v'
      })
      parsed.v.should.equal(1)
      parsed.should.have.property('_').and.deep.equal(['moo'])

      parsed = parser(['--verbose', 'moomoo', '--verbose'], {
        count: 'verbose'
      })
      parsed.verbose.should.equal(2)
      parsed.should.have.property('_').and.deep.equal(['moomoo'])
    })

    it('should use a default value as is when no arg given', function () {
      var parsed = parser([], {
        count: 'v',
        default: { v: 3 }
      })
      parsed.v.should.equal(3)

      parsed = parser([], {
        count: 'v',
        default: { v: undefined }
      })
      expect(parsed.v).to.be.undefined // eslint-disable-line

      parsed = parser([], {
        count: 'v',
        default: { v: null }
      })
      expect(parsed.v).to.be.null // eslint-disable-line

      parsed = parser([], {
        count: 'v',
        default: { v: false }
      })
      parsed.v.should.equal(false)

      parsed = parser([], {
        count: 'v',
        default: { v: 'hello' }
      })
      parsed.v.should.equal('hello')
    })

    it('should ignore a default value when arg given', function () {
      var parsed = parser(['-vv', '-v', '-v'], {
        count: 'v',
        default: { v: 1 }
      })
      parsed.v.should.equal(4)
    })

    it('should increment regardless of arg value', function () {
      var parsed = parser([
        '-v',
        '-v=true',
        '-v', 'true',
        '-v=false',
        '-v', 'false',
        '--no-v',
        '-v=999',
        '-v=foobar'
      ], { count: 'v' })
      parsed.v.should.equal(8)
    })

    it('should add an error if counter is also set as array', function () {
      var argv = parser.detailed(['--counter', '--counter', '--counter'], {
        count: ['counter'],
        array: ['counter']
      })

      argv.error.message.should.equal('Invalid configuration: counter, opts.count excludes opts.array.')
    })

    it('should add an error if counter is also set as narg', function () {
      var argv = parser.detailed(['--counter', 'foo', 'bar'], {
        count: ['counter'],
        narg: { counter: 2 }
      })

      argv.error.message.should.equal('Invalid configuration: counter, opts.count excludes opts.narg.')
    })
  })

  describe('array', function () {
    it('should group values into an array if the same option is specified multiple times (duplicate-arguments-array=true)', function () {
      var parse = parser(['-v', 'a', '-v', 'b', '-v', 'c'], { configuration: { 'duplicate-arguments-array': true } })
      parse.should.have.property('v').and.deep.equal(['a', 'b', 'c'])
      parse.should.have.property('_').with.length(0)
    })
    it('should keep only the last value if the same option is specified multiple times (duplicate-arguments-false)', function () {
      var parse = parser(['-v', 'a', '-v', 'b', '-v', 'c'], { configuration: { 'duplicate-arguments-array': false } })
      parse.should.have.property('v').and.equal('c')
      parse.should.have.property('_').with.length(0)
    })

    it('should default an array to an empty array if passed as first option followed by another', function () {
      var result = parser(['-a', '-b'], {
        array: 'a'
      })
      result.should.have.property('a').and.deep.equal([])
    })

    it('should not attempt to default array if an element has already been populated', function () {
      var result = parser(['-a', 'foo', 'bar', '-b'], {
        array: 'a'
      })
      result.should.have.property('a').and.deep.equal(['foo', 'bar'])
    })

    it('should default argument to empty array if no value given', function () {
      var result = parser(['-b', '--tag'], {
        array: ['b', 'tag'],
        default: { tag: [] }
      })
      result.b.should.deep.equal([])
      result.tag.should.deep.equal([])
    })

    it('should place default of argument in array, when default provided', function () {
      var result = parser(['-b', '--tag'], {
        array: ['b', 'tag'],
        default: { b: 33, tag: ['foo'] }
      })
      result.b.should.deep.equal([33])
      result.tag.should.deep.equal(['foo'])
    })

    it('should place value of argument in array, when one argument provided', function () {
      var result = parser(['-b', '33'], {
        array: ['b']
      })
      Array.isArray(result.b).should.equal(true)
      result.b[0].should.equal(33)
    })

    it('should add multiple argument values to the array', function () {
      var result = parser(['-b', '33', '-b', 'hello'], {
        array: 'b'
      })
      Array.isArray(result.b).should.equal(true)
      result.b.should.include(33)
      result.b.should.include('hello')
    })

    it('should allow array: true, to be set inside an option block', function () {
      var result = parser(['-b', '33'], {
        array: 'b'
      })
      Array.isArray(result.b).should.equal(true)
      result.b.should.include(33)
    })

    // issue #103
    it('should default camel-case alias to array type', function () {
      var result = parser(['--ca-path', 'http://www.example.com'], {
        array: ['ca-path']
      })

      Array.isArray(result['ca-path']).should.equal(true)
      Array.isArray(result.caPath).should.equal(true)
    })

    it('should default alias to array type', function () {
      var result = parser(['--ca-path', 'http://www.example.com'], {
        array: 'ca-path',
        alias: {
          'ca-path': 'c'
        }
      })

      Array.isArray(result['ca-path']).should.equal(true)
      Array.isArray(result.caPath).should.equal(true)
      Array.isArray(result.c).should.equal(true)
    })

    // see: https://github.com/bcoe/yargs/issues/162
    it('should eat non-hyphenated arguments until hyphenated option is hit', function () {
      var result = parser(['-a=hello', 'world', '-b',
        '33', '22', '--foo', 'red', 'green',
        '--bar=cat', 'dog'], {
        array: ['a', 'b', 'foo', 'bar']
      })

      Array.isArray(result.a).should.equal(true)
      result.a.should.include('hello')
      result.a.should.include('world')

      Array.isArray(result.b).should.equal(true)
      result.b.should.include(33)
      result.b.should.include(22)

      Array.isArray(result.foo).should.equal(true)
      result.foo.should.include('red')
      result.foo.should.include('green')

      Array.isArray(result.bar).should.equal(true)
      result.bar.should.include('cat')
      result.bar.should.include('dog')
    })

    // see: https://github.com/yargs/yargs-parser/pull/13
    it('should support array for --foo= format when the key is a number', function () {
      var result = parser(['--1=a', 'b'], {
        array: ['1']
      })

      Array.isArray(result['1']).should.equal(true)
      result['1'][0].should.equal('a')
      result['1'][1].should.equal('b')
    })

    it('should support array for -f= and --bar= format when the value is dashed', function () {
      var result = parser(['-f=--dog', 'cat', '--bar=--red', 'green'], {
        array: ['f', 'bar']
      })

      Array.isArray(result.f).should.equal(true)
      result.f[0].should.equal('--dog')
      result.f[1].should.equal('cat')

      Array.isArray(result.bar).should.equal(true)
      result.bar[0].should.equal('--red')
      result.bar[1].should.equal('green')
    })

    it('should create an array when passing an argument twice with same value', function () {
      var result = parser(['-x', 'val1', '-x', 'val1'])
      result.should.have.property('x').that.is.an('array').and.to.deep.equal(['val1', 'val1'])
    })

    it('should eat camelCase switch with camelCase array option', function () {
      var result = parser(['--someOption', '1', '2'], {
        array: ['someOption']
      })
      Array.isArray(result.someOption).should.equal(true)
      result.someOption.should.deep.equal([1, 2])
    })
    it('should eat hyphenated switch with hyphenated array option', function () {
      var result = parser(['--some-option', '1', '2'], {
        array: ['some-option']
      })
      Array.isArray(result['some-option']).should.equal(true)
      result['some-option'].should.deep.equal([1, 2])
    })
    it('should eat camelCase switch with hyphenated array option', function () {
      var result = parser(['--someOption', '1', '2'], {
        array: ['some-option']
      })
      Array.isArray(result['some-option']).should.equal(true)
      result['some-option'].should.deep.equal([1, 2])
    })
    it('should eat hyphenated switch with camelCase array option', function () {
      var result = parser(['--some-option', '1', '2'], {
        array: ['someOption']
      })
      Array.isArray(result.someOption).should.equal(true)
      result.someOption.should.deep.equal([1, 2])
    })

    // see https://github.com/yargs/yargs-parser/issues/6
    it('should respect the type `boolean` option for arrays', function () {
      var result = parser(['-x=true', 'false'], {
        array: [{ key: 'x', boolean: true }]
      })
      result.should.have.property('x').that.is.an('array').and.to.deep.equal([true, false])
    })

    it('should respect type `boolean` without value for arrays', function () {
      var result = parser(['-x', '-x'], {
        array: [{ key: 'x', boolean: true }],
        configuration: { 'flatten-duplicate-arrays': false }
      })
      result.x.should.deep.equal([[true], [true]])
    })

    it('should respect `boolean negation` for arrays', function () {
      var result = parser(['--no-bool', '--no-bool'], {
        array: [{ key: 'bool', boolean: true }],
        configuration: { 'flatten-duplicate-arrays': false }
      })
      result.bool.should.deep.equal([[false], [false]])
    })

    it('should respect the type `number` option for arrays', function () {
      var result = parser(['-x=5', '2'], {
        array: [{ key: 'x', number: true }]
      })
      result.should.have.property('x').that.is.an('array').and.to.deep.equal([5, 2])
    })

    it('should respect the type `string` option for arrays', function () {
      var result = parser(['-x=5', '2'], {
        configuration: {
          'parse-numbers': true
        },
        array: [{ key: 'x', string: true }]
      })
      result.should.have.property('x').that.is.an('array').and.to.deep.equal(['5', '2'])
    })

    it('should eat non-hyphenated arguments until hyphenated option is hit - combined with coercion', function () {
      var result = parser([
        '-a=hello', 'world',
        '-b', '33', '22',
        '--foo', 'true', 'false',
        '--bar=cat', 'dog'
      ], {
        array: [
          'a',
          { key: 'b', integer: true },
          { key: 'foo', boolean: true },
          'bar'
        ]
      })

      Array.isArray(result.a).should.equal(true)
      result.a.should.include('hello')
      result.a.should.include('world')

      Array.isArray(result.b).should.equal(true)
      result.b.should.include(33)
      result.b.should.include(22)

      Array.isArray(result.foo).should.equal(true)
      result.foo.should.include(true)
      result.foo.should.include(false)

      Array.isArray(result.bar).should.equal(true)
      result.bar.should.include('cat')
      result.bar.should.include('dog')
    })
  })

  describe('nargs', function () {
    it('should allow the number of arguments following a key to be specified', function () {
      var result = parser(['--foo', 'apple', 'bar'], {
        narg: {
          foo: 2
        }
      })

      Array.isArray(result.foo).should.equal(true)
      result.foo[0].should.equal('apple')
      result.foo[1].should.equal('bar')
    })

    it('should raise an exception if -f== format is used for a key with no expected argument', function () {
      var argv = parser.detailed('-f=apple', {
        narg: {
          f: 0
        }
      })
      argv.error.message.should.equal('Argument unexpected for: f')
    })

    it('should raise an exception if --bar== format is used for a key with no expected argument', function () {
      var argv = parser.detailed('--bar=apple', {
        narg: {
          bar: 0
        }
      })
      argv.error.message.should.equal('Argument unexpected for: bar')
    })

    it('should raise an exception if there are not enough arguments following key', function () {
      var argv = parser.detailed('--foo apple', {
        narg: {
          foo: 2
        }
      })
      argv.error.message.should.equal('Not enough arguments following: foo')
    })

    it('nargs is applied to aliases', function () {
      var result = parser(['--bar', 'apple', 'bar'], {
        narg: {
          foo: 2
        },
        alias: {
          foo: 'bar'
        }
      })
      Array.isArray(result.foo).should.equal(true)
      result.foo[0].should.equal('apple')
      result.foo[1].should.equal('bar')
    })

    it('should apply nargs to flag arguments', function () {
      var result = parser(['-f', 'apple', 'bar', 'blerg'], {
        narg: {
          f: 2
        }
      })

      result.f[0].should.equal('apple')
      result.f[1].should.equal('bar')
      result._[0].should.equal('blerg')
    })

    it('should support nargs for -f= and --bar= format arguments', function () {
      var result = parser(['-f=apple', 'bar', 'blerg', '--bar=monkey', 'washing', 'cat'], {
        narg: {
          f: 2,
          bar: 2
        }
      })

      result.f[0].should.equal('apple')
      result.f[1].should.equal('bar')
      result._[0].should.equal('blerg')

      result.bar[0].should.equal('monkey')
      result.bar[1].should.equal('washing')
      result._[1].should.equal('cat')
    })

    it('should support nargs for -f= and --bar= format arguments with dashed values', function () {
      var result = parser(['-f=--apple', 'bar', 'blerg', '--bar=-monkey', 'washing', 'cat'], {
        narg: {
          f: 2,
          bar: 2
        }
      })

      result.f[0].should.equal('--apple')
      result.f[1].should.equal('bar')
      result._[0].should.equal('blerg')

      result.bar[0].should.equal('-monkey')
      result.bar[1].should.equal('washing')
      result._[1].should.equal('cat')
    })

    it('should not modify the input args if an = was used', function () {
      var expected = ['-f=apple', 'bar', 'blerg', '--bar=monkey', 'washing', 'cat']
      var args = expected.slice()
      parser(args, {
        narg: {
          f: 2,
          bar: 2
        }
      })
      args.should.deep.equal(expected)

      parser.detailed(args, {
        narg: {
          f: 2,
          bar: 2
        }
      })
      args.should.deep.equal(expected)
    })

    it('allows multiple nargs to be set at the same time', function () {
      var result = parser(['--foo', 'apple', 'bar', '--bar', 'banana', '-f'], {
        narg: {
          foo: 2,
          bar: 1
        }
      })

      Array.isArray(result.foo).should.equal(true)
      result.foo[0].should.equal('apple')
      result.foo[1].should.equal('bar')
      result.bar.should.equal('banana')
      result.f.should.equal(true)
    })

    // see: https://github.com/yargs/yargs-parser/pull/13
    it('should support nargs for --foo= format when the key is a number', function () {
      var result = parser(['--1=a', 'b'], {
        narg: {
          1: 2
        }
      })

      Array.isArray(result['1']).should.equal(true)
      result['1'][0].should.equal('a')
      result['1'][1].should.equal('b')
    })

    it('should not treat flag arguments as satisfying narg requirements', function () {
      var result = parser.detailed(['--foo', '--bar', '99'], {
        narg: {
          foo: 1
        }
      })

      result.argv.bar.should.equal(99)
      result.error.message.should.equal('Not enough arguments following: foo')
    })

    // See: https://github.com/yargs/yargs-parser/issues/232
    it('should treat flag arguments as satisfying narg requirements, if nargs-eats-options=true', function () {
      var result = parser.detailed(['--foo', '--bar', '99', '--batman', 'robin'], {
        narg: {
          foo: 2
        },
        configuration: {
          'nargs-eats-options': true
        }
      })

      result.argv.foo.should.eql(['--bar', 99])
      result.argv.batman.should.eql('robin')
    })

    it('should not consume more than configured nargs', function () {
      var result = parser(['--foo', 'a', 'b'], {
        narg: {
          foo: 1
        }
      })

      result.foo.should.eql('a')
    })
  })

  describe('env vars', function () {
    it('should apply all env vars if prefix is empty', function () {
      process.env.ONE_FISH = 'twofish'
      process.env.RED_FISH = 'bluefish'
      var result = parser([], {
        envPrefix: ''
      })

      result.oneFish.should.equal('twofish')
      result.redFish.should.equal('bluefish')
    })

    it('should apply only env vars matching prefix if prefix is valid string', function () {
      process.env.ONE_FISH = 'twofish'
      process.env.RED_FISH = 'bluefish'
      process.env.GREEN_EGGS = 'sam'
      process.env.GREEN_HAM = 'iam'
      var result = parser([], {
        envPrefix: 'GREEN'
      })

      result.eggs.should.equal('sam')
      result.ham.should.equal('iam')
      expect(result.oneFish).to.be.undefined // eslint-disable-line
      expect(result.redFish).to.be.undefined // eslint-disable-line
    })

    it('should set aliases for options defined by env var', function () {
      process.env.AIRFORCE_ONE = 'two'
      var result = parser([], {
        envPrefix: 'AIRFORCE',
        alias: {
          1: ['one', 'uno']
        }
      })

      result['1'].should.equal('two')
      result.one.should.equal('two')
      result.uno.should.equal('two')
    })

    it('should prefer command line value over env var', function () {
      process.env.FOO_BAR = 'ignore'
      var result = parser(['--foo-bar', 'baz'], {
        envPrefix: ''
      })

      result.fooBar.should.equal('baz')
    })

    it('should respect type for args defined by env var', function () {
      process.env.MY_TEST_STRING = '1'
      process.env.MY_TEST_NUMBER = '2'
      var result = parser([], {
        string: 'string',
        envPrefix: 'MY_TEST_'
      })

      result.string.should.equal('1')
      result.number.should.equal(2)
    })

    it('should set option from aliased env var', function () {
      process.env.SPACE_X = 'awesome'
      var result = parser([], {
        alias: {
          xactly: 'x'
        },
        envPrefix: 'SPACE'
      })

      result.xactly.should.equal('awesome')
    })

    it('should prefer env var value over configured default', function () {
      process.env.FOO_BALL = 'wut'
      process.env.FOO_BOOL = 'true'
      var result = parser([], {
        envPrefix: 'FOO',
        default: {
          ball: 'baz',
          bool: false
        },
        boolean: 'bool',
        string: 'ball'
      })

      result.ball.should.equal('wut')
      result.bool.should.equal(true)
    })

    var jsonPath = path.resolve(__dirname, './fixtures/config.json')
    it('should prefer environment variables over config file', function () {
      process.env.CFG_HERP = 'zerp'
      var result = parser(['--cfg', jsonPath], {
        envPrefix: 'CFG',
        config: 'cfg',
        string: 'herp',
        default: {
          herp: 'nerp'
        }
      })

      result.herp.should.equal('zerp')
    })

    it('should support an env var value as config file option', function () {
      process.env.TUX_CFG = jsonPath
      var result = parser([], {
        envPrefix: 'TUX',
        config: ['cfg'],
        default: {
          z: 44
        }
      })

      result.should.have.property('herp')
      result.should.have.property('foo')
      result.should.have.property('version')
      result.should.have.property('truthy')
      result.z.should.equal(55)
    })

    it('should prefer cli config file option over env var config file option', function () {
      process.env.MUX_CFG = path.resolve(__dirname, '../package.json')
      var result = parser(['--cfg', jsonPath], {
        envPrefix: 'MUX',
        config: 'cfg'
      })

      result.should.have.property('herp')
      result.should.have.property('foo')
      result.should.have.property('version')
      result.should.have.property('truthy')
      result.z.should.equal(55)
    })

    it('should apply all nested env vars', function () {
      process.env.TEST_A = 'a'
      process.env.TEST_NESTED_OPTION__FOO = 'baz'
      process.env.TEST_NESTED_OPTION__BAR = 'bar'
      var result = parser(['--nestedOption.foo', 'bar'], {
        envPrefix: 'TEST'
      })

      result.should.have.property('a', 'a')
      result.should.have.property('nestedOption').and.deep.equal({
        foo: 'bar',
        bar: 'bar'
      })
    })

    it('should apply nested env var if argv value is using default value', function () {
      process.env.TEST_A = 'a'
      process.env.TEST_NESTED_OPTION__FOO = 'baz'
      process.env.TEST_NESTED_OPTION__BAR = 'bar'
      var result = parser([], {
        envPrefix: 'TEST',
        default: {
          'nestedOption.foo': 'banana'
        }
      })

      result.should.have.property('a', 'a')
      result.should.have.property('nestedOption').and.deep.equal({
        foo: 'baz',
        bar: 'bar'
      })
    })
  })

  describe('configuration', function () {
    describe('short option groups', function () {
      it('allows short-option-groups to be disabled', function () {
        var parse = parser(['-cats=meow'], {
          configuration: {
            'short-option-groups': false
          }
        })
        parse.cats.should.equal('meow')
        parse = parser(['-cats', 'meow'], {
          configuration: {
            'short-option-groups': false
          }
        })
        parse.cats.should.equal('meow')
      })
    })

    describe('camel-case expansion', function () {
      it('does not expand camel-case aliases', function () {
        var parsed = parser.detailed([], {
          alias: {
            'foo-bar': ['x']
          },
          configuration: {
            'camel-case-expansion': false
          }
        })

        expect(parsed.newAliases.fooBar).to.equal(undefined)
        expect(parsed.aliases.fooBar).to.equal(undefined)
      })

      it('does not expand camel-case keys', function () {
        var parsed = parser.detailed(['--foo-bar=apple'], {
          configuration: {
            'camel-case-expansion': false
          }
        })

        expect(parsed.argv.fooBar).to.equal(undefined)
        expect(parsed.argv['foo-bar']).to.equal('apple')
      })
    })

    describe('dot notation', function () {
      it('does not expand dot notation defaults', function () {
        var parsed = parser([], {
          default: {
            'foo.bar': 'x'
          },
          configuration: {
            'dot-notation': false
          }
        })

        expect(parsed['foo.bar']).to.equal('x')
      })

      it('does not expand dot notation arguments', function () {
        var parsed = parser(['--foo.bar', 'banana'], {
          configuration: {
            'dot-notation': false
          }
        })
        expect(parsed['foo.bar']).to.equal('banana')
        parsed = parser(['--foo.bar=banana'], {
          configuration: {
            'dot-notation': false
          }
        })
        expect(parsed['foo.bar']).to.equal('banana')
      })

      it('should use value from cli, if cli overrides dot notation default', function () {
        var parsed = parser(['--foo.bar', 'abc'], {
          default: {
            'foo.bar': 'default'
          },
          configuration: {
            'dot-notation': false
          }
        })

        expect(parsed['foo.bar']).to.equal('abc')
      })

      it('should also override dot notation alias', function () {
        var parsed = parser(['--foo.bar', 'abc'], {
          alias: {
            'foo.bar': ['alias.bar']
          },
          default: {
            'foo.bar': 'default'
          },
          configuration: {
            'dot-notation': false
          }
        })

        expect(parsed['alias.bar']).to.equal('abc')
      })

      it('does not expand alias of first element of dot notation arguments', function () {
        var parsed = parser(['--foo.bar', 'banana'], {
          alias: {
            foo: ['f']
          },
          configuration: {
            'dot-notation': false
          }
        })
        expect(parsed['foo.bar']).to.equal('banana')
        expect(parsed).not.to.include.keys('f.bar')
      })

      // addresses https://github.com/yargs/yargs/issues/716
      it('does not append nested-object keys from config to top-level key', function () {
        var parsed = parser([], {
          alias: {
            foo: ['f']
          },
          configuration: {
            'dot-notation': false
          },
          configObjects: [
            {
              'website.com': {
                a: 'b',
                b: 'c'
              }
            }
          ]
        })

        parsed['website.com'].should.deep.equal({
          a: 'b',
          b: 'c'
        })
      })
    })

    describe('parse numbers', function () {
      it('does not coerce defaults into numbers', function () {
        var parsed = parser([], {
          default: {
            foo: '5'
          },
          configuration: {
            'parse-numbers': false
          }
        })

        expect(parsed.foo).to.equal('5')
      })

      it('does not coerce arguments into numbers', function () {
        var parsed = parser(['--foo', '5'], {
          configuration: {
            'parse-numbers': false
          }
        })
        expect(parsed.foo).to.equal('5')
      })

      it('does not coerce positional arguments into numbers', function () {
        var parsed = parser(['5'], {
          configuration: {
            'parse-numbers': false
          }
        })
        expect(parsed._[0]).to.equal('5')
      })

      it('parses number if option explicitly set to number type', function () {
        var parsed = parser(['--foo', '5', '--bar', '6', '--baz', '7'], {
          number: ['bar', 'baz'],
          coerce: {
            baz: val => val
          },
          configuration: {
            'parse-numbers': false
          }
        })
        expect(parsed.foo).to.equal('5')
        expect(parsed.bar).to.equal(6)
        expect(parsed.baz).to.equal(7)
      })

      it('should coerce elements of number typed arrays to numbers', function () {
        var parsed = parser(['--foo', '4', '--foo', '5', '2'], {
          array: ['foo'],
          configObjects: [{ foo: ['1', '2', '3'] }],
          configuration: {
            'combine-arrays': true,
            'flatten-duplicate-arrays': false
          }
        })

        expect(parsed.foo).to.deep.equal([[4], [5, 2], [1, 2, 3]])
      })
    })

    describe('boolean negation', function () {
      it('does not negate arguments prefixed with --no-', function () {
        var parsed = parser(['--no-dice'], {
          configuration: {
            'boolean-negation': false
          }
        })

        parsed['no-dice'].should.equal(true)
        expect(parsed.dice).to.equal(undefined)
      })

      it('negates boolean arguments with correct prefix', function () {
        var parsed = parser(['--foodice'], {
          configuration: {
            'negation-prefix': 'foo'
          }
        })

        expect(parsed.dice).to.equal(false)
      })
    })

    describe('duplicate arguments array', function () {
      it('adds duplicate argument to array', function () {
        var parsed = parser('-x a -x b', {
          configuration: {
            'duplicate-arguments-array': true
          }
        })

        parsed.x.should.deep.equal(['a', 'b'])
      })
      it('keeps only last argument', function () {
        var parsed = parser('-x a -x b', {
          configuration: {
            'duplicate-arguments-array': false
          }
        })

        parsed.x.should.equal('b')
      })
      it('does not interfere with nargs', function () {
        var parsed = parser('-x a b c -x o p q', {
          narg: { x: 3 },
          configuration: {
            'duplicate-arguments-array': false
          }
        })

        parsed.x.should.deep.equal(['o', 'p', 'q'])
      })
    })

    describe('flatten duplicate arrays', function () {
      it('flattens duplicate array type', function () {
        var parsed = parser('-x a b -x c d', {
          array: ['x'],
          configuration: {
            'flatten-duplicate-arrays': true
          }
        })

        parsed.x.should.deep.equal(['a', 'b', 'c', 'd'])
      })
      it('nests duplicate array types', function () {
        var parsed = parser('-x a b -x c d', {
          array: ['x'],
          configuration: {
            'flatten-duplicate-arrays': false
          }
        })

        parsed.x.should.deep.equal([['a', 'b'], ['c', 'd']])
      })
      it('nests duplicate array types of more than 2', function () {
        var parsed = parser('-x a b -x c d -x e f -x g h', {
          array: ['x'],
          configuration: {
            'flatten-duplicate-arrays': false
          }
        })

        parsed.x.should.deep.equal([['a', 'b'], ['c', 'd'], ['e', 'f'], ['g', 'h']])
      })
      it('doesn\'t nests single arrays', function () {
        var parsed = parser('-x a b', {
          array: ['x'],
          configuration: {
            'flatten-duplicate-arrays': false
          }
        })

        parsed.x.should.deep.equal(['a', 'b'])
      })
      it('flattens duplicate array type, when argument uses dot notation', function () {
        var parsed = parser('-x.foo a -x.foo b', {
          array: ['x.foo'],
          configuration: {
            'flatten-duplicate-arrays': true
          }
        })

        parsed.x.should.deep.equal({ foo: ['a', 'b'] })
      })
    })

    describe('duplicate-arguments-array VS flatten-duplicate-arrays', function () {
      /*
        duplicate=false, flatten=false
          type=array
            [-x 1 2 3]          => [1, 2, 3]
            [-x 1 2 3 -x 2 3 4] => [2, 3, 4]
          type=string/number/etc
            [-x 1 -x 2 -x 3]    => 3

        duplicate=false, flatten=true
          type=array
            [-x 1 2 3]          => [1, 2, 3]
            [-x 1 2 3 -x 2 3 4] => [2, 3, 4]
          type=string/number/etc
            [-x 1 -x 2 -x 3]    => 3

        duplicate=true, flatten=true
          type=array
            [-x 1 2 3]          => [1, 2, 3]
            [-x 1 2 3 -x 2 3 4] => [1, 2, 3, 2, 3, 4]
          type=string/number/etc
            [-x 1 -x 2 -x 3]    => [1, 2, 3]

        duplicate=true, flatten=false
          type=array
            [-x 1 2 3]          => [1, 2, 3]
            [-x 1 2 3 -x 2 3 4] => [[1, 2, 3], [2, 3, 4]]
          type=string/number/etc
            [-x 1 -x 2 -x 3]    => [1, 2, 3]
      */
      describe('duplicate=false, flatten=false,', function () {
        describe('type=array', function () {
          it('[-x 1 2 3] => [1, 2, 3]', function () {
            var parsed = parser('-x 1 2 3', {
              array: ['x'],
              configuration: {
                'duplicate-arguments-array': false,
                'flatten-duplicate-arrays': false
              }
            })
            parsed.x.should.deep.equal([1, 2, 3])
          })
          it('[-x 1 2 3 -x 2 3 4] => [2, 3, 4]', function () {
            var parsed = parser('-x 1 2 3 -x 2 3 4', {
              array: ['x'],
              configuration: {
                'duplicate-arguments-array': false,
                'flatten-duplicate-arrays': false
              }
            })
            parsed.x.should.deep.equal([2, 3, 4])
          })
        })
        describe('type=number', function () {
          it('[-x 1 -x 2 -x 3] => 3', function () {
            var parsed = parser('-x 1 -x 2 -x 3', {
              number: 'x',
              configuration: {
                'duplicate-arguments-array': false,
                'flatten-duplicate-arrays': false
              }
            })
            parsed.x.should.deep.equal(3)
          })
        })
        describe('type=boolean', function () {
          it('[-x true -x true -x false] => false', function () {
            var parsed = parser('-x true -x true -x false', {
              boolean: ['x'],
              configuration: {
                'duplicate-arguments-array': false,
                'flatten-duplicate-arrays': false
              }
            })
            parsed.x.should.deep.equal(false)
          })
        })
      })
      describe('duplicate=false, flatten=true,', function () {
        describe('type=array', function () {
          it('[-x 1 2 3] => [1, 2, 3]', function () {
            var parsed = parser('-x 1 2 3', {
              array: ['x'],
              configuration: {
                'duplicate-arguments-array': false,
                'flatten-duplicate-arrays': true
              }
            })
            parsed.x.should.deep.equal([1, 2, 3])
          })
          it('[-x 1 2 3 -x 2 3 4] => [2, 3, 4]', function () {
            var parsed = parser('-x 1 2 3 -x 2 3 4', {
              array: ['x'],
              configuration: {
                'duplicate-arguments-array': false,
                'flatten-duplicate-arrays': true
              }
            })
            parsed.x.should.deep.equal([2, 3, 4])
          })
        })
        describe('type=number', function () {
          it('[-x 1 -x 2 -x 3] => 3', function () {
            var parsed = parser('-x 1 -x 2 -x 3', {
              number: 'x',
              configuration: {
                'duplicate-arguments-array': false,
                'flatten-duplicate-arrays': true
              }
            })
            parsed.x.should.deep.equal(3)
          })
        })
        describe('type=boolean', function () {
          it('[-x true -x true -x false] => false', function () {
            var parsed = parser('-x true -x true -x false', {
              boolean: ['x'],
              configuration: {
                'duplicate-arguments-array': false,
                'flatten-duplicate-arrays': true
              }
            })
            parsed.x.should.deep.equal(false)
          })
        })
      })
      describe('duplicate=true, flatten=true,', function () {
        describe('type=array', function () {
          it('[-x 1 2 3] => [1, 2, 3]', function () {
            var parsed = parser('-x 1 2 3', {
              array: ['x'],
              configuration: {
                'duplicate-arguments-array': true,
                'flatten-duplicate-arrays': true
              }
            })
            parsed.x.should.deep.equal([1, 2, 3])
          })
          it('[-x 1 2 3 -x 2 3 4] => [1, 2, 3, 2, 3, 4]', function () {
            var parsed = parser('-x 1 2 3 -x 2 3 4', {
              array: ['x'],
              configuration: {
                'duplicate-arguments-array': true,
                'flatten-duplicate-arrays': true
              }
            })
            parsed.x.should.deep.equal([1, 2, 3, 2, 3, 4])
          })
        })
        describe('type=number', function () {
          it('[-x 1 -x 2 -x 3] => [1, 2, 3]', function () {
            var parsed = parser('-x 1 -x 2 -x 3', {
              number: 'x',
              configuration: {
                'duplicate-arguments-array': true,
                'flatten-duplicate-arrays': true
              }
            })
            parsed.x.should.deep.equal([1, 2, 3])
          })
        })
        describe('type=boolean', function () {
          // in the casse of boolean arguments, only the last argument is used:
          it('[-x true -x true -x false] => false', function () {
            var parsed = parser('-x true -x true -x false', {
              boolean: ['x'],
              configuration: {
                'duplicate-arguments-array': true,
                'flatten-duplicate-arrays': true
              }
            })
            parsed.x.should.deep.equal(false)
          })
        })
      })
      describe('duplicate=true, flatten=false,', function () {
        describe('type=array', function () {
          it('[-x 1 -x 2 -x 3] => [[1], [2], [3]]', function () {
            var parsed = parser('-x 1 -x 2 -x 3', {
              array: ['x'],
              configuration: {
                'duplicate-arguments-array': true,
                'flatten-duplicate-arrays': false
              }
            })
            parsed.x.should.deep.equal([[1], [2], [3]])
          })
          it('[-x 1 2 3 -x 2 3 4] => [[1, 2, 3], [ 2, 3, 4]]', function () {
            var parsed = parser('-x 1 2 3 -x 2 3 4', {
              array: ['x'],
              configuration: {
                'duplicate-arguments-array': true,
                'flatten-duplicate-arrays': false
              }
            })
            parsed.x.should.deep.equal([[1, 2, 3], [2, 3, 4]])
          })
        })
        describe('type=number', function () {
          it('[-x 1 -x 2 -x 3] => [1, 2, 3]', function () {
            var parsed = parser('-x 1 -x 2 -x 3', {
              number: 'x',
              configuration: {
                'duplicate-arguments-array': true,
                'flatten-duplicate-arrays': false
              }
            })
            parsed.x.should.deep.equal([1, 2, 3])
          })
        })
        describe('type=boolean', function () {
          it('[-x true -x true -x false] => false', function () {
            var parsed = parser('-x true -x true -x false', {
              boolean: ['x'],
              configuration: {
                'duplicate-arguments-array': true,
                'flatten-duplicate-arrays': false
              }
            })
            parsed.x.should.deep.equal(false)
          })
        })
      })
    })

    describe('populate--', function () {
      it('should populate "_" by default', function () {
        var result = parser([
          'bare',
          '--', '-h', 'eek', '--'
        ])
        result.should.have.property('_').and.deep.equal(['bare', '-h', 'eek', '--'])
        result.should.not.have.property('--')
      })

      it('should populate "_" when given config with "short-option-groups" false', function () {
        var result = parser.detailed([
          '--', 'foo'
        ], {
          configuration: {
            'short-option-groups': false
          }
        })
        result.argv.should.deep.equal({ _: ['foo'] })
        result.argv.should.not.have.property('--')
        result.newAliases.should.deep.equal({})
      })

      it('should populate the "--" if populate-- is "true"', function () {
        var result = parser([
          '--name=meowmers', 'bare', '-cats', 'woo', 'moxy',
          '-h', 'awesome', '--multi=quux',
          '--key', 'value',
          '-b', '--bool', '--no-meep', '--multi=baz',
          '--', '--not-a-flag', '-', '-h', '-multi', '--', 'eek'
        ], {
          configuration: {
            'populate--': true
          }
        })
        result.should.have.property('c', true)
        result.should.have.property('a', true)
        result.should.have.property('t', true)
        result.should.have.property('s', 'woo')
        result.should.have.property('h', 'awesome')
        result.should.have.property('b', true)
        result.should.have.property('bool', true)
        result.should.have.property('key', 'value')
        result.should.have.property('multi').and.deep.equal(['quux', 'baz'])
        result.should.have.property('meep', false)
        result.should.have.property('name', 'meowmers')
        result.should.have.property('_').and.deep.equal(['bare', 'moxy'])
        result.should.have.property('--').and.deep.equal(['--not-a-flag', '-', '-h', '-multi', '--', 'eek'])
      })
    })

    describe('set-placeholder-key', function () {
      it('should not set placeholder key by default', function () {
        var parsed = parser([], {
          string: ['a']
        })
        parsed.should.not.have.property('a')
      })

      it('should set placeholder key to "undefined"', function () {
        var parsed = parser([], {
          array: ['a'],
          boolean: ['b'],
          string: ['c'],
          number: ['d'],
          count: ['e'],
          normalize: ['f'],
          narg: { g: 2 },
          coerce: {
            h: function (arg) {
              return arg
            }
          },
          configuration: { 'set-placeholder-key': true }
        })
        parsed.should.have.property('a')
        expect(parsed.a).to.be.equal(undefined)
        parsed.should.have.property('b')
        expect(parsed.b).to.be.equal(undefined)
        parsed.should.have.property('c')
        expect(parsed.c).to.be.equal(undefined)
        parsed.should.have.property('d')
        expect(parsed.d).to.be.equal(undefined)
        parsed.should.have.property('e')
        expect(parsed.f).to.be.equal(undefined)
        parsed.should.have.property('g')
        expect(parsed.g).to.be.equal(undefined)
        parsed.should.have.property('h')
        expect(parsed.h).to.be.equal(undefined)
      })

      it('should not set placeholder for key with a default value', function () {
        var parsed = parser([], {
          string: ['a'],
          default: { a: 'hello' },
          configuration: { 'set-placeholder-key': true }
        })
        parsed.a.should.equal('hello')
      })

      it('should not set placeholder key with dot notation', function () {
        var parsed = parser([], {
          string: ['a.b']
        })
        parsed.should.not.have.property('a')
        parsed.should.not.have.property('b')
        parsed.should.not.have.property('a.b')
      })
    })

    describe('halt-at-non-option', function () {
      it('gets the entire rest of line', function () {
        var parse = parser(['--foo', './file.js', '--foo', '--bar'], {
          configuration: { 'halt-at-non-option': true },
          boolean: ['foo', 'bar']
        })
        parse.should.deep.equal({ foo: true, _: ['./file.js', '--foo', '--bar'] })
      })

      it('is not influenced by --', function () {
        var parse = parser(
          ['--foo', './file.js', '--foo', '--', 'barbar', '--bar'],
          { configuration: { 'halt-at-non-option': true }, boolean: ['foo', 'bar'] }
        )
        parse.should.deep.equal({
          foo: true,
          _: ['./file.js', '--foo', '--', 'barbar', '--bar']
        })
      })

      it('is not influenced by unknown options', function () {
        var parse = parser(
          ['-v', '--long', 'arg', './file.js', '--foo', '--', 'barbar'],
          { configuration: { 'halt-at-non-option': true }, boolean: ['foo'] }
        )
        parse.should.deep.equal({
          v: true,
          long: 'arg',
          _: ['./file.js', '--foo', '--', 'barbar']
        })
      })
    })

    describe('unknown-options-as-args = true', function () {
      it('should ignore unknown options in long format separated by =', function () {
        const argv = parser('--known-arg=1 --unknown-arg=2', {
          number: ['known-arg'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['--unknown-arg=2'],
          'known-arg': 1,
          knownArg: 1
        })
      })
      it('should ignore unknown options in boolean negations', function () {
        const argv = parser('--no-known-arg --no-unknown-arg', {
          boolean: ['known-arg'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['--no-unknown-arg'],
          'known-arg': false,
          knownArg: false
        })
      })
      it('should ignore unknown options in long format separated by space', function () {
        const argv = parser('--known-arg a --unknown-arg b', {
          string: ['known-arg'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['--unknown-arg', 'b'],
          'known-arg': 'a',
          knownArg: 'a'
        })
      })
      it('should ignore unknown options in short dot format separated by equals', function () {
        const argv = parser('-k.arg=a -u.arg=b', {
          string: ['k.arg'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['-u.arg=b'],
          k: {
            arg: 'a'
          }
        })
      })
      it('should ignore unknown options in short dot format separated by space', function () {
        const argv = parser('-k.arg 1 -u.arg 2', {
          number: ['k.arg'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['-u.arg', '2'],
          k: {
            arg: 1
          }
        })
      })
      it('should ignore unknown options in short format separated by equals', function () {
        const argv = parser('-k=a -u=b', {
          string: ['k'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['-u=b'],
          k: 'a'
        })
      })
      it('should ignore unknown options in short format followed by hyphen', function () {
        const argv = parser('-k- -u-', {
          string: ['k'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['-u-'],
          k: '-'
        })
      })
      it('should ignore unknown options in short format separated by space', function () {
        const argv = parser('-k 1 -u 2', {
          number: ['k'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['-u', '2'],
          k: 1
        })
      })
      it('should allow an unknown arg to be used as the value of another flag in short form', function () {
        const argv = parser('-k -u', {
          string: ['k'],
          narg: { k: 1 },
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: [],
          k: '-u'
        })
      })
      it('should allow an unknown arg to be used as the value of another flag in long form', function () {
        const argv = parser('--known-arg --unknown-arg', {
          string: ['known-arg'],
          narg: { 'known-arg': 1 },
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: [],
          knownArg: '--unknown-arg',
          'known-arg': '--unknown-arg'
        })
      })
      it('should allow an unknown arg to be used as the value of another flag in array form', function () {
        const argv = parser('--known-arg --unknown-arg1 --unknown-arg2', {
          array: ['known-arg'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: [],
          knownArg: ['--unknown-arg1', '--unknown-arg2'],
          'known-arg': ['--unknown-arg1', '--unknown-arg2']
        })
      })
      it('should ignore unknown options in short format followed by a number', function () {
        const argv = parser('-k1 -u2', {
          number: ['k'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['-u2'],
          k: 1
        })
      })
      it('should ignore unknown options in short format followed by a non-word character', function () {
        const argv = parser('-k/1/ -u/2/', {
          string: ['k'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['-u/2/'],
          k: '/1/'
        })
      })
      it('should ignore unknown options in short format with multiple flags in one argument where an unknown flag is before the end', function () {
        const argv = parser('-kuv', {
          boolean: ['k', 'v'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['-kuv']
        })
      })
      it('should parse known options in short format with multiple flags in one argument where no unknown flag is in the argument', function () {
        const argv = parser('-kv', {
          boolean: ['k', 'v'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: [],
          k: true,
          v: true
        })
      })
      it('should parse negative numbers', function () {
        const argv = parser('-k -33', {
          boolean: ['k'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: [-33],
          k: true
        })
      })

      it('should not identify "--" as an unknown option', function () {
        const argv = parser('-a -k one -1 -- -b -k two -2', {
          boolean: ['k'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['-a', 'one', -1, '-b', '-k', 'two', '-2'],
          k: true
        })
      })

      it('should not identify "--" as an unknown option when "populate--" is true', function () {
        const argv = parser('-a -k one -1 -- -b -k two -2', {
          boolean: ['k'],
          configuration: {
            'populate--': true,
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          // populate argv._ with everything before the --
          _: ['-a', 'one', -1],
          // and argv['--'] with everything after the --
          '--': ['-b', '-k', 'two', '-2'],
          k: true
        })
      })
      // see: https://github.com/yargs/yargs/issues/1489
      it('should identify "hasOwnProperty" as unknown option', () => {
        const argv = parser('--known-arg=1 --hasOwnProperty=33', {
          number: ['known-arg'],
          configuration: {
            'unknown-options-as-args': true
          }
        })
        argv.should.deep.equal({
          _: ['--hasOwnProperty=33'],
          'known-arg': 1,
          knownArg: 1
        })
      })
    })

    // See: https://github.com/yargs/yargs-parser/issues/231
    it('should collect unknown options terminated with digit', function () {
      const argv = parser('--known-arg=1 --num2', {
        alias: { num: ['n'] },
        number: ['known-arg'],
        configuration: {
          'unknown-options-as-args': true
        }
      })
      argv.should.deep.equal({
        _: ['--num2'],
        'known-arg': 1,
        knownArg: 1
      })
    })
  })

  // addresses: https://github.com/yargs/yargs-parser/issues/41
  it('defaults to empty array if array option is provided no values', function () {
    var parsed = parser(['-f'], {
      alias: {
        f: 'files'
      },
      array: ['files']
    })
    parsed.f.should.deep.equal([])
    parsed.files.should.deep.equal([])

    parsed = parser(['--files'], {
      alias: {
        f: 'files'
      },
      array: ['files']
    })
    parsed.f.should.deep.equal([])
    parsed.files.should.deep.equal([])

    parsed = parser(['-f', '-y'], {
      alias: {
        f: 'files'
      },
      array: ['files']
    })
    parsed.f.should.deep.equal([])
    parsed.files.should.deep.equal([])
  })

  describe('coerce', function () {
    it('applies coercion function to simple arguments', function () {
      var parsed = parser(['--foo', '99'], {
        coerce: {
          foo: function (arg) {
            return arg * -1
          }
        }
      })
      parsed.foo.should.equal(-99)
    })

    it('applies coercion function to aliases', function () {
      var parsed = parser(['--foo', '99'], {
        coerce: {
          f: function (arg) {
            return arg * -1
          }
        },
        alias: {
          f: ['foo']
        }
      })
      parsed.foo.should.equal(-99)
      parsed.f.should.equal(-99)
    })

    it('applies coercion function to all dot options', function () {
      var parsed = parser(['--foo.bar', 'nananana'], {
        coerce: {
          foo: function (val) {
            val.bar += ', batman!'
            return val
          }
        }
      })
      parsed.foo.bar.should.equal('nananana, batman!')
    })

    it('applies coercion to defaults', function () {
      var parsed = parser([], {
        default: { foo: 'bar' },
        coerce: {
          foo: function (val) {
            return val.toUpperCase()
          }
        }
      })
      parsed.foo.should.equal('BAR')
    })

    it('applies coercion function to an implicit array', function () {
      var parsed = parser(['--foo', '99', '-f', '33'], {
        coerce: {
          f: function (arg) {
            return arg.map(function (a) {
              return a * -1
            })
          }
        },
        alias: {
          f: ['foo']
        }
      })
      parsed.f.should.deep.equal([-99, -33])
      parsed.foo.should.deep.equal([-99, -33])
    })

    it('applies coercion function to an explicit array', function () {
      var parsed = parser(['--foo', '99', '-f', '33'], {
        coerce: {
          f: function (arg) {
            return arg.map(function (a) {
              return a * -1
            })
          }
        },
        array: ['foo'],
        alias: {
          f: ['foo']
        }
      })
      parsed.f.should.deep.equal([-99, -33])
      parsed.foo.should.deep.equal([-99, -33])
    })

    it('applies coercion function to _', function () {
      var parsed = parser(['99', '33'], {
        coerce: {
          _: function (arg) {
            return arg.map(function (a) {
              return a * -1
            })
          }
        }
      })
      parsed._.should.deep.equal([-99, -33])
    })

    // see: https://github.com/yargs/yargs/issues/550
    it('coercion function can be used to parse large #s', function () {
      var fancyNumberParser = function (arg) {
        if (arg.length > 10) return arg
        else return parseInt(arg)
      }
      var parsed = parser(['--foo', '88888889999990000998989898989898', '--bar', '998'], {
        coerce: {
          foo: fancyNumberParser,
          bar: fancyNumberParser
        }
      })
        ; (typeof parsed.foo).should.equal('string')
      parsed.foo.should.equal('88888889999990000998989898989898')
      ; (typeof parsed.bar).should.equal('number')
      parsed.bar.should.equal(998)
    })

    it('populates argv.error, if an error is thrown', function () {
      var parsed = parser.detailed(['--foo', '99'], {
        coerce: {
          foo: function (arg) {
            throw Error('banana')
          }
        }
      })
      parsed.error.message.should.equal('banana')
    })

    it('populates argv.error, if an error is thrown for an explicit array', function () {
      var parsed = parser.detailed(['--foo', '99'], {
        array: ['foo'],
        coerce: {
          foo: function (arg) {
            throw Error('foo is array: ' + Array.isArray(arg))
          }
        }
      })
      parsed.error.message.should.equal('foo is array: true')
    })

    // see: https://github.com/yargs/yargs-parser/issues/76
    it('only runs coercion functions once, even with aliases', function () {
      var runcount = 0
      var func = (arg) => {
        runcount++
        return undefined
      }
      parser(['--foo', 'bar'], {
        alias: {
          foo: ['f', 'foo-bar', 'bar'],
          b: ['bar']
        },
        coerce: {
          bar: func
        }
      })
      runcount.should.equal(1)
    })
  })

  // see: https://github.com/yargs/yargs-parser/issues/37
  it('normalizes all paths in array when provided via config object', function () {
    var argv = parser(['--foo', 'bar'], {
      array: ['a'],
      normalize: ['a'],
      configObjects: [{ a: ['bin/../a.txt', 'bin/../b.txt'] }]
    })
    argv.a.should.deep.equal(['a.txt', 'b.txt'])
  })

  // see: https://github.com/yargs/yargs/issues/963
  it('does not magically convert numeric strings larger than Number.MAX_SAFE_INTEGER', () => {
    const argv = parser(['--foo', '93940495950949399948393'])
    argv.foo.should.equal('93940495950949399948393')
  })

  it('does not magically convert scientific notation larger than Number.MAX_SAFE_INTEGER', () => {
    const argv = parser(['--foo', '33e99999'])
    argv.foo.should.equal('33e99999')
  })

  it('converts numeric options larger than Number.MAX_SAFE_INTEGER to number', () => {
    const argv = parser(['--foo', '93940495950949399948393'], {
      number: ['foo']
    })
    argv.foo.should.equal(9.39404959509494e+22)
  })

  // see: https://github.com/yargs/yargs/issues/1099
  it('does not magically convert options with leading + to number', () => {
    const argv = parser(['--foo', '+5550100', '--bar', '+5550100'], {
      number: 'bar'
    })
    argv.foo.should.equal('+5550100')
    argv.bar.should.equal(5550100)
  })

  // see: https://github.com/yargs/yargs/issues/1099
  it('does not magically convert options with leading 0 to number', () => {
    const argv = parser(['--foo', '000000', '--bar', '000000'], {
      number: 'bar'
    })
    argv.foo.should.equal('000000')
    argv.bar.should.equal(0)
  })

  // see: https://github.com/yargs/yargs-parser/issues/101
  describe('dot-notation array arguments combined with string arguments', function () {
    it('parses correctly when dot-notation argument is first', function () {
      var argv = parser(['--foo.bar', 'baz', '--foo', 'bux'])
      Array.isArray(argv.foo).should.equal(true)
      argv.foo[0].bar.should.equal('baz')
      argv.foo[1].should.equal('bux')
    })

    it('parses correctly when dot-notation argument is last', function () {
      var argv = parser(['--foo', 'bux', '--foo.bar', 'baz'])
      Array.isArray(argv.foo).should.equal(true)
      argv.foo[0].should.equal('bux')
      argv.foo[1].bar.should.equal('baz')
    })

    it('parses correctly when there are multiple dot-notation arguments', function () {
      var argv = parser(['--foo.first', 'firstvalue', '--foo', 'bux', '--foo.bar', 'baz', '--foo.bla', 'banana'])
      Array.isArray(argv.foo).should.equal(true)
      argv.foo.length.should.equal(4)
      argv.foo[0].first.should.equal('firstvalue')
      argv.foo[1].should.equal('bux')
      argv.foo[2].bar.should.equal('baz')
      argv.foo[3].bla.should.equal('banana')
    })
  })

  // see: https://github.com/yargs/yargs-parser/issues/145
  describe('strings with quotes and dashes', () => {
    it('handles double quoted strings', function () {
      const args = parser('--foo "hello world" --bar="goodnight\'moon"')
      args.foo.should.equal('hello world')
      args.bar.should.equal('goodnight\'moon')
      const args2 = parser(['--foo', '"hello world"', '--bar="goodnight\'moon"'])
      args2.foo.should.equal('hello world')
      args2.bar.should.equal('goodnight\'moon')
    })

    it('handles single quoted strings', function () {
      const args = parser("--foo 'hello world' --bar='goodnight\"moon'")
      args.foo.should.equal('hello world')
      args.bar.should.equal('goodnight"moon')
      const args2 = parser(['--foo', "'hello world'", "--bar='goodnight\"moon'"])
      args2.foo.should.equal('hello world')
      args2.bar.should.equal('goodnight"moon')
    })

    it('handles strings with dashes', function () {
      const args = parser('--foo "-hello world" --bar="--goodnight moon"')
      args.foo.should.equal('-hello world')
      args.bar.should.equal('--goodnight moon')
    })
  })

  // see: https://github.com/yargs/yargs-parser/issues/144
  it('number/string types should use default when no right-hand value', () => {
    let argv = parser(['--foo'], {
      number: ['foo'],
      default: {
        foo: 99
      }
    })
    argv.foo.should.equal(99)

    argv = parser(['-b'], {
      alias: {
        bar: 'b'
      },
      string: ['bar'],
      default: {
        bar: 'hello'
      }
    })
    argv.bar.should.equal('hello')
  })

  describe('stripping', function () {
    it('strip-dashed removes expected fields from argv', function () {
      const argv = parser(['--test-value', '1'], {
        number: ['test-value'],
        alias: {
          'test-value': ['alt-test']
        },
        configuration: {
          'strip-dashed': true
        }
      })
      argv.should.deep.equal({
        _: [],
        testValue: 1,
        altTest: 1
      })
    })

    it('strip-aliased removes expected fields from argv', function () {
      const argv = parser(['--test-value', '1'], {
        number: ['test-value'],
        alias: {
          'test-value': ['alt-test']
        },
        configuration: {
          'strip-aliased': true
        }
      })
      argv.should.deep.equal({
        _: [],
        'test-value': 1,
        testValue: 1
      })
    })

    it('strip-aliased and strip-dashed combined removes expected fields from argv', function () {
      const argv = parser(['--test-value', '1'], {
        number: ['test-value'],
        alias: {
          'test-value': ['alt-test']
        },
        configuration: {
          'strip-aliased': true,
          'strip-dashed': true
        }
      })
      argv.should.deep.equal({
        _: [],
        testValue: 1
      })
    })

    it('ignores strip-dashed if camel-case-expansion is disabled', function () {
      const argv = parser(['--test-value', '1'], {
        number: ['test-value'],
        configuration: {
          'camel-case-expansion': false,
          'strip-dashed': true
        }
      })
      argv.should.deep.equal({
        _: [],
        'test-value': 1
      })
    })
  })

  describe('prototype collisions', () => {
    it('parses unknown argument colliding with prototype', () => {
      var parse = parser(['--toString'])
      parse.toString.should.equal(true)
    })

    it('parses unknown argument colliding with prototype, when unknown options as args', () => {
      var parse = parser(['--toString'], {
        configuration: {
          'unknown-options-as-args': true
        }
      })
      parse._.should.include('--toString')
    })

    it('handles "alias" colliding with prototype', () => {
      var parse = parser(['-t', '99'], {
        alias: {
          toString: ['t']
        }
      })
      parse.toString.should.equal(99)
      parse.t.should.equal(99)
      parse['to-string'].should.equal(99)
    })

    it('handles multiple args colliding with alias', () => {
      var parse = parser(['--toString', '88', '--toString', '99'])
      parse.toString.should.eql([88, 99])
    })

    it('handle dot notation colliding with alias', () => {
      var parse = parser(['--toString.cool', 'apple'])
      parse.toString.cool.should.equal('apple')
    })

    it('handles "arrays" colliding with prototype', () => {
      var parse = parser(['--toString', '99', '100'], {
        array: ['toString']
      })
      parse.toString.should.eql([99, 100])
    })

    it('handles "arrays" colliding with prototype', () => {
      var parse = parser(['--toString', '99', '100'], {
        array: ['toString']
      })
      parse.toString.should.eql([99, 100])
    })

    it('handles "strings" colliding with prototype', () => {
      var parse = parser(['--toString', '99'], {
        string: ['toString']
      })
      parse.toString.should.eql('99')
    })

    it('handles "numbers" colliding with prototype', () => {
      var parse = parser(['--toString', '99'], {
        number: ['toString'],
        configuration: {
          'parse-numbers': false
        }
      })
      parse.toString.should.eql(99)
    })

    it('handles "counts" colliding with prototype', () => {
      var parse = parser(['--toString', '--toString', '--toString'], {
        count: ['toString']
      })
      parse.toString.should.eql(3)
    })

    it('handles "normalize" colliding with prototype', () => {
      var parse = parser(['--toString', './node_modules/chai'], {
        normalize: ['toString']
      })
      parse.toString.should.include('node_modules')
    })

    it('handles "normalize" colliding with prototype', () => {
      var parse = parser(['--toString', './node_modules/chai'], {
        normalize: ['toString']
      })
      parse.toString.should.include('node_modules')
    })

    it('handles key in configuration file that collides with prototype', function () {
      var argv = parser(['--foo', 'bar'], {
        alias: {
          z: 'zoom'
        },
        default: {
          settings: jsonPath
        },
        config: 'settings'
      })
      argv.toString.should.equal('method name')
    })

    it('handles "nargs" colliding with prototype', () => {
      var parse = parser(['--toString', 'apple', 'banana', 'batman', 'robin'], {
        narg: {
          toString: 3
        }
      })
      parse.toString.should.eql(['apple', 'banana', 'batman'])
      parse._.should.eql(['robin'])
    })

    it('handles "coercions" colliding with prototype', () => {
      var parse = parser(['--toString', '33'], {
        coerce: {
          toString: (val) => {
            return val * 2
          }
        }
      })
      parse.toString.should.equal(66)
    })
  })

  // See: https://github.com/facebook/jest/issues/9517
  it('does not collect arguments configured as booleans into implicit array', () => {
    var parse = parser(['--infinite', 'true', '--infinite', 'true', '--no-infinite'], {
      boolean: 'infinite'
    })
    parse.infinite.should.equal(false)
  })

  // See: https://github.com/yargs/yargs/issues/1098,
  // https://github.com/yargs/yargs/issues/1570
  describe('array with nargs', () => {
    it('allows array and nargs to be configured in conjunction, enforcing the nargs value', () => {
      var parse = parser.detailed(['-a', 'apple', 'banana'], {
        array: 'a',
        narg: {
          a: 1
        }
      })
      expect(parse.error).to.be.null // eslint-disable-line
      parse.argv.a.should.eql(['apple'])
      parse.argv._.should.eql(['banana'])
    })

    // see; https://github.com/yargs/yargs/issues/1098
    it('allows special NaN count to be provided to narg, to indicate one or more array values', () => {
      var parse = parser.detailed(['-a', 'apple', 'banana'], {
        array: 'a',
        narg: {
          a: NaN
        }
      })
      expect(parse.error).to.be.null // eslint-disable-line
      parse.argv.a.should.eql(['apple', 'banana'])
    })

    it('throws error if at least one value not provided for NaN', () => {
      var parse = parser.detailed(['-a'], {
        array: 'a',
        narg: {
          a: NaN
        }
      })
      parse.error.message.should.match(/Not enough arguments/)
    })

    it('returns an error if not enough positionals were provided for nargs', () => {
      var parse = parser.detailed(['-a', '33'], {
        array: 'a',
        narg: {
          a: 2
        }
      })
      parse.argv.a.should.eql([33])
      parse.error.message.should.equal('Not enough arguments following: a')
    })

    it('returns an error if not enough positionals were provided for nargs even with nargs-eats-options', () => {
      var parse = parser.detailed(['-a', '33', '--cat'], {
        narg: {
          a: 3
        },
        configuration: {
          'nargs-eats-options': true
        }
      })
      parse.error.message.should.equal('Not enough arguments following: a')
    })

    it('does not raise error if no arguments are provided for boolean option', () => {
      var parse = parser.detailed(['-a'], {
        array: 'a',
        boolean: 'a',
        narg: {
          a: NaN
        }
      })
      expect(parse.error).to.be.null // eslint-disable-line
      parse.argv.a.should.eql([true])
    })
  })

  describe('greedy-arrays=false', () => {
    it('does not consume more than one argument after array option', () => {
      const argv = parser(['--arr', 'foo', 'bar'], {
        array: 'arr',
        configuration: {
          'greedy-arrays': false
        }
      })
      argv.arr.should.eql(['foo'])
      argv._.should.eql(['bar'])
    })

    it('places argument into array when specified multiple times', () => {
      const argv = parser(['--arr', 99, 'foo', '--arr', 'hello', 'bar'], {
        array: 'arr',
        configuration: {
          'greedy-arrays': false
        }
      })
      argv.arr.should.eql([99, 'hello'])
      argv._.should.eql(['foo', 'bar'])
    })

    it('places boolean arguments into array when specified multiple times', () => {
      const argv = parser(['--arr', 101, '--arr', 102, '--arr', 'false'], {
        array: 'arr',
        boolean: 'arr',
        configuration: {
          'greedy-arrays': false
        }
      })
      argv.arr.should.eql([true, true, false])
      argv._.should.eql([101, 102])
    })
  })

  it('should replace the key __proto__ with the key ___proto___', function () {
    const argv = parser(['-f.__proto__.foo', '99', '-x.y.__proto__.bar', '100', '--__proto__', '200'])
    argv.should.eql({
      _: [],
      ___proto___: 200,
      f: {
        ___proto___: {
          foo: 99
        }
      },
      x: {
        y: {
          ___proto___: {
            bar: 100
          }
        }
      }
    })
  })
})
