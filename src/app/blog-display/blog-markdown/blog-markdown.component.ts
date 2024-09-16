import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
// import hljs from 'highlight.js/lib/common';
// import hljs_dockerfile from 'highlight.js/lib/languages/dockerfile'


// hljs.registerLanguage('dockerfile',hljs_dockerfile);

export interface Title {
  level: number,
  TitleId: string,
  TitleName: string,
}

@Component({
  selector: 'app-blog-markdown',
  standalone: true,
  imports: [
    MarkdownModule,
  ],
  templateUrl: './blog-markdown.component.html',
  styleUrl: './blog-markdown.component.scss'
})
export class BlogMarkdownComponent implements OnInit{
  constructor(
    private markdownService:MarkdownService,
  ){ }
  @Output() isReady:EventEmitter<{ready:boolean,titles:Array<Title>}> = new EventEmitter<{ready:boolean,titles:Array<Title>}>;
  titleArray: Array<Title> = [];
  titleNum: number = 0;

  renderHeading() {
    this.markdownService.renderer.heading = (text: string, level: number) => {
      this.titleNum++;
      const title: Title = {
        level: level,
        TitleId: "title".concat(String(this.titleNum)),
        TitleName: text,
      }
      this.titleArray.push(title);

      return `<h${level} id=${title.TitleId}><a></a>${text}</h${level}>`;
    };
  }

  onReady(){
    console.log("ready: parsing is completed")
    // console.log(this.titleArray);
    this.isReady.emit({
      ready:true,
      titles:this.titleArray
    });
    // this.cd.detectChanges();
  }
  onLoad(){
    // console.log("loading finish")
  }
  ngOnInit(): void {
    this.renderHeading();
  }
}
