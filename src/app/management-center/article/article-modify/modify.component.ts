import { Component, OnInit } from '@angular/core';
import { get_selected_edit_blog } from '../article.component';

import { EditComponent } from '../article-edit-logic/edit.component';
import { ArticleInfo } from '../../../services/articles.service';

@Component({
  selector: 'app-article-modify',
  standalone: true,
  imports: [
    EditComponent
  ],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.scss'
})
export class ArticleModifyComponent implements OnInit {
  // the blog which wants to be updated
  blogInfo:ArticleInfo = null;
  ngOnInit(): void {
    this.blogInfo = get_selected_edit_blog();
  }
}
