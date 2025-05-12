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

import { $, createColorWheel, updateWheelImageData } from './util.js'

document.addEventListener('DOMContentLoaded', () => {
  initColors()
  initChangeTheme()
  initHSLWheels()
  initLCHWheels()
  initHWBWheels()
})

function initColors() {
  function colorChange(el, mode) {
    const colors = []
    let alpha = '0'
    const ranges = Array.from(el.querySelectorAll('input[type="range"]'))
    ranges.forEach((range, i) => {
      const result = range.parentNode.querySelector('.result')
      if (i === ranges.length - 1) alpha = range.value
      else colors.push(range.value)
      result.innerHTML = `${range.value}`
    })

    const color = `${mode}(${colors.join(' ')} / ${alpha})`
    console.log(color)
    el.style.backgroundColor = color
  }

  const modes = ['rgb', 'hsl', 'hwb', 'lab', 'lch', 'oklab', 'oklch']
  modes.forEach((mode) => {
    const el = $(`.color.${mode}`)
    if (!el) return

    el.addEventListener('change', () => colorChange(el, mode))
    colorChange(el, mode)
  })
}

function initChangeTheme() {
  $('#changeTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark')
  })
}

function initHSLWheels() {
  const mode = 'hsl'
  const el = $(`.color.wheel-color.${mode}-wheel`)
  if (!el) return

  const canvas = createColorWheel(mode, ({ rgba: d }) => {
    el.style.backgroundColor = `rgb(${d[0]} ${d[1]} ${d[2]} / ${d[3]})`
  })

  // Lightness
  const lightnessRange = document.createElement('input')
  lightnessRange.type = 'range'
  lightnessRange.className = 'l'
  lightnessRange.value = '50'
  lightnessRange.min = '0'
  lightnessRange.max = '100'
  el.append(lightnessRange)
  lightnessRange.addEventListener('change', () => {
    updateWheelImageData(mode, canvas, parseInt(lightnessRange.value))
  })
}

function initLCHWheels() {
  const mode = 'lch'
  const el = $(`.color.wheel-color.${mode}-wheel`)
  if (!el) return

  function update() {
    el.style.backgroundColor = `lch(${lightnessRange.value} ${chromaRange.value} ${angle})`
  }

  let angle = 0
  const canvas = createColorWheel(mode, (args) => {
    angle = args.angle
    update()
  })

  // Lightness
  const lightnessRange = document.createElement('input')
  lightnessRange.type = 'range'
  lightnessRange.className = 'l'
  lightnessRange.value = '50'
  lightnessRange.min = '0'
  lightnessRange.max = '100'
  el.append(lightnessRange)
  lightnessRange.addEventListener('change', () => {
    updateWheelImageData(mode, canvas, parseInt(lightnessRange.value))
    update()
  })

  // Chroma
  const chromaRange = document.createElement('input')
  chromaRange.type = 'range'
  chromaRange.className = 'c'
  chromaRange.value = '50'
  chromaRange.min = '0'
  chromaRange.max = '230'
  el.append(chromaRange)
  chromaRange.addEventListener('change', update)
}

function initHWBWheels() {
  const mode = 'hwb'
  const el = $(`.color.wheel-color.${mode}-wheel`)
  if (!el) return

  function update() {
    el.style.backgroundColor = `hwb(${angle} ${whitenessRange.value} ${blacknessRange.value})`
  }

  let angle = 0
  const canvas = createColorWheel(mode, (args) => {
    angle = args.angle
    update()
  })

  // Whiteness
  const whitenessRange = document.createElement('input')
  whitenessRange.type = 'range'
  whitenessRange.className = 'w'
  whitenessRange.value = '0'
  whitenessRange.min = '0'
  whitenessRange.max = '100'
  el.append(whitenessRange)
  whitenessRange.addEventListener('change', update)

  // Blackness
  const blacknessRange = document.createElement('input')
  blacknessRange.type = 'range'
  blacknessRange.className = 'b'
  blacknessRange.value = '0'
  blacknessRange.min = '0'
  blacknessRange.max = '100'
  el.append(blacknessRange)
  blacknessRange.addEventListener('change', update)
}
