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

import md, { frontmatter } from './hello.md'

console.log('log')

fetch(`/postman/get?text=hello%20proxy`).then(async response => {
  const json = await response.json()
  const fetchNode = document.createElement('div')
  document.body.appendChild(fetchNode)
  fetchNode.textContent = json.args.text
})

fetch(`/mock-api/ping`).then(async response => {
  const json = await response.json()
  const mockGetNode = document.createElement('div')
  document.body.appendChild(mockGetNode)
  mockGetNode.textContent = `hello ${json.data}`
})

const helloNode = document.createElement('div')
helloNode.textContent = 'hello world'
document.body.appendChild(helloNode)

function getObj() {
  window.randomSideEffects = Math.random()
  return {}
}
const obj = getObj()
const optionalChainingNode = document.createElement('div')
optionalChainingNode.textContent = obj?.field || 'fallback'
document.body.appendChild(optionalChainingNode)

import alias from '@/alias'
const aliasNode = document.createElement('div')
aliasNode.textContent = alias
document.body.appendChild(aliasNode)

import './version'

import bird from './images/bird.png'
const birdImg = document.createElement('img')
birdImg.id = 'bird'
birdImg.src = bird
document.body.appendChild(birdImg)

import svg from './images/TablerAntennaBars5.svg'
const svgImg = document.createElement('img')
svgImg.id = 'svg'
svgImg.src = svg
document.body.appendChild(svgImg)

import './index.css'
const cssNode = document.createElement('div')
cssNode.className = 'css'
cssNode.textContent = 'hello css'
document.body.appendChild(cssNode)

import './index.less'
const lessNode = document.createElement('div')
lessNode.className = 'less'
lessNode.textContent = 'hello less'
document.body.appendChild(lessNode)

import lessStyles from './index.module.less'
const lessModulesNode = document.createElement('div')
lessModulesNode.className = lessStyles.lessModules
lessModulesNode.textContent = 'hello less modules'
document.body.appendChild(lessModulesNode)

import ts from './index.ts'
const tsNode = document.createElement('div')
tsNode.textContent = ts()
document.body.appendChild(tsNode)

import { createApp } from 'vue'
import VueComponent from './component.vue'
const vueContainer = document.createElement('div')
document.body.appendChild(vueContainer)
createApp(VueComponent).mount(vueContainer)

import { createRoot } from 'react-dom/client'
import ReactComponent from './component.jsx'
const reactContainer = document.createElement('div')
document.body.appendChild(reactContainer)
createRoot(reactContainer).render(ReactComponent())

import files from '~files';

const div = document.createElement('div');
div.textContent = JSON.stringify(files);
document.body.appendChild(div);

const mdDiv = document.createElement('div')
mdDiv.innerHTML = md
document.body.appendChild(mdDiv)

const fmDiv = document.createElement('div')
fmDiv.innerHTML = frontmatter.author
document.body.appendChild(fmDiv)