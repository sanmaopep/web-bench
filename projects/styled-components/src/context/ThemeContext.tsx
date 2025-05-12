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
