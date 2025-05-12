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
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditing ? 'Edit Blog' : 'Create Blog' }}</h2>
        <button class="close-btn" @click="$emit('close')">x</button>
      </div>
      <div class="visible-count">{{ visibleCount }}</div>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="title">Blog Title:</label>
          <input id="title" v-model="title" placeholder="Enter blog title" required>
          <span v-if="titleError" class="error">{{ titleError }}</span>
        </div>
        <div class="form-group">
          <label for="detail">Blog Detail (Markdown):</label>
          <textarea id="detail" v-model="detail" placeholder="Enter blog detail in Markdown" required></textarea>
        </div>
        <div class="form-group">
          <label>Preview:</label>
          <div v-html="markdownToHtml(detail)"></div>
        </div>
        <button type="submit" class="submit-btn">Submit</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useBlogContext } from '../context/BlogContext';
import { useEdit } from '../composables/useEdit';
import { markdownToHtml } from '../composables/useMarkdown';

export default defineComponent({
  setup(props, { emit }) {
    const { checkDuplicateTitle, showForm, isEditing, selectedBlog } = useBlogContext();
    const { updateBlogTitle } = useEdit();
    const title = ref('');
    const detail = ref('');
    const visibleCount = ref(0);
    const titleError = ref('');

    watch(showForm, () => {
      if (isEditing.value) {
        title.value = selectedBlog.value.title;
        detail.value = selectedBlog.value.detail;
      } else {
        title.value = "";
        detail.value = "";
      }
    }, { immediate: true });

    const submitForm = () => {
      if (checkDuplicateTitle(title.value)) {
        titleError.value = 'This title already exists';
        return;
      }
      titleError.value = '';
      if (isEditing.value) {
        updateBlogTitle(title.value);
      }
      emit('submit', { title: title.value, detail: detail.value });

      title.value = '';
      detail.value = '';
    };

    return {
      title,
      detail,
      visibleCount,
      titleError,
      isVisible: showForm,
      isEditing: isEditing,
      submitForm,
      markdownToHtml
    };
  },
  watch: {
    isVisible(newValue) {
      if (newValue) {
        this.visibleCount++;
      }
    }
  },
  emits: ['close', 'submit']
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.visible-count {
  position: absolute;
  top: 5px;
  left: 5px;
}

.modal-content {
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: red;
  font-size: 0.8em;
}
</style>