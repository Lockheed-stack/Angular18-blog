import { ComponentRef, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from '../shared/login/login.component';
import { map } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../services/auth.service';
import { HttpStatusCode } from '@angular/common/http';
import { InterComponentService } from '../services/inter-component.service';

export const authGuard: CanActivateFn = (route, state) => {

  const token = window.sessionStorage.getItem('token');
  const router = inject(Router)
  const authService = inject(AuthService);
  const dialog = inject(MatDialog);
  const inter_component_service = inject(InterComponentService);
  
  // the user has never been logined before
  if (token === null) {
    dialog.open(ConfirmDialogComponent, {
      data: {
        title: "用户身份认证",
        content: "还未登录，即将返回首页"
      }
    })
    window.sessionStorage.clear();
    router.navigate(["/"]);
    inter_component_service.sendVoidMessage();
    return false;
  }

  // check if the token existed
  return authService.token_check().pipe(
    map((value) => {
      switch (value) {
        case HttpStatusCode.Unauthorized: { // Invalid token
          dialog.open(ConfirmDialogComponent, {
            data: {
              title: "用户身份认证",
              content: "用户身份认证过期，请重新登录"
            }
          })
          window.sessionStorage.clear();
          router.navigate([""]);
          inter_component_service.sendVoidMessage();
          return false;
        }
        case HttpStatusCode.Ok: { // Valid token
          return true;
        }
        default: { // User authentication service error
          dialog.open(ConfirmDialogComponent, {
            data: {
              title: "用户身份认证",
              content: "无法进行身份认证，请稍后再试"
            }
          })
          router.parseUrl("");
          inter_component_service.sendVoidMessage();
          return false;
        }
      }
    })
  )

};
