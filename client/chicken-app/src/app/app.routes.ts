import { Routes } from '@angular/router';
import { PostListComponent } from '../features/post/post-list/post-list.component';

export const routes: Routes = [
    {path: 'posty', component: PostListComponent, children: [
        {path: ':id', loadComponent: () => import('./components/post/post.component').then(c => c.PostComponent)}
    ]},
    {path: '', redirectTo: '/posty', pathMatch: 'full'},
    {path: '**', loadComponent: () => import('./components/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)}
];
