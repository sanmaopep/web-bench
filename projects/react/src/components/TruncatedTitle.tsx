import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Tooltip from './Tooltip'

interface TruncatedTitleProps {
  title: string
  maxWidth?: number
}

const TruncatedTitle: React.FC<TruncatedTitleProps> = ({ title, maxWidth = 300 }) => {
  const [isTruncated, setIsTruncated] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const checkTruncation = () => {
      if (titleRef.current) {
        setIsTruncated(titleRef.current.scrollWidth > titleRef.current.clientWidth)
      }
    }

    checkTruncation()

    window.addEventListener('resize', checkTruncation)

    return () => {
      window.removeEventListener('resize', checkTruncation)
    }
  }, [title])

  const titleElement = (
    <div
      ref={titleRef}
      style={{
        maxWidth: `${maxWidth}px`,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {title}
    </div>
  )

  return isTruncated ? (
    <Tooltip text={title}>
      {/* Tooltip will hijack the ref of the first div */}
      <div>{titleElement}</div>
    </Tooltip>
  ) : (
    titleElement
  )
}

export default TruncatedTitle
