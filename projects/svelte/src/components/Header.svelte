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
  import { blogCount, blogs } from '../stores/blogStore';
  import { fastComment } from '../stores/commentStore';
  import { navigate } from '../router';
  import Tooltip from './Tooltip.svelte';

  function generateRandomBlogs() {
    const newBlogs = Array.from({length: 100000}, () => ({
      title: `RandomBlog-${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
      detail: 'Random blog detail'
    }));
    
    blogs.addBulkBlogs(newBlogs);
  }

  function handleFastComment() {
    fastComment.set('Charming Blog!');
  }

  function goToGame() {
    navigate('/game');
  }
</script>

<div class="header">
  <div>Hello Blog <span class="blog-list-len">({$blogCount})</span></div>
  <div class="button-group">
    <button class="game-btn" on:click={goToGame}>🎮</button>
    <button class="random-btn" on:click={generateRandomBlogs}>Random Blogs</button>
    <button class="fast-btn" on:click={handleFastComment}>Fast Comment</button>
    <Tooltip text="Write a New Blog For everyone">
      <button class="add-btn" on:click>Add Blog</button>
    </Tooltip>
  </div>
</div>

<style>
  .header {
    background-color: #4CAF50;
    color: white;
    padding: 1rem;
    text-align: center;
    font-size: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .blog-list-len {
    font-size: 1.5rem;
    opacity: 0.9;
  }

  .button-group {
    display: flex;
    gap: 1rem;
  }

  .add-btn, .random-btn, .fast-btn, .game-btn {
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .add-btn {
    background-color: #1976d2;
  }

  .add-btn:hover {
    background-color: #1565c0;
  }

  .random-btn {
    background-color: #ff9800;
  }

  .random-btn:hover {
    background-color: #f57c00;
  }

  .fast-btn {
    background-color: #e91e63;
  }

  .fast-btn:hover {
    background-color: #d81b60;
  }

  .game-btn {
    background-color: #9c27b0;
    font-size: 1.2rem;
  }

  .game-btn:hover {
    background-color: #7b1fa2;
  }
</style>