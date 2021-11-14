import { should, expect } from 'chai'
import parser from '../build/lib/index.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

should()

describe('yargs-parser (esm)', function () {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const jsonPath = path.resolve(__dirname, './fixtures/config.json')
  describe('config', function () {
    it('should load options and values from default config if specified', function () {
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
    })

    it('should use value from config file, if argv value is using default value', function () {
      const argv = parser([], {
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
      const argv = parser(['--foo', 'bar'], {
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
      const argv = parser([], {
        config: ['settings'],
        default: {
          settings: jsonPath
        },
        boolean: ['truthy']
      })

      argv.should.have.property('truthy', true)
    })

    it('should use value from cli, if cli overrides boolean argv key', function () {
      const argv = parser(['--no-truthy'], {
        config: ['settings'],
        default: {
          settings: jsonPath
        },
        boolean: ['truthy']
      })

      argv.should.have.property('truthy', false)
    })

    it('should use cli value, if cli value is set and both cli and default value match', function () {
      const argv = parser(['--foo', 'banana'], {
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
      const argv = parser(['--settings', jsonPath, '--foo', 'bar'], {
        alias: {
          z: 'zoom'
        },
        config: ['settings']
      })

      argv.should.have.property('herp', 'derp')
      argv.should.have.property('zoom', 55)
      argv.should.have.property('foo').and.deep.equal('bar')
    })

    // for esm, only support importing json files
    it('should fail to load options and values from a JS file when config has .js extention', function () {
      const jsPath = path.resolve(__dirname, './fixtures/settings.cjs')
      const argv = parser.detailed(['--settings', jsPath, '--foo', 'bar'], {
        config: ['settings']
      })

      argv.error.message.should.include('Invalid JSON config file')
    })

    it('should raise an appropriate error if JSON file is not found', function () {
      const argv = parser.detailed(['--settings', 'fake.json', '--foo', 'bar'], {
        alias: {
          z: 'zoom'
        },
        config: ['settings']
      })

      argv.error.message.should.equal('Invalid JSON config file: fake.json')
    })

    // see: https://github.com/bcoe/yargs/issues/172
    it('should not raise an exception if config file is set as default argument value', function () {
      const argv = parser.detailed([], {
        default: {
          config: 'foo.json'
        },
        config: ['config']
      })

      expect(argv.error).to.equal(null)
    })

    it('should load nested options from config file', function () {
      const jsonPath = path.resolve(__dirname, './fixtures/nested_config.json')
      const argv = parser(['--settings', jsonPath, '--nested.foo', 'bar'], {
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
      const jsonPath = path.resolve(__dirname, './fixtures/nested_config.json')
      const argv = parser(['--settings', jsonPath], {
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
      const jsPath = path.resolve(__dirname, './fixtures/config.txt')
      const argv = parser(['--settings', jsPath, '--foo', 'bar'], {
        config: {
          settings: function (configPath) {
            // as an example, parse an environment
            // variable style config:
            // FOO=99
            // BATMAN=grumpy
            const config = {}
            const txt = readFileSync(configPath, 'utf-8')
            txt.split(/\r?\n/).forEach(function (l) {
              const kv = l.split('=')
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
      const jsPath = path.resolve(__dirname, './fixtures/config.json')
      const argv = parser(['--settings', jsPath, '--foo', 'bar'], {
        config: {
          s: function (configPath) {
            return JSON.parse(readFileSync(configPath, 'utf-8'))
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
      const argv = parser.detailed(['--settings=./package.json'], {
        config: {
          settings: function (configPath) {
            return Error('someone set us up the bomb')
          }
        }
      })

      argv.error.message.should.equal('someone set us up the bomb')
    })

    it('outputs an error if thrown by the parsing function', function () {
      const argv = parser.detailed(['--settings=./package.json'], {
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
})