const { test, expect } = require('@playwright/test')
const { getViewport, getOffset, getComputedStyle, isExisted } = require('@web-bench/test-util')
const path = require('path')
const { getEntryName } = require('./util')

/**
 * @param {Element} entry
 * @param {string} newName
 */
function setEntryName(entry, newName) {
  const firstTextNode = Array.from(entry.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE
  )
  if (firstTextNode) {
    firstTextNode.nodeValue = newName
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')

  const addFile = page.locator('.tools button:text("file")')
  const addDir = page.locator('.tools button:text("dir")')
  await addFile.click()
  await addDir.click()
  // add to sub dir
  await addFile.click()
  await addDir.click() // selected
})

test('menu item file/rename', async ({ page }) => {
  const rename = page.locator('.menu .menu-item-rename')

  // file/rename
  const file = page.locator('.entries > .file')
  await file.click({ button: 'right' })
  await expect(rename).toBeVisible()

  const filename = await file.textContent()
  const newFilename = 'new ' + filename
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') {
      await dialog.accept(newFilename)
    }
  })

  await rename.click()
  await expect(file).toHaveText(newFilename)
})

test('menu item file/rename duplicated', async ({ page }) => {
  const rename = page.locator('.menu .menu-item-rename')

  // file/rename
  const file = page.locator('.entries > .file')
  await file.click({ button: 'right' })
  await expect(rename).toBeVisible()

  const filename = (await file.textContent()) ?? ''
  const newFilename = await getEntryName(page.locator('.entries > .dir'))
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') {
      await dialog.accept(newFilename)
    }
  })

  await rename.click()
  await expect(file).toHaveText(filename)
})

test('menu item dir/rename', async ({ page }) => {
  const rename = page.locator('.menu .menu-item-rename')

  // dir/rename
  const dir = page.locator('.entries > .dir:nth-child(2)')
  await dir.click({ button: 'right', position: { x: 0, y: 0 } })
  await expect(rename).toBeVisible()
  const newFilename = 'new dir'

  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') {
      await dialog.accept(newFilename)
    }
  })

  await rename.click()

  const dirName = await dir.evaluate((entry) => {
    const firstTextNode = Array.from(entry.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE
    )
    return firstTextNode?.nodeValue?.trim() ?? ''
  })
  await expect(dirName).toBe(newFilename)
})

test('menu item no entries/rename', async ({ page }) => {
  const rename = page.locator('.menu .menu-item-rename')

  await page.locator('.entries').click({ button: 'right' })
  await expect(rename).toBeHidden()
})
