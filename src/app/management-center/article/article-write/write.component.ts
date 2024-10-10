import { Component } from '@angular/core';
import { EditComponent } from '../article-edit-logic/edit.component';

@Component({
  selector: 'app-article-write',
  standalone: true,
  imports: [
    EditComponent
  ],
  templateUrl: './write.component.html',
  styleUrl: './write.component.scss'
})
export class ArticleWriteComponent {

}
