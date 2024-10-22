import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementCenterComponent } from './management-center.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { ArticleComponent } from './article/article.component';
import { ArticleWriteComponent } from './article/article-write/write.component';
import { ArticleModifyComponent } from './article/article-modify/modify.component';
import { CategoryComponent } from './category/category.component';
import { CategoryAddComponent } from './category/category-add/category-add.component';

const routes: Routes = [
  {path:"",component:ManagementCenterComponent,children:[
    {path:"dashboard",component:DashboardComponent},
    {path:"user",component:UserComponent},
    {path:"allArticle",component:ArticleComponent},
    {path:"WriteArticle",component:ArticleWriteComponent},
    {path:"ModifyBlog",component:ArticleModifyComponent},
    {path:"allCategory",component:CategoryComponent},
    {path:"addCategory",component:CategoryAddComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementCenterRoutingModule { }
