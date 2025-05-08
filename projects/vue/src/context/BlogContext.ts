import { Ref, ref, reactive, provide, inject, InjectionKey } from 'vue'

interface Blog {
  title: string
  detail: string
}

interface BlogContext {
  showForm: Ref<boolean>
  isEditing: Ref<boolean>
  blogs: Blog[]
  selectedBlog: Ref<Blog>
  addBlog: (blog: Blog) => void
  updateBlog: (blog: Blog) => void
  selectBlog: (blog: Blog) => void
  checkDuplicateTitle: (title: string) => boolean
}

const BlogKey: InjectionKey<BlogContext> = Symbol('BlogContext')

export function useBlogProvider() {
  const showForm = ref(false)
  const isEditing = ref(false)

  const blogs = reactive<Blog[]>([
    { title: 'Morning', detail: 'Morning My Friends' },
    { title: 'Travel', detail: 'I love traveling!' },
  ])

  const selectedBlog = ref<Blog>(blogs[0])

  const addBlog = (blog: Blog) => {
    blogs.push(blog)
    selectedBlog.value = blog
  }

  const updateBlog = (updatedBlog: Blog) => {
    const index = blogs.findIndex((blog) => blog.title === selectedBlog.value.title)
    if (index !== -1) {
      blogs[index] = updatedBlog
      selectedBlog.value = updatedBlog
    }
  }

  const selectBlog = (blog: Blog) => {
    selectedBlog.value = blog
  }

  const checkDuplicateTitle = (title: string) => {
    if (isEditing.value) {
      return blogs.some((blog) => blog.title === title && blog.title !== selectedBlog.value.title)
    }

    return blogs.some((blog) => blog.title === title)
  }

  const blogContext: BlogContext = {
    blogs,
    selectedBlog,
    selectBlog,
    addBlog,
    updateBlog,
    checkDuplicateTitle,
    showForm,
    isEditing,
  }

  provide(BlogKey, blogContext)

  return blogContext
}

export function useBlogContext() {
  const context = inject(BlogKey)
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider')
  }
  return context
}
