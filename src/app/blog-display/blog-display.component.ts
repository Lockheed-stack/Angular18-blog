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
import {MatCardModule} from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../shared/snack-bar/snack-bar.component';
import { UserInfo, UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';

hljs.registerLanguage('dockerfile', hljs_dockerfile);


@Component({
  selector: 'app-blog-display',
  standalone: true,
  imports: [
    NavBarComponent,
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
  ],
  templateUrl: './blog-display.component.html',
  styleUrl: './blog-display.component.scss',
})
export class BlogDisplayComponent implements OnInit, OnChanges {

  constructor(
    private articleService: ArticlesService,
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }
  readonly snackbar = inject(MatSnackBar);
  loading: boolean = true;
  openSidebar: boolean = false;
  titleArray: Array<Title> = [];
  blogInfo: ArticleInfo = null;
  userInfo: UserInfo = null;
  markdownURL: string = "";

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
              const usersID: Array<number> = [value.result.Uid]
              this.userService.GetPublicUsersInfo(usersID).subscribe({
                next: (val_userinfo) => {
                  if (val_userinfo!==null){
                    this.userInfo = val_userinfo.result[0];
                  }else{
                    this.userInfo.Username = "获取文章作者信息失败";  
                  }
                },
                error: (err_userinfo) => {
                  this.snackBarTips("获取文章作者信息失败");
                  this.userInfo.Username = "获取文章作者信息失败";
                }
              })
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
