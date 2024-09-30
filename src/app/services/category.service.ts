import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';


export interface CategoryInfo {
  ID: number,
  Name: string,
}

var CategoryInfoArray: Array<CategoryInfo> = [];
var CategoryInfoMap: Map<number, string> = new Map<number, string>();
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private domain: GlobalService,
    private http: HttpClient,
  ) { }

  GetAllCategory() {
    const url = this.domain.domain + "gateway/category";
    return this.http.get<{ result: Array<CategoryInfo> }>(
      url,
      {
        params: {
          PageSize: 100,
          PageNum: 1
        }
      }
    ).pipe(
      map(
        (value) => {
          return value.result;
        }
      ))
  }
  CacheCategoryInfoArray(result: Array<CategoryInfo>) {
    CategoryInfoArray = [...result];
    if (CategoryInfoMap.size === 0) {
      for (let index = 0; index < CategoryInfoArray.length; index++) {
        const element = CategoryInfoArray[index];
        CategoryInfoMap.set(element.ID, element.Name);
      }
    }
  }
  GetCategoryInfoArray() {
    return CategoryInfoArray;
  }
  GetCategoryInfoMap() {
    return CategoryInfoMap;
  }
}
