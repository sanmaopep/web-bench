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
  import { onMount, onDestroy } from 'svelte';
  import Portal from './Portal.svelte'

  let tooltipEl: HTMLElement;
  export let text = '';
  let target: HTMLElement;
  let tooltipVisible = false;
  let x = 0;
  let y = 0;

  function updatePosition() {
    if (!target || !tooltipEl) return;
    
    const rect = target.getBoundingClientRect();
    x = rect.left + (rect.width - tooltipEl.offsetWidth) / 2;
    y = rect.bottom + 8;
  }

  function show(event: MouseEvent) {
    tooltipVisible = true;
    setTimeout(updatePosition);
  }

  function hide(event: MouseEvent) {
    tooltipVisible = false;
  }

  onMount(() => {
    if (!target) return;
    target.addEventListener('mouseenter', show);
    target.addEventListener('mouseleave', hide);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
  });

  onDestroy(() => {
    if (!target) return;
    target.removeEventListener('mouseenter', show);
    target.removeEventListener('mouseleave', hide);
    window.removeEventListener('scroll', updatePosition, true);
    window.removeEventListener('resize', updatePosition);
  });
</script>

<div bind:this={target}>
  <slot />
</div>

<Portal>
  {#if tooltipVisible}
    <div 
      bind:this={tooltipEl}
      class="tooltip"
      style="left: {x}px; top: {y}px"
    >
      {text}
    </div>
  {/if}
</Portal>

<style>
  .tooltip {
    position: fixed;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    pointer-events: none;
    white-space: nowrap;
  }

  .tooltip::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid rgba(0, 0, 0, 0.8);
  }
</style>