// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
