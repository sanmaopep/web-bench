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

function useMarkdown() {
  const convertMarkdown = (text) => {
    // Escape HTML special characters to prevent XSS
    text = text.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));

    // Headers
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    text = text.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    text = text.replace(/^###### (.*$)/gm, '<h6>$1</h6>');

    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code blocks
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');

    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images
    text = text.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // Unordered lists
    text = text.replace(/^\s*\*\s(.*$)/gm, '<ul><li>$1</li></ul>');
    text = text.replace(/<\/ul>\n<ul>/g, ''); // Merge adjacent lists

    // Ordered lists
    text = text.replace(/^\s*\d+\.\s(.*$)/gm, '<ol><li>$1</li></ol>');
    text = text.replace(/<\/ol>\n<ol>/g, ''); // Merge adjacent lists

    // Blockquotes
    text = text.replace(/^>\s(.*$)/gm, '<blockquote>$1</blockquote>');

    // Horizontal rule
    text = text.replace(/^\s*---\s*$/gm, '<hr />');

    // Paragraphs
    text = text.replace(/(\n\n|\r\r|\r\n\r\n)/g, '</p><p>');
    text = `<p>${text}</p>`;

    return text;
  };

  return { convertMarkdown };
}

export default useMarkdown;