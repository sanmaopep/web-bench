import { atom } from 'jotai';
import { userAtom } from './user';
import { selectedBlogAtom } from './blog';

export interface Comment {
  blogId: number;
  text: string;
  author: string;
  timestamp: number;
}

export const commentsAtom = atom<Comment[]>([]);

export const blogCommentsAtom = atom(
  (get) => {
    const comments = get(commentsAtom);
    const selectedBlog = get(selectedBlogAtom)
    return comments.filter(comment => comment.blogId === selectedBlog);
  }
);


export const addCommentAtom = atom(
  null,
  (get, set, payload: { blogId: number; text: string }) => {
    const { blogId, text } = payload;
    const user = get(userAtom);
    const currentComments = get(commentsAtom);
    
    const newComment: Comment = {
      blogId,
      text,
      author: user.isLoggedIn ? user.username : 'Anonymous',
      timestamp: Date.now()
    };
    
    // Save current state to history before modifying
    
    // Add new comment
    set(commentsAtom, [...currentComments, newComment]);
  }
);

export const undoCommentAtom = atom(
  null,
  (get, set) => {
    const currentComments = get(commentsAtom);
    const username = get(userAtom).username;
    const blogId = get(selectedBlogAtom);

    // Remove last comment with current user and current blogId
    const lastCommentIndex = currentComments.findLastIndex(
      comment => comment.author === username && comment.blogId === blogId 
    )
    if (lastCommentIndex !== -1) {
      const newComments = [...currentComments];
      newComments.splice(lastCommentIndex, 1);
      set(commentsAtom, newComments);
    }
  }
);