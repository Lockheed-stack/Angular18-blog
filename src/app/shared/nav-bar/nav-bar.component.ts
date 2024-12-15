import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router, } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { DarkLightService } from '../../services/dark-light.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { InterComponentService } from '../../services/inter-component.service';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private dark_light_srv: DarkLightService,
    private breakpointServer: BreakpointObserver,
    private inter_component_service: InterComponentService,
  ) { }
  readonly dialog = inject(MatDialog);
  dialogCfg: MatDialogConfig = new MatDialogConfig();
  loginDialogRef: MatDialogRef<LoginComponent>;
  logoutDialogRef: MatDialogRef<ConfirmDialogComponent>;
  subscription: Subscription = new Subscription();
  theme = "light_mode";
  avatarURL: string = "";
  destroyed = new Subject<void>();

  toggleTheme() {
    const result = this.dark_light_srv.toggle_theme();
    if (result) {
      this.theme = "dark_mode";
    } else {
      this.theme = "light_mode";
    }
  }
  openLoginDialog() {
    this.loginDialogRef = this.dialog.open(LoginComponent, this.dialogCfg);
    this.loginDialogRef.addPanelClass("dialog-class-login");
    this.subscription.add(
      this.loginDialogRef.afterClosed().subscribe(() => {
        if (this.loginDialogRef.componentInstance.authUserResult === 0) {
          const avatar = window.sessionStorage.getItem('avatar');
          this.avatarURL = avatar;
        }
      })
    )
  }
  openLoginDialogWithReturn() {
    this.loginDialogRef = this.dialog.open(LoginComponent, this.dialogCfg);
    this.loginDialogRef.addPanelClass("dialog-class-login");
    return this.loginDialogRef
  }
  onManageBtnClicked() {
    this.router.navigate(['management']);
  }
  onHomeBtnClicked() {
    this.router.navigate(['/']);
  }
  onAIBtnClicked(){
    this.router.navigate(['AI']);
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
        if (this.logoutDialogRef.componentInstance.is_yes) { 
          this.avatarURL = "";
          window.sessionStorage.clear();
        }
      })
    )
  }
  ngOnInit(): void {
    // UI display control
    this.breakpointServer.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]).pipe(takeUntil(this.destroyed)).subscribe(result => {
      if (result.matches) {
        this.dialogCfg = {
          disableClose: true,
          height: "95%",
          maxHeight: "780px",
          width: "95%",
          maxWidth: "980px",
        }
        if (this.loginDialogRef !== undefined && this.loginDialogRef.getState() === MatDialogState.OPEN) {
          this.loginDialogRef = this.loginDialogRef.updateSize("95%", "95%");
        }
      } else {
        this.dialogCfg = {
          disableClose: true,
          // height: "540px",
          maxHeight: "780px",
          width: "980px",
          maxWidth: "980px",
        }
        if (this.loginDialogRef !== undefined && this.loginDialogRef.getState() === MatDialogState.OPEN) {
          this.loginDialogRef = this.loginDialogRef.updateSize("980px",);
        }
      }
    });


    if (this.dark_light_srv.get_theme()) {
      this.theme = "dark_mode";
    }

    const avatar = window.sessionStorage.getItem('avatar');
    if (avatar !== null) {
      this.avatarURL = avatar;
    }
    // listen login status event
    this.subscription.add(this.inter_component_service.getVoidMessageObservable().subscribe(
      () => {
        this.avatarURL = "";
      }
    ));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyed.next();
    this.destroyed.complete();
  }
}
