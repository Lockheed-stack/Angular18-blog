import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgStyle } from '@angular/common';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleInfo, ArticlesService } from '../../services/articles.service';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { UserInfo, UserService } from '../../services/user.service';

@Component({
  selector: 'app-index-carousel',
  standalone: true,
  imports: [
    MatCardModule,
    NgStyle,
    NzSkeletonModule,
  ],
  templateUrl: './index-carousel.component.html',
  styleUrl: './index-carousel.component.scss',
  providers: []
})
export class IndexCarouselComponent implements OnInit, OnDestroy, OnChanges {
  @Input() carouselWidth: number = 0;
  @Input() direction: number = 0;
  @Output() indexUpdated = new EventEmitter<{ idx: number, total: number }>;
  constructor(
    private router: Router,
    private articleService: ArticlesService,
    private userService: UserService
  ) { }
  private autoPlaySubscription: Subscription = Subscription.EMPTY;
  private el_slideTrack: HTMLElement;

  // max length: 5
  TextArray: Array<ArticleInfo> = [];
  // user info
  UserIdArray: Array<number> = [];
  UserIdMap: Map<number, UserInfo> = new Map<number, UserInfo>();
  // carousel scrolling
  startPos: number = 0;
  currentPos: number = 0;
  step: number = 0;
  slideIndex: number = 0;
  slideNum: number = 0;
  loading: boolean = true;
  private animateOption: KeyframeAnimationOptions = {
    duration: 1000,
    easing: "cubic-bezier(.20,.94,.43,1)",
    iterations: 1,
    fill: "forwards"
  };

  Next_Slide() {
    let idx = (this.slideIndex + 1) % (this.slideNum);
    this.currentPos = this.startPos - this.step * this.slideIndex;
    if (idx !== 0) {
      var scrollKeyFrame = [
        { transform: `translateX(${this.currentPos}%)` },
        { transform: `translateX(${this.currentPos - this.step}%)` }
      ];

    } else {
      var scrollKeyFrame = [
        { transform: `translateX(${this.currentPos}%)` },
        { transform: `translateX(${this.startPos}%)` }
      ];
    }

    this.el_slideTrack.animate(scrollKeyFrame, this.animateOption);
    this.slideIndex = idx;
    this.indexUpdated.emit({ idx: this.slideIndex, total: this.slideNum });
  }

  Pre_Slide() {
    let idx = this.slideIndex - 1;
    if (idx < 0) {
      this.slideIndex = this.slideNum - 1;
      this.currentPos = this.startPos - this.step * this.slideIndex;
      var scrollKeyFrame = [
        { transform: `translateX(${this.startPos}%)` },
        { transform: `translateX(${this.currentPos}%)` }
      ];
    } else {
      this.currentPos = this.startPos - this.step * this.slideIndex;
      var scrollKeyFrame = [
        { transform: `translateX(${this.currentPos}%)` },
        { transform: `translateX(${this.currentPos + this.step}%)` }
      ];
      this.slideIndex = idx;
    }

    this.el_slideTrack.animate(scrollKeyFrame, this.animateOption);
    this.indexUpdated.emit({ idx: this.slideIndex, total: this.slideNum });
  }

  onSlideMouseIn() {
    this.autoPlaySubscription.unsubscribe();
  }
  onSlideMouseOut() {
    this.autoPlaySubscription = interval(5000).subscribe(() => this.Next_Slide());
  }
  onCardClicked(blogID: number) {
    this.router.navigate(["blog", blogID])
  }

  getUserInfo(uid: number, type: string) {
    switch (type) {
      case "avatar": {
        return this.UserIdMap.get(uid) === undefined ? "url(https://placehold.co/100x100?text=?)" : `url(${this.UserIdMap.get(uid).Avatar})`;
      }
      case "name": {
        return this.UserIdMap.get(uid) === undefined ? "无法获取用户名" : this.UserIdMap.get(uid).Username;
      }
      default: {
        return "";
      }
    }
  }

  // angular lifecycle
  ngOnInit(): void {
    this.TextArray = this.articleService.GetArticlePlaceholder(1);
    /* Get Blogs for carousel */
    this.articleService.GetArticlesForRecommend(5, 1).subscribe({
      next: (value) => {
        this.TextArray = value.result;
        for (let index = 0; index < this.TextArray.length; index++) {
          const element = this.TextArray[index];
          this.UserIdArray.push(element.Uid);
        }
        /* Get blogs owners infomation */
        this.userService.GetPublicUsersInfo(this.UserIdArray).subscribe({
          next: (value) => {
            for(let item of value.result){
              this.UserIdMap.set(item.ID,item);
            }
            this.loading = false;
          },
          error: (err) => {
            this.UserIdMap.set(-1, {
              Username: "无法获取用户名",
              Avatar: "https://placehold.co/100x100?text=?",
              ID: -1,
            })
            this.loading = false;
          }
        })
      },
      error: (err) => {
        this.TextArray[0].Title = "无法获取文章";
        this.TextArray[0].Desc = "文章服务出现错误，请稍后尝试"
        this.TextArray[0].Img = "https://placehold.co/200x200?text=Image"
        this.loading = false;
      },
      complete: () => {
        /* carousel control setting */
        this.carouselWidth = this.carouselWidth * 0.95;
        this.el_slideTrack = document.getElementById("slide-track");
        this.slideNum = this.TextArray.length;
        if (this.slideNum === 0) {
          this.startPos = 100;
        } else {
          // notice: need to check odd/even while the data type is int. But the data type is number in there.
          this.step = 100 / this.slideNum;
          this.startPos = (this.step) * ((this.slideNum - 1) * 0.5);
        }
        this.el_slideTrack.style.transform = `translateX(${this.startPos}%)`;
        this.autoPlaySubscription = interval(5000).subscribe(() => this.Next_Slide());
        this.indexUpdated.emit({ idx: this.slideIndex, total: this.slideNum });


        // when using EventListener, you should be really carefully check the 'this' context
        this.onSlideMouseIn = this.onSlideMouseIn.bind(this);
        this.onSlideMouseOut = this.onSlideMouseOut.bind(this);
        this.el_slideTrack.addEventListener("mouseenter", this.onSlideMouseIn);
        this.el_slideTrack.addEventListener("mouseleave", this.onSlideMouseOut);
      }
    })

  }

  ngOnDestroy(): void {
    this.autoPlaySubscription.unsubscribe();
    this.el_slideTrack.removeEventListener("mouseenter", this.onSlideMouseIn);
    this.el_slideTrack.removeEventListener("mouseleave", this.onSlideMouseOut);
  }
  ngOnChanges(changes: SimpleChanges): void {
    const val = changes["direction"];
    if (val !== undefined && !val.firstChange) {
      if (val.currentValue > val.previousValue) { // turn right
        this.Next_Slide()
      } else { // turn left
        this.Pre_Slide()
      }
    }
  }
}
