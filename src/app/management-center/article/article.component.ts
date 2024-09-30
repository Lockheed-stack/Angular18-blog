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
import { ArticleInfo } from '../../services/articles.service';


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
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paginatorOpt: MatPaginatorIntl,
  ) {
    this.paginatorOpt.lastPageLabel = "页数";
  }
  readonly dialog = inject(MatDialog);
  readonly snackbar = inject(MatSnackBar);
  dialogRef: MatDialogRef<ConfirmDialogComponent>;
  subscription: Subscription = new Subscription();

  categoryName: string[] = [
    "Ne pro case",
    "possim dolorum.",
    "Ne consul ubique",
    "aperiri quo.",
    "Et eum commodo facilis.Rebum",
    "每次组件输入发生变化时运行。",
    "ei pro",
    "porro verear",
    "malorum qui cu",
    "eum ad purto",
    "possit aliquid."
  ];
  selectedItem: string = this.categoryName[0];

  blogs: Array<ArticleInfo> = []
  length = 50;
  pageSize = 10;
  pageIndex = 0;

  onCategoryClicked(cid: number) {
    this.selectedItem = this.categoryName[cid];
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.length = event.length;
    this.blogs = [];
    for (let i = 0; i < event.pageSize; i++) {
      this.blogs.push({
        ID: Math.random() * 100,
        CID: Math.random() * 100,
        UID: Math.random() * 100,
        CreatedAt: new Date(Date.UTC(Math.trunc(Math.random() * 3000))).toLocaleString(),
        UpdatedAt: "2024",
        Title: "this is title",
        Desc: "this is description",
        Content: "this is content",
        PageView: Math.random() * 100
      })
    }
  }

  onCardClicked(blogID: number) {
    this.router.navigate(["blog", blogID])
  }
  onEditBtnClicked(blog: ArticleInfo) {
    set_selected_edit_blog(blog);
    this.router.navigate(
      ['ModifyBlog'],
      { relativeTo: this.route.parent, queryParams: { id: blog.ID,category:this.categoryName[0]} }
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
    for (let i = 0; i < this.pageSize; i++) {
      this.blogs.push({
        ID: Math.random() * 100,
        CID: Math.random() * 100,
        UID: Math.random() * 100,
        CreatedAt: "2024",
        UpdatedAt: "2024",
        Title: "this is title",
        Desc: "this is description",
        Content: "this is content",
        PageView: Math.random() * 100
      })
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
