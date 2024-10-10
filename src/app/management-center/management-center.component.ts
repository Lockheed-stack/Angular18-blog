import { AsyncPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DarkLightService } from '../services/dark-light.service';

interface ListOptionContent {
  router_navgate: string,
  isSelected: boolean,
  icon?: string,
  content: string,
  extend: boolean,
  level: number,
  belongTo: string,
}

@Component({
  selector: 'app-management-center',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
  ],
  templateUrl: './management-center.component.html',
  styleUrl: './management-center.component.scss'
})
export class ManagementCenterComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dark_light_srv: DarkLightService
  ) { }
  readonly dialog = inject(MatDialog);
  logoutDialogRef: MatDialogRef<ConfirmDialogComponent>;
  subscription: Subscription = new Subscription();
  theme = "light_mode";
  sideNavExpandCtr: Map<string, boolean> = new Map<string, boolean>([
    ["article", false],
    ["category", false],
    ["", true]
  ])
  sideNavList: Array<ListOptionContent> = [
    { router_navgate: "dashboard", isSelected: true, icon: "query_stats", content: "统计信息", extend: false, level: 1, belongTo: "" },
    { router_navgate: "user", isSelected: false, icon: "manage_accounts", content: "个人中心", extend: false, level: 1, belongTo: "" },
    { router_navgate: "article", isSelected: false, icon: "article", content: "文章管理", extend: true, level: 1, belongTo: "" },
    { router_navgate: "allArticle", isSelected: false, icon: "view_cozy", content: "我的文章", extend: false, level: 2, belongTo: "article" },
    { router_navgate: "WriteArticle", isSelected: false, icon: "edit_note", content: "写文章", extend: false, level: 2, belongTo: "article" },
    { router_navgate: "category", isSelected: false, icon: "category", content: "文章分类", extend: true, level: 1, belongTo: "" },
    { router_navgate: "allCategory", isSelected: false, icon: "ballot", content: "所有分类", extend: false, level: 2, belongTo: "category" },
    { router_navgate: "addCategory", isSelected: false, icon: "add", content: "添加分类", extend: false, level: 2, belongTo: "category" },

  ]
  onLogoutBtnClicked() {
    this.logoutDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "退出登录?",
        content: "是否退出登录"
      }
    })

    this.subscription = this.logoutDialogRef.afterClosed().subscribe(() => {
      if (this.logoutDialogRef.componentInstance.is_yes) {
        window.sessionStorage.clear();
        this.router.navigate([''], { relativeTo: this.route.root });
      }
    })
  }

  onNavBtnClick(dest: string) {
    switch (dest) {
      case "article":{

        const val = !this.sideNavExpandCtr.get("article");
        this.sideNavExpandCtr.set("article", val);
        break;
      }
      case "category":{
        const val = !this.sideNavExpandCtr.get("category");
        this.sideNavExpandCtr.set("category", val);
        break;
      }
      default:
        this.router.navigate([dest], { relativeTo: this.route });

    }
  }
  onIndexBtnClick() {
    this.router.navigate([''], { relativeTo: this.route.root });
  }

  toggleTheme() {
    const result = this.dark_light_srv.toggle_theme();
    if (result) {
      this.theme = "dark_mode";
    } else {
      this.theme = "light_mode";
    }
  }

  ngOnInit() {
    // this.router.navigate(['dashboard'],{relativeTo:this.route})
    if (this.dark_light_srv.get_theme()) {
      this.theme = "dark_mode";
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
