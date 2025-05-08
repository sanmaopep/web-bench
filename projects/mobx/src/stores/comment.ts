import { makeAutoObservable, action, runInAction } from 'mobx'
import userStore from './user';
import blogStore from './blog';

export interface Comment {
  id: string;
  blogId: number;
  text: string;
  author: string;
  timestamp: number;
}

class CommentStore {
  comments: Record<number, Comment[]> = {};
  commentHistory: Comment[] = [];

  constructor() {
    makeAutoObservable(this);
    this.registerUndoHandler();
  }

  registerUndoHandler() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        this.undoLastComment();
        e.preventDefault();
      }
    });
  }

  addComment = action((blogId: number, text: string, author: string) => {
    if (!this.comments[blogId]) {
      this.comments[blogId] = [];
    }
    
    const newComment = {
      id: Math.random().toString(36).substring(2, 9),
      blogId,
      text,
      author,
      timestamp: Date.now()
    };
    
    this.comments[blogId].push(newComment);
    this.commentHistory.push(newComment);
  });

  undoLastComment = action(() => {
    if (this.commentHistory.length === 0) return;

    const lastCommentIndex = this.commentHistory.findLastIndex(_comment => _comment.author === userStore?.username && _comment.blogId === blogStore.selectedBlogIndex);

    if (lastCommentIndex === -1) return;

    const lastComment = this.commentHistory[lastCommentIndex];
    
    const blogComments = this.comments[lastComment.blogId];
    if (!blogComments) return;
    const blogCommentsIndex = blogComments.findIndex(comment => comment.id === lastComment.id);

    if (blogCommentsIndex === -1) {
      return;
    }

    this.commentHistory.splice(lastCommentIndex, 1);
    blogComments.splice(blogCommentsIndex, 1);

  });

  getCommentsForBlog(blogId: number): Comment[] {
    return this.comments[blogId] || [];
  }
}

const commentStore = new CommentStore();
export default commentStore;