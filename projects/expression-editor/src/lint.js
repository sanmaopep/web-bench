/**
 * Lints the given program for operator capitalization issues
 * @param {Object} program - The parsed program AST
 * @returns {Array} - Array of diagnostic objects
 */
export function lint(program) {
  const diagnostics = [];
  
  // Process tokens for logical operators and check capitalization
  const tokens = tokenize(program.source);
  
  for (const token of tokens) {
    if (token.type === 'operator') {
      const opText = token.value.toLowerCase();
      if (opText === 'and' || opText === 'or') {
        // Check if operator is uppercase in the original source
        const originalOp = token.value;
        const correctOp = opText.toUpperCase();
        
        // If the operator is not in uppercase, report an error
        if (originalOp !== correctOp) {
          diagnostics.push({
            range: {
              from: token.from,
              to: token.to
            },
            level: 'error',
            message: `Operator should be uppercase. Use ${correctOp} instead of ${originalOp}.`
          });
        }
      }
    }
  }
  
  return diagnostics;
}

// Helper function to get tokens
function tokenize(source) {
  // Import would create circular dependency
  // Use simplified tokenizer for operators only
  const tokens = [];
  let pos = 0;
  
  while (pos < source.length) {
    // Skip whitespace
    if (/\s/.test(source[pos])) {
      pos++;
      continue;
    }
    
    // Match operators (case insensitive)
    const andMatch = source.substring(pos).match(/^(AND|and|And)/i);
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
    
    const orMatch = source.substring(pos).match(/^(OR|or|Or)/i);
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
    
    // Skip other characters
    pos++;
  }
  
  return tokens;
}