import { Component } from '@angular/core';
import { NavBarComponent } from '../shared/nav-bar/nav-bar.component'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { slideInAnimation } from '../route-animations/animations';

var RefreshBtnOffsetTop = -1;
export function SetRefreshBtnOffsetTop(offset:number){
  RefreshBtnOffsetTop = offset;
}
export function GetRefreshBtnOffsetTop(){
  return RefreshBtnOffsetTop;
}
@Component({
  selector: 'app-blog-index',
  standalone: true,
  imports: [
    // material design component
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    // Angular component
    RouterOutlet,
    // custom component
    NavBarComponent,
  ],
  templateUrl: './blog-index.component.html',
  styleUrl: './blog-index.component.scss',
  animations:[
    slideInAnimation,
  ]
})

export class BlogIndexComponent {
  constructor(private contexts: ChildrenOutletContexts) {}
  getRouteAnimationData() {
    // const ret = this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    // console.log(ret);
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    // return ret;
  }
}
