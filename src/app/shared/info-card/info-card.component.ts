import { NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
interface BingImgResponse {
  start_date?: string;
  end_date?: string;
  url: string;
  copyright?: string;
  copyright_link?: string;
}

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [
    NgStyle,
    MatIconModule,
  ],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss'
})
export class InfoCardComponent implements OnInit {

  constructor(
    private http: HttpClient,
  ) { }
  @Input() blogInfoInput: { title: string, desc: string, pageview: number };
  @Input() authorInfoInput: { username: string, desc: string, avatar: string };

  blogInfoBg: string = "";
  userInfoBg: string = "";

  getInfoCardBingImg() {
    const url = "https://bing.biturl.top/";

    // get bloginfo background-image
    this.http.get<BingImgResponse>(
      url,
      {
        params: {
          resolution: "400x240",
          format: "json",
          mkt: "zh-CN"
        }
      }
    ).subscribe({
      next: (value) => {
        this.blogInfoBg = `url(${value.url})`;
      }
    })

    // get userinfo background-image
    this.http.get<BingImgResponse>(
      url,
      {
        params: {
          resolution: "400x240",
          format: "json",
          mkt: "en-US"
        }
      }
    ).subscribe({
      next: (value) => {
        this.userInfoBg = `url(${value.url})`;
      }
    })
  }

  ngOnInit(): void {
    this.getInfoCardBingImg();
  }
}
