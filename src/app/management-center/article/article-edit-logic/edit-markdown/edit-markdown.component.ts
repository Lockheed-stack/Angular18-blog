import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MarkdownModule, KatexOptions } from 'ngx-markdown';
import hljs from 'highlight.js/lib/common';
import hljs_dockerfile from 'highlight.js/lib/languages/dockerfile'


hljs.registerLanguage('dockerfile', hljs_dockerfile);

@Component({
  selector: 'app-edit-markdown',
  standalone: true,
  imports: [
    MarkdownModule,
  ],
  templateUrl: './edit-markdown.component.html',
  styleUrl: './edit-markdown.component.scss'
})
export class EditMarkdownComponent implements OnInit {
  constructor(
    private http: HttpClient
  ) { }
  @Output() loaded: EventEmitter<string> = new EventEmitter<string>;
  @Input() data: string = "";
  @Input() mode: number = 0; // 0: add a blog; 1: update a blog
  @Input() url: string = "";
  firstRender: boolean = true;
  katexOpt: KatexOptions = {
    throwOnError: false,
    output: "mathml",
    displayMode: true
  }

  onReady() {
    if (this.firstRender && this.data !== "") {
      this.loaded.emit(this.data);
      this.firstRender = false;
    }

    hljs.highlightAll();
  }
  ngOnInit(): void {
    if (this.mode === 1) { // fetch the original blog
      this.http.get(this.url, {
        responseType: "text",
      }).subscribe(
        {
          next: (val) => {
            this.data = val;
          },
          error: (err) => {
            const e = (err as HttpErrorResponse).message;
            this.data = 
            `# 无法获取文章
            ## 出现错误：${e}
            `;
          }
        }
      )
    }
  }
}
