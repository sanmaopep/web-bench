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
  <div class="App">
    <Header @toggle-form="toggleForm" />
    <Main />
    <BlogForm 
      @close="toggleForm" 
      @submit="submitBlog" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue';
import Header from './components/Header.vue';
import Main from './components/Main.vue';
import BlogForm from './components/BlogForm.vue';
import { useBlogContext } from './context/BlogContext';
import { showToast } from './utils/toast';

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Main,
    BlogForm,
  },
  setup() {
    const { addBlog, updateBlog, showForm, isEditing } = useBlogContext();

    const toggleForm = (editing: boolean = false) => {
      showForm.value = !showForm.value;
      isEditing.value = editing;
    };

    const submitBlog = (blog: any) => {
      if (isEditing.value) {
        updateBlog(blog);
        showToast('Blog Updated Successfully!');
      } else {
        addBlog(blog);
        showToast('New Blog Created Successfully!');
      }
      toggleForm();
    };

    const fastCommentRef = ref();
    provide('fastCommentRef', fastCommentRef);

    return {
      showForm,
      isEditing,
      toggleForm,
      submitBlog,
      fastCommentRef
    };
  }
});
</script>