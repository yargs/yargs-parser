import cleanup from 'rollup-plugin-cleanup'
import ts from 'rollup-plugin-ts'
import transformDefaultExport from 'ts-transform-default-export'

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
    ts({
      transformers: ({ program }) => ({
        afterDeclarations: transformDefaultExport(program)
      })
    }),
    cleanup({
      comments: 'none',
      extensions: ['*']
    })
  ]
}
