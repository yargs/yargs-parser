// deno run --allow-env --allow-read ./test.js
import { runTests } from "./test/deps/mocha.ts"

import "./test/tokenize-arg-string.js"
import "./test/yargs-parser.js"

runTests()