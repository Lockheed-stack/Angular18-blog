import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';

export interface UserInfo {
  ID: number,
  Username: string,
  Avatar?: string,
  SelfDesc?: string,
  Location?: string,
  Email?: string,
  Github?: string
}
export interface UserStatisticsInfo {
  TotalLoginDays?: number,
  TotalBlogs?: number,
  TotalPageviews?: number,
  TotalUniqueviews?: number
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private globalService: GlobalService,
    private http: HttpClient,
  ) { }

  GetPublicUsersInfo(usersId: Array<number>) {
    const url = this.globalService.domain + "gateway/user/publicInfo";
    const body = { UsersID: usersId }
    return this.http.post<{ result: Array<UserInfo> }>(
      url,
      body
    )
  }
  UpdateUserPublicInfo(userInfo: UserInfo) {
    const url = this.globalService.domain + "management/user/updatePublicInfo";
    return this.http.patch<{ result: string }>(
      url,
      userInfo,
    )
  }
  GetUserStatisticsInfo(){
    const url = this.globalService.domain + "management/user/statisticsInfo";
    return this.http.get<{result:UserStatisticsInfo}>(
      url,
    )
  }
  GetUserTodayStatisticsInfo(){
    const url = this.globalService.domain + "management/user/todayStatistics";
    return this.http.get<{result:UserStatisticsInfo}>(
      url,
    )
  }
}
