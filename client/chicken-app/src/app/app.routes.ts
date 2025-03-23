import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';

export const routes: Routes = [
    {path: 'posty', component: PostListComponent},
    {path: '', redirectTo: '/posty', pathMatch: 'full'},
    {path: '**', loadComponent: () => import('./components/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)}
];
