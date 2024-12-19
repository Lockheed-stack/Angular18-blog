import { Component, inject, Input, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { Title } from '../blog-markdown/blog-markdown.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'app-blog-bookmark',
  standalone: true,
  imports: [
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './blog-bookmark.component.html',
  styleUrl: './blog-bookmark.component.scss'
})
export class BlogBookmarkComponent implements OnInit {

  data = inject(MAT_BOTTOM_SHEET_DATA);
  private _bottomSheetRef = inject<MatBottomSheetRef<BlogBookmarkComponent>>(MatBottomSheetRef);

  titleArray: Array<Title> = []
  scrollTitleIntoView(titleID: string) {
    const el = document.getElementById(titleID);
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
  }

  closeBottomSheet(){
    this._bottomSheetRef.dismiss();
  }
  ngOnInit(): void {
    this.titleArray = this.data;
  }
}
