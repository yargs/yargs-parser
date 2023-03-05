import cleanup from 'rollup-plugin-cleanup'
import typescript from '@rollup/plugin-typescript'

const output = {
  format: 'cjs',
  file: './build/index.cjs',
  exports: 'default'
}

if (process.env.NODE_ENV === 'test') output.sourcemap = true

export default {
  input: './lib/index.ts',
  output,
  plugins: [
    typescript(),
    cleanup({
      comments: 'none',
      extensions: ['*']
    })
  ]
}
