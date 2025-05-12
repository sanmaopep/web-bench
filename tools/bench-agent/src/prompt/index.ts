// Copyright (c) 2023-2024 Continue Dev, Inc.
// Copyright (c) 2025 Bytedance Ltd.
// SPDX-License-Identifier: Apache-2.0
//
// This file has been modified by Bytedance Ltd on SystemPrompt
//
// Original file was released under Apache-2.0, with the full license text
// available at https://github.com/continuedev/continue?tab=Apache-2.0-1-ov-file.
//
// This modified file is released under the same license.

export const getSystemMessage = () => {
  const rules = [
    `Always produce a single code block.`,
    `Never separate the code into multiple code blocks.`,
    `Only include the code that is being added.`,
    `No explanation, no issue, only code.`,
    `Never omit any code.`,
    `If the user submits a code block that contains a filename in the language specifier, always include the filename in any code block you generate based on that file. The filename should be on the next line as the language specifier in your code block.`,
    `Don't repeat filename in code block`,
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
