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

<script lang="ts">
  export let value = '';
</script>

<div class="search">
  <input 
    type="text"
    bind:value
    placeholder="Search Blogs"
    class="search-input"
  />
</div>

<style>
  .search {
    width: 200px;
    box-sizing: border-box;
    margin-bottom: 1rem;
  }

  .search-input {
    width: 200px; 
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .search-input:focus {
    outline: none;
    border-color: #4CAF50;
  }
</style>