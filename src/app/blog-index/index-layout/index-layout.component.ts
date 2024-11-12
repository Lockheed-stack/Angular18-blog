import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { InfiniteCarouselComponent } from "../../shared/infinite-carousel/infinite-carousel.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { DecimalPipe, NgStyle } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../shared/nav-bar/nav-bar.component';
import { IndexCarouselComponent } from '../index-carousel/index-carousel.component';
import { Observable, Subject, takeUntil } from 'rxjs';

import { GetRefreshBtnOffsetTop, SetRefreshBtnOffsetTop } from '../blog-index.component';
import { CategoryInfo, CategoryService } from '../../services/category.service';
import { ArticleInfo, ArticlesService } from '../../services/articles.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { GlobalService } from '../../services/global.service';
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-index-layout',
  standalone: true,
  imports: [
    // material design component
    MatSidenavModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    // Angular component
    DecimalPipe,
    NgStyle,
    // custom component
    MatProgressBarModule,
    IndexCarouselComponent,
    InfiniteCarouselComponent,
    FooterComponent,
    // ng-zorro
    NzSkeletonModule,
],
  templateUrl: './index-layout.component.html',
  styleUrl: './index-layout.component.scss'
})
export class IndexLayoutComponent implements OnInit, OnDestroy {
  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private categoryService: CategoryService,
    private articleService: ArticlesService,
    private globalService: GlobalService,
    private breakpointServer: BreakpointObserver
  ) { }

  // variables of UI control
  private element_grid_list: HTMLElement = null;
  private element_grid_tile_abstract: HTMLElement = null;
  setCarouselWidth: number = 0;
  orientaion: number = 0;
  progressBarVal: number = 0;
  refreshBtnTop: string = "";
  refreshBtnVisible:string = "hidden";
  destroyed = new Subject<void>();
  categoryBreakPoint: number = 8;
  blogAbstractBreakPoint: number = 9;
  carouselBreakPoint: number = 3;
  loading: boolean = true;
  // variables of data
  articlesArray: Array<ArticleInfo> = [];
  categoryInfo: Array<CategoryInfo> = [];


  onCarouselLeftClicked() {
    this.orientaion -= 1;
  }
  onCarouselRightClicked() {
    this.orientaion += 1;
  }
  onCarouselProgressBarUpdated(data: { idx: number, total: number }) {
    this.progressBarVal = ((data.idx + 1) / data.total) * 100;
  }
  onResize() {
    setTimeout(() => {
      const offsetTop = this.getOffsetTop(this.element_grid_tile_abstract);
      this.refreshBtnTop = `${offsetTop}px`;
      SetRefreshBtnOffsetTop(offsetTop);
    }, 400);
  }
  onCardClicked(blogID: number) {
    this.router.navigate(["blog", blogID]);
  }
  onCategoryClicked(categoryID: number) {
    this.router.navigate(['category', categoryID]);
  }
  getOffsetTop(el: HTMLElement) {
    return el.offsetParent ? el.offsetTop + this.getOffsetTop(el.offsetParent as HTMLElement) : el.offsetTop;
  }
  setRefreshBtnLocation() {
    const pre_offset = GetRefreshBtnOffsetTop();
    this.refreshBtnVisible = "visible";
    if (pre_offset < 0) {
      this.element_grid_tile_abstract = document.getElementById("grid-tile-abstract-0") as HTMLElement;
      const offsetTop = this.element_grid_tile_abstract.getBoundingClientRect().top;
      this.refreshBtnTop = `${offsetTop}px`;
      SetRefreshBtnOffsetTop(offsetTop);
    } else {
      this.refreshBtnTop = `${pre_offset}px`
    }
  }
  onRefreshBtnClicked() {
    this.loading = true;
    this.articlesArray = this.articleService.GetArticlePlaceholder(6);
    this.articleService.GetArticlesByRandom(6).subscribe({
      next: (value) => {
        this.articlesArray = value.result;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      },
      error: (err) => {
        this.articlesArray = [];
        this.articlesArray.push({
          ID: -1,
          Title: "文章服务出现问题",
          Desc: "placeholder",
          Content: "placeholder",
          Img: this.globalService.imagePlaceholder,
          PageView: 0
        })
        this.loading = false;
      },
    })
  }

  ngOnInit(): void {

    // UI display control
    this.element_grid_list = document.getElementById("grid-list") as HTMLElement;
    this.breakpointServer.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]).pipe(takeUntil(this.destroyed)).subscribe(result => {
      if (result.matches) {
        this.categoryBreakPoint = 4;
        this.blogAbstractBreakPoint = 4;
        this.carouselBreakPoint = 4;
        this.setCarouselWidth = this.element_grid_list.offsetWidth;
      } else {
        this.categoryBreakPoint = 8;
        this.blogAbstractBreakPoint = 9;
        this.carouselBreakPoint = 3;
        this.setCarouselWidth = this.element_grid_list.offsetWidth * 0.333333 - 13.333;
      }
    });
    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize);

    // get category info
    this.categoryInfo = this.categoryService.GetCategoryInfoArray();
    if (this.categoryInfo.length === 0) {
      this.categoryService.GetAllCategory().subscribe({
        next: (value) => {
          this.categoryInfo = value;
          this.categoryService.CacheCategoryInfoArray(value);
        },
        error: (err) => {
          this.categoryInfo.push({
            Name: "无法获取分类信息！",
            ID: -1
          })
        }
      })
    }

    // get random blogs
    this.articlesArray = this.articleService.GetArticlePlaceholder(6);
    this.articleService.GetArticlesByRandom(6).subscribe({
      next: (value) => {
        this.articlesArray = value.result;
        setTimeout(() => {
          this.loading = false;
          this.setRefreshBtnLocation();
        }, 500);
      },
      error: (err) => {
        this.articlesArray = [];
        this.articlesArray.push({
          ID: -1,
          Title: "文章服务出现问题",
          Desc: "placeholder",
          Content: "placeholder",
          Img: this.globalService.imagePlaceholder,
          PageView: 0
        })
        this.loading = false;
        this.setRefreshBtnLocation();
      },
    })
  }

  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
    window.removeEventListener("resize", this.onResize);
  }
}
