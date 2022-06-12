import { PluginImpl } from 'rollup'
import { resolve, relative, sep } from 'path'
import { tmpdir } from 'os'
import { readFileSync, writeFileSync } from 'fs'
import * as readline from 'readline'
import { red } from 'chalk'

export interface Options {
  clearLine?: boolean
}

function normalizePath(id: string) {
  return relative(process.cwd(), id).split(sep).join('/')
}

const progress: PluginImpl<Options> = (options?: Options) => {
  if (options === undefined || options.clearLine === undefined) {
    options = { clearLine: true }
  }

  let total = 0
  const totalFilePath = resolve(tmpdir(), './xxteam-rollup-plugin-progress')
  try {
    total = parseInt(readFileSync(totalFilePath).toString(), 10)
  } catch (e) {
    writeFileSync(totalFilePath, '0')
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

      if (options!.clearLine && process.stdout.isTTY) {
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
      writeFileSync(totalFilePath, String(state.loaded))
      if (options!.clearLine && process.stdout.isTTY) {
        readline.cursorTo(process.stdout, 0)
      }
    }
  }
}

export default progress
