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
 * Sets up autocompletion for the editor
 * @param {HTMLElement} editor - The editor element
 */
export function setupAutocompletion(editor) {
    // Create autocomplete popup
    const autocompletePopup = document.createElement('div');
    autocompletePopup.className = 'autocomplete-popup';
    autocompletePopup.style.position = 'absolute';
    autocompletePopup.style.backgroundColor = 'white';
    autocompletePopup.style.border = '1px solid #ccc';
    autocompletePopup.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    autocompletePopup.style.zIndex = '1000';
    autocompletePopup.style.maxHeight = '150px';
    autocompletePopup.style.overflowY = 'auto';
    autocompletePopup.style.display = 'none';
    document.body.appendChild(autocompletePopup);

    // Available completions
    const completions = {
        variables: ['foo', 'fooooo', 'bar', 'barrrr'],
        operators: ['AND', 'OR']
    };

    // Track cursor position and word being typed
    let currentWord = '';
    let wordStartPos = 0;

    // Track the last input position
    let lastInputNode = null;
    let lastInputOffset = 0;

    // Listen for input events to trigger autocomplete
    editor.addEventListener('input', handleInput);
    editor.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleDocumentClick);

    function handleInput(e) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const cursorPosition = range.startOffset;
        const currentNode = range.startContainer;

        if (currentNode.nodeType !== Node.TEXT_NODE) {
            hideAutocomplete();
            return;
        }

        // Store the current node for later use
        lastInputNode = currentNode;
        lastInputOffset = cursorPosition;

        const textBeforeCursor = currentNode.textContent.substring(0, cursorPosition);
        
        // Find word being typed
        const wordMatch = textBeforeCursor.match(/[a-zA-Z0-9_]*$/);
        if (wordMatch) {
            currentWord = wordMatch[0];
            wordStartPos = cursorPosition - currentWord.length;
            
            if (currentWord.length > 0) {
                const suggestions = getSuggestions(currentWord);
                if (suggestions.length > 0) {
                    showSuggestions(suggestions);
                } else {
                    hideAutocomplete();
                }
            } else {
                hideAutocomplete();
            }
        } else {
            hideAutocomplete();
        }
    }

    function handleKeyDown(e) {
        if (!autocompletePopup.style.display || autocompletePopup.style.display === 'none') {
            return;
        }

        const items = autocompletePopup.querySelectorAll('.autocomplete-item');
        const activeItem = autocompletePopup.querySelector('.autocomplete-item.active');
        let activeIndex = -1;

        if (activeItem) {
            for (let i = 0; i < items.length; i++) {
                if (items[i] === activeItem) {
                    activeIndex = i;
                    break;
                }
            }
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (items.length > 0) {
                    if (activeItem) activeItem.classList.remove('active');
                    // Loop from last to first
                    activeIndex = (activeIndex + 1) % items.length;
                    items[activeIndex].classList.add('active');
                    items[activeIndex].scrollIntoView({ block: 'nearest' });
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (items.length > 0) {
                    if (activeItem) activeItem.classList.remove('active');
                    // Loop from first to last
                    activeIndex = (activeIndex - 1 + items.length) % items.length;
                    items[activeIndex].classList.add('active');
                    items[activeIndex].scrollIntoView({ block: 'nearest' });
                }
                break;
            case 'Enter':
            case 'Tab':
                if (activeItem) {
                    e.preventDefault();
                    insertCompletion(activeItem.textContent);
                }
                break;
            case 'Escape':
                e.preventDefault();
                hideAutocomplete();
                break;
        }
    }

    function handleDocumentClick(e) {
        // Hide autocomplete when clicking outside the editor
        if (e.target !== editor && !autocompletePopup.contains(e.target)) {
            hideAutocomplete();
        }
    }

    function getSuggestions(prefix) {
        const normalizedPrefix = prefix.toLowerCase();
        const suggestions = [];

        // Check variables
        for (const variable of completions.variables) {
            if (variable.toLowerCase().startsWith(normalizedPrefix)) {
                suggestions.push(variable);
            }
        }

        // Check operators
        for (const operator of completions.operators) {
            if (operator.toLowerCase().startsWith(normalizedPrefix)) {
                suggestions.push(operator);
            }
        }

        return suggestions;
    }

    function showSuggestions(suggestions) {
        autocompletePopup.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = suggestion;
            item.style.padding = '5px 10px';
            item.style.cursor = 'pointer';
            
            item.addEventListener('mouseenter', () => {
                const activeItem = autocompletePopup.querySelector('.autocomplete-item.active');
                if (activeItem) activeItem.classList.remove('active');
                item.classList.add('active');
            });
            
            item.addEventListener('click', () => {
                insertCompletion(suggestion);
            });
            
            autocompletePopup.appendChild(item);
        });

        // Set the first item as active
        const firstItem = autocompletePopup.querySelector('.autocomplete-item');
        if (firstItem) {
            firstItem.classList.add('active');
        }

        // Position the popup
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        autocompletePopup.style.top = `${rect.bottom + window.scrollY}px`;
        autocompletePopup.style.left = `${rect.left + window.scrollX}px`;
        autocompletePopup.style.display = 'block';
    }

    function hideAutocomplete() {
        autocompletePopup.style.display = 'none';
    }

    function insertCompletion(completion) {
        const selection = window.getSelection();
        if (!selection.rangeCount || !lastInputNode) return;

        // Focus the editor to ensure the command works
        editor.focus();
        
        // Create a range for the word to replace
        const range = document.createRange();
        range.setStart(lastInputNode, wordStartPos);
        range.setEnd(lastInputNode, wordStartPos + currentWord.length);
        
        // Select the range
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Replace the selection with completion
        document.execCommand('insertText', false, completion);
        
        hideAutocomplete();
    }

    // Helper function to find text node and offset at a given position
    function findNodeAndOffsetAtPosition(root, targetOffset) {
        let currentOffset = 0;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        
        let node = walker.nextNode();
        while (node) {
            const nodeLength = node.textContent.length;
            if (currentOffset + nodeLength >= targetOffset) {
                return {
                    node: node,
                    offset: targetOffset - currentOffset
                };
            }
            currentOffset += nodeLength;
            node = walker.nextNode();
        }
        return null;
    }

    // Add some basic styling for active items
    const style = document.createElement('style');
    style.textContent = `
        .autocomplete-item.active {
            background-color: #f0f0f0;
        }
    `;
    document.head.appendChild(style);
}