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

import { expect, test } from 'vitest'
import { MarkdownParser } from './markdown'

test('MarkdownParser 前面有多空行', () => {
  const content = `
\`\`\`

src/components/Title.tsx
import React from 'react';

const Title: React.FC = () => {
  return <h1>Hello World</h1>;
};

export default Title;
\`\`\`
   
  `

  const res = MarkdownParser.parseMarkdownCodeBlocks(content)
  expect(res[0]?.filename).toStrictEqual('src/components/Title.tsx')
})

test('MarkdownParser 处理缺少 language', () => {
  const content = `
  \`\`\`src/demo/index.html
	<!doctype html>
	<html lang="en">
	  <head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Simple Calculator</title>
		<style>
		  .calculator {
			width: 300px;
			margin: 50px auto;
			padding: 20px;
			border: 1px solid #ccc;
			border-radius: 5px;
		  }
		  .display {
			width: 100%;
			height: 40px;
			margin-bottom: 10px;
			text-align: right;
			font-size: 24px;
		  }
		  .buttons {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 5px;
		  }
		  button {
			padding: 10px;
			font-size: 18px;
			border: 1px solid #999;
			border-radius: 5px;
			cursor: pointer;
		  }
		  button:hover {
			background-color: #eee;
		  }
		</style>
	  </head>
	  <body>
		<div class="calculator">
		  <input type="text" class="display" id="display" readonly />
		  <div class="buttons">
			<button onclick="calculate('7')">7</button>
			<button onclick="calculate('8')">8</button>
			<button onclick="calculate('9')">9</button>
			<button onclick="calculate('/')">/</button>
			<button onclick="calculate('4')">4</button>
			<button onclick="calculate('5')">5</button>
			<button onclick="calculate('6')">6</button>
			<button onclick="calculate('*')">*</button>
			<button onclick="calculate('1')">1</button>
			<button onclick="calculate('2')">2</button>
			<button onclick="calculate('3')">3</button>
			<button onclick="calculate('-')">-</button>
			<button onclick="calculate('0')">0</button>
			<button onclick="calculate('.')">.</button>
			<button onclick="calculate('=')">=</button>
			<button onclick="calculate('+')">+</button>
			<button onclick="calculate('C')" style="grid-column: span 3">
			  Clear
			</button>
			<button onclick="calculateSqrt()">√</button>
		  </div>
		</div>
	
		<script>
		  let displayValue = ''
	
		  function calculate(value) {
			if (value === 'C') {
			  displayValue = ''
			} else if (value === '=') {
			  try {
				displayValue = eval(displayValue).toString()
			  } catch (error) {
				displayValue = 'Error'
			  }
			} else {
			  displayValue += value
			}
			document.getElementById('display').value = displayValue
		  }
	
		  function calculateSqrt() {
			try {
			  displayValue = Math.sqrt(parseFloat(displayValue)).toString()
			} catch (error) {
			  displayValue = 'Error'
			}
			document.getElementById('display').value = displayValue
		  }
		</script>
	  </body>
	</html>
  \`\`\`
	 
	`

  const res = MarkdownParser.parseMarkdownCodeBlocks(content)
  expect(res[0]?.filename).toStrictEqual('src/demo/index.html')
  expect(res[0]?.language).toStrictEqual('html')
})

