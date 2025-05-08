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