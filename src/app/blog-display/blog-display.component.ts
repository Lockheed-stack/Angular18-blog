import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BlogMarkdownComponent, Title } from './blog-markdown/blog-markdown.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgStyle } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkListbox, CdkOption } from '@angular/cdk/listbox';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import hljs from 'highlight.js/lib/common';
import hljs_dockerfile from 'highlight.js/lib/languages/dockerfile'
import { ArticleInfo, ArticlesService } from '../services/articles.service';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../shared/snack-bar/snack-bar.component';
import { UserInfo, UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { AiService } from '../services/ai.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpDownloadProgressEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { InfoCardComponent } from '../shared/info-card/info-card.component';
import { MarkdownModule } from 'ngx-markdown';

hljs.registerLanguage('dockerfile', hljs_dockerfile);


@Component({
  selector: 'app-blog-display',
  standalone: true,
  imports: [
    BlogMarkdownComponent,
    NzSkeletonModule,
    CdkDrag,
    MatIcon,
    MatButtonModule,
    CdkListbox,
    CdkOption,
    NzDrawerModule,
    MatCardModule,
    FooterComponent,
    NgStyle,
    MatProgressBarModule,
    InfoCardComponent,
    MarkdownModule
  ],
  templateUrl: './blog-display.component.html',
  styleUrl: './blog-display.component.scss',
})
export class BlogDisplayComponent implements OnInit, OnDestroy {

  constructor(
    private articleService: ArticlesService,
    private route: ActivatedRoute,
    private userService: UserService,
    private breakpointServer: BreakpointObserver,
    private aiservice: AiService
  ) { }
  readonly snackbar = inject(MatSnackBar);
  loading: boolean = true;
  openSidebar: boolean = false;
  titleArray: Array<Title> = [];
  blogInfo: ArticleInfo = null;
  userInfo: UserInfo = null;
  markdownURL: string = "";
  destroyed = new Subject<void>();
  blogInfoFlexDirection: string = "row";
  // ai summarization setting
  disableAIAbstractBtn: boolean = false;
  rawMarkdown: string = "";
  AISummarization: string = "";
  AISummarizationResultIcon: string = "";

  markdownReady(event: { ready: boolean, titles: Array<Title> }) {
    if (event.ready) {
      this.titleArray = event.titles;
      setTimeout(() => {
        this.loading = false;
      }, 300)
      setTimeout(() => {
        hljs.highlightAll();
      }, 500);
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
    this.openSidebar = false;
  }
  snackBarTips(content: string) {
    this.snackbar.openFromComponent(SnackBarComponent, {
      data: {
        content: content
      }
    })
  }
  getAuthorInfo(usersID: Array<number>) {
    this.userService.GetPublicUsersInfo(usersID).subscribe({
      next: (val_userinfo) => {
        if (val_userinfo !== null) {
          this.userInfo = val_userinfo.result[0];
        } else {
          this.userInfo.Username = "获取文章作者信息失败";
        }
      },
      error: (err_userinfo) => {
        this.snackBarTips("获取文章作者信息失败");
        this.userInfo.Username = "获取文章作者信息失败";
      }
    })
  }

  onAIAbstractBtnClicked() {
    if (this.rawMarkdown !== "") {
      this.disableAIAbstractBtn = true;
      this.AISummarization = "";
      this.AISummarizationResultIcon = "";
      this.aiservice.StreamGetAISummarizationResponse(this.rawMarkdown, this.blogInfo.ID).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            const partial = (event as HttpDownloadProgressEvent).partialText!;
            this.AISummarization = partial;
          } else if (event.type === HttpEventType.Response) {
            // AI finished summarization
            this.AISummarizationResultIcon = "download_done";
          }
        },
        error: (err) => {
          const e = err as HttpErrorResponse;
          this.AISummarization = e.message;
          this.AISummarizationResultIcon = "dangerous";
          this.disableAIAbstractBtn = false;
        }
      })
    }
  }

  getRawMarkdown(event: string) {
    this.rawMarkdown = event;
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

              // get article author public info
              const usersID: Array<number> = [value.result.Uid];
              this.getAuthorInfo(usersID);
            },
            error: (err) => {
              this.snackBarTips("文章不存在");
            }
          })
        } else {
          this.markdownURL = this.blogInfo.Content;
          // get article author public info
          const usersID: Array<number> = [this.blogInfo.Uid];
          this.getAuthorInfo(usersID);
        }
      }
    })

    // UI display control
    this.breakpointServer.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]).pipe(takeUntil(this.destroyed)).subscribe(result => {
      if (result.matches) {
        this.blogInfoFlexDirection = "column";
      } else {
        this.blogInfoFlexDirection = "row";
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
