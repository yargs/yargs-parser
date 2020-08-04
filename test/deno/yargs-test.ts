/* global Deno */

import {
  assertEquals
} from 'https://deno.land/std/testing/asserts.ts'
import parser from '../../deno.ts'

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
  var argv = parser(['--foo', 'bar'], {
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
