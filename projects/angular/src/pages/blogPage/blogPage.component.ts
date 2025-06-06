// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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