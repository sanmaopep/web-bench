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