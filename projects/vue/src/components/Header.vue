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
  <header class="header">
    <h1>Hello Blog <span class="blog-list-len">({{ blogs.length }})</span></h1>
    <div class="header-right">
      <Tooltip text="Write a New Blog For everyone">
        <button class="add-blog-btn" @click="$emit('toggle-form')">Add Blog</button>
      </Tooltip>
      <button class="random-blogs-btn" @click="appendRandomBlogs" v-if="currentPage === '/'">Random Blogs</button>
      <button class="fast-comment-btn" @click="fastComment" v-if="currentPage === '/'">Fast Comment</button>
      <button class="game-btn" @click="goToGame">🎮</button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, inject, ref, onMounted } from 'vue';
import { useBlogContext } from '../context/BlogContext';
import Tooltip from './Tooltip.vue';

export default defineComponent({
  components: {
    Tooltip
  },
  setup() {
    const { blogs } = useBlogContext();
    const fastCommentRef = inject('fastCommentRef') as { value: () => void };
    const currentPage = ref('/');

    const appendRandomBlogs = () => {
      new Array(100000).fill(0).forEach((_, i) => {
        const randomDigits = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
          blogs.push({
            title: `RandomBlog-${randomDigits}`,
            detail: `This is random blog ${i + 1}`
          });
      })
    };

    const fastComment = () => {
      if (fastCommentRef && fastCommentRef.value) {
        fastCommentRef.value();
      }
    };

    const goToGame = () => {
      window.history.pushState(null, '', '/game');
      window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const goBack = () => {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    };

    onMounted(() => {
      currentPage.value = window.location.pathname;
      window.addEventListener('popstate', () => {
        currentPage.value = window.location.pathname;
      });
    });

    return { blogs, appendRandomBlogs, fastComment, goToGame, goBack, currentPage };
  },
  emits: ['toggle-form']
});
</script>

<style scoped>
.header {
  background-color: #4CAF50;
  color: white;
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-blog-btn, .random-blogs-btn, .fast-comment-btn, .game-btn, .back-button {
  background-color: #008CBA;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.random-blogs-btn {
  background-color: #f44336;
}

.fast-comment-btn {
  background-color: #FFA500;
}

.game-btn {
  background-color: #9C27B0;
}

.blog-list-len {
  font-size: 0.8em;
  margin-left: 10px;
}
</style>