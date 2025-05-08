import { ProjectSetting } from '@web-bench/evaluator-types'
import child_process from 'child_process'
import path from 'path'
import fs from 'promise-fs'

const { exec } = child_process

const getExecPromise = (
  cmd: string,
  projectDir: string,
  port: number,
  settings: ProjectSetting
) => {
  return new Promise((resolve, reject) => {
    exec(
      cmd,
      {
        env: {
          ...process.env,
          EVAL_PROJECT_ROOT: projectDir,
          EVAL_PROJECT_PORT: `${port}`,
          IS_EVAL_PRODUCTION: settings.production ? 'true' : undefined,

          EVAL: 'true',
        },
      },
      (err, stdout, stderr) => {
        if (err) reject(stdout + '\n' + stderr)
        resolve('')
      }
    )
  })
}

export const generateScreenShot = async (
  filename: string,
  settings: ProjectSetting,
  port: number
) => {
  const content = `
const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.screenshot({
    path: "${filename}"
  })

})

test('1 + 2 =', async () => {
  await expect(1).toBe(1)
})

`
  // 带上端口号，避免多个 model 同时运行时，删除其他的 screenshot.spec.js 导致截图出错
  const screenshotPath = path.join(settings.testDir, `screenshot-${port}.spec.js`)

  try {
    await fs.access(screenshotPath)
    await fs.unlink(screenshotPath)
  } catch (error) {}

  try {
    await fs.appendFile(screenshotPath, content)

    await getExecPromise(
      `cd ${settings.projectDir} && npx playwright test ${screenshotPath}`,
      settings.outputProjectDir[0],
      port,
      settings
    )

    await fs.unlink(screenshotPath)
  } catch (error) {
    await fs.unlink(screenshotPath)

    return `Generate screenshot failed: port ${port}\n ${error}`
  }
}
