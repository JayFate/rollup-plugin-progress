import progress from 'src/index'
import { setInterval } from 'timers/promises'

test('控制台log测试', async () => {
  const progressBar = progress()
  const arg = undefined as any
  const interval = 100
  for await (const startTime of setInterval(interval, Date.now())) {
    const now = Date.now()
    const id = (Math.random() * 16).toString()
    progressBar.load?.bind(arg)(id)
    progressBar.transform?.bind(arg)('', id)
    if (now - startTime > 2000) break
  }
  progressBar.generateBundle?.bind(undefined as any)(arg, arg, arg)
})
