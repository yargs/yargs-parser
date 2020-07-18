/* global describe, it */

import * as yargsParser from '../'
import * as assert from 'assert'

describe('types', function () {
  it('allows a partial config object to be provided', () => {
    const argv = yargsParser('--foo 99', {
      string: 'foo'
    })
    assert.strictEqual(argv.foo, '99')
  })
})
