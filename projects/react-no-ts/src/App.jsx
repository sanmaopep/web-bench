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