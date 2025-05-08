import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast.service';

export interface Comment {
  blogTitle: string;
  text: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private toastService = inject(ToastService);
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject.asObservable();

  addComment(comment: Comment) {
    const currentComments = this.commentsSubject.value;
    this.commentsSubject.next([...currentComments, comment]);
    this.toastService.show('New Comment Created Successfully!');
  }

  getCommentsByBlog(blogTitle: string) {
    return this.commentsSubject.value.filter(comment => comment.blogTitle === blogTitle);
  }

  updateBlogTitle(oldTitle: string, newTitle: string) {
    const currentComments = this.commentsSubject.value;
    const updatedComments = currentComments.map(comment => 
      comment.blogTitle === oldTitle ? {...comment, blogTitle: newTitle} : comment
    );
    this.commentsSubject.next(updatedComments);
  }

  deleteBlogComments(blogTitle: string) {
    const currentComments = this.commentsSubject.value;
    const updatedComments = currentComments.filter(comment => comment.blogTitle !== blogTitle);
    this.commentsSubject.next(updatedComments);
  }
}