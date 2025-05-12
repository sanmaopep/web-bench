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
 * Manages the undo/redo stack for the editor
 */
export class EditorHistory {
    constructor(editor) {
        this.editor = editor;
        this.undoStack = [];
        this.redoStack = [];
        this.lastContent = editor.innerText;
        this.isPerformingUndoRedo = false;
        this.lastCursorPosition = 0;
        
        // Set up event listeners
        this.setupListeners();
    }
    
    setupListeners() {
        // Listen for content changes
        this.editor.addEventListener('input', () => {
            if (!this.isPerformingUndoRedo) {
                const currentContent = this.editor.innerText;
                const cursorPosition = this.getCursorPosition();
                
                // Only push to stack if content actually changed
                if (currentContent !== this.lastContent) {
                    this.undoStack.push({
                        content: this.lastContent,
                        cursorPosition: this.lastCursorPosition
                    });
                    this.redoStack = []; // Clear redo stack on new changes
                    this.lastContent = currentContent;
                    this.lastCursorPosition = cursorPosition;
                }
            }
        });
        
        // Track cursor position on selection changes
        document.addEventListener('selectionchange', () => {
            if (document.activeElement === this.editor && !this.isPerformingUndoRedo) {
                this.lastCursorPosition = this.getCursorPosition();
            }
        });
        
        // Listen for keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Check if the editor is focused
            if (document.activeElement !== this.editor) return;
            
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modKey = isMac ? e.metaKey : e.ctrlKey;
            
            // Undo: Cmd+Z (Mac) or Ctrl+Z (Windows)
            if (modKey && e.key.toLowerCase() === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            }
            
            // Redo: Cmd+Y (Mac) or Ctrl+Y (Windows)
            // Some Mac apps also use Cmd+Shift+Z, so we'll support both
            if ((modKey && e.key.toLowerCase() === 'y') || 
                (isMac && modKey && e.key.toLowerCase() === 'z' && e.shiftKey)) {
                e.preventDefault();
                this.redo();
            }
        });
    }
    
    getCursorPosition() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return 0;
        
        const range = selection.getRangeAt(0);
        if (!this.editor.contains(range.commonAncestorContainer)) return 0;
        
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(this.editor);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
    }
    
    setCursorPosition(position) {
        // Find the text node and offset for the position
        const nodeInfo = this.findNodeAndOffsetAtPosition(this.editor, position);
        if (!nodeInfo) return;
        
        const selection = window.getSelection();
        const range = document.createRange();
        range.setStart(nodeInfo.node, nodeInfo.offset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    findNodeAndOffsetAtPosition(root, targetOffset) {
        if (targetOffset === 0) {
            // Special case for position 0
            if (root.firstChild) {
                if (root.firstChild.nodeType === Node.TEXT_NODE) {
                    return { node: root.firstChild, offset: 0 };
                } else {
                    return { node: root, offset: 0 };
                }
            }
            return { node: root, offset: 0 };
        }
        
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
        
        // If we didn't find the exact position, return the last possible position
        if (root.lastChild && root.lastChild.nodeType === Node.TEXT_NODE) {
            return {
                node: root.lastChild,
                offset: root.lastChild.textContent.length
            };
        }
        return { node: root, offset: root.childNodes.length };
    }
    
    undo() {
        if (this.undoStack.length > 0) {
            const currentContent = this.editor.innerText;
            const cursorPosition = this.getCursorPosition();
            
            this.redoStack.push({
                content: currentContent,
                cursorPosition: cursorPosition
            });
            
            const previousState = this.undoStack.pop();
            this.isPerformingUndoRedo = true;
            this.editor.innerText = previousState.content;
            this.lastContent = previousState.content;
            this.isPerformingUndoRedo = false;
            
            // Set the cursor position to where it was before
            this.setCursorPosition(previousState.cursorPosition);
            this.lastCursorPosition = previousState.cursorPosition;
            
            // Trigger input event to ensure highlighting and other features update
            this.editor.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    
    redo() {
        if (this.redoStack.length > 0) {
            const currentContent = this.editor.innerText;
            const cursorPosition = this.getCursorPosition();
            
            this.undoStack.push({
                content: currentContent,
                cursorPosition: cursorPosition
            });
            
            const nextState = this.redoStack.pop();
            this.isPerformingUndoRedo = true;
            this.editor.innerText = nextState.content;
            this.lastContent = nextState.content;
            this.isPerformingUndoRedo = false;
            
            // Set the cursor position to where it was
            this.setCursorPosition(nextState.cursorPosition);
            this.lastCursorPosition = nextState.cursorPosition;
            
            // Trigger input event to ensure highlighting and other features update
            this.editor.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
}