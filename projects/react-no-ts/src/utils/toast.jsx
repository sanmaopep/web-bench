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