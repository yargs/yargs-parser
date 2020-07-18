const { yargsParser } = require('./build/lib')

// See https://github.com/yargs/yargs-parser#supported-nodejs-versions for our
// version support policy. The YARGS_MIN_NODE_VERSION is used for testing only.
const minNodeVersion = (process && process.env && process.env.YARGS_MIN_NODE_VERSION)
  ? Number(process.env.YARGS_MIN_NODE_VERSION) : 10
if (process && process.version) {
  const major = Number(process.version.match(/v([^.]+)/)[1])
  if (major < minNodeVersion) {
    throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`)
  }
}

module.exports = yargsParser
