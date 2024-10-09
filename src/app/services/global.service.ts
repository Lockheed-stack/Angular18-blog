import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public domain: string = "https://lee-marcus.one/";
  public qiniuImgsURL: string = this.domain + "qiniu-img/";
  public qiniuArticleURL: string = this.domain + "qiniu-article/";
  public imagePlaceholder:string = "https://placehold.co/200x200?text=Image";
  public avatarPlaceholder:string = "https://placehold.co/200x200?text=?";
  constructor() { }
}
