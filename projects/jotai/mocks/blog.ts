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
