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

<!-- components/Portal.svelte -->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let target: HTMLElement | null | undefined = globalThis.document?.body;

  let ref: HTMLElement;

  onMount(() => {
    if (target) {
      target.appendChild(ref);
    }
  })

  // this block is almost needless/useless (if not totally) as, on destroy, the ref will no longer exist/be in the DOM anyways
  onDestroy(() => {
    setTimeout(() => {
      if (ref?.parentNode) {
        ref.parentNode?.removeChild(ref);
      }
    })
  })
</script>

<div bind:this={ref}>
  <slot />
</div>