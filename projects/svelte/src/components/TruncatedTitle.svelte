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