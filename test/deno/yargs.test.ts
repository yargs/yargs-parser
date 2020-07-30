import {
  assertEquals
} from "https://deno.land/std/testing/asserts.ts";
import parser from '../../index-deno.ts'

Deno.test("parse simple string", () => {
  const parsed = parser('--foo --bar 99')
  assertEquals(parsed.foo, true)
  assertEquals(parsed.bar, 99)
});

Deno.test("parse simple array", () => {
  const parsed = parser(['--foo', '--bar', '99'])
  assertEquals(parsed.foo, true)
  assertEquals(parsed.bar, 99)
});
