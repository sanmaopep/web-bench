class CommentStore {
  constructor() {
    this.comments = new Map();
    this.listeners = new Set();
  }

  addComment(blogTitle, comment) {
    if (!this.comments.has(blogTitle)) {
      this.comments.set(blogTitle, []);
    }
    this.comments.get(blogTitle).push(comment);
    this.notify();
  }

  getComments(blogTitle) {
    return this.comments.get(blogTitle) || [];
  }

  updateBlogTitle(oldTitle, newTitle) {
    if (this.comments.has(oldTitle)) {
      const comments = this.comments.get(oldTitle);
      this.comments.set(newTitle, comments);
      this.comments.delete(oldTitle);
      this.notify();
    }
  }

  deleteComments(blogTitle) {
    this.comments.delete(blogTitle);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
  }

  unsubscribe(listener) {
    this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }
}

export default new CommentStore();