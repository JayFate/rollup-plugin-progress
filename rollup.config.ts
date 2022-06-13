import { defineConfig } from 'rollup'
import { cleandir } from 'rollup-plugin-cleandir'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import bable from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { visualizer } from 'rollup-plugin-visualizer'

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
    cleandir(['dist', 'output']),

    // https://github.com/rollup/plugins/tree/master/packages/commonjs/#readme
    commonjs(),

    // https://github.com/rollup/plugins/tree/master/packages/node-resolve/#readme
    nodeResolve({
      preferBuiltins: true,
      moduleDirectories: ['node_modules']
    }),

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
    }),

    // https://github.com/btd/rollup-plugin-visualizer
    visualizer({ filename: 'output/stats.html' })
  ]
})

export default rollupConfig
