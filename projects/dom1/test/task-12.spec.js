// @ts-nocheck
const { test, expect } = require('@playwright/test')
const { getEntryName } = require('./util/index')
const { getViewport, getOffset, getComputedStyle, isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

/**
 * @param {import('@playwright/test').Page} page
 */
async function testExportedData(page, importedData) {
  let exportedData
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') {
      await dialog.accept(JSON.stringify(importedData))
    }
    if (dialog.type() === 'alert') {
      exportedData = JSON.parse(dialog.message())
      await dialog.accept()
    }
  })

  await page.locator('.tools button:text("imp")').click()
  await page.locator('.tools button:text("exp")').click()
  await expect(exportedData).toEqual(importedData)
}

test('export file', async ({ page }) => {
  const importedData = {
    entries: [{ type: 'file', name: 'file-0.txt', content: 'file content from file-0.txt' }],
  }

  await testExportedData(page, importedData)
})

test('export dir', async ({ page }) => {
  const importedData = {
    entries: [{ type: 'dir', name: 'dir-0', children: [] }],
  }

  await testExportedData(page, importedData)
})

test('export dirs & files', async ({ page }) => {
  const importedData = {
    entries: [
      { type: 'file', name: 'file-0.txt', content: 'file content from file-0.txt' },
      {
        type: 'dir',
        name: 'dir-0',
        children: [
          { type: 'file', name: 'file-2.txt', content: 'file content from file-2.txt' },
          { type: 'dir', name: 'dir-2', children: [] },
        ],
      },
    ],
  }

  await testExportedData(page, importedData)
})

test('export complicated dirs & files', async ({ page }) => {
  const importedData = {
    entries: [
      { type: 'file', name: 'file-0.txt', content: 'file content from file-0.txt' },
      {
        type: 'dir',
        name: 'dir-0',
        children: [
          { type: 'file', name: 'file-2.txt', content: 'file content from file-2.txt' },
          { type: 'dir', name: 'dir-2', children: [] },
        ],
      },
      { type: 'file', name: 'file-4.txt', content: 'file content from file-4.txt' },
      {
        type: 'dir',
        name: 'dir-4',
        children: [{ type: 'file', name: 'file-6.txt', content: 'file content from file-6.txt' }],
      },
    ],
  }

  await testExportedData(page, importedData)
})
