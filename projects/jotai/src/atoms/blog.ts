import { atom } from 'jotai'
import {userAtom} from './user'

export interface Blog {
  title: string
  detail: string
  author?: string
  gameHistory?: string
}

export const blogListAtom = atom<Blog[]>([])
export const blogAtom = atom((get) => get(blogListAtom))
export const selectedBlogAtom = atom<number>(0)
export const formVisibleAtom = atom<boolean>(false)
export const loadingAtom = atom<boolean>(false)
export const editBlogAtom = atom<number | null>(null)
export const searchKeywordsAtom = atom('')
export const filteredBlogsAtom = atom<Blog[]>([])
export const selectedBlogInfoAtom = atom((get) => {
  const selectedBlog = get(selectedBlogAtom)
  const blogList = get(searchKeywordsAtom) ? get(filteredBlogsAtom) : get(blogListAtom)
  return blogList[selectedBlog]
})
export const blogsAsyncAtom = atom(null, async (get, set) => {
  set(loadingAtom, true)
  const response = await fetch('/api/blogs')
  const data = await response.json()
  set(blogListAtom, data.blogs)
  set(loadingAtom, false)
})
export const fetchFilteredBlogsAtom = atom(null, async (get, set, keywords: string) => {
  if (keywords) {
    const response = await fetch(`/api/search_blogs?keywords=${encodeURIComponent(keywords)}`)
    const data = await response.json()
    set(filteredBlogsAtom, data.blogs)
    set(selectedBlogAtom, 0)
  } else {
    set(filteredBlogsAtom, [])
  }
})

export const appendManyBlogsAtom = atom(null, (get, set) => {
  const currentBlogs = get(blogListAtom)
  const newBlogs: Blog[] = Array(100000).fill(null).map(() => ({
    title: `RandomBlog-${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
    detail: 'Auto-generated blog post'
  }))
  
  set(blogListAtom, [...currentBlogs, ...newBlogs])
})

export const shareGameToBlogAtom = atom(null, (get, set, payload: { title: string, description: string, gameHistory: string }) => {
  const { title, description, gameHistory } = payload;
  const currentBlogs = get(blogListAtom);
  const user = get(userAtom);
  
  const newBlog: Blog = {
    title,
    detail: description,
    author: user.isLoggedIn ? user.username : 'Anonymous',
    gameHistory
  };
  
  set(blogListAtom, [newBlog, ...currentBlogs]);
})