<template>
  <main class="main">
    <div class="sidebar">
      <Search @search="filterBlogs" />
      <BlogList :blogs="filteredBlogs" :selectedBlog="selectedBlog.title" @select-blog="selectBlog" />
    </div>
    <Blog :title="selectedBlog.title" :detail="selectedBlog.detail" />
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Blog from './Blog.vue';
import BlogList from './BlogList.vue';
import Search from './Search.vue';
import { useBlogContext } from '../context/BlogContext';

export default defineComponent({
  components: {
    Blog,
    BlogList,
    Search
  },
  setup() {
    const { blogs, selectedBlog, selectBlog } = useBlogContext();
    const searchTerm = ref('');

    const filteredBlogs = computed(() => {
      if (!searchTerm.value) return blogs;
      const lowerSearchTerm = searchTerm.value.toLowerCase();
      return blogs.filter(blog => 
        blog.title.toLowerCase().includes(lowerSearchTerm) ||
        blog.detail.toLowerCase().includes(lowerSearchTerm)
      );
    });

    const filterBlogs = (term: string) => {
      searchTerm.value = term;
    };

    return {
      filteredBlogs,
      selectedBlog,
      selectBlog,
      filterBlogs
    };
  }
});
</script>

<style scoped>
.main {
  display: flex;
  gap: 20px;
  position: relative;
}

.sidebar {
  width: 300px;
}
</style>