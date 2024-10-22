import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';
import { ArticleInfo, ArticlesService } from '../../services/articles.service';
import { CategoryInfo, CategoryService } from '../../services/category.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';


var _selected_edit_blog: ArticleInfo = null;
export function get_selected_edit_blog() {
  return _selected_edit_blog;
}
export function set_selected_edit_blog(blog: ArticleInfo) {
  _selected_edit_blog = { ...blog };
}


@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    MatGridListModule,
    MatButtonModule,
    MatGridListModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paginatorOpt: MatPaginatorIntl,
    private articleService: ArticlesService,
    private categoryService: CategoryService,
  ) {
    this.paginatorOpt.lastPageLabel = "页数";
  }
  readonly dialog = inject(MatDialog);
  readonly snackbar = inject(MatSnackBar);
  dialogRef: MatDialogRef<ConfirmDialogComponent>;
  subscription: Subscription = new Subscription();

  // category
  categoryInfo: Array<CategoryInfo> = [];
  selectedCategoryItem: string = "";

  // blog
  blogs: Array<ArticleInfo> = []
  length = 50;
  pageSize = 10;
  pageIndex = 0;

  // user
  userid: number = -1;

  onCategoryClicked(cid: number,name:string) {
    this.selectedCategoryItem = name;
    this.displayArticleInfo(cid,this.userid,this.pageSize,this.pageIndex);
  }

  snackBarTips(content: string) {
    this.snackbar.openFromComponent(SnackBarComponent, {
      data: {
        content: content
      }
    })
  }
  handlePageEvent(event: PageEvent) {
    // this.pageSize = event.pageSize;
    // this.pageIndex = event.pageIndex;
    // this.length = event.length;
    // this.blogs = [];
    // for (let i = 0; i < event.pageSize; i++) {
    //   this.blogs.push({
    //     ID: Math.random() * 100,
    //     Cid: Math.random() * 100,
    //     Uid: Math.random() * 100,
    //     CreatedAt: new Date(Date.UTC(Math.trunc(Math.random() * 3000))).toLocaleString(),
    //     UpdatedAt: "2024",
    //     Title: "this is title",
    //     Desc: "this is description",
    //     Content: "this is content",
    //     PageView: Math.random() * 100
    //   })
    // }
  }
  displayArticleInfo(cid: number,uid: number, pagesize: number, pagenum: number){
    this.articleService.GetArticleListByCidAndUid(cid,uid,pagesize,pagenum+1).subscribe({
      next:(value)=>{
        if(value.total===undefined){
          this.length=0;
          this.snackBarTips("无法获取文章信息");
        }else{
          this.length = value.total;
          this.blogs = value.result;
        }
      },
      error:(err)=>{
        const e = (err as HttpErrorResponse).message;
        this.snackBarTips(`出现错误: ${e}`);
      }
    })
  }

  onCardClicked(blogID: number) {
    this.router.navigate(["blog", blogID])
  }
  onEditBtnClicked(blog: ArticleInfo) {
    set_selected_edit_blog(blog);
    this.router.navigate(
      ['ModifyBlog'],
      { relativeTo: this.route.parent,}
    );
  }
  onDeleteBlogBtnClicked(blogID: number, blogName: string) {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "删除文章?",
        content: `是否删除文章: "${blogName}" ?`
      }
    })
    this.subscription.add(
      this.dialogRef.afterClosed().subscribe(() => {
        if (this.dialogRef.componentInstance.is_yes) {
          this.removeSelectedBlog(blogID);
          this.snackbar.openFromComponent(SnackBarComponent, {
            data: {
              content: "删除成功!"
            }
          })
        }
      })
    )
  }

  removeSelectedBlog(blogID: number) {
    for (let i = 0; i < this.blogs.length; i++) {
      if (this.blogs[i].ID === blogID) {
        this.blogs.splice(i, 1);
        return;
      }
    }
  }

  ngOnInit(): void {
    // get category info
    this.categoryService.GetAllCategory().subscribe({
      next: (value) => {
        this.categoryInfo = value;
        this.selectedCategoryItem = value[0].Name;

        // get blogs info
        const uid = Number(window.sessionStorage.getItem("UID"));
        this.userid = uid;
        this.displayArticleInfo(value[0].ID,uid,this.pageSize,this.pageIndex);
      },
      error:(err)=>{
        const e = (err as HttpErrorResponse).message;
        this.snackBarTips(`无法获取文章分类信息: ${e}`);
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
