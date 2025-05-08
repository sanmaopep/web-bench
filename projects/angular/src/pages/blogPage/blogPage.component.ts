import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HeaderComponent } from '../../components/header/header.component'
import { MainComponent } from '../../components/main/main.component'
import { BlogFormComponent } from '../../components/blog-form/blog-form.component'
import { BlogService } from '../../services/blog.service'
import { SearchComponent } from '../../components/search/search.component'

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [HeaderComponent, MainComponent, BlogFormComponent, SearchComponent],
  template: `
    <app-header
      [blogCount]="blogService.getBlogs().length"
      (openForm)="blogForm.show()"
      (fastComment)="main.onFastComment()"
    />
    <app-search (search)="onSearch($event)" />
    <app-main #main [searchKeyword]="searchKeyword" />
    <app-blog-form #blogForm />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column; 
      min-height: 100vh;
    }

    app-search {
      padding: 1rem;
    }
  `,
})
export class BlogPageComponent {
  searchKeyword = ''

  constructor(public blogService: BlogService) {}

  onSearch(text: string) {
    this.searchKeyword = text
  }
}