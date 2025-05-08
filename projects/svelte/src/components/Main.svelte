<script lang="ts">
  import Blog from './Blog.svelte';
  import BlogList from './BlogList.svelte';
  import Search from './Search.svelte';
  import { filteredBlogs, selectedBlog, searchKeyword } from '../stores/blogStore';

  export let onEdit: () => void;

  function handleSelect(blog: {title: string, detail: string}) {
    selectedBlog.set(blog);
  }
</script>

<main>
  <div>
    <Search bind:value={$searchKeyword} />
    <BlogList 
      blogs={$filteredBlogs} 
      selectedBlog={$selectedBlog}
      onSelect={handleSelect}
    />
  </div>
  <div class="blog-content">
    <Blog title={$selectedBlog.title} detail={$selectedBlog.detail} {onEdit} />
  </div>
</main>

<style>
  main {
    padding: 1rem;
    height: 100%;
    display: flex;
    gap: 2rem;
  }

  .blog-content {
    flex: 1;
  }
</style>