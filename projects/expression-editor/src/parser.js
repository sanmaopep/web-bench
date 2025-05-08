export function tokenize(input) {
  const tokens = [];
  let pos = 0;
  
  // Skip whitespace function
  function skipWhitespace() {
    while (pos < input.length && /[\s\t\n]/.test(input[pos])) {
      pos++;
    }
  }
  
  while (pos < input.length) {
    skipWhitespace();
    
    if (pos >= input.length) break;
    
    // Check for parentheses
    if (input[pos] === '(') {
      tokens.push({
        type: 'lparen',
        from: pos,
        to: pos + 1
      });
      pos++;
      continue;
    }
    
    if (input[pos] === ')') {
      tokens.push({
        type: 'rparen',
        from: pos,
        to: pos + 1
      });
      pos++;
      continue;
    }
    
    // Check for operators (AND, OR) - case insensitive
    const andMatch = input.substring(pos).match(/^(AND|and|And)/i);
    if (andMatch) {
      const value = andMatch[0];
      tokens.push({
        type: 'operator',
        from: pos,
        to: pos + value.length,
        value: value
      });
      pos += value.length;
      continue;
    }
    
    const orMatch = input.substring(pos).match(/^(OR|or|Or)/i);
    if (orMatch) {
      const value = orMatch[0];
      tokens.push({
        type: 'operator',
        from: pos,
        to: pos + value.length,
        value: value
      });
      pos += value.length;
      continue;
    }
    
    // Identifier
    if (/[a-zA-Z0-9_]/.test(input[pos])) {
      const start = pos;
      while (pos < input.length && /[a-zA-Z0-9_]/.test(input[pos])) {
        pos++;
      }
      tokens.push({
        type: 'identifier',
        from: start,
        to: pos,
        value: input.substring(start, pos)
      });
      continue;
    }
    
    // Skip any character that doesn't match our token patterns
    pos++;
  }
  
  return tokens;
}

export function parse(input) {
  const tokens = tokenize(input);
  let currentToken = 0;
  
  // Helper functions
  function peek() {
    return tokens[currentToken] || null;
  }
  
  function consume() {
    return tokens[currentToken++];
  }
  
  function match(type) {
    const token = peek();
    if (token && token.type === type) {
      return consume();
    }
    return null;
  }
  
  function expect(type, message) {
    const token = peek();
    if (token && token.type === type) {
      return consume();
    }
    throw new SyntaxError(message || `Expected ${type}, got ${token ? token.type : 'end of input'}`);
  }
  
  // Grammar productions
  
  // Program -> Expression
  function parseProgram() {
    const program = {
      type: 'Program',
      source: input,
      body: [],
      range: { from: 0, to: input.length }
    };
    
    // If we have tokens, try to parse them
    if (tokens.length > 0 && peek()) {
      const expr = parseExpression();
      if (expr) {
        program.body.push(expr);
      }
    }
    
    // Check for unexpected tokens
    if (peek()) {
      throw new SyntaxError(`Unexpected token: ${peek().type}`);
    }
    
    return program;
  }
  
  // Expression -> Term (OR Term)*
  function parseExpression() {
    let left = parseTerm();
    
    if (!left) {
      throw new SyntaxError("Expected expression");
    }
    
    while (peek() && peek().type === 'operator' && peek().value.toUpperCase() === 'OR') {
      const opToken = consume(); // Consume OR operator
      const right = parseTerm();
      
      if (!right) {
        throw new SyntaxError("Expected term after OR");
      }
      
      left = {
        type: 'LogicalExpression',
        operator: 'OR',
        rawOperator: opToken.value,
        operatorRange: { from: opToken.from, to: opToken.to },
        left: left,
        right: right,
        range: { from: left.range.from, to: right.range.to }
      };
    }
    
    return left;
  }
  
  // Term -> Factor (AND Factor)*
  function parseTerm() {
    let left = parseFactor();
    
    if (!left) {
      throw new SyntaxError("Expected term");
    }
    
    while (peek() && peek().type === 'operator' && peek().value.toUpperCase() === 'AND') {
      const opToken = consume(); // Consume AND operator
      const right = parseFactor();
      
      if (!right) {
        throw new SyntaxError("Expected factor after AND");
      }
      
      left = {
        type: 'LogicalExpression',
        operator: 'AND',
        rawOperator: opToken.value,
        operatorRange: { from: opToken.from, to: opToken.to },
        left: left,
        right: right,
        range: { from: left.range.from, to: right.range.to }
      };
    }
    
    return left;
  }
  
  // Factor -> Identifier | '(' Expression ')'
  function parseFactor() {
    // Check for identifier
    if (peek() && peek().type === 'identifier') {
      const token = consume();
      return {
        type: 'Identifier',
        name: token.value,
        range: { from: token.from, to: token.to }
      };
    }
    
    // Check for parenthesized expression
    if (peek() && peek().type === 'lparen') {
      const lparenToken = consume(); // Consume '('
      
      const expr = parseExpression();
      
      if (!expr) {
        throw new SyntaxError("Expected expression after '('");
      }
      
      if (!peek() || peek().type !== 'rparen') {
        throw new SyntaxError("Expected closing parenthesis");
      }
      
      const rparenToken = consume(); // Consume ')'
      expr.range = { from: lparenToken.from, to: rparenToken.to };
      return expr;
    }
    
    throw new SyntaxError("Expected identifier or '('");
  }
  
  try {
    // Start parsing
    return parseProgram();
  } catch (error) {
    throw error; // Re-throw the error
  }
}