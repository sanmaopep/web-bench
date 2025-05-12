<!-- 
Copyright (c) 2025 Bytedance Ltd. and/or its affiliates

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 -->

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