import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { UserInfo } from '../../services/user.service';
import { GlobalService } from '../../services/global.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

enum Result {
  success,
  fail,
  none,
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    MatLabel,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    private authService: AuthService,
    private globalService: GlobalService,
    private breakpointServer: BreakpointObserver
  ) { }
  snackbar = inject(MatSnackBar);
  signinForm: FormGroup;
  hidePassword: boolean = true;
  loginBtnDisable: boolean = false;
  authUserResult: Result = Result.none;
  destroyed = new Subject<void>();
  onSubmit() {
    this.loginBtnDisable = true;
    this.authUserResult = Result.none;

    const username = this.signinForm.value['username'];
    const passwd = this.signinForm.value['password'];
    // check inputs validation
    if (username === null || this.signinForm.get('username').invalid) {
      this.signinForm.value['username'] = "";
      this.loginBtnDisable = false;
      return
    }
    if (passwd === null || this.signinForm.get('password').invalid) {
      this.signinForm.value['password'] = "";
      this.loginBtnDisable = false;
      return
    }

    // login logic
    this.authService.login_auth(username, passwd).subscribe({
      next: (value) => {
        if (value.token === undefined) { // failed to login
          this.authUserResult = Result.fail;
          this.loginBtnDisable = false;
        } else { // login successfully
          this.authUserResult = Result.success;
          const result = value.result as UserInfo
          window.sessionStorage.setItem('UID', String(result.ID));
          window.sessionStorage.setItem('token', value.token);
          window.sessionStorage.setItem('username', result.Username);
          result.Avatar === undefined ? window.sessionStorage.setItem('avatar', this.globalService.avatarPlaceholder) : window.sessionStorage.setItem('avatar', result.Avatar);
          setTimeout(() => {
            this.dialogRef.close();
          }, 1500);
        }
      },
      error: (err) => {
        const status = (err as HttpErrorResponse).status
        switch (status) {
          case HttpStatusCode.BadRequest: {
            this.snackbar.openFromComponent(SnackBarComponent, {
              data: {
                content: "用户名或密码错误"
              }
            })
            break;
          }
          case HttpStatusCode.GatewayTimeout: {
            this.snackbar.openFromComponent(SnackBarComponent, {
              data: {
                content: "登录服务不可用，请稍后再试"
              }
            })
            break;
          }
          default: {
            this.snackbar.openFromComponent(SnackBarComponent, {
              data: {
                content: "无法与服务器通信，请稍后再试"
              }
            })
          }
        }
        this.authUserResult = Result.fail;
        this.loginBtnDisable = false;
      }
    })
  }

  ngOnInit(): void {
    // UI display control
    const el_mat_content = document.getElementById("mat-dialog-content-login");
    const el_div_content = document.getElementById("div-login-content");
    this.breakpointServer.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]).pipe(takeUntil(this.destroyed)).subscribe(result => {
      if (result.matches) {
        el_mat_content.style.maxHeight = "90%";
        el_div_content.style.flexDirection = "column";
      }else{
        el_mat_content.style.maxHeight = "65vh";
        el_div_content.style.flexDirection = "row";
      }
    });
    // Form group
    this.signinForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, Validators.required),
    });
  }
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
