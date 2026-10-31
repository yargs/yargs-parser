# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [16.1.0](https://github.com/yargs/yargs-parser/compare/v22.0.0...v16.1.0) (2026-10-31)


### ⚠ BREAKING CHANGES

* yargs is now ESM first ([#503](https://github.com/yargs/yargs-parser/issues/503))
* drops support for 10 ([#421](https://github.com/yargs/yargs-parser/issues/421))
* do not ship type definitions ([#318](https://github.com/yargs/yargs-parser/issues/318))
* adds support for ESM and Deno ([#295](https://github.com/yargs/yargs-parser/issues/295))
* **ts:** projects using `@types/yargs-parser` may see variations in type definitions.
* drops Node 6. begin following Node.js LTS schedule ([#278](https://github.com/yargs/yargs-parser/issues/278))
* the narg count is now enforced when parsing arrays.
* this reverts parsing behavior of booleans to that of yargs@14
* objects used during parsing are now created with a null prototype. There may be some scenarios where this change in behavior leaks externally.
* populate error if incompatible narg/count or array/count options are used ([#191](https://github.com/yargs/yargs-parser/issues/191))
* moving to c8 for coverage and dropping Node 6 from build matrix ([#209](https://github.com/yargs/yargs-parser/issues/209))
* rework `collect-unknown-options` into `unknown-options-as-args`, providing more comprehensive functionality
* unless "parse-numbers" is set to "false", arrays of numeric strings are now parsed as numbers, rather than strings.
* we have dropped the broken "defaulted" functionality; we would like to revisit adding this in the future.
* maybeCoerceNumber now takes precedence over coerce return value ([#182](https://github.com/yargs/yargs-parser/issues/182))
* options with leading '+' or '0' now parse as strings
* a flag with no right-hand value no longer populates defaulted options with `undefined`.
* quotes and beginning and endings of strings are not removed during parsing.
* drops Node 4 support
* the argv object is now populated differently (correctly) when hyphens and dot notation are used in conjunction.
* `boolean` flags defined without a `default` value will now behave like other option type and won't be set in the parsed results when the user doesn't set the corresponding CLI arg.
* arguments of form --foo, -abc, will no longer be consumed by nargs
* strings that fail `Number.isSafeInteger()` are no longer coerced into numbers.
* populate-- now defaults to false.
* rather than placing arguments in "_", when parsing is stopped via "--"; we now populate an array called "--" by default.
* camelcase now requires Node 4+.
* environment variables will now override config files (args, env, config-file, config-object)
* coerce is no longer applied to individual arguments in an implicit array.
* 

### Features

* add -- option which allows arguments after the -- flag to be returned separated from positional arguments ([#84](https://github.com/yargs/yargs-parser/issues/84)) ([2572ca8](https://github.com/yargs/yargs-parser/commit/2572ca8f95b7cf6b8c53411d4adb834644b12105))
* add `set-placeholder-key` configuration ([#123](https://github.com/yargs/yargs-parser/issues/123)) ([19386ee](https://github.com/yargs/yargs-parser/commit/19386eec911ba8819dcfc00894eb05a590f8ca37))
* add `strip-aliased` and `strip-dashed` configuration options. ([#172](https://github.com/yargs/yargs-parser/issues/172)) ([a3936aa](https://github.com/yargs/yargs-parser/commit/a3936aa21e89b9a7e4f3bc05d3e56c1eff6a6a79))
* add configuration option to "collect-unknown-options" ([#181](https://github.com/yargs/yargs-parser/issues/181)) ([7909cc4](https://github.com/yargs/yargs-parser/commit/7909cc4679c76770d4d7950ecd527da823b08f91))
* add halt-at-non-option configuration option ([#130](https://github.com/yargs/yargs-parser/issues/130)) ([a849fce](https://github.com/yargs/yargs-parser/commit/a849fce0ba37414b3f3c2e01a547654dc1035623))
* added coerce option, for providing specialized argument parsing ([#42](https://github.com/yargs/yargs-parser/issues/42)) ([7b49cd2](https://github.com/yargs/yargs-parser/commit/7b49cd2231dd5d46c9555da2e27609efd0f2a465))
* adds parse-positional-numbers configuration ([#321](https://github.com/yargs/yargs-parser/issues/321)) ([9cec00a](https://github.com/yargs/yargs-parser/commit/9cec00a622251292ffb7dce6f78f5353afaa0d4c))
* adds support for ESM and Deno ([#295](https://github.com/yargs/yargs-parser/issues/295)) ([195bc4a](https://github.com/yargs/yargs-parser/commit/195bc4a7f20c2a8f8e33fbb6ba96ef6e9a0120a1))
* allow configuration of prefix for boolean negation ([#94](https://github.com/yargs/yargs-parser/issues/94)) ([00bde7d](https://github.com/yargs/yargs-parser/commit/00bde7d60c433c188f2529a33bab187d40645f7d))
* allow multiple arrays to be provided, rather than always combining ([#71](https://github.com/yargs/yargs-parser/issues/71)) ([0f0fb2d](https://github.com/yargs/yargs-parser/commit/0f0fb2d13101ac1eb24479130a9290d5e431befc))
* allow the browser build to be imported ([#443](https://github.com/yargs/yargs-parser/issues/443)) ([a89259f](https://github.com/yargs/yargs-parser/commit/a89259ff41d6f5312b3ce8a30bef343a993f395a))
* also add camelCase array options ([#125](https://github.com/yargs/yargs-parser/issues/125)) ([08c0117](https://github.com/yargs/yargs-parser/commit/08c011796f83e84fe50ffb066a87ae2effadfc75))
* apply coercions to default options ([#65](https://github.com/yargs/yargs-parser/issues/65)) ([c79052b](https://github.com/yargs/yargs-parser/commit/c79052bb35b471fa9eaa48a7d95cc24fca46d4e2))
* array.type can now be provided, supporting coercion ([#132](https://github.com/yargs/yargs-parser/issues/132)) ([4b8cfce](https://github.com/yargs/yargs-parser/commit/4b8cfce511edce5fe6f3c5a6d7eb147b56cd8f52))
* boolean arguments will not be collected into an implicit array ([#236](https://github.com/yargs/yargs-parser/issues/236)) ([34c4e19](https://github.com/yargs/yargs-parser/commit/34c4e19bae4e7af63e3cb6fa654a97ed476e5eb5))
* coerce full array instead of each element ([#51](https://github.com/yargs/yargs-parser/issues/51)) ([cc4dc56](https://github.com/yargs/yargs-parser/commit/cc4dc5663bf9a29527127cf575d37b461c1c47a2))
* **configuration:** Allow to pass configuration objects to yargs-parser ([0780900](https://github.com/yargs/yargs-parser/commit/07809007cd533852b5eb3eca58af7a8e420931f7))
* default value is now used if no right-hand value provided for numbers/strings ([#156](https://github.com/yargs/yargs-parser/issues/156)) ([5a7c46a](https://github.com/yargs/yargs-parser/commit/5a7c46a0c707fbd975150352619a0e90c42df227))
* **deps:** update to latest camelcase/decamelize ([#281](https://github.com/yargs/yargs-parser/issues/281)) ([8931ab0](https://github.com/yargs/yargs-parser/commit/8931ab08f686cc55286f33a95a83537da2be5516))
* don't coerce number from string with leading '0' or '+' ([#158](https://github.com/yargs/yargs-parser/issues/158)) ([18d0fd5](https://github.com/yargs/yargs-parser/commit/18d0fd582996b3004bc92f2b46b9cd9776550414))
* **environment:** Support nested options in environment variables ([#26](https://github.com/yargs/yargs-parser/issues/26)) thanks [@elas7](https://github.com/elas7) \o/ ([020778b](https://github.com/yargs/yargs-parser/commit/020778b5e8f63a2fe7a34e3963dc695c44239540))
* expose camelCase and decamelize helpers ([#296](https://github.com/yargs/yargs-parser/issues/296)) ([39154ce](https://github.com/yargs/yargs-parser/commit/39154ceb5bdcf76b5f59a9219b34cedb79b67f26))
* handle dot notation boolean options ([#63](https://github.com/yargs/yargs-parser/issues/63)) ([02c3545](https://github.com/yargs/yargs-parser/commit/02c35450bef53d720a428a88ace53390c542781c))
* introduce greedy-arrays config, for specifying whether arrays consume multiple positionals ([#249](https://github.com/yargs/yargs-parser/issues/249)) ([60e880a](https://github.com/yargs/yargs-parser/commit/60e880a837046314d89fa4725f923837fd33a9eb))
* introduce nargs-eats-options config option ([#246](https://github.com/yargs/yargs-parser/issues/246)) ([d50822a](https://github.com/yargs/yargs-parser/commit/d50822ac10e1b05f2e9643671ca131ac251b6732))
* introduce single-digit boolean aliases ([#255](https://github.com/yargs/yargs-parser/issues/255)) ([9c60265](https://github.com/yargs/yargs-parser/commit/9c60265fd7a03cb98e6df3e32c8c5e7508d9f56f))
* make combining arrays a configurable option ([#111](https://github.com/yargs/yargs-parser/issues/111)) ([c8bf536](https://github.com/yargs/yargs-parser/commit/c8bf5365aa79876ca4f0f7e7d769e2b1a9aab73b))
* maybeCoerceNumber() now takes into account arrays ([#187](https://github.com/yargs/yargs-parser/issues/187)) ([31c204b](https://github.com/yargs/yargs-parser/commit/31c204b35eb35e9a3c382f8068e7cb80674a2f22))
* merge array from arguments with array from config ([#83](https://github.com/yargs/yargs-parser/issues/83)) ([806ddd6](https://github.com/yargs/yargs-parser/commit/806ddd6cacacb728e42828113e75c6700ffe4366))
* NaN can now be provided as a value for nargs, indicating "at least" one value is expected for array ([#251](https://github.com/yargs/yargs-parser/issues/251)) ([9db4be8](https://github.com/yargs/yargs-parser/commit/9db4be81417a2c7097128db34d86fe70ef4af70c))
* narg arguments no longer consume flag arguments ([#114](https://github.com/yargs/yargs-parser/issues/114)) ([60bb9b3](https://github.com/yargs/yargs-parser/commit/60bb9b3ec2809b7b0bec2c0de9e2078d1b3f8fdb))
* **normalize:** allow normalize to work with arrays ([e0eaa1a](https://github.com/yargs/yargs-parser/commit/e0eaa1ab90c2b5a24f569e6fc27962edb9a3a414))
* options that have had their default value used are now tracked ([#211](https://github.com/yargs/yargs-parser/issues/211)) ([a525234](https://github.com/yargs/yargs-parser/commit/a525234558c847deedd73f8792e0a3b77b26e2c0))
* populate error if incompatible narg/count or array/count options are used ([#191](https://github.com/yargs/yargs-parser/issues/191)) ([84a401f](https://github.com/yargs/yargs-parser/commit/84a401f0fa3095e0a19661670d1570d0c3b9d3c9))
* rework `collect-unknown-options` into `unknown-options-as-args`, providing more comprehensive functionality ([ef771ca](https://github.com/yargs/yargs-parser/commit/ef771ca6fa344e7cd30de5828b16ae965eddb409))
* reworking how numbers are parsed ([#104](https://github.com/yargs/yargs-parser/issues/104)) ([fba00eb](https://github.com/yargs/yargs-parser/commit/fba00ebfa77a097dd7d6bbf420bba8ba3a941436))
* **string-utils:** export looksLikeNumber helper ([#324](https://github.com/yargs/yargs-parser/issues/324)) ([c8580a2](https://github.com/yargs/yargs-parser/commit/c8580a2327b55f6342acecb6e72b62963d506750))
* support boolean which do not consume next argument. ([#171](https://github.com/yargs/yargs-parser/issues/171)) ([0ae7fcb](https://github.com/yargs/yargs-parser/commit/0ae7fcbc528bc7630b713b7e09b7a3a6b5fced9c))
* when parsing stops, we now populate "--" by default ([#88](https://github.com/yargs/yargs-parser/issues/88)) ([cd666db](https://github.com/yargs/yargs-parser/commit/cd666db9c2d0f4575b070b1242c32c97bb16ef2f))
* yargs is now ESM first ([#503](https://github.com/yargs/yargs-parser/issues/503)) ([6d69295](https://github.com/yargs/yargs-parser/commit/6d692953ade099375c6c5e131367968b07ae8470))


### Bug Fixes

* __proto__ will now be replaced with ___proto___ in parse ([#258](https://github.com/yargs/yargs-parser/issues/258)) ([63810ca](https://github.com/yargs/yargs-parser/commit/63810ca1ae1a24b08293a4d971e70e058c7a41e2))
* address bugs with "uknown-options-as-args" ([bc023e3](https://github.com/yargs/yargs-parser/commit/bc023e3b13e20a118353f9507d1c999bf388a346))
* address issue with array options with array default values ([#206](https://github.com/yargs/yargs-parser/issues/206)) ([f5f9e5a](https://github.com/yargs/yargs-parser/commit/f5f9e5a7ea91821f7c95e8eb4c71dc74de1bc907))
* address pkgConf parsing bug outlined in [#37](https://github.com/yargs/yargs-parser/issues/37) ([#45](https://github.com/yargs/yargs-parser/issues/45)) ([be76ee6](https://github.com/yargs/yargs-parser/commit/be76ee6e602bd2ff3541763c54aba834a3b9ef8c))
* allow null config values ([#108](https://github.com/yargs/yargs-parser/issues/108)) ([d8b14f9](https://github.com/yargs/yargs-parser/commit/d8b14f94e7ab4228c54370c183ef265824b41287))
* array should take precedence over nargs, but enforce nargs ([#243](https://github.com/yargs/yargs-parser/issues/243)) ([4cbc188](https://github.com/yargs/yargs-parser/commit/4cbc188b7abb2249529a19c090338debdad2fe6c))
* **array, nargs:** support -o=--value and --option=--value format ([#262](https://github.com/yargs/yargs-parser/issues/262)) ([41d3f81](https://github.com/yargs/yargs-parser/commit/41d3f8139e116706b28de9b0de3433feb08d2f13))
* better handling of quoted strings ([#153](https://github.com/yargs/yargs-parser/issues/153)) ([2fb71b2](https://github.com/yargs/yargs-parser/commit/2fb71b2b1d25316f94786a385616ebe34a6cbd73))
* better parsing of negative values ([#44](https://github.com/yargs/yargs-parser/issues/44)) ([2e43692](https://github.com/yargs/yargs-parser/commit/2e436928a78cba889b8b3bf91210ff368b428a73))
* boolean arrays with default values ([#185](https://github.com/yargs/yargs-parser/issues/185)) ([7d42572](https://github.com/yargs/yargs-parser/commit/7d42572acf7e81f1d78f357b3229d415abe3d6c5))
* boolean flag when next value contains the strings 'true' or 'false'. ([69941a6](https://github.com/yargs/yargs-parser/commit/69941a632691256132d836efdc903071700db13c))
* boolean now behaves the same as other array types ([#184](https://github.com/yargs/yargs-parser/issues/184)) ([17ca3bd](https://github.com/yargs/yargs-parser/commit/17ca3bdaada25605ab06fe72946d2da4b52087fa))
* boolean numeric short option ([#294](https://github.com/yargs/yargs-parser/issues/294)) ([f600082](https://github.com/yargs/yargs-parser/commit/f600082c959e092076caf420bbbc9d7a231e2418))
* **boolean:** fix for boolean options with non boolean defaults ([#20](https://github.com/yargs/yargs-parser/issues/20)) ([2dbe86b](https://github.com/yargs/yargs-parser/commit/2dbe86b1d6dba7d1d2d54de6a0171c42f8b75cae))
* **build:** fixed automated release pipeline ([1fe9135](https://github.com/yargs/yargs-parser/commit/1fe9135884790a083615419b2861683e2597dac3))
* **build:** fixing publication ([#310](https://github.com/yargs/yargs-parser/issues/310)) ([5d3c6c2](https://github.com/yargs/yargs-parser/commit/5d3c6c29a9126248ba601920d9cf87c78e161ff5))
* **build:** push tag created for deno ([2186a14](https://github.com/yargs/yargs-parser/commit/2186a14989749887d56189867602e39e6679f8b0))
* **build:** switch to action for publish ([#308](https://github.com/yargs/yargs-parser/issues/308)) ([5c2f305](https://github.com/yargs/yargs-parser/commit/5c2f30585342bcd8aaf926407c863099d256d174))
* **build:** update release-please; make labels kick off builds ([#323](https://github.com/yargs/yargs-parser/issues/323)) ([09f448b](https://github.com/yargs/yargs-parser/commit/09f448b4cd66e25d2872544718df46dab8af062a))
* check aliases when guessing defaults for arguments fixes [#41](https://github.com/yargs/yargs-parser/issues/41) ([#43](https://github.com/yargs/yargs-parser/issues/43)) ([f3e4616](https://github.com/yargs/yargs-parser/commit/f3e4616771ee4927414f98ccd247b21e78fc419f))
* coerce should be applied to the final objects and arrays created ([#57](https://github.com/yargs/yargs-parser/issues/57)) ([4ca69da](https://github.com/yargs/yargs-parser/commit/4ca69da4c9734ed101cbc0e076e057ee9bdfcb8c))
* convert values to strings when tokenizing ([#167](https://github.com/yargs/yargs-parser/issues/167)) ([57b7883](https://github.com/yargs/yargs-parser/commit/57b788303e1119ba5260b273e486b73d0d638ad8))
* **count:** do not increment a default value ([#39](https://github.com/yargs/yargs-parser/issues/39)) ([b04a189](https://github.com/yargs/yargs-parser/commit/b04a18932d332e03322d0002d4605c75369d08ba))
* default '--' to undefined when not provided; this is closer to the array API ([#90](https://github.com/yargs/yargs-parser/issues/90)) ([4e739cc](https://github.com/yargs/yargs-parser/commit/4e739ccb9e21ffe861dcae1e0b9799e65d50724d))
* **deno:** address import issues in Deno ([#339](https://github.com/yargs/yargs-parser/issues/339)) ([3b54e5e](https://github.com/yargs/yargs-parser/commit/3b54e5eef6e9a7b7c6eec7c12bab3ba3b8ba8306))
* **deno:** force relese for Deno ([6687c97](https://github.com/yargs/yargs-parser/commit/6687c972d0f3ca7865a97908dde3080b05f8b026))
* **deno:** update types for deno ^1.4.0 ([#330](https://github.com/yargs/yargs-parser/issues/330)) ([0ab92e5](https://github.com/yargs/yargs-parser/commit/0ab92e50b090f11196334c048c9c92cecaddaf56))
* **deps:** update dependency decamelize to v3 ([#274](https://github.com/yargs/yargs-parser/issues/274)) ([4d98698](https://github.com/yargs/yargs-parser/commit/4d98698bc6767e84ec54a0842908191739be73b7))
* do not lowercase camel cased string ([#348](https://github.com/yargs/yargs-parser/issues/348)) ([5f4da1f](https://github.com/yargs/yargs-parser/commit/5f4da1f17d9d50542d2aaa206c9806ce3e320335))
* do not set boolean flags if not defined in `argv` ([#119](https://github.com/yargs/yargs-parser/issues/119)) ([f6e6599](https://github.com/yargs/yargs-parser/commit/f6e65994a07cddbd3526052877aee4b307925f9d))
* eatNargs() for 'opt.narg === 0' and boolean typed options ([#188](https://github.com/yargs/yargs-parser/issues/188)) ([c5a1db0](https://github.com/yargs/yargs-parser/commit/c5a1db06eabc4dd249adf2a471156bd133b693bf))
* ensure consistent parsing of dot-notation arguments ([#102](https://github.com/yargs/yargs-parser/issues/102)) ([c9bd79c](https://github.com/yargs/yargs-parser/commit/c9bd79c657dabedb21b1cacf4c3f86b41180d24b))
* ensure empty string is added into argv._ ([#140](https://github.com/yargs/yargs-parser/issues/140)) ([79cda98](https://github.com/yargs/yargs-parser/commit/79cda989595a7da4a9fd3f39120da5001f68899c))
* environment variables should take precedence over config file ([#81](https://github.com/yargs/yargs-parser/issues/81)) ([76cee1f](https://github.com/yargs/yargs-parser/commit/76cee1f621e3463d73b7a892207b945503cad403))
* esm json import ([#416](https://github.com/yargs/yargs-parser/issues/416)) ([90f970a](https://github.com/yargs/yargs-parser/commit/90f970a6482dd4f5b5eb18d38596dd6f02d73edf))
* **exports:** node 13.0 and 13.1 require the dotted object form _with_ a string fallback ([#336](https://github.com/yargs/yargs-parser/issues/336)) ([3ae7242](https://github.com/yargs/yargs-parser/commit/3ae7242040ff876d28dabded60ac226e00150c88))
* **exports:** node 13.0-13.6 require a string fallback ([#333](https://github.com/yargs/yargs-parser/issues/333)) ([291aeda](https://github.com/yargs/yargs-parser/commit/291aeda06b685b7a015d83bdf2558e180b37388d))
* flatten-duplicate-arrays:false for more than 2 arrays ([#128](https://github.com/yargs/yargs-parser/issues/128)) ([2bc395f](https://github.com/yargs/yargs-parser/commit/2bc395fb28300222e7c93c2682eb37311065198f))
* flatten/duplicate regression ([#75](https://github.com/yargs/yargs-parser/issues/75)) ([68d68a0](https://github.com/yargs/yargs-parser/commit/68d68a0440510eabbd4d1aca22b6b091e454c19f))
* **halt-at-non-option:** prevent known args from being parsed when "unknown-options-as-args" is enabled ([#438](https://github.com/yargs/yargs-parser/issues/438)) ([c474bc1](https://github.com/yargs/yargs-parser/commit/c474bc10c3aa0ae864b95e5722730114ef15f573))
* handling of one char alias ([#139](https://github.com/yargs/yargs-parser/issues/139)) ([ee56e31](https://github.com/yargs/yargs-parser/commit/ee56e3116800824b2b0d6a749950fb7eaac296ff))
* hyphenated flags combined with dot notation broke parsing ([#131](https://github.com/yargs/yargs-parser/issues/131)) ([dc788da](https://github.com/yargs/yargs-parser/commit/dc788daac7845f5cf7a44c2f73c84087441264ef))
* Ignore multiple spaces between arguments. ([#100](https://github.com/yargs/yargs-parser/issues/100)) ([d137227](https://github.com/yargs/yargs-parser/commit/d1372279d3fc574ecc67bf9b3a21d785dd33a5a4))
* implement [@antoniom](https://github.com/antoniom)'s fix for camel-case expansion ([3087e1d](https://github.com/yargs/yargs-parser/commit/3087e1d65e2448a230a9b3187c23eabc24829267))
* inner objects in configs had their keys appended to top-level key when dot-notation was disabled ([#72](https://github.com/yargs/yargs-parser/issues/72)) ([0b1b5f9](https://github.com/yargs/yargs-parser/commit/0b1b5f9c3861e70955f86ba0d2e89da9e80ca901))
* **locale:** Turkish camelize and decamelize issues with toLocaleLowerCase/toLocaleUpperCase ([2617303](https://github.com/yargs/yargs-parser/commit/261730383e02448562f737b94bbd1f164aed5143))
* lodash.assign was deprecated ([#59](https://github.com/yargs/yargs-parser/issues/59)) ([5e7eb11](https://github.com/yargs/yargs-parser/commit/5e7eb116e071cd72a837788ab646ad659b3decec))
* make requiresArg work in conjunction with arrays ([#136](https://github.com/yargs/yargs-parser/issues/136)) ([77ae1d4](https://github.com/yargs/yargs-parser/commit/77ae1d4e1c2590eeca025952671fff935ab7e884))
* maybeCoerceNumber now takes precedence over coerce return value ([#182](https://github.com/yargs/yargs-parser/issues/182)) ([2f26436](https://github.com/yargs/yargs-parser/commit/2f2643602f6310078c6ec141bd395435818f90ef))
* nargs should allow duplicates when duplicate-arguments-array=false ([#164](https://github.com/yargs/yargs-parser/issues/164)) ([47ccb0b](https://github.com/yargs/yargs-parser/commit/47ccb0b7fcca1b989ef97bb084e4aa2aaf2a7666))
* nargs was consuming too many arguments ([4fef206](https://github.com/yargs/yargs-parser/commit/4fef20615ab0a14627a9f8004f81d4baafe4b9f4))
* nargs was still aggressively consuming too many arguments ([9b28aad](https://github.com/yargs/yargs-parser/commit/9b28aad9c44d73e966d406c00218f004d31411e0))
* node version check now uses process.versions.node ([#450](https://github.com/yargs/yargs-parser/issues/450)) ([d07bcdb](https://github.com/yargs/yargs-parser/commit/d07bcdbe43075f7201fbe8a08e491217247fe1f1))
* normalized keys were not enumerable ([#247](https://github.com/yargs/yargs-parser/issues/247)) ([57119f9](https://github.com/yargs/yargs-parser/commit/57119f9f17cf27499bd95e61c2f72d18314f11ba))
* only run coercion functions once, despite aliases. ([#76](https://github.com/yargs/yargs-parser/issues/76)) ([#103](https://github.com/yargs/yargs-parser/issues/103)) ([507aaef](https://github.com/yargs/yargs-parser/commit/507aaefac5f5d8ef0e8b121be4afe1c63b5bb0b8))
* only strip camel case if hyphenated ([#316](https://github.com/yargs/yargs-parser/issues/316)) ([95a9e78](https://github.com/yargs/yargs-parser/commit/95a9e785127b9bbf2d1db1f1f808ca1fb100e82a)), closes [#315](https://github.com/yargs/yargs-parser/issues/315)
* **package:** remove tests from tarball ([0353c0d](https://github.com/yargs/yargs-parser/commit/0353c0d5f181ff0d1883a6e3a6aed2ad007dbdbd))
* parse options ending with 3+ hyphens ([#434](https://github.com/yargs/yargs-parser/issues/434)) ([4f1060b](https://github.com/yargs/yargs-parser/commit/4f1060b50759fadbac3315c5117b0c3d65b0a7d8))
* parse short option with trailing equals and empty value (-o=) as empty string ([#541](https://github.com/yargs/yargs-parser/issues/541)) ([aa386be](https://github.com/yargs/yargs-parser/commit/aa386be666df974a127904020c61b9febc10301f))
* parser should preserve inner quotes ([#407](https://github.com/yargs/yargs-parser/issues/407)) ([ae11f49](https://github.com/yargs/yargs-parser/commit/ae11f496a8318ea8885aa25015d429b33713c314))
* parsing hints should apply for dot notation keys ([#86](https://github.com/yargs/yargs-parser/issues/86)) ([3e47d62](https://github.com/yargs/yargs-parser/commit/3e47d62c62bdf41c03f84ca0105ddd1b10fe9879))
* parsing issue with numeric character in group of options ([#19](https://github.com/yargs/yargs-parser/issues/19)) ([f743236](https://github.com/yargs/yargs-parser/commit/f743236743577798d95bd5c18d25abaa9b370002))
* **parsing:** handle calling short option with an empty string as the next value. ([a867165](https://github.com/yargs/yargs-parser/commit/a8671651a62232f7763df1ec8e471e1fa435662e))
* **perf:** address slow parse when using unknown-options-as-args ([#394](https://github.com/yargs/yargs-parser/issues/394)) ([441f059](https://github.com/yargs/yargs-parser/commit/441f059d585d446551068ad213db79ac91daf83a))
* **populate--:** -- should always be array ([#354](https://github.com/yargs/yargs-parser/issues/354)) ([585ae8f](https://github.com/yargs/yargs-parser/commit/585ae8ffad74cc02974f92d788e750137fd65146))
* preserve negative number handling when short-option-groups:false ([#511](https://github.com/yargs/yargs-parser/issues/511)) ([ccc3634](https://github.com/yargs/yargs-parser/commit/ccc3634e324458d15789d8e9bd81851b178f21b5))
* raise permission error for Deno if config load fails ([#298](https://github.com/yargs/yargs-parser/issues/298)) ([1174e2b](https://github.com/yargs/yargs-parser/commit/1174e2b3f0c845a1cd64e14ffc3703e730567a84))
* remove inaccurate and unnecessary regexp used by unknown-options-as-args ([#508](https://github.com/yargs/yargs-parser/issues/508)) ([cea8972](https://github.com/yargs/yargs-parser/commit/cea8972ad169121c32a9a67693e5eb11dd3dc001))
* return deno env object ([#432](https://github.com/yargs/yargs-parser/issues/432)) ([b00eb87](https://github.com/yargs/yargs-parser/commit/b00eb87b4860a890dd2dab0d6058241bbfd2b3ec))
* scientific notation circumvented bounds check ([#110](https://github.com/yargs/yargs-parser/issues/110)) ([3571f57](https://github.com/yargs/yargs-parser/commit/3571f57af42036ee7b9734178b114a75c5a75762))
* **setArg:** options using camel-case and dot-notation populated twice ([#268](https://github.com/yargs/yargs-parser/issues/268)) ([f7e15b9](https://github.com/yargs/yargs-parser/commit/f7e15b9800900b9856acac1a830a5f35847be73e))
* **setKey:** use a sentinel to detect count auto-increment ([#529](https://github.com/yargs/yargs-parser/issues/529)) ([add38aa](https://github.com/yargs/yargs-parser/commit/add38aafb96709e8eeecdc86b825419b3f1d5f96))
* should populate "_" when given config with "short-option-groups" false ([#179](https://github.com/yargs/yargs-parser/issues/179)) ([6055974](https://github.com/yargs/yargs-parser/commit/6055974a23b1a5fb8769eff433e7dd122cefba79))
* **string-utils:** detect [0,1] ranged values as numbers ([#388](https://github.com/yargs/yargs-parser/issues/388)) ([efcc32c](https://github.com/yargs/yargs-parser/commit/efcc32c2d6b09aba31abfa2db9bd947befe5586b))
* support keys that collide with object prototypes ([#234](https://github.com/yargs/yargs-parser/issues/234)) ([1587b6d](https://github.com/yargs/yargs-parser/commit/1587b6d91db853a9109f1be6b209077993fee4de))
* support negative numbers with decimal places ([#208](https://github.com/yargs/yargs-parser/issues/208)) ([850bbda](https://github.com/yargs/yargs-parser/commit/850bbdafcf8a4998f374dfce993422855d10716d))
* take into account aliases when appending arrays from config object ([#199](https://github.com/yargs/yargs-parser/issues/199)) ([f8a2d3f](https://github.com/yargs/yargs-parser/commit/f8a2d3f26a84cc57e210deb1aa27b580e4b06388))
* tokenizer should ignore spaces at the beginning of the argString ([#106](https://github.com/yargs/yargs-parser/issues/106)) ([f34ead9](https://github.com/yargs/yargs-parser/commit/f34ead9986476c94199f6bd843c394169bf67319))
* **typescript:** ignore .cts files during publish ([#454](https://github.com/yargs/yargs-parser/issues/454)) ([d69f9c3](https://github.com/yargs/yargs-parser/commit/d69f9c3a91c3ad2f9494d0a94e29a8b76c41b81b)), closes [#452](https://github.com/yargs/yargs-parser/issues/452)
* **types:** envPrefix should be optional ([#305](https://github.com/yargs/yargs-parser/issues/305)) ([ae3f180](https://github.com/yargs/yargs-parser/commit/ae3f180e14df2de2fd962145f4518f9aa0e76523))
* **types:** switch back to using Partial types ([#293](https://github.com/yargs/yargs-parser/issues/293)) ([bdc80ba](https://github.com/yargs/yargs-parser/commit/bdc80ba59fa13bc3025ce0a85e8bad9f9da24ea7))
* unknown options terminated with digits now handled by unknown-options-as-args ([#238](https://github.com/yargs/yargs-parser/issues/238)) ([d36cdfa](https://github.com/yargs/yargs-parser/commit/d36cdfa854254d7c7e0fe1d583818332ac46c2a5))
* unknown-options-as-args now respects short-option-groups ([#510](https://github.com/yargs/yargs-parser/issues/510)) ([60f2db5](https://github.com/yargs/yargs-parser/commit/60f2db5dacde1e94f960ce0941a717f3f422f865))
* unknown-options-as-args should treat negated boolean as unknown when boolean-negation:false ([#509](https://github.com/yargs/yargs-parser/issues/509)) ([b82ba0f](https://github.com/yargs/yargs-parser/commit/b82ba0f90d7e7eaac404a77ed6675d8d3fbda5f3))
* **unknown-options-as-args:** '--' is not an unknown option ([#207](https://github.com/yargs/yargs-parser/issues/207)) ([3fee2d8](https://github.com/yargs/yargs-parser/commit/3fee2d895e9da14af978bbd1c7c9c20170c3aa59))
* **unknown-options-as-args:** convert positionals that look like numbers ([#326](https://github.com/yargs/yargs-parser/issues/326)) ([f85ebb4](https://github.com/yargs/yargs-parser/commit/f85ebb4face9d4b0f56147659404cbe0002f3dad))
* update dependencies; add standard-version bin for next release ([#24](https://github.com/yargs/yargs-parser/issues/24)) ([822d9d5](https://github.com/yargs/yargs-parser/commit/822d9d542d6b03996cabd06be79060bd84f34f5a))
* upgraded lodash.assign ([5d7fdf4](https://github.com/yargs/yargs-parser/commit/5d7fdf481251d86550efa740d29b320d61f1ef06))
* whoops, let's make the assign not change the Object key order ([29d069a](https://github.com/yargs/yargs-parser/commit/29d069a95aaa513430d226cd05ffc288c8856392))


### Reverts

* make requiresArg work in conjunction with arrays ([#136](https://github.com/yargs/yargs-parser/issues/136)) ([f4a3063](https://github.com/yargs/yargs-parser/commit/f4a3063b17c4d921bb1e9551e23d32c9fb7c68b5))
* revert 16.0.0 CHANGELOG entry ([920320a](https://github.com/yargs/yargs-parser/commit/920320ad9861bbfd58eda39221ae211540fc1daf))


### Miscellaneous Chores

* revert populate-- logic ([#91](https://github.com/yargs/yargs-parser/issues/91)) ([6003e6d](https://github.com/yargs/yargs-parser/commit/6003e6d770ee9bd30eb9fe8e169e948cc949d6d3))
* update dependencies ([6dc42a1](https://github.com/yargs/yargs-parser/commit/6dc42a190a97a779ac01b6ddf3d405bddefb0e96))
* upgrade to newest version of camelcase ([#87](https://github.com/yargs/yargs-parser/issues/87)) ([f1903aa](https://github.com/yargs/yargs-parser/commit/f1903aacf148dad9673e249bce3d3cbb15a3cec7))


### Code Refactoring

* do not ship type definitions ([#318](https://github.com/yargs/yargs-parser/issues/318)) ([8fbd56f](https://github.com/yargs/yargs-parser/commit/8fbd56f1d0b6c44c30fca62708812151ca0ce330))
* drops support for 10 ([#421](https://github.com/yargs/yargs-parser/issues/421)) ([3aaf878](https://github.com/yargs/yargs-parser/commit/3aaf8784f5c7f2aec6108c1c6a55537fa7e3b5c1))
* **ts:** move index.js to TypeScript ([#292](https://github.com/yargs/yargs-parser/issues/292)) ([f78d2b9](https://github.com/yargs/yargs-parser/commit/f78d2b97567ac4828624406e420b4047c710b789))


### Build System

* drops Node 6. begin following Node.js LTS schedule ([#278](https://github.com/yargs/yargs-parser/issues/278)) ([9014ed7](https://github.com/yargs/yargs-parser/commit/9014ed722a32768b96b829e65a31705db5c1458a))
* moving to c8 for coverage and dropping Node 6 from build matrix ([#209](https://github.com/yargs/yargs-parser/issues/209)) ([f3a9316](https://github.com/yargs/yargs-parser/commit/f3a9316e470b0cc5c01981c9614ee935835d719b))

## [22.0.0](https://github.com/yargs/yargs-parser/compare/yargs-parser-v21.1.1...yargs-parser-v22.0.0) (2025-05-26)


### ⚠ BREAKING CHANGES

* yargs is now ESM first ([#503](https://github.com/yargs/yargs-parser/issues/503))

### Features

* yargs is now ESM first ([#503](https://github.com/yargs/yargs-parser/issues/503)) ([6d69295](https://github.com/yargs/yargs-parser/commit/6d692953ade099375c6c5e131367968b07ae8470))

## [21.1.1](https://github.com/yargs/yargs-parser/compare/yargs-parser-v21.1.0...yargs-parser-v21.1.1) (2022-08-04)


### Bug Fixes

* **typescript:** ignore .cts files during publish ([#454](https://github.com/yargs/yargs-parser/issues/454)) ([d69f9c3](https://github.com/yargs/yargs-parser/commit/d69f9c3a91c3ad2f9494d0a94e29a8b76c41b81b)), closes [#452](https://github.com/yargs/yargs-parser/issues/452)

## [21.1.0](https://github.com/yargs/yargs-parser/compare/yargs-parser-v21.0.1...yargs-parser-v21.1.0) (2022-08-03)


### Features

* allow the browser build to be imported ([#443](https://github.com/yargs/yargs-parser/issues/443)) ([a89259f](https://github.com/yargs/yargs-parser/commit/a89259ff41d6f5312b3ce8a30bef343a993f395a))


### Bug Fixes

* **halt-at-non-option:** prevent known args from being parsed when "unknown-options-as-args" is enabled ([#438](https://github.com/yargs/yargs-parser/issues/438)) ([c474bc1](https://github.com/yargs/yargs-parser/commit/c474bc10c3aa0ae864b95e5722730114ef15f573))
* node version check now uses process.versions.node ([#450](https://github.com/yargs/yargs-parser/issues/450)) ([d07bcdb](https://github.com/yargs/yargs-parser/commit/d07bcdbe43075f7201fbe8a08e491217247fe1f1))
* parse options ending with 3+ hyphens ([#434](https://github.com/yargs/yargs-parser/issues/434)) ([4f1060b](https://github.com/yargs/yargs-parser/commit/4f1060b50759fadbac3315c5117b0c3d65b0a7d8))

### [21.0.1](https://github.com/yargs/yargs-parser/compare/yargs-parser-v21.0.0...yargs-parser-v21.0.1) (2022-02-27)


### Bug Fixes

* return deno env object ([#432](https://github.com/yargs/yargs-parser/issues/432)) ([b00eb87](https://github.com/yargs/yargs-parser/commit/b00eb87b4860a890dd2dab0d6058241bbfd2b3ec))

## [21.0.0](https://www.github.com/yargs/yargs-parser/compare/yargs-parser-v20.2.9...yargs-parser-v21.0.0) (2021-11-15)


### ⚠ BREAKING CHANGES

* drops support for 10 (#421)

### Bug Fixes

* esm json import ([#416](https://www.github.com/yargs/yargs-parser/issues/416)) ([90f970a](https://www.github.com/yargs/yargs-parser/commit/90f970a6482dd4f5b5eb18d38596dd6f02d73edf))
* parser should preserve inner quotes ([#407](https://www.github.com/yargs/yargs-parser/issues/407)) ([ae11f49](https://www.github.com/yargs/yargs-parser/commit/ae11f496a8318ea8885aa25015d429b33713c314))


### Code Refactoring

* drops support for 10 ([#421](https://www.github.com/yargs/yargs-parser/issues/421)) ([3aaf878](https://www.github.com/yargs/yargs-parser/commit/3aaf8784f5c7f2aec6108c1c6a55537fa7e3b5c1))

### [20.2.9](https://www.github.com/yargs/yargs-parser/compare/yargs-parser-v20.2.8...yargs-parser-v20.2.9) (2021-06-20)


### Bug Fixes

* **build:** fixed automated release pipeline ([1fe9135](https://www.github.com/yargs/yargs-parser/commit/1fe9135884790a083615419b2861683e2597dac3))

### [20.2.8](https://www.github.com/yargs/yargs-parser/compare/yargs-parser-v20.2.7...yargs-parser-v20.2.8) (2021-06-20)


### Bug Fixes

* **locale:** Turkish camelize and decamelize issues with toLocaleLowerCase/toLocaleUpperCase ([2617303](https://www.github.com/yargs/yargs-parser/commit/261730383e02448562f737b94bbd1f164aed5143))
* **perf:** address slow parse when using unknown-options-as-args ([#394](https://www.github.com/yargs/yargs-parser/issues/394)) ([441f059](https://www.github.com/yargs/yargs-parser/commit/441f059d585d446551068ad213db79ac91daf83a))
* **string-utils:** detect [0,1] ranged values as numbers ([#388](https://www.github.com/yargs/yargs-parser/issues/388)) ([efcc32c](https://www.github.com/yargs/yargs-parser/commit/efcc32c2d6b09aba31abfa2db9bd947befe5586b))

### [20.2.7](https://www.github.com/yargs/yargs-parser/compare/v20.2.6...v20.2.7) (2021-03-10)


### Bug Fixes

* **deno:** force release for Deno ([6687c97](https://www.github.com/yargs/yargs-parser/commit/6687c972d0f3ca7865a97908dde3080b05f8b026))

### [20.2.6](https://www.github.com/yargs/yargs-parser/compare/v20.2.5...v20.2.6) (2021-02-22)


### Bug Fixes

* **populate--:** -- should always be array ([#354](https://www.github.com/yargs/yargs-parser/issues/354)) ([585ae8f](https://www.github.com/yargs/yargs-parser/commit/585ae8ffad74cc02974f92d788e750137fd65146))

### [20.2.5](https://www.github.com/yargs/yargs-parser/compare/v20.2.4...v20.2.5) (2021-02-13)


### Bug Fixes

* do not lowercase camel cased string ([#348](https://www.github.com/yargs/yargs-parser/issues/348)) ([5f4da1f](https://www.github.com/yargs/yargs-parser/commit/5f4da1f17d9d50542d2aaa206c9806ce3e320335))

### [20.2.4](https://www.github.com/yargs/yargs-parser/compare/v20.2.3...v20.2.4) (2020-11-09)


### Bug Fixes

* **deno:** address import issues in Deno ([#339](https://www.github.com/yargs/yargs-parser/issues/339)) ([3b54e5e](https://www.github.com/yargs/yargs-parser/commit/3b54e5eef6e9a7b7c6eec7c12bab3ba3b8ba8306))

### [20.2.3](https://www.github.com/yargs/yargs-parser/compare/v20.2.2...v20.2.3) (2020-10-16)


### Bug Fixes

* **exports:** node 13.0 and 13.1 require the dotted object form _with_ a string fallback ([#336](https://www.github.com/yargs/yargs-parser/issues/336)) ([3ae7242](https://www.github.com/yargs/yargs-parser/commit/3ae7242040ff876d28dabded60ac226e00150c88))

### [20.2.2](https://www.github.com/yargs/yargs-parser/compare/v20.2.1...v20.2.2) (2020-10-14)


### Bug Fixes

* **exports:** node 13.0-13.6 require a string fallback ([#333](https://www.github.com/yargs/yargs-parser/issues/333)) ([291aeda](https://www.github.com/yargs/yargs-parser/commit/291aeda06b685b7a015d83bdf2558e180b37388d))

### [20.2.1](https://www.github.com/yargs/yargs-parser/compare/v20.2.0...v20.2.1) (2020-10-01)


### Bug Fixes

* **deno:** update types for deno ^1.4.0 ([#330](https://www.github.com/yargs/yargs-parser/issues/330)) ([0ab92e5](https://www.github.com/yargs/yargs-parser/commit/0ab92e50b090f11196334c048c9c92cecaddaf56))

## [20.2.0](https://www.github.com/yargs/yargs-parser/compare/v20.1.0...v20.2.0) (2020-09-21)


### Features

* **string-utils:** export looksLikeNumber helper ([#324](https://www.github.com/yargs/yargs-parser/issues/324)) ([c8580a2](https://www.github.com/yargs/yargs-parser/commit/c8580a2327b55f6342acecb6e72b62963d506750))


### Bug Fixes

* **unknown-options-as-args:** convert positionals that look like numbers ([#326](https://www.github.com/yargs/yargs-parser/issues/326)) ([f85ebb4](https://www.github.com/yargs/yargs-parser/commit/f85ebb4face9d4b0f56147659404cbe0002f3dad))

## [20.1.0](https://www.github.com/yargs/yargs-parser/compare/v20.0.0...v20.1.0) (2020-09-20)


### Features

* adds parse-positional-numbers configuration ([#321](https://www.github.com/yargs/yargs-parser/issues/321)) ([9cec00a](https://www.github.com/yargs/yargs-parser/commit/9cec00a622251292ffb7dce6f78f5353afaa0d4c))


### Bug Fixes

* **build:** update release-please; make labels kick off builds ([#323](https://www.github.com/yargs/yargs-parser/issues/323)) ([09f448b](https://www.github.com/yargs/yargs-parser/commit/09f448b4cd66e25d2872544718df46dab8af062a))

## [20.0.0](https://www.github.com/yargs/yargs-parser/compare/v19.0.4...v20.0.0) (2020-09-09)


### ⚠ BREAKING CHANGES

* do not ship type definitions (#318)

### Bug Fixes

* only strip camel case if hyphenated ([#316](https://www.github.com/yargs/yargs-parser/issues/316)) ([95a9e78](https://www.github.com/yargs/yargs-parser/commit/95a9e785127b9bbf2d1db1f1f808ca1fb100e82a)), closes [#315](https://www.github.com/yargs/yargs-parser/issues/315)


### Code Refactoring

* do not ship type definitions ([#318](https://www.github.com/yargs/yargs-parser/issues/318)) ([8fbd56f](https://www.github.com/yargs/yargs-parser/commit/8fbd56f1d0b6c44c30fca62708812151ca0ce330))

### [19.0.4](https://www.github.com/yargs/yargs-parser/compare/v19.0.3...v19.0.4) (2020-08-27)


### Bug Fixes

* **build:** fixing publication ([#310](https://www.github.com/yargs/yargs-parser/issues/310)) ([5d3c6c2](https://www.github.com/yargs/yargs-parser/commit/5d3c6c29a9126248ba601920d9cf87c78e161ff5))

### [19.0.3](https://www.github.com/yargs/yargs-parser/compare/v19.0.2...v19.0.3) (2020-08-27)


### Bug Fixes

* **build:** switch to action for publish ([#308](https://www.github.com/yargs/yargs-parser/issues/308)) ([5c2f305](https://www.github.com/yargs/yargs-parser/commit/5c2f30585342bcd8aaf926407c863099d256d174))

### [19.0.2](https://www.github.com/yargs/yargs-parser/compare/v19.0.1...v19.0.2) (2020-08-27)


### Bug Fixes

* **types:** envPrefix should be optional ([#305](https://www.github.com/yargs/yargs-parser/issues/305)) ([ae3f180](https://www.github.com/yargs/yargs-parser/commit/ae3f180e14df2de2fd962145f4518f9aa0e76523))

### [19.0.1](https://www.github.com/yargs/yargs-parser/compare/v19.0.0...v19.0.1) (2020-08-09)


### Bug Fixes

* **build:** push tag created for deno ([2186a14](https://www.github.com/yargs/yargs-parser/commit/2186a14989749887d56189867602e39e6679f8b0))

## [19.0.0](https://www.github.com/yargs/yargs-parser/compare/v18.1.3...v19.0.0) (2020-08-09)


### ⚠ BREAKING CHANGES

* adds support for ESM and Deno (#295)
* **ts:** projects using `@types/yargs-parser` may see variations in type definitions.
* drops Node 6. begin following Node.js LTS schedule (#278)

### Features

* adds support for ESM and Deno ([#295](https://www.github.com/yargs/yargs-parser/issues/295)) ([195bc4a](https://www.github.com/yargs/yargs-parser/commit/195bc4a7f20c2a8f8e33fbb6ba96ef6e9a0120a1))
* expose camelCase and decamelize helpers ([#296](https://www.github.com/yargs/yargs-parser/issues/296)) ([39154ce](https://www.github.com/yargs/yargs-parser/commit/39154ceb5bdcf76b5f59a9219b34cedb79b67f26))
* **deps:** update to latest camelcase/decamelize ([#281](https://www.github.com/yargs/yargs-parser/issues/281)) ([8931ab0](https://www.github.com/yargs/yargs-parser/commit/8931ab08f686cc55286f33a95a83537da2be5516))


### Bug Fixes

* boolean numeric short option ([#294](https://www.github.com/yargs/yargs-parser/issues/294)) ([f600082](https://www.github.com/yargs/yargs-parser/commit/f600082c959e092076caf420bbbc9d7a231e2418))
* raise permission error for Deno if config load fails ([#298](https://www.github.com/yargs/yargs-parser/issues/298)) ([1174e2b](https://www.github.com/yargs/yargs-parser/commit/1174e2b3f0c845a1cd64e14ffc3703e730567a84))
* **deps:** update dependency decamelize to v3 ([#274](https://www.github.com/yargs/yargs-parser/issues/274)) ([4d98698](https://www.github.com/yargs/yargs-parser/commit/4d98698bc6767e84ec54a0842908191739be73b7))
* **types:** switch back to using Partial types ([#293](https://www.github.com/yargs/yargs-parser/issues/293)) ([bdc80ba](https://www.github.com/yargs/yargs-parser/commit/bdc80ba59fa13bc3025ce0a85e8bad9f9da24ea7))


### Build System

* drops Node 6. begin following Node.js LTS schedule ([#278](https://www.github.com/yargs/yargs-parser/issues/278)) ([9014ed7](https://www.github.com/yargs/yargs-parser/commit/9014ed722a32768b96b829e65a31705db5c1458a))


### Code Refactoring

* **ts:** move index.js to TypeScript ([#292](https://www.github.com/yargs/yargs-parser/issues/292)) ([f78d2b9](https://www.github.com/yargs/yargs-parser/commit/f78d2b97567ac4828624406e420b4047c710b789))

### [18.1.3](https://www.github.com/yargs/yargs-parser/compare/v18.1.2...v18.1.3) (2020-04-16)


### Bug Fixes

* **setArg:** options using camel-case and dot-notation populated twice ([#268](https://www.github.com/yargs/yargs-parser/issues/268)) ([f7e15b9](https://www.github.com/yargs/yargs-parser/commit/f7e15b9800900b9856acac1a830a5f35847be73e))

### [18.1.2](https://www.github.com/yargs/yargs-parser/compare/v18.1.1...v18.1.2) (2020-03-26)


### Bug Fixes

* **array, nargs:** support -o=--value and --option=--value format ([#262](https://www.github.com/yargs/yargs-parser/issues/262)) ([41d3f81](https://www.github.com/yargs/yargs-parser/commit/41d3f8139e116706b28de9b0de3433feb08d2f13))

### [18.1.1](https://www.github.com/yargs/yargs-parser/compare/v18.1.0...v18.1.1) (2020-03-16)


### Bug Fixes

* \_\_proto\_\_ will now be replaced with \_\_\_proto\_\_\_ in parse ([#258](https://www.github.com/yargs/yargs-parser/issues/258)), patching a potential 
prototype pollution vulnerability. This was reported by the Snyk Security Research Team.([63810ca](https://www.github.com/yargs/yargs-parser/commit/63810ca1ae1a24b08293a4d971e70e058c7a41e2))

## [18.1.0](https://www.github.com/yargs/yargs-parser/compare/v18.0.0...v18.1.0) (2020-03-07)


### Features

* introduce single-digit boolean aliases ([#255](https://www.github.com/yargs/yargs-parser/issues/255)) ([9c60265](https://www.github.com/yargs/yargs-parser/commit/9c60265fd7a03cb98e6df3e32c8c5e7508d9f56f))

## [18.0.0](https://www.github.com/yargs/yargs-parser/compare/v17.1.0...v18.0.0) (2020-03-02)


### ⚠ BREAKING CHANGES

* the narg count is now enforced when parsing arrays.

### Features

* NaN can now be provided as a value for nargs, indicating "at least" one value is expected for array ([#251](https://www.github.com/yargs/yargs-parser/issues/251)) ([9db4be8](https://www.github.com/yargs/yargs-parser/commit/9db4be81417a2c7097128db34d86fe70ef4af70c))

## [17.1.0](https://www.github.com/yargs/yargs-parser/compare/v17.0.1...v17.1.0) (2020-03-01)


### Features

* introduce greedy-arrays config, for specifying whether arrays consume multiple positionals ([#249](https://www.github.com/yargs/yargs-parser/issues/249)) ([60e880a](https://www.github.com/yargs/yargs-parser/commit/60e880a837046314d89fa4725f923837fd33a9eb))

### [17.0.1](https://www.github.com/yargs/yargs-parser/compare/v17.0.0...v17.0.1) (2020-02-29)


### Bug Fixes

* normalized keys were not enumerable ([#247](https://www.github.com/yargs/yargs-parser/issues/247)) ([57119f9](https://www.github.com/yargs/yargs-parser/commit/57119f9f17cf27499bd95e61c2f72d18314f11ba))

## [17.0.0](https://www.github.com/yargs/yargs-parser/compare/v16.1.0...v17.0.0) (2020-02-10)


### ⚠ BREAKING CHANGES

* this reverts parsing behavior of booleans to that of yargs@14
* objects used during parsing are now created with a null
prototype. There may be some scenarios where this change in behavior
leaks externally.

### Features

* boolean arguments will not be collected into an implicit array ([#236](https://www.github.com/yargs/yargs-parser/issues/236)) ([34c4e19](https://www.github.com/yargs/yargs-parser/commit/34c4e19bae4e7af63e3cb6fa654a97ed476e5eb5))
* introduce nargs-eats-options config option ([#246](https://www.github.com/yargs/yargs-parser/issues/246)) ([d50822a](https://www.github.com/yargs/yargs-parser/commit/d50822ac10e1b05f2e9643671ca131ac251b6732))


### Bug Fixes

* address bugs with "uknown-options-as-args" ([bc023e3](https://www.github.com/yargs/yargs-parser/commit/bc023e3b13e20a118353f9507d1c999bf388a346))
* array should take precedence over nargs, but enforce nargs ([#243](https://www.github.com/yargs/yargs-parser/issues/243)) ([4cbc188](https://www.github.com/yargs/yargs-parser/commit/4cbc188b7abb2249529a19c090338debdad2fe6c))
* support keys that collide with object prototypes ([#234](https://www.github.com/yargs/yargs-parser/issues/234)) ([1587b6d](https://www.github.com/yargs/yargs-parser/commit/1587b6d91db853a9109f1be6b209077993fee4de))
* unknown options terminated with digits now handled by unknown-options-as-args ([#238](https://www.github.com/yargs/yargs-parser/issues/238)) ([d36cdfa](https://www.github.com/yargs/yargs-parser/commit/d36cdfa854254d7c7e0fe1d583818332ac46c2a5))

## [16.1.0](https://www.github.com/yargs/yargs-parser/compare/v16.0.0...v16.1.0) (2019-11-01)


### ⚠ BREAKING CHANGES

* populate error if incompatible narg/count or array/count options are used (#191)

### Features

* options that have had their default value used are now tracked ([#211](https://www.github.com/yargs/yargs-parser/issues/211)) ([a525234](https://www.github.com/yargs/yargs-parser/commit/a525234558c847deedd73f8792e0a3b77b26e2c0))
* populate error if incompatible narg/count or array/count options are used ([#191](https://www.github.com/yargs/yargs-parser/issues/191)) ([84a401f](https://www.github.com/yargs/yargs-parser/commit/84a401f0fa3095e0a19661670d1570d0c3b9d3c9))


### Reverts

* revert 16.0.0 CHANGELOG entry ([920320a](https://www.github.com/yargs/yargs-parser/commit/920320ad9861bbfd58eda39221ae211540fc1daf))
