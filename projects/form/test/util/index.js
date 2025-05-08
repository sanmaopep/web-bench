/**
 * Intercept the network request
 * @param {import('@playwright/test').Page} page
 * @param {(searchParams: URLSearchParams, url: URL) => void} tests
 */
export async function interceptNetworkAndAbort(page, tests) {
  await page.route('**/*submit*', async (route) => {
    const rawurl = route.request().url()
    const url = new URL(rawurl)
    // console.log(url.pathname, url.searchParams)
    await tests(url.searchParams, url)
    await route.abort()
  })
}

/**
 * @param {import('@playwright/test').Page} page
 */
export async function submit(page) {
  await page.locator('button[type="submit"]').first().click()
}
