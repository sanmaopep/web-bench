import { makeAutoObservable, action, runInAction } from 'mobx'

interface Blog {
  title: string
  detail: string
  author?: string
}

class BlogStore {
  blogs: Blog[] = [
    { title: 'Morning', detail: 'Morning My Friends', author: 'Admin' },
    { title: 'Travel', detail: 'I love traveling!', author: 'Admin' }
  ]
  filteredBlogs: Blog[] = []
  selectedBlogIndex = 0
  formVisible = false
  isLoading = false
  editMode = false

  constructor() {
    makeAutoObservable(this)
  }

  selectBlog(index: number) {
    this.selectedBlogIndex = index
  }

  toggleForm() {
    this.formVisible = !this.formVisible
  }

  setEditMode(mode: boolean) {
    this.editMode = mode
  }

  setFilteredBlogs(blogs: Blog[]) {
    this.filteredBlogs = blogs
  }

  addBlog = action((blog: Blog) => {
    this.blogs.push(blog)
  })

  updateBlog = action((index: number, blog: Blog) => {
    this.blogs[index] = blog
  })

  addManyBlogs = action((count: number) => {
    // Use setTimeout to not block the UI
    setTimeout(() => {
      const newBlogs = [];
      for (let i = 0; i < count; i++) {
        const randomDigits = Math.floor(Math.random() * 1000000000000)
          .toString()
          .padStart(12, '0');
        newBlogs.push({
          title: `RandomBlog-${randomDigits}`,
          detail: `This is a random blog ${i + 1}`,
          author: 'System'
        });
      }
      
      // Use runInAction to batch the updates
      runInAction(() => {
        this.blogs = [...this.blogs, ...newBlogs];
      });
    }, 0);
  })

  async fetchBlogs() {
    this.isLoading = true
    try {
      const response = await fetch('/api/blogs')
      const data = await response.json()
      this.blogs = data.blogs
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
    } finally {
      this.isLoading = false
    }
  }

  async searchBlogs(keywords: string) {
    try {
      const response = await fetch(`/api/search_blogs?keywords=${encodeURIComponent(keywords)}`)
      const data = await response.json()
      this.setFilteredBlogs(data.blogs)
      this.selectedBlogIndex = 0
    } catch (error) {
      console.error('Failed to search blogs:', error)
    }
  }

  get selectedBlog() {
    return (this.filteredBlogs.length > 0 ? this.filteredBlogs[this.selectedBlogIndex] : this.blogs[this.selectedBlogIndex]) || null
  }
}

const blogStore = new BlogStore()
export default blogStore