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