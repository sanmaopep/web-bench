<script lang="ts">
  import { onMount } from 'svelte';
  import { blogs, selectedBlog } from '../stores/blogStore';
  import { comments } from '../stores/commentStore';
  import { parseMarkdown } from '../utils/markdown';
  import { toast } from '../utils/toast';
  
  export let visible: boolean = false;
  export let onClose: () => void;
  export let editMode: boolean = false;
  export let initialTitle: string = '';
  export let initialDetail: string = '';

  let title = initialTitle;
  let detail = initialDetail;
  let visibleCount = 0;
  let titleError = '';
  let previewMode = false;

  $: parsedDetail = parseMarkdown(detail);

  onMount(() => {
    if (visible) {
      visibleCount++;
    }
  });

  $: if (visible) {
    visibleCount++;
    if (editMode) {
      title = initialTitle;
      detail = initialDetail;
    } else {
      title = '';
      detail = '';
    }
    previewMode = false;
  }

  function checkTitleDuplication(title: string): boolean {
    const editTitle = editMode ? initialTitle : '';
    return $blogs.some(blog => blog.title.toLowerCase() === title.toLowerCase() && blog.title !== editTitle);
  }

  function handleSubmit() {
    if (checkTitleDuplication(title)) {
      titleError = 'This title already exists';
      return; 
    }

    titleError = '';
    const newBlog = { title, detail };
    
    if (editMode) {
      blogs.updateBlog(initialTitle, newBlog);
      comments.updateBlogTitle(initialTitle, title);
      selectedBlog.set(newBlog);
    } else {
      blogs.addBlog(newBlog);
      selectedBlog.set(newBlog);
      toast.showToast('New Blog Created Successfully!');
    }
    
    title = '';
    detail = '';
    onClose();
  }
</script>

{#if visible}
<div class="modal-overlay">
  <div class="modal">
    <div class="visible-count">{visibleCount}</div>
    <button class="close-btn" on:click={onClose}>×</button>
    <h2>{editMode ? 'Edit Blog' : 'Create Blog'}</h2>
    
    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="title">Title</label>
        <input 
          id="title"
          type="text" 
          bind:value={title}
          placeholder="Enter title"
          required
        />
        {#if titleError}
          <span class="error">{titleError}</span>
        {/if}
      </div>

      <div class="form-group">
        <label for="detail">
          Detail
          <button 
            type="button" 
            class="preview-toggle" 
            on:click={() => previewMode = !previewMode}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>
        </label>
        
        {#if previewMode}
          <div class="preview-content">
            {@html parsedDetail}
          </div>
        {:else}
          <textarea
            id="detail"
            bind:value={detail}
            placeholder="Enter detail (Markdown supported)"
            required
          />
        {/if}
      </div>

      <button type="submit" class="submit-btn">{editMode ? 'Update' : 'Create'}</button>
    </form>
  </div>
</div>
{/if}


<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    position: relative;
  }

  .visible-count {
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-size: 0.875rem;
    color: #666;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  }

  .close-btn:hover {
    background-color: #f5f5f5;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input, textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  textarea {
    height: 150px;
    resize: vertical;
    font-family: monospace;
  }

  .preview-toggle {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    padding: 0;
    font-size: 0.875rem;
  }

  .preview-toggle:hover {
    text-decoration: underline;
  }

  .preview-content {
    min-height: 150px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f8f9fa;
    overflow-y: auto;
  }

  .error {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }

  .submit-btn {
    background-color: #4CAF50;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    margin-top: 1rem;
  }

  .submit-btn:hover {
    background-color: #45a049;
  }

  .preview-content :global(h1) {
    font-size: 2em;
    margin: 0.67em 0;
  }

  .preview-content :global(h2) {
    font-size: 1.5em;
    margin: 0.83em 0;
  }

  .preview-content :global(h3) {
    font-size: 1.17em;
    margin: 1em 0;
  }

  .preview-content :global(p) {
    margin: 1em 0;
  }

  .preview-content :global(ul) {
    margin: 1em 0;
    padding-left: 40px;
  }

  .preview-content :global(code) {
    background-color: #f5f5f5;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }

  .preview-content :global(a) {
    color: #007bff;
    text-decoration: none;
  }

  .preview-content :global(a:hover) {
    text-decoration: underline;
  }
</style>