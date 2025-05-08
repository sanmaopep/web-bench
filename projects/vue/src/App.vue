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