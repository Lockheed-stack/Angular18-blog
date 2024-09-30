import { HttpInterceptorFn, HttpParams } from '@angular/common/http';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === "POST") {
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
