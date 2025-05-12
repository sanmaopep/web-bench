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

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

let activeTimer = null;
let activeToast = null;

export function showToast(message, styles = {}) {
  if (activeTimer) {
    clearTimeout(activeTimer);
    if (activeToast) {
      document.body.removeChild(activeToast);
    }
  }

  const toastElement = document.createElement('div');
  document.body.appendChild(toastElement);
  activeToast = toastElement;

  const ToastContent = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      activeTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          if (document.body.contains(activeToast)) {
            document.body.removeChild(activeToast);
            activeToast = null;
          }
        }, 300);
      }, 2000);

      return () => {
        if (activeTimer) {
          clearTimeout(activeTimer);
        }
      };
    }, []);

    return (
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          fontSize: styles.fontSize || '12px',
          zIndex: 10000,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 300ms ease-in-out',
          pointerEvents: 'none',
          ...styles
        }}
      >
        {message}
      </div>
    );
  };

  ReactDOM.createRoot(toastElement).render(<ToastContent />);
}