<!-- TruncatedTitle.vue -->
<template>
  <Tooltip v-if="isTruncated" :text="title || ''">
    <div
      ref="titleRef"
      :style="titleStyle"
    >
      {{ title }}
    </div>
  </Tooltip>
  <div
    v-else
    ref="titleRef"
    :style="titleStyle"
  >
    {{ title }}
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, computed, defineComponent, watch, onUpdated, nextTick } from 'vue'
import Tooltip from './Tooltip.vue'

export default defineComponent({
  name: 'TruncatedTitle',
  
  components: {
    Tooltip
  },

  props: {
    title: {
      type: String,
    },
    maxWidth: {
      type: Number,
      default: 300
    }
  },

  setup(props) {
    const titleRef = ref<HTMLDivElement | null>(null)
    const isTruncated = ref(false)

    const titleStyle = computed(() => ({
      maxWidth: `${props.maxWidth}px`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }))

    const checkTruncation = () => {
      nextTick().then(() => {
        if (titleRef.value) {
          isTruncated.value = titleRef.value.scrollWidth > titleRef.value.clientWidth
        }
      })
    }

    watch(props, () => {
      checkTruncation()
    })

    onMounted(() => {
      checkTruncation()
      window.addEventListener('resize', checkTruncation)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkTruncation)
    })

    return {
      titleRef,
      isTruncated,
      titleStyle
    }
  }
})
</script>