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

// DO NOT use any library or framework.

import { setupEditorHighlighting } from './highlight.js';
import { parse } from './parser.js';
import { evaluate } from './evaluate.js';
import { setupAutocompletion } from './autocomplete.js';
import { EditorHistory } from './editor.js';

// Create a contenteditable editor
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.id = 'toolbar';
    toolbar.style.display = 'flex';
    toolbar.style.justifyContent = 'space-between';
    toolbar.style.padding = '10px';
    toolbar.style.marginTop = '20px';
    toolbar.style.border = '1px solid #ccc';
    toolbar.style.borderBottom = 'none';
    
    // Create left side of toolbar for Run button
    const leftToolbar = document.createElement('div');
    
    // Create Run button
    const runButton = document.createElement('button');
    runButton.textContent = 'Run';
    runButton.style.padding = '5px 10px';
    runButton.style.cursor = 'pointer';
    runButton.style.marginRight = '10px';
    leftToolbar.appendChild(runButton);
    
    // Create right side of toolbar
    const rightToolbar = document.createElement('div');
    
    // Create uppercase button
    const uppercaseButton = document.createElement('button');
    uppercaseButton.textContent = 'Uppercase';
    uppercaseButton.style.padding = '5px 10px';
    uppercaseButton.style.cursor = 'pointer';
    uppercaseButton.style.marginRight = '10px';
    rightToolbar.appendChild(uppercaseButton);
    
    // Create insert snippet button
    const snippetButton = document.createElement('button');
    snippetButton.textContent = 'Insert Snippet';
    snippetButton.style.padding = '5px 10px';
    snippetButton.style.cursor = 'pointer';
    snippetButton.style.marginRight = '10px';
    rightToolbar.appendChild(snippetButton);
    
    // Create documentation button
    const docButton = document.createElement('button');
    docButton.textContent = 'Documentation';
    docButton.style.padding = '5px 10px';
    docButton.style.cursor = 'pointer';
    rightToolbar.appendChild(docButton);
    
    // Add both sides to toolbar
    toolbar.appendChild(leftToolbar);
    toolbar.appendChild(rightToolbar);
    
    // Create editor element
    const editor = document.createElement('div');
    editor.id = 'editor';
    editor.contentEditable = 'true';
    editor.style.fontFamily = 'Menlo, Monaco, "Courier New", monospace';
    editor.style.minHeight = '100px';
    editor.style.padding = '10px';
    editor.style.border = '1px solid #ccc';
    editor.style.margin = '0 0 20px 0';
    editor.style.boxSizing = 'border-box';
    editor.style.height = 'auto';
    editor.style.overflow = 'auto';
    
    // Create result display element
    const resultDisplay = document.createElement('div');
    resultDisplay.id = 'result-display';
    resultDisplay.style.padding = '10px';
    resultDisplay.style.border = '1px solid #ccc';
    resultDisplay.style.marginTop = '5px';
    resultDisplay.style.display = 'none';
    
    // Create syntax error message element
    const errorMessage = document.createElement('div');
    errorMessage.id = 'syntax-error';
    errorMessage.style.backgroundColor = '#ffcccc';
    errorMessage.style.color = '#cc0000';
    errorMessage.style.padding = '10px';
    errorMessage.style.border = '1px solid #cc0000';
    errorMessage.style.marginTop = '5px';
    errorMessage.style.display = 'none';
    errorMessage.textContent = 'Syntax Error';
    
    // Create popup
    const popup = document.createElement('div');
    popup.id = 'documentation-popup';
    popup.style.display = 'none';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '1000';
    popup.style.minWidth = '300px';
    
    // Create popup title
    const popupTitle = document.createElement('h2');
    popupTitle.textContent = 'Document';
    popup.appendChild(popupTitle);
    
    // Create popup content
    const popupContent = document.createElement('p');
    popupContent.textContent = 'WIP';
    popup.appendChild(popupContent);
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    popup.appendChild(closeButton);
    
    // Create tooltip element for diagnostics
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
    
    // Add event listeners
    docButton.addEventListener('click', () => {
        popup.style.display = 'block';
    });
    
    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });
    
    // Add run functionality
    runButton.addEventListener('click', () => {
        const content = editor.innerText.trim();
        const result = evaluate(content);
        
        // Display the result
        resultDisplay.style.display = 'block';
        resultDisplay.textContent = result === null ? "null" : result.toString();
        
        // Style based on result
        if (result === true) {
            resultDisplay.style.backgroundColor = '#e6ffe6';
            resultDisplay.style.color = '#006600';
        } else if (result === false) {
            resultDisplay.style.backgroundColor = '#fff0e6';
            resultDisplay.style.color = '#cc6600';
        } else {
            resultDisplay.style.backgroundColor = '#f2f2f2';
            resultDisplay.style.color = '#666666';
        }
    });
    
    // Add uppercase functionality
    uppercaseButton.addEventListener('click', () => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = selection.toString();
            const uppercaseText = selectedText.toUpperCase();
            
            range.deleteContents();
            range.insertNode(document.createTextNode(uppercaseText));
        }
    });
    
    // Add insert snippet functionality
    snippetButton.addEventListener('click', () => {
        const snippetText = "true OR false";
        const selection = window.getSelection();
        let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        
        // If editor is not focused, focus it and move cursor to the end
        if (!editor.contains(selection.focusNode)) {
            editor.focus();
            range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        
        // Insert the snippet at cursor position or replace selected text
        document.execCommand('insertText', false, snippetText);
        
        // Select the newly inserted text
        const currentPos = selection.focusOffset;
        const newStartPos = currentPos - snippetText.length;
        
        range = selection.getRangeAt(0);
        range.setStart(selection.focusNode, newStartPos);
        range.setEnd(selection.focusNode, currentPos);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Keep the editor focused
        editor.focus();
    });
    
    // Add parenthesis auto-closing functionality
    editor.addEventListener('input', function(event) {
        if (event.inputType === 'insertText' && event.data === '(') {
            // Get the current selection
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            
            // Insert the closing parenthesis
            document.execCommand('insertText', false, ')');
            
            // Move the cursor back between the parentheses
            range.setStart(range.startContainer, range.startOffset - 1);
            range.setEnd(range.startContainer, range.startOffset - 1);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        
        // Validate syntax
        validateSyntax();
    });
    
    // Add diagnostic tooltip functionality
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('diagnostic-error')) {
            const message = e.target.dataset.diagnosticMessage;
            if (message) {
                tooltip.textContent = message;
                tooltip.style.display = 'block';
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.bottom + 5) + 'px';
            }
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('diagnostic-error')) {
            tooltip.style.display = 'none';
        }
    });
    
    // Function to validate syntax
    function validateSyntax() {
        const content = editor.innerText.trim();
        
        if (content) {
            try {
                parse(content);
                errorMessage.style.display = 'none';
            } catch (error) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = `Syntax Error: ${error.message}`;
            }
        } else {
            errorMessage.style.display = 'none';
        }
    }
    
    // Add to DOM
    app.appendChild(toolbar);
    app.appendChild(editor);
    app.appendChild(resultDisplay);
    app.appendChild(errorMessage);
    app.appendChild(popup);

    setupEditorHighlighting(editor);
    setupAutocompletion(editor);
    
    // Initialize undo/redo functionality
    const history = new EditorHistory(editor);
    
    // Add event listener for initial validation
    editor.addEventListener('blur', validateSyntax);
});