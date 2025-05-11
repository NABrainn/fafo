import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {path: 'posty', loadComponent: () => import('./features/post/components/post-list/post-list.component').then(c => c.PostListComponent), children: [
        {path: 'nowy', loadComponent: () => import('./features/post/components/post-form/post-form.component').then(c => c.PostFormComponent), canActivate: [authGuard]},
    ]},
    {path: 'posty/:id', loadComponent: () => import('./features/post/components/post-page/post-page.component').then(c => c.PostPageComponent)},
    {path: 'rejestracja', loadComponent: () => import('./auth/components/register-form/register-form.component').then(c => c.RegisterFormComponent)},
    {path: 'logowanie', loadComponent: () => import('./auth/components/login-form/login-form.component').then(c => c.LoginFormComponent)},
    {path: '', redirectTo: '/posty', pathMatch: 'full'},
    {path: '**', loadComponent: () => import('./core/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)}
];
