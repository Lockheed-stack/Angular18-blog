import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { GlobalService } from '../services/global.service';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const splited = req.url.split("/");
  if (splited[3] === "management") {
    const cloneReq = req.clone(
      {
        headers: req.headers.append('Authorization', 'Bearer '.concat(window.sessionStorage.getItem('token'))),
        params: req.params.append("userID", window.sessionStorage.getItem("UID"))
      }
    )
    return next(cloneReq);
  }

  return next(req);
};
