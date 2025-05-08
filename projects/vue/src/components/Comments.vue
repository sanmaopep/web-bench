<template>
  <div class="comments">
    <h3>Comments</h3>
    <div v-for="comment in comments" :key="comment.text" class="comment-item">
      {{ comment.text }}
    </div>
    <textarea ref="commentTextarea" v-model="newComment" placeholder="Enter Your Comment"></textarea>
    <button class="comment-btn" @click="submitComment">Submit Comment</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject } from 'vue'
import { useCommentStore } from '../store/comment'
import { useBlogContext } from '../context/BlogContext'
import { showToast } from '../utils/toast'

export default defineComponent({
  setup() {
    const commentStore = useCommentStore()
    const { selectedBlog } = useBlogContext()
    const newComment = ref('')
    const commentTextarea = ref<HTMLTextAreaElement | null>(null)

    const comments = computed(() => commentStore.getComments(selectedBlog.value.title))

    const submitComment = () => {
      if (newComment.value.trim()) {
        commentStore.addComment(selectedBlog.value.title, newComment.value)
        newComment.value = ''
        showToast('New Comment Created Successfully!')
      }
    }

    const fastCommentRef = inject('fastCommentRef')
    if (fastCommentRef) {
      fastCommentRef.value = () => {
        if (commentTextarea.value) {
          commentTextarea.value.focus()
          newComment.value = 'Charming Blog!'
        }
      }
    }

    return {
      comments,
      newComment,
      submitComment,
      commentTextarea
    }
  }
})
</script>

<style scoped>
.comments {
  margin-top: 20px;
}

.comment-item {
  background-color: #f0f0f0;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}

.comment-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>