test('MarkdownParser 处理缺少 language', () => {
  const content = `
	\`\`\`src/demo/index.html
	  <!doctype html>
	  <html lang="en">
		<head>
		  <meta charset="UTF-8" />
		  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
		  <title>Simple Calculator</title>
		  <style>
			.calculator {
			  width: 300px;
			  margin: 50px auto;
			  padding: 20px;
			  border: 1px solid #ccc;
			  border-radius: 5px;
			}
			.display {
			  width: 100%;
			  height: 40px;
			  margin-bottom: 10px;
			  text-align: right;
			  font-size: 24px;
			}
			.buttons {
			  display: grid;
			  grid-template-columns: repeat(4, 1fr);
			  gap: 5px;
			}
			button {
			  padding: 10px;
			  font-size: 18px;
			  border: 1px solid #999;
			  border-radius: 5px;
			  cursor: pointer;
			}
			button:hover {
			  background-color: #eee;
			}
		  </style>
		</head>
		<body>
		  <div class="calculator">
			<input type="text" class="display" id="display" readonly />
			<div class="buttons">
			  <button onclick="calculate('7')">7</button>
			  <button onclick="calculate('8')">8</button>
			  <button onclick="calculate('9')">9</button>
			  <button onclick="calculate('/')">/</button>
			  <button onclick="calculate('4')">4</button>
			  <button onclick="calculate('5')">5</button>
			  <button onclick="calculate('6')">6</button>
			  <button onclick="calculate('*')">*</button>
			  <button onclick="calculate('1')">1</button>
			  <button onclick="calculate('2')">2</button>
			  <button onclick="calculate('3')">3</button>
			  <button onclick="calculate('-')">-</button>
			  <button onclick="calculate('0')">0</button>
			  <button onclick="calculate('.')">.</button>
			  <button onclick="calculate('=')">=</button>
			  <button onclick="calculate('+')">+</button>
			  <button onclick="calculate('C')" style="grid-column: span 3">
				Clear
			  </button>
			  <button onclick="calculateSqrt()">√</button>
			</div>
		  </div>
	  
		  <script>
			let displayValue = ''
	  
			function calculate(value) {
			  if (value === 'C') {
				displayValue = ''
			  } else if (value === '=') {
				try {
				  displayValue = eval(displayValue).toString()
				} catch (error) {
				  displayValue = 'Error'
				}
			  } else {
				displayValue += value
			  }
			  document.getElementById('display').value = displayValue
			}
	  
			function calculateSqrt() {
			  try {
				displayValue = Math.sqrt(parseFloat(displayValue)).toString()
			  } catch (error) {
				displayValue = 'Error'
			  }
			  document.getElementById('display').value = displayValue
			}
		  </script>
		</body>
	  </html>
	\`\`\`
	   
	  `

  const res = MarkdownParser.parseMarkdownCodeBlocks(content)
  expect(res[0]?.filename).toStrictEqual('src/demo/index.html')
  expect(res[0]?.language).toStrictEqual('html')
})

test('MarkdownParser 处理 url 在尾部', () => {
  const content =
    '```html\n<html>\n  <body>\n    <div class="root"></div>\n  </body>\n</html>\n/user/index.html\n```'

  const res = MarkdownParser.parseMarkdownCodeBlocks(content)
  expect(res[0]?.filename).toStrictEqual('user/index.html')
  expect(res[0]?.code).toStrictEqual(
    '<html>\n  <body>\n    <div class="root"></div>\n  </body>\n</html>'
  )
  expect(res[0]?.language).toStrictEqual('html')
})

test('判断是非是本地路径', () => {
  expect(MarkdownParser.isFileName('test.txt')).toBe(true)
  expect(MarkdownParser.isFileName('/usr/local/file.txt')).toBe(true)
  expect(MarkdownParser.isFileName('./relative/path.txt')).toBe(true)
  expect(MarkdownParser.isFileName('src/components/Title.tsx')).toBe(true)
  expect(
    MarkdownParser.isFileName(
      '/Documents/project/web Bench/projects/grid/src/index.html'
    )
  ).toBe(true)
  expect(MarkdownParser.isFileName('pages/profile/[username].vue')).toBe(true)
  expect(MarkdownParser.isFileName('index.html')).toBe(true)
  expect(MarkdownParser.isFileName('not a path')).toBe(false)
  expect(MarkdownParser.isFileName('<html>')).toBe(false)
  expect(MarkdownParser.isFileName('.hidden')).toBe(true)
  expect(MarkdownParser.isFileName('test@email.com')).toBe(false)
})

test('去除字符串开始和结尾的换行符', () => {
  expect(MarkdownParser.trimNewlines('\nHello World\n')).toBe('Hello World')
  expect(MarkdownParser.trimNewlines('\n')).toBe('')
  expect(MarkdownParser.trimNewlines('\r\nMultiple\r\nLines\r\n')).toBe('Multiple\r\nLines')
  expect(MarkdownParser.trimNewlines('\n\n\nExtra newlines\n\n')).toBe('Extra newlines')
  expect(MarkdownParser.trimNewlines('')).toBe('')
})

test('Angular app.component.ts file path', () => {
  const res = MarkdownParser.parseMarkdownCodeBlocks(`
\`\`\`
src/components/app.component.ts
// APP Component
\`\`\`

\`\`\`
src/app.component.css
// APP CSS
\`\`\`
		`)

  expect(res[0]?.filename).toStrictEqual('src/components/app.component.ts')
  expect(res[1]?.filename).toStrictEqual('src/app.component.css')
})
