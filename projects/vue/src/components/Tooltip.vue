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

<template>
  <div ref="targetRef" class="tooltip-container">
    <slot></slot>
  </div>
  <teleport to="body">
    <div v-if="isVisible" class="tooltip" :style="tooltipStyle">
      {{ text }}
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true
    }
  },
  setup() {
    const isVisible = ref(false);
    const tooltipStyle = ref({});
    const targetRef = ref();

    const showTooltip = () => {
      isVisible.value = true;
      updatePosition();
    };

    const hideTooltip = () => {
      isVisible.value = false;
    };

    const updatePosition = () => {
      if (!targetRef.value) return;
      const rect = targetRef.value.getBoundingClientRect();
      tooltipStyle.value = {
        position: 'fixed',
        top: `${rect.bottom + window.scrollY + 5}px`,
        left: `${rect.left + rect.width / 2 + window.scrollX}px`
      };
    };

    onMounted(() => {
      if (targetRef.value) {
        targetRef.value.addEventListener('mouseenter', showTooltip);
        targetRef.value.addEventListener('mouseleave', hideTooltip);
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);
      }
    });

    onBeforeUnmount(() => {
      if (targetRef.value) {
        targetRef.value.removeEventListener('mouseenter', showTooltip);
        targetRef.value.removeEventListener('mouseleave', hideTooltip);
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      }
    });

    return {
      targetRef,
      isVisible,
      tooltipStyle
    };
  }
});
</script>

<style scoped>
.tooltip-container {
  display: inline-block;
}

.tooltip {
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 1000;
  transform: translate(-50%, 0);
}
</style>