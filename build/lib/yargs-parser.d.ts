import type { ArgsInput, DetailedArguments, Options, YargsParserMixin } from './yargs-parser-types.js';
export declare class YargsParser {
    constructor(_mixin: YargsParserMixin);
    parse(argsInput: ArgsInput, options?: Partial<Options>): DetailedArguments;
}
