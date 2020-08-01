// Main entrypoint for ESM web browser environments. Avoids using Node.js
// specific libraries, such as "path".
//
// TODO: figure out reasonable web equivalents for "resolve", "normalize", etc.
import { YargsParser } from './build/lib/yargs-parser.js'
const parser = new YargsParser({
  format: (str, arg) => { return str.replace('%s', arg) },
  normalize: (str) => { return str },
  resolve: (str) => { return str },
  env: {}
})

const yargsParser = function Parser (args, opts) {
  const result = parser.parse(args.slice(), opts)
  return result.argv
}

yargsParser.detailed = function (args, opts) {
  return parser.parse(args.slice(), opts)
}

export default yargsParser
