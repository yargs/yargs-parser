/**
 * @fileoverview Main entrypoint for libraries using yargs-parser in Node.js
 *
 * @license
 * Copyright (c) 2016, Contributors
 * SPDX-License-Identifier: ISC
 */

/* eslint-disable n/no-unpublished-import */

import { format } from 'util'
import { normalize, resolve } from 'path'
import { ArgsInput, Arguments, Parser, Options, DetailedArguments } from './yargs-parser-types.js'
import { camelCase, decamelize, looksLikeNumber } from './string-utils.js'
import { YargsParser } from './yargs-parser.js'
import { readFileSync } from 'fs'
import { createRequire } from 'node:module';

// See https://github.com/yargs/yargs-parser#supported-nodejs-versions for our
// version support policy. The YARGS_MIN_NODE_VERSION is used for testing only.
const minNodeVersion = (process && process.env && process.env.YARGS_MIN_NODE_VERSION)
  ? Number(process.env.YARGS_MIN_NODE_VERSION)
  : 20
const nodeVersion = process?.versions?.node ?? process?.version?.slice(1)
if (nodeVersion) {
  const major = Number(nodeVersion.match(/^([^.]+)/)![1])
  if (major < minNodeVersion) {
    throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`)
  }
}

// Creates a yargs-parser instance using Node.js standard libraries:
const env = process ? process.env as { [key: string]: string } : {}
const require = createRequire ? createRequire(import.meta.url) : undefined;

const parser = new YargsParser({
  cwd: process.cwd,
  env: () => {
    return env
  },
  format,
  normalize,
  resolve,
  require: (path: string) => {
    if (typeof require !== 'undefined') {
      return require(path)
    } else if (path.match(/\.json$/)) {
      // Addresses: https://github.com/yargs/yargs/issues/2040
      return JSON.parse(readFileSync(path, 'utf8'))
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

// special syntax to allow unqualified default export from CommonJS
export {yargsParser as 'module.exports'};
