import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';


export interface ArticleInfo {
  CreatedAt?: string,
  UpdatedAt?: string,
  Title: string,
  Desc: string,
  Content?: string,
  Content_blob?: Blob,
  PageView?: number
  Img?: string,
  Img_blob?: Blob,
  ID?: number,
  Uid?: number,
  Cid?: number,
}

var PreparedBlog: ArticleInfo = null;

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(
    private domain: GlobalService,
    private http: HttpClient,
  ) { }

  GetSingleArticle(id: number) {
    const url = this.domain.domain + `gateway/blog/${id}`;
    return this.http.get<{ result: ArticleInfo }>(url);
  }
  GetMarkdown(url: string) {
    return this.http.get(
      url,
      {
        responseType: "text"
      }
    )
  }
  GetArticleListByCid(cid: number, pageSize: number, pageNum: number) {
    const url = this.domain.domain + `gateway/list/${cid}`;
    return this.http.get<{ result: Array<ArticleInfo>, total?: number }>(
      url,
      {
        params: {
          PageSize: pageSize,
          PageNum: pageNum
        }
      }
    )
  }
  GetArticleListByCidAndUid(cid: number, uid: number, pageSize: number, pageNum: number) {
    const url = this.domain.domain + `gateway/${uid}/list/${cid}`;
    return this.http.get<{ result: Array<ArticleInfo>, total?: number }>(
      url,
      {
        params: {
          PageSize: pageSize,
          PageNum: pageNum
        }
      }
    )
  }
  GetArticlesForRecommend(pageSize: number, pageNum: number) {
    const url = this.domain.domain + `gateway/recommendBlogs`;
    return this.http.get<{ result: Array<ArticleInfo> }>(
      url,
      {
        params: {
          PageSize: pageSize,
          PageNum: pageNum
        }
      }
    )
  }
  GetArticlesByRandom(count: number) {
    const url = this.domain.domain + `gateway/randomBlogs`;
    return this.http.get<{ result: Array<ArticleInfo> }>(
      url,
      {
        params: {
          Count: count
        }
      }
    );
  }
  GetArticlePlaceholder(count: number) {
    const articlePlaceholder: Array<ArticleInfo> = [];
    for (let index = 0; index < count; index++) {
      articlePlaceholder.push({
        ID: -index - 1,
        Title: "placeholder",
        Desc: "placeholder",
        Content: "placeholder",
        Uid: -index - 1,
      })
    }
    return articlePlaceholder;
  }
  GetPreparedBlog() {
    return PreparedBlog;
  }
  SetPreparedBlog(blog: ArticleInfo) {
    PreparedBlog = blog;
  }
  // edit article
  UpdateArticle(blog: ArticleInfo) {
    const username = window.sessionStorage.getItem("username");
    const url = this.domain.domain + `management/${username}/modify-blog`;
    const data = new FormData();
    for (const key in blog) {
      if (Object.prototype.hasOwnProperty.call(blog, key)) {
        const element = blog[key];
        data.append(key, element);
      }
    }
    return this.http.patch<{ result: String }>(
      url,
      data,
    )
  }
  AddArticle(blog: ArticleInfo) {
    const username = window.sessionStorage.getItem("username");
    const url = this.domain.domain+ `management/${username}/add-blog`;
    const data = new FormData();
    for (const key in blog) {
      if (Object.prototype.hasOwnProperty.call(blog, key)) {
        const element = blog[key];
        data.append(key, element);
      }
    }
    return this.http.post<{ result: String }>(
      url,
      data
    )
  }
}