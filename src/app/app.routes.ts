import { Routes } from '@angular/router';
import { BlogIndexComponent } from './blog-index/blog-index.component';
import { IndexLayoutComponent } from './blog-index/index-layout/index-layout.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path: "", component: BlogIndexComponent, children: [
            {
                path: "",
                component: IndexLayoutComponent,
                data: { animation: "HomePage" }
            },
            {
                path: "blog/:blogid",
                loadComponent: () => import('./blog-display/blog-display.component').then(c => c.BlogDisplayComponent),
                data: { animation: "BlogPage" }
            },
            {
                path: "category/:cid",
                loadComponent: () => import('./blog-index/index-category/index-category.component').then(c => c.IndexCategoryComponent),
                data: { animation: "CategoryPage" }
            },
        ],
        data: { animation: "IndexFrameworkPage" }
    },
    {
        path: "management",
        loadChildren: () => import("./management-center/management-center-routing.module").then(m => m.ManagementCenterRoutingModule),
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        data: { animation: "ManagementPage" }
    },
    {
        path: "**",
        loadComponent: () => import('./shared/not-found-page/not-found-page.component').then(c => c.NotFoundPageComponent)
    }
];
