<script lang="ts">
  import { blogs, selectedBlog } from '../stores/blogStore';
  import { comments } from '../stores/commentStore';
  import { parseMarkdown } from '../utils/markdown';
  import Comments from './Comments.svelte';
  import TruncatedTitle from './TruncatedTitle.svelte';
  
  export let title: string;
  export let detail: string;
  export let onEdit: () => void;

  $: parsedDetail = parseMarkdown(detail);

  function handleDelete() {
    blogs.deleteBlog(title);
    comments.deleteBlogComments(title);
    const firstBlog = $blogs[0];
    if(firstBlog) {
      selectedBlog.set(firstBlog);
    } else {
      selectedBlog.set({title: '', detail: ''});
    }
  }
</script>

{#if title && detail}
  <div>
    <div class="blog-header">
      <h2 class="blog-title">
        <TruncatedTitle title={title} maxWidth={400} />
      </h2>
      <div class="button-group">
        <button class="edit-btn" on:click={onEdit}>Edit</button>
        <button class="delete-btn" on:click={handleDelete}>Delete</button>
      </div>
    </div>
    <div class="blog-content">
      {@html parsedDetail}
    </div>
    <Comments blogTitle={title} />
  </div>
{/if}

<style>
  .blog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .blog-title {
    width: fit-content;
    font-size: 24px;
  }

  .button-group {
    display: flex;
    gap: 8px;
  }

  .delete-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .delete-btn:hover {
    background-color: #c82333;
  }

  .edit-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .edit-btn:hover {
    background-color: #0056b3;
  }

  .blog-content :global(h1) {
    font-size: 2em;
    margin: 0.67em 0;
  }

  .blog-content :global(h2) {
    font-size: 1.5em;
    margin: 0.83em 0;
  }

  .blog-content :global(h3) {
    font-size: 1.17em;
    margin: 1em 0;
  }

  .blog-content :global(p) {
    margin: 1em 0;
  }

  .blog-content :global(ul) {
    margin: 1em 0;
    padding-left: 40px;
  }

  .blog-content :global(code) {
    background-color: #f5f5f5;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }

  .blog-content :global(a) {
    color: #007bff;
    text-decoration: none;
  }

  .blog-content :global(a:hover) {
    text-decoration: underline;
  }
</style>