/**
 * @fileoverview Main entrypoint for libraries using yargs-parser in Node.js
 *
 * @license
 * Copyright (c) 2016, Contributors
 * SPDX-License-Identifier: ISC
 */
import { Parser } from './yargs-parser-types.js';
declare const yargsParser: Parser;
export default yargsParser;
export { yargsParser as 'module.exports' };
