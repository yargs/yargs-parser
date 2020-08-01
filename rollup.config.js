import ts from '@wessberg/rollup-plugin-ts'

export default {
  input: './index-node.ts',
  output: {
    format: 'cjs',
    file: './build/index.cjs',
    exports: 'default'
  },
  plugins: [
    ts({ /* options */ })
  ]
}
