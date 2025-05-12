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

import { parse } from 'node-html-parser'
import { CodeParser } from './type'

export enum HTMLParserError {
  FullHTML = 'Please enter the full HTML codeblock with filename in the language specifier.',
}

export class HTMLParser implements CodeParser {
  suffix: string[] = ['html', 'htm']

  validate(content: string) {
    const root = parse(content)

    const hasHTMLNode = root.childNodes.find(
      (c) => c.rawTagName === 'html' || c.rawTagName === 'body'
    )

    if (hasHTMLNode) {
      return ''
    }
    return HTMLParserError.FullHTML
  }
}
