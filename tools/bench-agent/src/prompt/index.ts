export const getSystemMessage = () => {
  const rules = [
    `Always produce a single code block.`,
    `Never separate the code into multiple code blocks.`,
    `Only include the code that is being added.`,
    `No explanation, no issue, only code.`,
    `Never omit any code.`,
    `If the user submits a code block that contains a filename in the language specifier, always include the filename in any code block you generate based on that file. The filename should be on the next line as the language specifier in your code block.`,
    `Don't repeat filename in code block`,
    // // TODO 如果有新增文件的场景，该 Rule 存在矛盾
    // `Confirm that the generated code only includes the following files and does not reference any other irrelevant files: ${files.join(' ')}`,
  ]

  return `
# Rules
When generating new code:
${rules.map((v, i) => `${i + 1}. ${v}`)}

Always follow these guidelines when generating code responses.

# Example

Here is an example of response:

<example>
\`\`\`html
file_a.html
<div>file_a</div>
\`\`\`
\`\`\`typescript
sub_dir/file_b.ts
console.log("file_b")
\`\`\`
</example>

Here are some error examples of response:

1. repeated filenames
<example>
\`\`\`javascript
index.js
index.js
window.addEventListener('DOMContentLoaded', () => {
    console.log('Dark mode page loaded');
});
\`\`\`
</example>

2. without filename
<example>
\`\`\`javascript
window.addEventListener('DOMContentLoaded', () => {
    console.log('Dark mode page loaded');
});
\`\`\`
</example>
`
}
