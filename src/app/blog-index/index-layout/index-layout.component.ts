import { ChangeDetectorRef, Component } from '@angular/core';
import { InfiniteCarouselComponent } from "../../shared/infinite-carousel/infinite-carousel.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgStyle, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../shared/nav-bar/nav-bar.component';
import { IndexCarouselComponent } from '../index-carousel/index-carousel.component';
import { Observable } from 'rxjs';

import { Article } from '../../shared/interfaces/article';
import { GetRefreshBtnOffsetTop, SetRefreshBtnOffsetTop } from '../blog-index.component';

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
    NgStyle,
    NgFor,
    RouterOutlet,
    // custom component
    MatProgressBarModule,
    NavBarComponent,
    IndexCarouselComponent,
    InfiniteCarouselComponent,
  ],
  templateUrl: './index-layout.component.html',
  styleUrl: './index-layout.component.scss'
})
export class IndexLayoutComponent {
  constructor(
    private cd:ChangeDetectorRef,
    private router:Router,
  ){}
  private element_grid_list:HTMLElement;
  setCarouselWidth: number = 0;
  orientaion: number = 0;
  progressBarVal: number = 0;
  refreshBtnTop:string = "";
  articlesArray:Array<Article> = [];

  categoryName:string[] = [
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


  test_observable = new Observable()

  onCarouselLeftClicked() {
    this.orientaion -= 1;
  }
  onCarouselRightClicked() {
    this.orientaion += 1;
  }
  onCarouselProgressBarUpdated(data: { idx: number, total: number }) {
    this.progressBarVal = ((data.idx + 1) / data.total) * 100;
  }

  onCardClicked(blogID:number){
    this.router.navigate(["blog",blogID]);
  }
  onCategoryClicked(categoryID:number){
    this.router.navigate(['category',categoryID]);
  }
  onRefreshBtnClicked(){
    
    this.articlesArray = []
    for(let i=0;i<6;i++){
      this.articlesArray.push({
        ID:Math.random()*100,
        CreateAt:new Date(Date.UTC(Math.trunc(Math.random()*3000))).toLocaleString(),
        UpdateAt:"2024",
        Title:"this is title",
        Desc:"this is description",
        Content:"this is content",
        PageView:Math.random()*100
      })
    }
  }

  ngOnInit(): void {

    this.element_grid_list = document.getElementById("grid-list") as HTMLElement
    this.setCarouselWidth =  this.element_grid_list.offsetWidth * 0.333333 - 13.333;

    for(let i=0;i<6;i++){
      this.articlesArray.push({
        ID:Math.random()*100,
        CreateAt:"2024",
        UpdateAt:"2024",
        Title:"this is title",
        Desc:"this is description",
        Content:"this is content",
        PageView:Math.random()*100
      })
    }
  }
  ngAfterViewInit(): void {
    // if (this.refreshBtnTop === ""){
    //   this.refreshBtnTop = `${this.element_grid_list.offsetTop}px`;
    // }
    const offset = GetRefreshBtnOffsetTop();
    if(offset<0){
      const offsetTop = this.element_grid_list.offsetTop
      this.refreshBtnTop = `${offsetTop}px`;
      SetRefreshBtnOffsetTop(offsetTop);
    }else{
      this.refreshBtnTop = `${offset}px`
    }
    this.cd.detectChanges()
  }
}
