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