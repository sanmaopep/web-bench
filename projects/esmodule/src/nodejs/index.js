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