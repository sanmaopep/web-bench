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
  import { tick } from 'svelte';
  import TruncatedTitle from './TruncatedTitle.svelte';

  export let blogs: Array<{title: string, detail: string}>;
  export let selectedBlog: {title: string, detail: string};
  export let onSelect: (blog: {title: string, detail: string}) => void;

  let container: HTMLElement;
  let itemHeight = 40;
  let visibleItems = 20;
  let startIndex = 0;
  let endIndex = visibleItems;
  let totalHeight: number;
  let scrollTop = 0;
  
  $: {
    totalHeight = blogs.length * itemHeight;
    handleScroll();
  }

  async function handleScroll() {
    if(!container) return;
    
    scrollTop = container.scrollTop;
    startIndex = Math.floor(scrollTop / itemHeight);
    endIndex = Math.min(startIndex + visibleItems, blogs.length);
    
    await tick();
  }

  $: visibleBlogs = blogs.slice(startIndex, endIndex);
  $: paddingTop = startIndex * itemHeight;
  $: paddingBottom = (blogs.length - endIndex) * itemHeight;
</script>

<div 
  class="blog-list" 
  bind:this={container}
  on:scroll={handleScroll}
>
  <div 
    class="viewport"
    style="height: {totalHeight}px; padding-top: {paddingTop}px; padding-bottom: {paddingBottom}px;"
  >
    {#each visibleBlogs as blog (blog.title)}
      <div 
        class="list-item" 
        class:selected={selectedBlog.title === blog.title}
        on:click={() => onSelect(blog)}
      >
        <TruncatedTitle title={blog.title} maxWidth={268} />
      </div>
    {/each}
  </div>
</div>

<style>
  .blog-list {
    width: 300px;
    height: 600px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: white;
    overflow-y: auto;
  }

  .viewport {
    box-sizing: border-box;
  }
  
  .list-item {
    height: 40px;
    box-sizing: border-box;
    padding: 8px 16px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .list-item:hover {
    background-color: #f5f5f5;
  }

  .list-item.selected {
    background-color: #4CAF50;
    color: white;
  }
</style>