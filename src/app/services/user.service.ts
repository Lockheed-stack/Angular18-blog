import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';

export interface UserInfo{
  ID:number,
  Username:string,
  Avatar?:string,
  SelfDesc?:string,
  Location?: string,
  Email?: string,
  Github?: string
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private globalService:GlobalService,
    private http: HttpClient,
  ) { }

  GetPublicUsersInfo(usersId:Array<number>){
    const url = this.globalService.domain + "gateway/user/publicInfo";
    const body = {UsersID:usersId}
    return this.http.post<{result:Array<UserInfo>}>(
      url,
      body
    )
  }
}
