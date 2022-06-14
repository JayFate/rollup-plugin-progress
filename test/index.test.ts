/* eslint-disable no-restricted-syntax */
import progress, { Options } from 'src/index'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { setInterval } from 'timers/promises'

const log = (options?: Options) => {
  return async () => {
    const progressBar = progress(options)
    const arg = undefined as any
    for await (const startTime of setInterval(200, Date.now())) {
      const now = Date.now()
      const id = path.resolve(path.resolve(), 'node_modules', (Math.random() * 16).toString())
      progressBar.load?.bind(arg)(id)
      progressBar.transform?.bind(arg)('', id)
      if (now - startTime > 2000) break
    }
    progressBar.generateBundle?.bind(undefined as any)(arg, arg, arg)
  }
}

beforeAll(() => {
  const totalFilePath = path.resolve(
    os.tmpdir(),
    './xxteam-rollup-plugin-progress-dir',
    path.basename(path.resolve())
  )
  if (fs.existsSync(totalFilePath)) {
    fs.unlinkSync(totalFilePath)
  }
})
test('clearLine default', log())
test('clearLine true', log({ clearLine: true }))
test('clearLine false', log({ clearLine: false }))
