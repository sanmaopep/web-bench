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