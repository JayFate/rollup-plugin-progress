/* eslint-disable no-console */
import { PluginImpl } from 'rollup'
import path from 'path'
import os from 'os'
import * as fs from 'fs'
import * as readline from 'readline'
import { red } from 'picocolors'

export interface Options {
  clearLine?: boolean
}

function normalizePath(id: string) {
  return path.relative(process.cwd(), id).split(path.sep).join('/')
}

const progress: PluginImpl<Options> = (options?: Options) => {
  const opts = { clearLine: true, ...options }

  let total = 0
  const totalFilePath = path.resolve(os.tmpdir(), './xxteam-rollup-plugin-progress')
  try {
    total = parseInt(fs.readFileSync(totalFilePath).toString(), 10)
  } catch (e) {
    fs.writeFileSync(totalFilePath, '0')
  }
  const state = {
    total,
    loaded: 0
  }

  return {
    name: 'progress',
    load() {
      state.loaded += 1
    },
    transform(_code, id) {
      const file = normalizePath(id)
      if (file.includes(':')) {
        return
      }

      if (opts.clearLine && process.stdout.isTTY) {
        readline.cursorTo(process.stdout, 0)
        let output = ''
        if (state.total > 0) {
          const percent = Math.round((100 * state.loaded) / state.total)
          output += `${Math.min(100, percent)}% `
        }
        output += `(${red(state.loaded)}): ${file}`
        if (output.length < process.stdout.columns) {
          process.stdout.write(output)
        } else {
          process.stdout.write(output.substring(0, process.stdout.columns - 1))
        }
      } else {
        console.log(`(${red(state.loaded)}): ${file}`)
      }
    },
    generateBundle() {
      fs.writeFileSync(totalFilePath, String(state.loaded))
      if (opts.clearLine && process.stdout.isTTY) {
        readline.cursorTo(process.stdout, 0)
      }
    }
  }
}

export default progress
