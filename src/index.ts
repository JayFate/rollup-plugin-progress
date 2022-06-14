import path from 'path'
import os from 'os'
import * as fs from 'fs'
import * as readline from 'readline'
import { PluginImpl } from 'rollup'
import { sync as mkdirpSync } from 'mkdirp'
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
  const dir = path.resolve(os.tmpdir(), 'xxteam-rollup-plugin-progress-dir')
  if (!fs.existsSync(dir)) {
    mkdirpSync(dir)
  }
  const totalFilePath = path.resolve(dir, path.basename(path.resolve()))
  try {
    const totalTemp = parseInt(fs.readFileSync(totalFilePath).toString(), 10)
    total = Number.isNaN(totalTemp) ? 0 : totalTemp
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
        readline.clearLine(process.stdout, 0)
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
        // eslint-disable-next-line no-console
        console.log(`(${red(state.loaded)}): ${file}`)
      }
    },
    generateBundle() {
      fs.writeFileSync(totalFilePath, String(state.loaded))
      if (opts.clearLine && process.stdout.isTTY) {
        readline.clearLine(process.stdout, 0)
        readline.cursorTo(process.stdout, 0)
      }
    }
  }
}

export default progress
