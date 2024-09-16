import { Component, OnInit } from '@angular/core';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import {MatPaginatorModule,MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { Article } from '../../shared/interfaces/article';


@Component({
  selector: 'app-index-category',
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    MatPaginatorModule,
    NzSkeletonModule
  ],
  templateUrl: './index-category.component.html',
  styleUrl: './index-category.component.scss'
})
export class IndexCategoryComponent implements OnInit{
  constructor(
    private paginatorOpt:MatPaginatorIntl,
    private router:Router,
  ){
    paginatorOpt.itemsPerPageLabel = "页数"
  }
  blogs:Array<Article> = [ ]
  length = 50;
  pageSize = 10;
  pageIndex = 0;

  handlePageEvent(event:PageEvent){
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.length = event.length;
    this.blogs = [];
    for(let i=0;i<event.pageSize;i++){
      this.blogs.push({
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
  onCardClicked(blogID:number){
    this.router.navigate(["blog",blogID])
  }

  ngOnInit(): void {
      for(let i=0;i<this.pageSize;i++){
        this.blogs.push({
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
}
