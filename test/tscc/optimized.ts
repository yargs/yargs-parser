import { YargsParser } from './lib/yargs-parser'

const parser = new YargsParser({
  cwd: () => { return '' },
  format: (str, arg) => { return str.replace('%s', arg) },
  normalize: (str) => { return str },
  resolve: (str) => { return str },
  require: () => {
    throw Error('loading config from files not currently supported in browser')
  },
  env: () => {}
})

// Workaround the need for proper nodejs typings and externs
// eslint-disable-next-line no-eval
const anyDeepEqual = eval('require("assert").strict.deepEqual') as any
function deepEqual<T> (actual: T, expected: T, message?: string): void {
  anyDeepEqual(actual, expected, message)
}

// Quoted properties aren't allowed in these lint settings.
const FLAG_X = 'x'

function runTests () {
  deepEqual(parser.parse([]).argv, { _: [] }, 'empty argv')
  deepEqual(
    parser.parse([`--${FLAG_X}=42`]).argv,
    { _: [], [FLAG_X]: 42 },
    'guessed numeric value')
  deepEqual(
    parser.parse([`--${FLAG_X}=str`]).argv,
    { _: [], [FLAG_X]: 'str' },
    'guessed string value')
  deepEqual(
    parser.parse([`--no-${FLAG_X}`]).argv,
    { _: [], [FLAG_X]: false },
    'guessed boolean negation')

  // Default values for types:
  deepEqual(
    parser.parse([`--${FLAG_X}`]).argv,
    { _: [], [FLAG_X]: true },
    'guessed boolean default true')

  console.log('ok')
}
runTests()
