import { YargsParser } from './build/lib/yargs-parser.js'
const parser = new YargsParser({
  format: (str) => { return str },
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
