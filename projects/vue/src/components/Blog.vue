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
  <div class="blog">
    <div class="blog-actions">
      <button class="delete-btn" @click="deleteBlog">Delete</button>
      <button class="edit-btn" @click="editBlog">Edit</button>
    </div>
    <h1 class="blog-title">
      <TruncatedTitle :title="title" />
    </h1>
    <div v-html="markdownToHtml(detail)"></div>
    <Comments />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDelete } from '../composables/useDelete';
import { useEdit } from '../composables/useEdit';
import Comments from './Comments.vue';
import { markdownToHtml } from '../composables/useMarkdown';
import TruncatedTitle from './TruncatedTitle.vue';

export default defineComponent({
  components: {
    Comments,
    TruncatedTitle
  },
  props: {
    title: String,
    detail: String
  },
  setup(props, { emit }) {
    const { deleteBlog } = useDelete();
    const { editBlog } = useEdit();

    return { 
      deleteBlog, 
      editBlog: () => editBlog(),
      markdownToHtml
    };
  }
});
</script>

<style scoped>
.blog {
  position: relative;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  flex: 1;
}

.blog-actions {
  position: absolute;
  top: 10px;
  right: 10px;
}

.blog-title {
  font-size: 24px;
  max-width: 300px;
  width: fit-content;
}

.delete-btn, .edit-btn {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}
</style>