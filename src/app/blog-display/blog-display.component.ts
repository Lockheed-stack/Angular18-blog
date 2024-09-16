import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavBarComponent } from '../shared/nav-bar/nav-bar.component';
import { BlogMarkdownComponent, Title } from './blog-markdown/blog-markdown.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import {CdkDrag} from '@angular/cdk/drag-drop';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {CdkListbox, CdkOption} from '@angular/cdk/listbox';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import hljs from 'highlight.js/lib/common';
import hljs_dockerfile from 'highlight.js/lib/languages/dockerfile'

hljs.registerLanguage('dockerfile',hljs_dockerfile);


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
export class BlogDisplayComponent implements OnInit,OnChanges{

  loading:boolean = false;
  openSidebar:boolean = false;
  titleArray:Array<Title> = [];
  constructor(  ){ }


  markdownReady(event:{ready:boolean,titles:Array<Title>}){
    if (event.ready){
      this.loading = false;
      this.titleArray = event.titles;

      setTimeout(() => {
        hljs.highlightAll();
      }, 200);
    }
  }

  closeBookMark(){
    this.openSidebar = false;
  }
  onBookMarkClicked(){
    this.openSidebar = true;
  }
  onBookMarkItemClicked(titleID:string){
    const element = document.getElementById(titleID);
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
  }


  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
      console.log(changes)
  }
}
