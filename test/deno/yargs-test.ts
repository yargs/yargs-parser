/* global Deno */

import {
  assertEquals
} from 'https://deno.land/std/testing/asserts.ts'
import parser from '../../deno.ts'

// Parser:
Deno.test('parse string', () => {
  const parsed = parser('--foo --bar 99')
  assertEquals(parsed.foo, true)
  assertEquals(parsed.bar, 99)
})

Deno.test('parse array', () => {
  const parsed = parser(['--foo', '--bar', '99'])
  assertEquals(parsed.foo, true)
  assertEquals(parsed.bar, 99)
})

Deno.test('aliases', () => {
  const parsed = parser(['--bar', '99'], {
    alias: {
      bar: ['foo'],
      foo: ['f']
    }
  })
  assertEquals(parsed.bar, 99)
  assertEquals(parsed.foo, 99)
  assertEquals(parsed.f, 99)
})

const jsonPath = './test/fixtures/config.json'
Deno.test('should load options and values from default config if specified', () => {
  const argv = parser(['--foo', 'bar'], {
    alias: {
      z: 'zoom'
    },
    default: {
      settings: jsonPath
    },
    config: 'settings'
  })
  assertEquals(argv.herp, 'derp')
  assertEquals(argv.zoom, 55)
  assertEquals(argv.zoom, 55)
})

// String utilities:
Deno.test('convert hyphenated string to camelcase', () => {
  assertEquals(parser.camelCase('hello-world'), 'helloWorld')
})

Deno.test('convert camelcase string to hyphenated', () => {
  assertEquals(parser.decamelize('helloWorld'), 'hello-world')
})

Deno.test('it detects strings that could be parsed as numbers', () => {
  assertEquals(parser.looksLikeNumber('3293'), true)
  assertEquals(parser.looksLikeNumber('0x10'), true)
  assertEquals(parser.looksLikeNumber('0x10'), true)

  assertEquals(parser.looksLikeNumber('0100'), false)
  assertEquals(parser.looksLikeNumber('apple'), false)
})

Deno.test('should load values from environment variables', () => {
  const argv = parser([], { envPrefix: 'MY_PREFIX' })
  assertEquals(argv.myKey, 'my value')
})
