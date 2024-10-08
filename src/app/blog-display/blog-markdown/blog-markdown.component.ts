import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { KatexOptions, MarkdownModule, MarkdownService } from 'ngx-markdown';
import { ArticlesService } from '../../services/articles.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
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
export class BlogMarkdownComponent implements OnInit, OnDestroy {
  constructor(
    private markdownService: MarkdownService,
    private articleService: ArticlesService,
    private breakpointServer: BreakpointObserver
  ) { }
  @Output() isReady: EventEmitter<{ ready: boolean, titles: Array<Title> }> = new EventEmitter<{ ready: boolean, titles: Array<Title> }>;
  @Input() blogURL: string = "";
  titleArray: Array<Title> = [];
  titleNum: number = 0;
  markdownData: string = "";
  markdown_width:string = "980px";
  katexOpt: KatexOptions = {
    throwOnError: false,
    output:"mathml",
    displayMode:true
  }
  destroyed = new Subject<void>();

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

  onReady() {
    // console.log("ready: parsing is completed")
    // console.log(this.titleArray);
    this.isReady.emit({
      ready: true,
      titles: this.titleArray
    });
    // this.cd.detectChanges();
  }
  onLoad() {
    // console.log("loading finish")
  }
  ngOnInit(): void {

    // UI control
    this.breakpointServer.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).pipe(takeUntil(this.destroyed)).subscribe(result => {
      for(const query of Object.keys(result.breakpoints)){
        if(result.breakpoints[query]){
          this.markdown_width = `${window.innerWidth}px`;
          break;
        }
      }
    });


    if (this.blogURL !== "") {
      this.articleService.GetMarkdown(this.blogURL).subscribe({
        next: (value) => {
          this.markdownData = value;
        },
        error: (err) => {
          this.markdownData = "# 文章不存在";
        },
        complete: () => {
          this.renderHeading();
        }
      })
    }
  }
  ngOnDestroy(): void {
    this.destroyed.unsubscribe();
  }
}
