import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementCenterComponent } from './management-center.component';

const routes: Routes = [
  {path:"",component:ManagementCenterComponent,children:[
    {
      path:"dashboard",
      loadComponent:()=>import('./dashboard/dashboard.component').then(c=>c.DashboardComponent),
    },
    {
      path:"user",
      loadComponent:()=>import('./user/user.component').then(c=>c.UserComponent),
    },
    {
      path:"allArticle",
      loadComponent:()=>import('./article/article.component').then(c=>c.ArticleComponent),
    },
    {
      path:"WriteArticle",
      loadComponent:()=>import('./article/article-write/write.component').then(c=>c.ArticleWriteComponent),
    },
    {
      path:"ModifyBlog",
      loadComponent:()=>import('./article/article-modify/modify.component').then(c=>c.ArticleModifyComponent),
    },
    {
      path:"allCategory",
      loadComponent:()=>import('./category/category.component').then(c=>c.CategoryComponent),
    },
    {
      path:"addCategory",
      loadComponent:()=>import('./category/category-add/category-add.component').then(c=>c.CategoryAddComponent),
    }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementCenterRoutingModule { }
