import { defineConfig } from 'rollup'
import { cleandir } from 'rollup-plugin-cleandir'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import bable from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'

const rollupConfig = defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    cleandir('dist'),
    // 支持处理 typescript 文件
    typescript({
      tsconfigOverride: {
        exclude: ['test/**/*.ts']
      }
    }),
    // 将 commonjs 转换为 ES 模块
    commonjs(),
    // 解析 node_modules 中的模块
    nodeResolve({
      preferBuiltins: true,
      moduleDirectories: ['node_modules']
    }),
    bable({
      babelHelpers: 'runtime',
      // 只转换源代码，忽略node依赖
      exclude: 'node_modules/**',
      // rollup-babel 默认不转换 ts 需要手动添加
      extensions: [...DEFAULT_EXTENSIONS, '.ts']
    })
  ]
})

export default rollupConfig
