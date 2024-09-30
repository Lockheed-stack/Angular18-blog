import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavBarComponent } from '../shared/nav-bar/nav-bar.component';
import { BlogMarkdownComponent, Title } from './blog-markdown/blog-markdown.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkListbox, CdkOption } from '@angular/cdk/listbox';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import hljs from 'highlight.js/lib/common';
import hljs_dockerfile from 'highlight.js/lib/languages/dockerfile'
import { ArticleInfo, ArticlesService } from '../services/articles.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../shared/snack-bar/snack-bar.component';

hljs.registerLanguage('dockerfile', hljs_dockerfile);


@Component({
  selector: 'app-blog-display',
  standalone: true,
  imports: [
    NavBarComponent,
    BlogMarkdownComponent,
    NzSkeletonModule,
    CdkDrag,
    NgIf,
    MatIcon,
    MatButtonModule,
    CdkListbox,
    CdkOption,
    NzDrawerModule
  ],
  templateUrl: './blog-display.component.html',
  styleUrl: './blog-display.component.scss',
})
export class BlogDisplayComponent implements OnInit, OnChanges {

  constructor(
    private articleService: ArticlesService,
    private route: ActivatedRoute,
  ) { }
  readonly snackbar = inject(MatSnackBar);
  loading: boolean = false;
  openSidebar: boolean = false;
  titleArray: Array<Title> = [];
  blogInfo: ArticleInfo = null;
  markdownURL: string = "";

  markdownReady(event: { ready: boolean, titles: Array<Title> }) {
    if (event.ready) {
      this.loading = false;
      this.titleArray = event.titles;

      setTimeout(() => {
        hljs.highlightAll();
      }, 200);
    }
  }

  closeBookMark() {
    this.openSidebar = false;
  }
  onBookMarkClicked() {
    this.openSidebar = true;
  }
  onBookMarkItemClicked(titleID: string) {
    const element = document.getElementById(titleID);
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
  }
  snackBarTips(content: string) {
    this.snackbar.openFromComponent(SnackBarComponent, {
      data: {
        content: content
      }
    })
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe((value) => {
      const BID = value.get("blogid")
      if (BID === null) {
        this.snackBarTips("未知文章");
      } else {
        this.blogInfo = this.articleService.GetPreparedBlog(); // the reader may come from index
        if (this.blogInfo === null || this.blogInfo.ID !== Number(BID)) { // the reader visited by url
          this.articleService.GetSingleArticle(Number(BID)).subscribe({
            next: (value) => {
              this.blogInfo = value.result;
              this.markdownURL = value.result.Content;
              this.articleService.SetPreparedBlog(this.blogInfo);
            },
            error: (err) => {
              this.snackBarTips("文章不存在");
            }
          })
        } else {
          this.markdownURL = this.blogInfo.Content;
        }
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }
}
