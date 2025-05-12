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