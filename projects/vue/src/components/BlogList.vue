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
  <div class="blog-list" @scroll="handleScroll">
    <div :style="{ height: totalHeight + 'px', position: 'relative' }" >
      <div :style="{position:'absolute', top: offsetY + 'px', left: 0, right:0}">
        <div
          v-for="blog in visibleBlogs"
          :key="blog.title"
          class="list-item"
          :class="{ 'selected': blog.title === selectedBlog }"
          @click="$emit('select-blog', blog)"
        >
          <TruncatedTitle :title="blog.title" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import TruncatedTitle from './TruncatedTitle.vue';

interface Blog {
  title: string;
  detail: string;
}

const ITEM_HEIGHT = 40 // Height of each blog item in pixels
const WINDOW_SIZE = 20 // Number of items to render at once

export default defineComponent({
  components: {
    TruncatedTitle
  },
  props: {
    blogs: Array,
    selectedBlog: String
  },
  setup(props: { blogs: Blog[]; selectedBlog: string }) {
    const itemHeight = 40;
    const scrollTop = ref(0);

    const startIndex = computed(() => Math.floor(scrollTop.value / ITEM_HEIGHT));
    const endIndex = computed(() => Math.min(startIndex.value + WINDOW_SIZE, props.blogs.length));
    const visibleBlogs = computed(() => props.blogs?.slice(startIndex.value, endIndex.value));

    const offsetY = computed(() => startIndex.value * itemHeight);
    const totalHeight = computed(() => (props.blogs || []).length * ITEM_HEIGHT);

    const handleScroll = (e: Event) => {
      scrollTop.value = (e.target as HTMLDivElement).scrollTop;
    };

    return {
      visibleBlogs,
      handleScroll,
      totalHeight,
      offsetY
    };
  },
  emits: ['select-blog']
});
</script>

<style scoped>
.blog-list {
  width: 300px;
  height: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.list-item {
  height: 40px;
  box-sizing: border-box;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: #f5f5f5;
}

.list-item.selected {
  background-color: #e8f5e9;
  font-weight: bold;
  color: #4CAF50;
}
</style>