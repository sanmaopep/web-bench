import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search">
      <input 
        type="text" 
        [(ngModel)]="searchText"
        (ngModelChange)="onSearch($event)"
        placeholder="Search Blogs"
        class="search-input"
      >
    </div>
  `,
  styles: `
    .search {
      width: 200px;
      box-sizing: border-box;
      padding: 8px;
    }

    .search-input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: #4CAF50;
    }
  `
})
export class SearchComponent {
  searchText = '';
  @Output() search = new EventEmitter<string>();

  onSearch(text: string) {
    this.search.emit(text);
  }
}