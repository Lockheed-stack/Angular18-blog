import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpResponseBase, HttpStatusCode } from '@angular/common/http';
import { UserInfo } from './user.service'
export interface LoginRequest {
  UserName: string,
  Password: string
}

export interface LoginRespond {
  result: string | UserInfo,
  token?: string
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private domain: GlobalService,
    private http: HttpClient,
  ) { }

  login_auth(username: string, passwd: string): Observable<LoginRespond> {
    const requestBody: LoginRequest = {
      UserName: username,
      Password: passwd
    }
    return this.http.post<LoginRespond>(
      this.domain.domain + "gateway/login",
      requestBody
    )
  }

  token_check(): Observable<number> {
    const url = this.domain.domain + "management/user/token-check";
    return this.http.post<{ result: string }>(
      url,
      {}
    ).pipe(
      map((value) => {
        if (value.result === "ok") {
          return HttpStatusCode.Ok;
        }
        return HttpStatusCode.BadRequest;
      }),
      catchError(
        (err, caught: Observable<number>) => {
          const status = (err as HttpErrorResponse).status
          return of(status);
        }
      )
    )

  }
}
