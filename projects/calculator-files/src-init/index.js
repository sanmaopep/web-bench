// @ts-nocheck
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
