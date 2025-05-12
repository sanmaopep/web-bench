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

// @ts-nocheck
let displayValue = ''
let isDarkMode = true
let isScientific = true
let memoryValue = 0
let clickHistory = []

document.getElementById('toggle').addEventListener('click', function () {
  isDarkMode = !isDarkMode
  document.querySelector('.calculator').classList.toggle('dark-mode')
  this.textContent = isDarkMode ? 'Light' : 'Dark'
})

document.getElementById('mode').addEventListener('click', function () {
  isScientific = !isScientific
  document.querySelector('.calculator').classList.toggle('scientific')
  this.textContent = isScientific ? 'Basic' : 'Scientific'
})

function updateMemoryDisplay() {
  const memoryElement = document.getElementById('memory')
  memoryElement.textContent = memoryValue.toLocaleString('en-US', {
    maximumFractionDigits: 10,
    minimumFractionDigits: 0,
  })
}

function updateClicksDisplay(text) {
  clickHistory.unshift(text)
  if (clickHistory.length > 5) {
    clickHistory.pop()
  }

  const clicksElement = document.getElementById('clicks')
  clicksElement.innerHTML = ''

  clickHistory.forEach((value) => {
    const historyItem = document.createElement('span')
    historyItem.textContent = value
    historyItem.className = 'history-item'
    historyItem.addEventListener('click', () => {
      updateClicksDisplay(value)
      calculate(value)
    })
    clicksElement.appendChild(historyItem)
  })
}

function calculate(text) {
  switch (text) {
    case 'M+':
      try {
        if (displayValue) {
          memoryValue += eval(displayValue)
          updateMemoryDisplay()
          displayValue = ''
        }
      } catch (error) {
        displayValue = 'Error'
      }
      break

    case 'MR':
      displayValue += memoryValue.toString()
      break

    case 'M-':
      try {
        if (displayValue) {
          memoryValue -= eval(displayValue)
          updateMemoryDisplay()
          displayValue = ''
        }
      } catch (error) {
        displayValue = 'Error'
      }
      break

    case 'MC':
      if (memoryValue !== 0) {
        memoryValue = 0
        updateMemoryDisplay()
      }
      break

    case 'Clear':
      displayValue = ''
      break

    case '=':
      try {
        displayValue = eval(displayValue).toString()
      } catch (error) {
        displayValue = 'Error'
      }
      break

    case '√':
      try {
        displayValue = Math.sqrt(parseFloat(displayValue)).toString()
      } catch (error) {
        displayValue = 'Error'
      }
      break

    case '^2':
      try {
        displayValue = Math.pow(parseFloat(displayValue), 2).toString()
      } catch (error) {
        displayValue = 'Error'
      }
      break

    case '1/x':
      try {
        const num = parseFloat(displayValue)
        if (num === 0) throw new Error('Cannot divide by zero')
        displayValue = (1 / num).toString()
      } catch (error) {
        displayValue = 'Error'
      }
      break

    case 'sin':
      try {
        displayValue = Math.sin(parseFloat(displayValue)).toString()
      } catch (error) {
        displayValue = 'Error'
      }
      break

    case 'π':
      displayValue = Math.PI.toString()
      break

    case 'cos':
      try {
        displayValue = Math.cos(parseFloat(displayValue)).toString()
      } catch (error) {
        displayValue = 'Error'
      }
      break

    case 'tan':
      try {
        displayValue = Math.tan(parseFloat(displayValue)).toString()
      } catch (error) {
        displayValue = 'Error'
      }
      break

    case 'sinh':
      try {
        displayValue = Math.sinh(parseFloat(displayValue)).toString()
      } catch (error) {
        displayValue = 'Error'
      }
      break

    case 'cosh':
      try {
        displayValue = Math.cosh(parseFloat(displayValue)).toString()
      } catch (error) {
        displayValue = 'Error'
      }
      break

    case 'tanh':
      try {
        displayValue = Math.tanh(parseFloat(displayValue)).toString()
      } catch (error) {
        displayValue = 'Error'
      }
      break

    default:
      displayValue += text
  }
  document.getElementById('display').value = displayValue
}

document.addEventListener('DOMContentLoaded', (event) => {
  updateMemoryDisplay()

  document.querySelectorAll('.buttons button').forEach((element) => {
    element.addEventListener('click', function (event) {
      const text = element.innerHTML
      updateClicksDisplay(text)
      calculate(text)
    })
  })
})
