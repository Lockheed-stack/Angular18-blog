import { Component,  OnDestroy, OnInit, } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-infinite-carousel',
  standalone: true,
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './infinite-carousel.component.html',
  styleUrl: './infinite-carousel.component.scss'
})
export class InfiniteCarouselComponent implements OnInit, OnDestroy {

  constructor(private breakpointServer: BreakpointObserver) { }
  poweredby: Array<{ logo: string, site: string }> = [
    { logo: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png", site: "https://google.com" },
    { logo: "https://angular.dev/assets/images/press-kit/angular_wordmark_gradient.png", site: "https://angular.dev" },
    { logo: "https://indexnowvideos.azureedge.net/logos/24CloudFlare.png", site: "https://www.cloudflare-cn.com/" },
    { logo: "https://static.wikia.nocookie.net/logopedia/images/9/9a/Visual_Studio_Code_1.35_icon.svg/revision/latest?cb=20231105010051", site: "https://code.visualstudio.com" },
    { logo: "https://build5nines.com/wp-content/uploads/2022/07/microsoft-azure-logo-2018-text-980x181.jpg", site: "https://portal.azure.com" },
    { logo: "https://go-kratos.dev/img/logo.svg", site: "https://go-kratos.dev/docs/" },
    { logo: "https://assets.codepen.io/t-1/codepen-logo.svg", site: "https://codepen.io" },
    { logo: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png", site: "https://github.com/" },
    { logo: "https://logos-world.net/wp-content/uploads/2021/02/Docker-Logo.png", site: "https://www.docker.com/" },
  ]

  destroyed = new Subject<void>();
  ngOnInit(): void {
    // UI display control
    const el_container = document.getElementById("infinite-carousel-container");
    const el_slider = document.getElementById("infinite-carousel-slider");
    this.breakpointServer.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]).pipe(takeUntil(this.destroyed)).subscribe(result => {
      if (result.matches) {
        el_container.style.flexDirection = "column";
        el_slider.style.width = "90%";
      } else {
        el_container.style.flexDirection = "row";
        el_slider.style.width = "60%";
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
