import { format } from 'util'
import { normalize, resolve } from 'path'
import { ArgsInput, Arguments, Parser, Options, DetailedArguments } from './lib/yargs-parser-types.js'
import { YargsParser } from './lib/yargs-parser.js'

// See https://github.com/yargs/yargs-parser#supported-nodejs-versions for our
// version support policy. The YARGS_MIN_NODE_VERSION is used for testing only.
const minNodeVersion = (process && process.env && process.env.YARGS_MIN_NODE_VERSION)
  ? Number(process.env.YARGS_MIN_NODE_VERSION) : 10
if (process && process.version) {
  const major = Number(process.version.match(/v([^.]+)/)![1])
  if (major < minNodeVersion) {
    throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`)
  }
}

// Creates a yargs-parser instance using Node.js standard libraries:
const env = process ? process.env as { [key: string]: string } : {}
const parser = new YargsParser({ format, normalize, resolve, env })
const yargsParser: Parser = function Parser (args: ArgsInput, opts?: Partial<Options>): Arguments {
  const result = parser.parse(args.slice(), opts)
  return result.argv
}
yargsParser.detailed = function (args: ArgsInput, opts?: Partial<Options>): DetailedArguments {
  return parser.parse(args.slice(), opts)
}
export default yargsParser
