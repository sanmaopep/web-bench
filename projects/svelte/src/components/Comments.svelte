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
  import { onMount } from 'svelte';
  import { comments, fastComment } from '../stores/commentStore';
  import { toast } from '../utils/toast';

  export let blogTitle: string;
  
  let newComment = '';
  let blogComments: string[] = [];
  let commentInput: HTMLTextAreaElement;

  onMount(() => {
    blogComments = $comments[blogTitle] || [];
  });

  $: {
    blogComments = $comments[blogTitle] || [];
  }

  $: if ($fastComment) {
    newComment = $fastComment;
    commentInput?.focus();
    fastComment.set('');
  }

  function handleSubmit() {
    if (!newComment.trim()) return;
    
    comments.addComment(blogTitle, newComment);
    toast.showToast('New Comment Created Successfully!');
    newComment = '';
  }
</script>

<div class="comments-section">
  <h3>Comments</h3>

  <div class="comments-list">
    {#each blogComments as comment}
      <div class="comment-item">
        {comment}
      </div>
    {/each}
  </div>

  <div class="comment-form">
    <textarea
      bind:this={commentInput}
      bind:value={newComment}
      placeholder="Enter Your Comment"
      class="comment-input"
    />
    <button class="comment-btn" on:click={handleSubmit}>
      Submit Comment
    </button>
  </div>
</div>

<style>
  .comments-section {
    margin-top: 2rem;
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }

  .comments-list {
    margin: 1rem 0;
  }

  .comment-item {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .comment-input {
    width: 100%;
    min-height: 80px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
  }

  .comment-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    align-self: flex-end;
  }

  .comment-btn:hover {
    background-color: #218838;
  }
</style>