/**
 * @fileoverview Main entrypoint for libraries using yargs-parser in Node.js
 * CJS and ESM environments.
 *
 * @license
 * Copyright (c) 2016, Contributors
 * SPDX-License-Identifier: ISC
 */

import { format } from 'util'
import { normalize, resolve } from 'path'
import { ArgsInput, Arguments, Parser, Options, DetailedArguments } from './yargs-parser-types.js'
import { camelCase, decamelize, looksLikeNumber } from './string-utils.js'
import { YargsParser } from './yargs-parser.js'
import { createRequire } from 'module'

// Addresses: https://github.com/yargs/yargs/issues/2040
const esmRequire = createRequire(import.meta.url)

// See https://github.com/yargs/yargs-parser#supported-nodejs-versions for our
// version support policy. The YARGS_MIN_NODE_VERSION is used for testing only.
const minNodeVersion = (process && process.env && process.env.YARGS_MIN_NODE_VERSION)
  ? Number(process.env.YARGS_MIN_NODE_VERSION)
  : 10
if (process && process.version) {
  const major = Number(process.version.match(/v([^.]+)/)![1])
  if (major < minNodeVersion) {
    throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`)
  }
}

// Creates a yargs-parser instance using Node.js standard libraries:
const env = process ? process.env as { [key: string]: string } : {}
const parser = new YargsParser({
  cwd: process.cwd,
  env: () => {
    return env
  },
  format,
  normalize,
  resolve,
  // TODO: figure  out a  way to combine ESM and CJS coverage, such  that
  // we can exercise all the lines below:
  require: (path: string) => {
    if (typeof require !== 'undefined') {
      return require(path)
    } else if (path.match(/\.json$/)) {
      return esmRequire(path)
    } else {
      throw Error('only .json config files are supported in ESM')
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
