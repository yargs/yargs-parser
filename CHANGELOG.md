# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
