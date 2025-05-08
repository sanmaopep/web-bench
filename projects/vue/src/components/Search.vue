<template>
  <div class="search">
    <input
      type="text"
      v-model="searchTerm"
      placeholder="Search Blogs"
      @input="search"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup(props, { emit }) {
    const searchTerm = ref('');

    const search = () => {
      emit('search', searchTerm.value);
    };

    return {
      searchTerm,
      search,
    };
  },
});
</script>

<style scoped>
.search {
  margin-top: 10px;
  margin-bottom: 20px;
}

input {
  width: 200px;
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>