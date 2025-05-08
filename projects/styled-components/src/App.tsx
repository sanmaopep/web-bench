import React, { useState } from 'react'
import { GlobalStyle } from './global.style'
import { Header } from './components/Header'
import { Main } from './components/Main'
import { Footer } from './components/Footer'
import { BlogProvider } from './context/BlogContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [currentPage, setCurrentPage] = useState('')

  return (
    <ThemeProvider>
      <BlogProvider>
        <GlobalStyle />
        <Header onPageChange={setCurrentPage} />
        <Main currentPage={currentPage} onPageChange={setCurrentPage} />
        <Footer />
      </BlogProvider>
    </ThemeProvider>
  )
}

export default App
