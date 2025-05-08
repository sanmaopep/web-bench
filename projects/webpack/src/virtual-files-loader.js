const glob = require('glob');
const path = require('path');
const fs = require('fs');

module.exports = function(options) {
  const files = glob.sync(options.pattern);
  
  const imports = files.map(file => {
    const relativePath = path.relative(path.dirname(options.pattern), file);
    const moduleName = path.basename(relativePath, '.ts');
    const content = fs.readFileSync(file, 'utf-8');
    
    return `  "${moduleName}": require("${file}")`;
  });

  const code = `
module.exports = {
${imports.join(',\n')}
}`;

  return {
    code,
    dependencies: files
  };
}; 