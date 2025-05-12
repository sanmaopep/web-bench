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

// test.ts

import { MockMethod } from 'vite-plugin-mock'

const initialBlogs = [
  { title: 'Morning', detail: 'Morning My Friends' },
  { title: 'Travel', detail: 'I love traveling!' },
  { title: 'API Blog', detail: 'This is a blog fetched from API' },
]

export default [
  {
    url: '/api/blogs',
    method: 'get',
    timeout: 500,
    response: () => {
      return {
        blogs: initialBlogs,
      }
    },
  },
  {
    url: '/api/login',
    method: 'post',
    timeout: 500,
    response: (req) => {
      const { username, password } = req.body

      if (username === 'user1' && password === '123456') {
        return {
          success: true,
        }
      }

      if (username === 'user2' && password === '123456') {
        return {
          success: true,
        }
      }

      if (username === 'user3' && password === '123456') {
        return {
          success: true,
        }
      }

      if (username === 'user4' && password === '123456') {
        return {
          success: true,
        }
      }

      return {
        success: false,
      }
    },
  },
  {
    url: '/api/search_blogs',
    method: 'get',
    timeout: 200,
    response: (req) => {
      const { keywords } = req.query

      if (!keywords) {
        return {
          blogs: initialBlogs,
        }
      }

      return {
        blogs: [
          {
            title: `Mock_${keywords}`,
            detail: `Mock Search ${keywords} Detail`,
          },
        ],
      }
    },
  },
] as MockMethod[]
