import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementCenterComponent } from './management-center.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { ArticleComponent } from './article/article.component';
import { ArticleWriteComponent } from './article/article-write/write.component';
import { ArticleModifyComponent } from './article/article-modify/modify.component';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
  {path:"",component:ManagementCenterComponent,children:[
    {path:"dashboard",component:DashboardComponent},
    {path:"user",component:UserComponent},
    {path:"allArticle",component:ArticleComponent},
    {path:"WriteArticle",component:ArticleWriteComponent},
    {path:"ModifyBlog",component:ArticleModifyComponent},
    {path:"allCategory",component:CategoryComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementCenterRoutingModule { }
