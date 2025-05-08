import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommentService } from './comment.service';
import { ToastService } from './toast.service';

export interface Blog {
  title: string;
  detail: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private commentService = inject(CommentService);
  private toastService = inject(ToastService);

  private initialBlogs: Blog[] = [
    { title: 'Morning', detail: 'Morning My Friends' },
    { title: 'Travel', detail: 'I love traveling!' },
  ];

  private blogsSubject = new BehaviorSubject<Blog[]>(this.initialBlogs);
  private selectedBlogSubject = new BehaviorSubject<Blog>(this.initialBlogs[0]);
  private editingBlogSubject = new BehaviorSubject<Blog | null>(null);

  blogs$ = this.blogsSubject.asObservable();
  selectedBlog$ = this.selectedBlogSubject.asObservable();
  editingBlog$ = this.editingBlogSubject.asObservable();

  addBlog(blog: Blog) {
    const currentBlogs = this.blogsSubject.value;
    this.blogsSubject.next([...currentBlogs, blog]);
    this.selectedBlogSubject.next(blog);
    this.toastService.show('New Blog Created Successfully!');
  }

  addRandomBlogs(blogs: Blog[]) {
    const currentBlogs = this.blogsSubject.value;
    this.blogsSubject.next([...currentBlogs, ...blogs]);
  }

  selectBlog(blog: Blog) {
    this.selectedBlogSubject.next(blog);
  }

  getBlogs() {
    return this.blogsSubject.value;
  }

  getSelectedBlog() {
    return this.selectedBlogSubject.value;
  }

  startEdit(blog: Blog) {
    this.editingBlogSubject.next(blog);
  }

  updateBlog(originalTitle: string, updatedBlog: Blog) {
    const currentBlogs = this.blogsSubject.value;
    const updatedBlogs = currentBlogs.map(blog => 
      blog.title === originalTitle ? updatedBlog : blog
    );
    this.blogsSubject.next(updatedBlogs);
    this.selectedBlogSubject.next(updatedBlog);
    this.editingBlogSubject.next(null);
    this.commentService.updateBlogTitle(originalTitle, updatedBlog.title);
  }

  deleteBlog(blogToDelete: Blog) {
    const currentBlogs = this.blogsSubject.value;
    const updatedBlogs = currentBlogs.filter(blog => blog.title !== blogToDelete.title);
    this.blogsSubject.next(updatedBlogs);
    
    if (updatedBlogs.length > 0) {
      this.selectedBlogSubject.next(updatedBlogs[0]);
    } else {
      this.selectedBlogSubject.next({ title: '', detail: '' });
    }
  }
}