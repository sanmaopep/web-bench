import alias from '@/alias'
import './version'
import bird from './images/bird.png'
import svg from './images/TablerAntennaBars5.svg'
import './index.css'
import './index.less'
import lessStyles from './index.module.less'
import ts from './index.ts'
import VueComponent from './component.vue'
import ReactComponent from './component.jsx'
import { createApp } from 'vue'
import { createRoot } from 'react-dom/client'
import React from 'react'
import files from '~files'
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

const obj = {}
const optionalChainingNode = document.createElement('div')
optionalChainingNode.textContent = obj?.field || 'fallback'
document.body.appendChild(optionalChainingNode)

const aliasNode = document.createElement('div')
aliasNode.textContent = alias
document.body.appendChild(aliasNode)

const birdImg = document.createElement('img')
birdImg.id = 'bird'
birdImg.src = bird
document.body.appendChild(birdImg)

const svgImg = document.createElement('img') 
svgImg.id = 'svg'
svgImg.src = svg
document.body.appendChild(svgImg)

const cssNode = document.createElement('div')
cssNode.className = 'css'
cssNode.textContent = 'hello css'
document.body.appendChild(cssNode)

const lessNode = document.createElement('div')
lessNode.className = 'less'
lessNode.textContent = 'hello less'
document.body.appendChild(lessNode)

const lessModulesNode = document.createElement('div') 
lessModulesNode.className = lessStyles.lessModules
lessModulesNode.textContent = 'hello less modules'
document.body.appendChild(lessModulesNode)

const tsNode = document.createElement('div')
tsNode.textContent = ts()
document.body.appendChild(tsNode)

const vueNode = document.createElement('div')
document.body.appendChild(vueNode)
const vueApp = createApp(VueComponent)
vueApp.mount(vueNode)

const reactNode = document.createElement('div')
document.body.appendChild(reactNode)
const root = createRoot(reactNode)
root.render(React.createElement(ReactComponent))

const filesNode = document.createElement('div')
filesNode.textContent = JSON.stringify(files)
document.body.appendChild(filesNode)

const mdDiv = document.createElement('div')
mdDiv.innerHTML = md
document.body.appendChild(mdDiv)

const fmDiv = document.createElement('div')
fmDiv.innerHTML = frontmatter.author
document.body.appendChild(fmDiv)