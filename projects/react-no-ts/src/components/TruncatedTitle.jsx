import React, { useRef, useState, useLayoutEffect } from 'react';
import Tooltip from './Tooltip';

function TruncatedTitle({ title, className = '', style = {} }) {
  const [isTruncated, setIsTruncated] = useState(false);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    if (titleRef.current) {
      setIsTruncated(titleRef.current.scrollWidth > 300);
    }
  }, [title]);

  const truncatedStyle = {
    maxWidth: '300px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ...style
  };

  const content = (
    <div
      ref={titleRef}
      className={className}
      style={truncatedStyle}
    >
      {title}
    </div>
  );

  if (!isTruncated) {
    return content;
  }

  return (
    <Tooltip text={title}>
      {/* Tooltip will hijack the ref of the first div */}
      <div>{content}</div>
    </Tooltip>
  );
}

export default React.memo(TruncatedTitle);