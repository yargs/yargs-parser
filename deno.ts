// Main entrypoint for Deno.
//
// TODO: find reasonable replacement for require logic.
import * as path from 'https://deno.land/std/path/mod.ts'
import { YargsParser } from './build/lib/yargs-parser.js'
import { Arguments, ArgsInput, Parser, Options, DetailedArguments } from './build/lib/yargs-parser-types.d.ts'

const parser = new YargsParser({
  format: (str: string, arg: string) => { return str.replace('%s', arg) },
  normalize: path.posix.normalize,
  resolve: path.posix.resolve,
  env: {}
})

const yargsParser: Parser = function Parser (args: ArgsInput, opts?: Partial<Options>): Arguments {
  const result = parser.parse(args.slice(), opts)
  return result.argv
}

yargsParser.detailed = function (args: ArgsInput, opts?: Partial<Options>): DetailedArguments {
  return parser.parse(args.slice(), opts)
}

export default yargsParser
