import { expect, test } from 'vitest'
import { HTMLParser, HTMLParserError } from './html'

const htmlParser = new HTMLParser()
test('test html parser', () => {
  expect(htmlParser.validate(`<ul id="list>"`)).toBe(HTMLParserError.FullHTML)

  expect(
    htmlParser.validate(`
      <button onclick="calculate('sqrt')">√</button>
      <button onclick="calculate('square')">^2</button>
      <button onclick="calculate('reciprocal')">1/x</button>
    </div>
    </div>

    <script>
    let displayValue = '';

    function calculate(value) {
      if (value === 'C') {
    	displayValue = '';
      } else if (value === '=') {
    	try {
    	  displayValue = eval(displayValue).toString();
    	} catch (error) {
    	  displayValue = 'Error';
    	}
      } else if (value === 'sqrt') {
    	try {
    	  displayValue = Math.sqrt(eval(displayValue)).toString();
    	} catch (error) {
    	  displayValue = 'Error';
    	}
      } else if (value === 'square') {
    	try {
    	  displayValue = Math.pow(eval(displayValue), 2).toString();
    	} catch (error) {
    	  displayValue = 'Error';
    	}
      } else if (value === 'reciprocal') {
    	try {
    	  displayValue = (1 / eval(displayValue)).toString();
    	} catch (error) {
    	  displayValue = 'Error';
    	}
      } else {
    	displayValue += value;
      }
      document.getElementById('display').value = displayValue;
    }
    </script>
      `)
  ).toBe(HTMLParserError.FullHTML)

  expect(
    htmlParser.validate(`
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
  		  <button onclick="calculate('sqrt')">√</button>
  		  <button onclick="calculate('square')">^2</button>
  		</div>
  	  </div>

  	  <script>
  		let displayValue = '';

  		function calculate(value) {
  		  if (value === 'C') {
  			displayValue = '';
  		  } else if (value === '=') {
  			try {
  			  displayValue = eval(displayValue).toString();
  			} catch (error) {
  			  displayValue = 'Error';
  			}
  		  } else if (value === 'sqrt') {
  			try {
  			  displayValue = Math.sqrt(eval(displayValue)).toString();
  			} catch (error) {
  			  displayValue = 'Error';
  			}
  		  } else if (value === 'square') {
  			try {
  			  displayValue = Math.pow(eval(displayValue), 2).toString();
  			} catch (error) {
  			  displayValue = 'Error';
  			}
  		  } else {
  			displayValue += value;
  		  }
  		  document.getElementById('display').value = displayValue;
  		}
  	  </script>
  	</body>
    </html>
    `)
  ).toBe('')
})
