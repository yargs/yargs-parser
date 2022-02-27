/* global Deno */
// Main entrypoint for Deno.
//
// TODO: find reasonable replacement for require logic.
import * as path from 'https://deno.land/std/path/mod.ts'
import { camelCase, decamelize, looksLikeNumber } from './build/lib/string-utils.js'
import { YargsParser } from './build/lib/yargs-parser.js'
import type { Arguments, ArgsInput, Parser, Options, DetailedArguments } from './build/lib/yargs-parser-types.d.ts'

const parser = new YargsParser({
  cwd: Deno.cwd,
  env: () => {
    return Deno.env.toObject()
  },
  format: (str: string, arg: string) => { return str.replace('%s', arg) },
  normalize: path.posix.normalize,
  resolve: path.posix.resolve,
  require: (path: string) => {
    if (!path.match(/\.json$/)) {
      throw Error('only .json config files are supported in Deno')
    } else {
      return JSON.parse(Deno.readTextFileSync(path))
    }
  }
})

const yargsParser: Parser = function Parser (args: ArgsInput, opts?: Partial<Options>): Arguments {
  const result = parser.parse(args.slice(), opts)
  return result.argv
}
yargsParser.detailed = function (args: ArgsInput, opts?: Partial<Options>): DetailedArguments {
  return parser.parse(args.slice(), opts)
}
yargsParser.camelCase = camelCase
yargsParser.decamelize = decamelize
yargsParser.looksLikeNumber = looksLikeNumber

export default yargsParser
