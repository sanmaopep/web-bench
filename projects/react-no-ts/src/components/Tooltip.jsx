import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function Tooltip({ children, text }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const childRef = useRef(null);

  const updatePosition = () => {
    if (childRef.current) {
      const rect = childRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX + (rect.width / 2)
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        updatePosition();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isVisible]);

  const handleMouseEnter = () => {
    setIsVisible(true);
    updatePosition();
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: childRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      })}
      {isVisible && createPortal(
        <div
          className="tooltip"
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '14px',
            zIndex: 10000,
            whiteSpace: 'nowrap'
          }}
        >
          {text}
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderBottom: '4px solid rgba(0, 0, 0, 0.8)'
          }} />
        </div>,
        document.body
      )}
    </>
  );
}

export default Tooltip;