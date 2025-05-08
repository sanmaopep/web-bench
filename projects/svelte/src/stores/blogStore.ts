import { writable, derived } from 'svelte/store';

export interface Blog {
  title: string;
  detail: string; 
}

const initialBlogs: Blog[] = [
  {
    title: 'Morning', 
    detail: 'Morning My Friends'
  },
  {
    title: 'Travel',
    detail: 'I love traveling!'
  }
];

const searchKeyword = writable('');

function createBlogStore() {
  const { subscribe, set, update } = writable<Blog[]>(initialBlogs);

  return {
    subscribe,
    addBlog: (blog: Blog) => {
      update(blogs => [...blogs, blog])
    },
    addBulkBlogs: (newBlogs: Blog[]) => {
      update(blogs => [...blogs, ...newBlogs])
    },
    deleteBlog: (title: string) => {
      update(blogs => blogs.filter(blog => blog.title !== title))
    },
    updateBlog: (oldTitle: string, newBlog: Blog) => {
      update(blogs => blogs.map(blog => 
        blog.title === oldTitle ? newBlog : blog
      ))
    },
    reset: () => set(initialBlogs)
  };
}

export const blogs = createBlogStore();

export const selectedBlog = writable<Blog>(initialBlogs[0]);

export const filteredBlogs = derived(
  [blogs, searchKeyword],
  ([$blogs, $searchKeyword]) => {
    if (!$searchKeyword) return $blogs;
    return $blogs.filter(blog => 
      blog.title.toLowerCase().includes($searchKeyword.toLowerCase()) ||
      blog.detail.toLowerCase().includes($searchKeyword.toLowerCase())
    );
  }
);

export const blogCount = derived(
  blogs, 
  $blogs => $blogs.length
);

export { searchKeyword };