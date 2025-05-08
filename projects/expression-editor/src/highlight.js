// Import tokenizer from parser
import { tokenize } from './parser.js';
import { lint } from './lint.js';

/**
 * Applies syntax highlighting to editor content
 * @param {string} content - Editor content to highlight
 * @param {HTMLElement} editorElement - DOM element of the editor
 * @param {number} cursorPosition - Current cursor position to maintain
 */
function highlightContent(content, editorElement, cursorPosition) {
    // Get tokens from parser
    const tokens = tokenize(content);
    
    // Get diagnostics from linter
    const parsedProgram = { source: content, body: [] };
    const diagnostics = lint(parsedProgram);
    
    // Clear existing content
    editorElement.innerHTML = '';
    
    // Track current position for cursor restoration
    let currentPosition = 0;
    let lastPosition = 0;
    
    // Create highlighted content
    tokens.forEach(token => {
        // Add any skipped whitespace/newlines before the token
        if (token.from > lastPosition) {
            const whitespace = content.substring(lastPosition, token.from);
            const span = document.createElement('span');
            span.textContent = whitespace;
            
            // Store position data for cursor restoration
            span.dataset.start = currentPosition;
            span.dataset.end = currentPosition + whitespace.length;
            currentPosition += whitespace.length;
            
            editorElement.appendChild(span);
        }
        
        // Add the token with highlighting
        const span = document.createElement('span');
        const tokenValue = token.value || content.substring(token.from, token.to);
        span.textContent = tokenValue;
        
        // Apply highlighting based on token type
        switch(token.type) {
            case 'identifier':
                span.style.color = '#0000ff';
                break;
            case 'operator':
                span.style.color = '#00ff00';
                break;
        }
        
        // Store position data for cursor restoration
        span.dataset.start = currentPosition;
        span.dataset.end = currentPosition + tokenValue.length;
        currentPosition += tokenValue.length;
        
        // Check if this token has diagnostics
        for (const diagnostic of diagnostics) {
            if (token.from === diagnostic.range.from && token.to === diagnostic.range.to) {
                span.style.borderBottom = '1px solid #ff0000';
                span.classList.add('diagnostic-error');
                span.dataset.diagnosticMessage = diagnostic.message;
                span.title = diagnostic.message;
            }
        }
        
        editorElement.appendChild(span);
        lastPosition = token.to;
    });
    
    // Add any remaining whitespace/newlines after the last token
    if (lastPosition < content.length) {
        const whitespace = content.substring(lastPosition);
        const span = document.createElement('span');
        span.textContent = whitespace;
        
        span.dataset.start = currentPosition;
        span.dataset.end = currentPosition + whitespace.length;
        
        editorElement.appendChild(span);
    }
    
    // Restore cursor position
    restoreCursor(editorElement, cursorPosition);
}

/**
 * Restores cursor to the correct position after highlighting
 * @param {HTMLElement} editorElement - Editor element
 * @param {number} position - Target cursor position
 */
function restoreCursor(editorElement, position) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    // Find the correct text node and offset
    let currentPos = 0;
    let targetNode = null;
    let targetOffset = 0;
    
    for (const span of editorElement.children) {
        const start = parseInt(span.dataset.start);
        const end = parseInt(span.dataset.end);
        
        if (position >= start && position <= end) {
            targetNode = span.firstChild;
            targetOffset = position - start;
            break;
        }
    }
    
    if (targetNode) {
        range.setStart(targetNode, targetOffset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

/**
 * Sets up syntax highlighting for the editor
 * @param {HTMLElement} editor - The editor element to set up highlighting for
 */
function setupEditorHighlighting(editor) {
    editor.addEventListener('input', (e) => {
        const content = editor.innerText;
        const cursorPosition = getCaretPosition(editor);
        
        // Apply highlighting while preserving cursor
        highlightContent(content, editor, cursorPosition);
    });
}

// Helper function to get cursor position
function getCaretPosition(element) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return 0;
    
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
}

export { setupEditorHighlighting };