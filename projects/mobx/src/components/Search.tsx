import React from 'react'
import { observer } from 'mobx-react-lite'
import blogStore from '../stores/blog'

const Search = observer(() => {
  const [keywords, setKeywords] = React.useState('')
  const [timer, setTimer] = React.useState<NodeJS.Timeout>()

  const handleSearch = (value: string) => {
    if (value.trim() === '') {
      blogStore.setFilteredBlogs([])
      return
    }
    blogStore.searchBlogs(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setKeywords(value)
    
    if (timer) {
      clearTimeout(timer)
    }
    
    const newTimer = setTimeout(() => {
      handleSearch(value)
    }, 300)
    
    setTimer(newTimer)
  }

  React.useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [timer])

  return (
    <div style={{ width: '200px', boxSizing: 'border-box', padding: '10px' }}>
      <input
        type="text"
        placeholder="Search Blogs"
        value={keywords}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />
    </div>
  )
})

export default Search