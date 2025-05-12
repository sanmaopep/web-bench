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
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';

  export let title: string;
  export let maxWidth = 300;
  
  let titleEl: HTMLElement;
  let needsTruncate = false;

  onMount(() => {
    checkTruncation();
  });

  $: if(title) {
    setTimeout(() => {
      checkTruncation();
    });
  }

  function checkTruncation() {
    if (titleEl) {
      needsTruncate = titleEl.scrollWidth > maxWidth;
    }
  }
</script>

<div class="title-container">
  {#if needsTruncate}
    <Tooltip text={title}>
      <div 
        bind:this={titleEl}
        class="truncated-text"
        style="max-width: {maxWidth}px"
      >
        {title}
      </div>
    </Tooltip>
  {:else}
    <div 
      bind:this={titleEl}
      class="truncated-text" 
      style="max-width: {maxWidth}px"
    >
      {title}
    </div>
  {/if}
</div>

<style>
  .title-container {
    display: inline-block;
  }

  .truncated-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
</style>