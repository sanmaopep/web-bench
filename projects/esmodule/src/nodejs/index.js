import fs from 'fs'
import path from 'path'

const filepath = path.resolve(import.meta.dirname, 'test-config.js')
fs.writeFileSync(filepath, "export const config = { lang: 'en' }")

export const lang = (await import('./test-config.js')).config.lang

export const cjs = (await import('./cjs.cjs')).default.cjs

// @see https://github.com/microsoft/playwright/issues/33557
export {default as data} from './data.json' with { type: 'json' }

// @ts-ignore
export {default as inlineData} from 'data:application/json,{"inline":true}' with { type: 'json' }