import { create } from 'zustand'
import useUserStore from './user'

interface Blog {
  title: string;
  detail: string;
  author?: string;
}

interface BlogStore {
  blogs: Array<Blog>
  filteredBlogs: Array<Blog>
  selectedBlogIndex: number
  setSelectedBlogIndex: (index: number) => void
  formVisible: boolean
  setFormVisible: (visible: boolean) => void
  isLoading: boolean
  isEditing: boolean
  setEditing: (editing: boolean) => void
  fetchBlogs: () => Promise<void>
  fetchSearchBlogs: (keywords: string) => Promise<void>
  addBlog: (blog: Blog) => void
  bulkAddBlogs: (blogs: Array<Blog>) => void
  updateBlog: (index: number, blog: Blog) => void
  deleteBlog: (index: number) => void
}

const useBlogStore = create<BlogStore>((set) => ({
  blogs: [
    { title: 'Morning', detail: 'Morning My Friends', author: 'Alice' },
    { title: 'Travel', detail: 'I love traveling!', author: 'Bob' }
  ],
  filteredBlogs: [],
  selectedBlogIndex: 0,
  setSelectedBlogIndex: (index) => set({ selectedBlogIndex: index }),
  formVisible: false,
  setFormVisible: (visible) => set({ formVisible: visible }),
  isLoading: false,
  isEditing: false,
  setEditing: (editing) => set({ isEditing: editing }),
  fetchBlogs: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/blogs')
      const data = await response.json()
      set({ blogs: data.blogs, isLoading: false })
    } catch (error) {
      console.error('Fetch error:', error)
      set({ isLoading: false })
    }
  },
  fetchSearchBlogs: async (keywords) => {
    if (!keywords) {
      set({ filteredBlogs: [] })
      return
    }
    try {
      const response = await fetch(`/api/search_blogs?keywords=${encodeURIComponent(keywords)}`)
      const data = await response.json()
      set({ filteredBlogs: data.blogs })
    } catch (error) {
      console.error('Search error:', error)
    }
  },
  addBlog: (blog) => set((state) => {
    const username = useUserStore.getState().username;
    const newBlog = {
      ...blog,
      author: username || undefined
    };
    return {
      blogs: [...state.blogs, newBlog],
      selectedBlogIndex: state.blogs.length
    };
  }),
  bulkAddBlogs: (newBlogs) => set((state) => ({
    blogs: [...state.blogs, ...newBlogs],
    selectedBlogIndex: state.blogs.length + newBlogs.length - 1
  })),
  updateBlog: (index, blog) => set((state) => {
    const currentAuthor = state.blogs[index]?.author;
    const updatedBlog = {
      ...blog,
      author: currentAuthor
    };
    return {
      blogs: state.blogs.map((b, i) => i === index ? updatedBlog : b)
    };
  }),
  deleteBlog: (index) => set((state) => {
    const newBlogs = state.blogs.filter((_, i) => i !== index)
    return {
      blogs: newBlogs,
      selectedBlogIndex: newBlogs.length > 0 ? 0 : -1
    }
  })
}))

export default useBlogStore