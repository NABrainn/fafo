import { Routes } from '@angular/router';
import { PostListComponent } from '../features/post/post-list/post-list.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {path: 'posty', component: PostListComponent, children: [
        {path: ':id', loadComponent: () => import('./components/post/post.component').then(c => c.PostComponent)}
    ], canActivate: [authGuard]},
    {path: 'rejestracja', loadComponent: () => import('./auth/components/register-form/register-form.component').then(c => c.RegisterFormComponent)},
    {path: 'logowanie', loadComponent: () => import('./auth/components/login-form/login-form.component').then(c => c.LoginFormComponent)},
    {path: '', redirectTo: '/posty', pathMatch: 'full'},
    {path: '**', loadComponent: () => import('./components/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)}
];
