import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';
import { DarkLightService } from '../../services/dark-light.service';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    NgIf,
    RouterLink,
    LoginComponent,
    MatMenuModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private dark_light_srv: DarkLightService,
  ) { }
  readonly dialog = inject(MatDialog);
  dialogCfg: MatDialogConfig = new MatDialogConfig();
  loginDialogRef: MatDialogRef<LoginComponent>;
  logoutDialogRef: MatDialogRef<ConfirmDialogComponent>;
  subscription: Subscription = new Subscription();
  theme = "light_mode";
  avatarURL: string = "";


  toggleTheme() {
    const result = this.dark_light_srv.toggle_theme();
    if (result){
      this.theme = "dark_mode";
    }else{
      this.theme = "light_mode";
    }
  }
  openLoginDialog() {
    this.loginDialogRef = this.dialog.open(LoginComponent, this.dialogCfg);
    this.loginDialogRef.addPanelClass("dialog-class-login");
    this.subscription.add(
      this.loginDialogRef.afterClosed().subscribe(() => {
        if (this.loginDialogRef.componentInstance.authUserResult === 0) {
          this.avatarURL = "https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png";
        }
      })
    )
  }
  onManageBtnClicked() {
    this.router.navigate(['management']);
  }
  onLogoutBtnClicked() {
    this.logoutDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "退出登录?",
        content: "是否退出登录"
      }
    })
    this.subscription.add(
      this.logoutDialogRef.afterClosed().subscribe(() => {
        if (this.logoutDialogRef.componentInstance.is_yes) { this.avatarURL = ""; }
      })
    )
  }
  ngOnInit(): void {
    this.dialogCfg = {
      disableClose: true,
      height: "540px",
      maxHeight: "780px",
      width: "980px",
      maxWidth: "980px",
    }
    if(this.dark_light_srv.get_theme()){
      this.theme = "dark_mode";
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
