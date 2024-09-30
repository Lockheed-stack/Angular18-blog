import { Component, inject, OnInit } from '@angular/core';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { MatPaginatorModule, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';
import { ArticleInfo, ArticlesService } from '../../services/articles.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-index-category',
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    MatPaginatorModule,
    NzSkeletonModule,
    CommonModule
  ],
  templateUrl: './index-category.component.html',
  styleUrl: './index-category.component.scss'
})
export class IndexCategoryComponent implements OnInit {
  constructor(
    private paginatorOpt: MatPaginatorIntl,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private articleService: ArticlesService,
    private breakpointServer: BreakpointObserver
  ) {
    paginatorOpt.itemsPerPageLabel = "页数"
  }
  readonly snackbar = inject(MatSnackBar);
  destroyed = new Subject<void>();
  breakPoint:number = 5;
  blogs: Array<ArticleInfo> = []
  categoryName: string = "";
  length = 0;
  pageSize = 10;
  pageIndex = 0;

  handlePageEvent(event: PageEvent) {
    // this.pageSize = event.pageSize;
    // this.pageIndex = event.pageIndex;
    // this.length = event.length;
    // this.blogs = [];
  }

  displayArticleInfo(cid: number, pagesize: number, pagenum: number) {
    this.articleService.GetArticleListByCid(cid, pagesize, pagenum+1).subscribe({
      next: (value) => {
        if (value.total === undefined) {
          this.length = 0;
          this.snackBarTips("无法获取文章信息");
        } else {
          this.length = value.total;
          this.blogs = value.result;
        }
      },
      error: (err) => {
        const e = (err as HttpErrorResponse).message;
        this.snackBarTips(`出现错误: ${e}`);
      }
    })
  }
  onCardClicked(blogID: number) {
    for (let index = 0; index < this.blogs.length; index++) {
      if(this.blogs[index].ID === blogID){
        this.articleService.SetPreparedBlog(this.blogs[index]);
        this.router.navigate(["blog", blogID]);
        break;
      }
    }
  }
  snackBarTips(content: string) {
    this.snackbar.openFromComponent(SnackBarComponent, {
      data: {
        content: content
      }
    })
  }

  ngOnInit(): void {

    // Get article info
    this.route.paramMap.subscribe(
      (value) => {
        const cid = value.get("cid");
        if (cid === null) {
          this.snackBarTips("未知分类");
        } else {
          // if the category info has never been initialized before
          if (this.categoryService.GetCategoryInfoMap().size === 0) {
            this.categoryService.GetAllCategory().subscribe({
              next: (value) => {
                this.categoryService.CacheCategoryInfoArray(value);
                this.categoryName = this.categoryService.GetCategoryInfoMap().get(Number(cid));
              },
              error: (err) => {
                this.snackBarTips("无法从服务器获取分类信息");
              },
              complete: () => {
                // if get the correct category info, then get articles info.
                this.displayArticleInfo(Number(cid),this.pageSize,this.pageIndex);
              }
            })
          } else {
            this.categoryName = this.categoryService.GetCategoryInfoMap().get(Number(cid));
            // if get the correct category info, then get articles info.
            this.displayArticleInfo(Number(cid),this.pageSize,this.pageIndex);
          }
        }
      }
    )

    // UI control
    this.breakpointServer.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]).pipe(takeUntil(this.destroyed)).subscribe(result => {
      if (result.matches) {
        this.breakPoint = 2;
      } else {
        this.breakPoint = 5;
      }
    });

  }
}
