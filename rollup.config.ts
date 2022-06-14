import { defineConfig } from 'rollup'
import { cleandir } from 'rollup-plugin-cleandir'
import nodeExternals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import bable from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'

// https://www.rollupjs.com/guide/big-list-of-options
const rollupConfig = defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'auto',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    // https://github.com/mstssk/rollup-plugin-cleandir
    cleandir('dist'),

    // https://github.com/Septh/rollup-plugin-node-externals
    nodeExternals(),

    // https://github.com/rollup/plugins/tree/master/packages/commonjs/#readme
    commonjs(),

    // https://github.com/rollup/plugins/tree/master/packages/node-resolve/#readme
    nodeResolve(),

    // https://github.com/ezolenko/rollup-plugin-typescript2
    typescript({
      tsconfigOverride: {
        exclude: ['test/**/*.ts']
      }
    }),

    // https://github.com/rollup/plugins/tree/master/packages/babel#readme
    bable({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      extensions: [...DEFAULT_EXTENSIONS, '.ts']
    })
  ]
})

export default rollupConfig
