import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
  text: string;
  children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const childRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (childRef.current) {
        const rect = childRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + rect.width / 2 + window.scrollX,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  const tooltipContent = (
    <div
      className="tooltip"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        backgroundColor: 'black',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        zIndex: 1000,
        display: isVisible ? 'block' : 'none',
      }}
    >
      {text}
    </div>
  );

  return (
    <>
      {React.cloneElement(children, {
        ref: childRef,
        onMouseEnter: () => setIsVisible(true),
        onMouseLeave: () => setIsVisible(false),
      })}
      {ReactDOM.createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;