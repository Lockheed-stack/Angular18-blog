import { ComponentRef, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from '../shared/login/login.component';
import { map } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../services/auth.service';
import { HttpStatusCode } from '@angular/common/http';

export const authGuard: CanActivateFn = (route, state) => {

  const token = window.sessionStorage.getItem('token');
  const router = inject(Router)
  const authService = inject(AuthService);
  const dialog = inject(MatDialog);

  // the user has never been logined before
  if (token === null) {
    const dialogCfg: MatDialogConfig = {
      disableClose: true,
      height: "540px",
      maxHeight: "780px",
      width: "980px",
      maxWidth: "980px",
    }
    const dialogRef = dialog.open(LoginComponent, dialogCfg);
    dialogRef.addPanelClass("dialog-class-login");
    return dialogRef.afterClosed().pipe(
      map(() => {
        if (dialogRef.componentInstance.authUserResult === 0) {
          return true;
        }
        router.navigate([""]);
        return false;
      })
    )
  }

  // check if the token is valid
  return authService.token_check().pipe(
    map((value) => {
      switch (value) {
        case HttpStatusCode.Unauthorized: {
          dialog.open(ConfirmDialogComponent, {
            data: {
              title: "用户身份认证",
              content: "用户身份认证过期，请重新登录"
            }
          })
          window.sessionStorage.clear();
          
          if (route.url.length === 0){ // in root Route
            location.reload();
          }else{
            router.navigate([""]);
          }
          return false;
        }
        case HttpStatusCode.Ok: {
          return true;
        }
        default: {
          dialog.open(ConfirmDialogComponent, {
            data: {
              title: "用户身份认证",
              content: "无法进行身份认证，请稍后再试"
            }
          })
          router.parseUrl("");
          return false;
        }
      }
    })
  )

};
