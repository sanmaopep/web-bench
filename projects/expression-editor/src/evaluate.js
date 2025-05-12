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

/**
 * Evaluates a logical expression
 * @param {string} input - The expression to evaluate
 * @returns {boolean|null} - The result of the evaluation or null if error
 */
export function evaluate(input) {
  // Check for empty input
  if (!input || input.trim() === '') {
    return false;
  }

  try {
    // Use the parse function from parser.js
    const program = parse(input);
    
    // Evaluate the parsed program
    if (program && program.body && program.body.length > 0) {
      return evaluateNode(program.body[0]);
    }
    
    return false;
  } catch (error) {
    return null;
  }
}

/**
 * Built-in variables for evaluation
 */
const builtinVariables = {
  foo: true,
  fooooo: false,
  bar: true,
  barrrr: false
};

/**
 * Evaluates a node in the AST
 * @param {Object} node - The AST node to evaluate
 * @returns {boolean|null} - The result of evaluation
 */
function evaluateNode(node) {
  if (!node) return null;
  
  switch (node.type) {
    case 'Identifier':
      // Look up the identifier in builtins, default to false if not found
      return builtinVariables[node.name] || false;
      
    case 'LogicalExpression':
      // Check if operator matches its uppercase version using rawOperator
      if (node.rawOperator !== node.rawOperator.toUpperCase()) {
        return null;
      }
      
      const leftValue = evaluateNode(node.left);
      const rightValue = evaluateNode(node.right);
      
      // If either side evaluates to null, return null
      if (leftValue === null || rightValue === null) {
        return null;
      }
      
      if (node.operator === 'AND') {
        return leftValue && rightValue;
      } else if (node.operator === 'OR') {
        return leftValue || rightValue;
      }
      
      // Unknown operator
      return null;
      
    default:
      // Unknown node type
      return null;
  }
}

// Import parse function
import { parse } from './parser.js';