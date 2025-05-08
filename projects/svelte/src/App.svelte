<script lang="ts">
  import Header from './components/Header.svelte';
  import Main from './components/Main.svelte';
  import BlogForm from './components/BlogForm.svelte';
  import ToastDisplay from './components/ToastDisplay.svelte';

  import { selectedBlog } from './stores/blogStore';

  let showBlogForm = false;
  let editMode = false;

  function toggleBlogForm(isEdit = false) {
    showBlogForm = !showBlogForm;
    editMode = isEdit;
  }
</script>

<div class="App">
  <Header on:click={() => toggleBlogForm(false)} />
  <Main onEdit={() => toggleBlogForm(true)} />
  <BlogForm 
    visible={showBlogForm} 
    onClose={() => toggleBlogForm(false)}
    editMode={editMode}
    initialTitle={$selectedBlog.title}
    initialDetail={$selectedBlog.detail}
  />
  
  <ToastDisplay />
</div>

<style>
  .App {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>