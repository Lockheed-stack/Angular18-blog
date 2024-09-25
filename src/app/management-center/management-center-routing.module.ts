import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementCenterComponent } from './management-center.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { ArticleComponent } from './article/article.component';
import { WriteComponent } from './article/write/write.component';
import { ModifyComponent } from './article/modify/modify.component';

const routes: Routes = [
  {path:"",component:ManagementCenterComponent,children:[
    {path:"dashboard",component:DashboardComponent},
    {path:"user",component:UserComponent},
    {path:"allArticle",component:ArticleComponent},
    {path:"WriteArticle",component:WriteComponent},
    {path:"ModifyBlog",component:ModifyComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementCenterRoutingModule { }
