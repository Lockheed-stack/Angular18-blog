import { Component, inject, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    private authService: AuthService
  ) { }
  snackbar = inject(MatSnackBar);
  signinForm: FormGroup;
  hidePassword: boolean = true;
  loginBtnDisable: boolean = false;
  authUserResult: Result = Result.none;

  onSubmit() {
    this.loginBtnDisable = true;
    this.authUserResult = Result.none;
    const username = this.signinForm.value['username'];
    const passwd = this.signinForm.value['password'];
    this.authService.login_auth(username, passwd).subscribe({
      next: (value) => {
        if (value.token === undefined) { // failed to login
          this.authUserResult = Result.fail;
          this.loginBtnDisable = false;
        } else { // login successfully
          this.authUserResult = Result.success;
          // if ((value.result instanceof String)) {
          //   window.sessionStorage.setItem('UID', value.result.);
          // }
          window.sessionStorage.setItem('UID', value.result as string);
          window.sessionStorage.setItem('token', value.token);
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
    this.signinForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, Validators.required),
    });
  }
}
