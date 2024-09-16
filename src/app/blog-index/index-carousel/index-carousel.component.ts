import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgStyle } from '@angular/common';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-carousel',
  standalone: true,
  imports: [
    MatCardModule,
    NgStyle
  ],
  templateUrl: './index-carousel.component.html',
  styleUrl: './index-carousel.component.scss',
  providers: []
})
export class IndexCarouselComponent implements OnInit, OnDestroy, OnChanges {
  @Input() carouselWidth: number = 0;
  @Input() direction: number = 0;
  @Output() indexUpdated = new EventEmitter<{ idx: number, total: number }>;
  constructor(private router:Router){}
  private autoPlaySubscription: Subscription = Subscription.EMPTY;
  private el_slideTrack: HTMLElement;

  TextArray = [
    "1111111111111111111",
    "2222222222222222222222",
    "333333333333333333333333333",
    "4444444444444444444444444444444",
    "5555555555555555555555555555555555"
  ]

  // carousel scrolling
  startPos: number = 0;
  currentPos: number = 0;
  step: number = 0;
  slideIndex: number = 0;
  slideNum: number = 0;
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
    this.autoPlaySubscription = interval(5000).subscribe(()=>this.Next_Slide());
  }
  onCardClicked(blogID:number){
    this.router.navigate(["blog",blogID])
  }

  // angular lifecycle
  ngOnInit(): void {
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
    this.autoPlaySubscription = interval(5000).subscribe(()=>this.Next_Slide());
    this.indexUpdated.emit({ idx: this.slideIndex, total: this.slideNum });


    // when using EventListener, you should be really carefully check the 'this' context
    this.onSlideMouseIn = this.onSlideMouseIn.bind(this);
    this.onSlideMouseOut = this.onSlideMouseOut.bind(this);
    this.el_slideTrack.addEventListener("mouseenter", this.onSlideMouseIn);
    this.el_slideTrack.addEventListener("mouseleave", this.onSlideMouseOut);
  }

  ngOnDestroy(): void {
    this.autoPlaySubscription.unsubscribe();
    this.el_slideTrack.removeEventListener("mouseenter", this.onSlideMouseIn);
    this.el_slideTrack.removeEventListener("mouseleave", this.onSlideMouseOut);
  }
  ngOnChanges(changes: SimpleChanges): void {
    const val = changes["direction"];
    if (!val.firstChange) {
      if (val.currentValue > val.previousValue) { // turn right
        this.Next_Slide()
      } else { // turn left
        this.Pre_Slide()
      }
    }
  }
}
