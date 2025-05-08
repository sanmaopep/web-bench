import { writable } from 'svelte/store';

interface CommentStore {
  [blogTitle: string]: string[];
}

function createCommentStore() {
  const { subscribe, update } = writable<CommentStore>({});

  return {
    subscribe,
    addComment: (blogTitle: string, comment: string) => {
      update(store => {
        const comments = store[blogTitle] || [];
        return {
          ...store,
          [blogTitle]: [...comments, comment]
        };
      });
    },
    updateBlogTitle: (oldTitle: string, newTitle: string) => {
      update(store => {
        const comments = store[oldTitle] || [];
        const newStore = { ...store };
        delete newStore[oldTitle];
        newStore[newTitle] = comments;
        return newStore;
      });
    },
    deleteBlogComments: (blogTitle: string) => {
      update(store => {
        const newStore = { ...store };
        delete newStore[blogTitle];
        return newStore;
      });
    }
  };
}

export const comments = createCommentStore();
export const fastComment = writable('');