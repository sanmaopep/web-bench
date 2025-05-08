import React, { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Main from './components/Main'
import BlogForm from './components/BlogForm'
import { FocusProvider } from './context/FocusContext'

function App({ navigate }) {
  const [isFormVisible, setIsFormVisible] = useState(false)

  return (
    <FocusProvider>
      <div className="App">
        <Header onAddClick={() => setIsFormVisible(true)} navigate={navigate} />
        <Main />
        <BlogForm 
          isVisible={isFormVisible}
          onClose={() => setIsFormVisible(false)}
        />
      </div>
    </FocusProvider>
  )
}

export default App