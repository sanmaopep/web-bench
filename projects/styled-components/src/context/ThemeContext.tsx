import React, { createContext, useContext, useState } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

interface ThemeContextType {
  theme: {
    headerBackground: string
    footerBackground: string
    markdownH1: string
    markdownH2: string
    markdownH3: string
    markdownH4: string
    buttonPrimary: string
    buttonSecondary: string
    buttonDanger: string
    toastBackground: string
  }
  updateTheme: (updates: Partial<ThemeContextType['theme']>) => void
}

const defaultTheme = {
  headerBackground: '#333',
  footerBackground: '#333',
  markdownH1: '#000000',
  markdownH2: '#333333',
  markdownH3: '#666666',
  markdownH4: '#999999',
  buttonPrimary: '#0064fa',
  buttonSecondary: '#0095ee',
  buttonDanger: '#d52515',
  toastBackground: '#4caf50',
}

export const currentThemeRef: { current: ThemeContextType['theme'] | null } = {
  current: null,
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  updateTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme)

  const updateTheme = (updates: Partial<ThemeContextType['theme']>) => {
    setTheme((prev) => ({ ...prev, ...updates }))
  }

  // Remember latest theme
  currentThemeRef.current = theme

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  )
}
