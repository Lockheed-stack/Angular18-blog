import { Routes } from '@angular/router';
import { BlogIndexComponent } from './blog-index/blog-index.component';
import { BlogDisplayComponent } from './blog-display/blog-display.component';
import { IndexLayoutComponent } from './blog-index/index-layout/index-layout.component';
import { IndexCategoryComponent } from './blog-index/index-category/index-category.component';

export const routes: Routes = [
    {path:"",component:BlogIndexComponent,children:[
        {path:"",component:IndexLayoutComponent},
        {path:"blog/:blogid",component:BlogDisplayComponent},
        {path:"category/:cid",component:IndexCategoryComponent},
    ]},
    { path: "management", loadChildren: () => 
        import("./management-center/management-center-routing.module").then(m=>m.ManagementCenterRoutingModule)
    }
];
