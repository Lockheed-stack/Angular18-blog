import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, GuardsCheckEnd, NavigationCancel, NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { openAnimation } from './route-animations/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatProgressBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    openAnimation,
  ]
})
export class AppComponent implements OnInit {
  constructor(
    private contexts: ChildrenOutletContexts,
    private router: Router
  ) { }

  loading_management_center: boolean = false;

  getRouteAnimationData() {
    // const ret = this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    // console.log(ret);
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    // return ret;
  }
  ngOnInit(): void {
    this.router.events.subscribe(
      {
        next: (value) => {
          if (value instanceof NavigationStart) {
            if (value.url === "/management") {
              this.loading_management_center = true;
            }
          } else if (value instanceof NavigationEnd || value instanceof NavigationCancel) {
            // console.log("end:",value);
            this.loading_management_center = false;
          }
        }
      }
    )
  }
}
