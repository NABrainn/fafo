import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import {numericIdGuard} from './shared/components/page-not-found/numeric-id.guard';

export const routes: Routes = [
    {path: 'posty', loadComponent: () => import('./features/post/components/post-list/post-list.component').then(c => c.PostListComponent), children: [
        {path: 'nowy', loadComponent: () => import('./features/post/components/post-form/post-form.component').then(c => c.PostFormComponent), canActivate: [authGuard]},
    ]},
    {path: 'posty/:id', loadComponent: () => import('./features/post/components/post-page/post-page.component').then(c => c.PostPageComponent), canActivate: [numericIdGuard]},
    {path: 'rejestracja', loadComponent: () => import('./core/auth/components/register-form/register-form.component').then(c => c.RegisterFormComponent)},
    {path: 'logowanie', loadComponent: () => import('./core/auth/components/login-form/login-form.component').then(c => c.LoginFormComponent)},
    {path: '', redirectTo: '/posty', pathMatch: 'full'},
    {path: '**', loadComponent: () => import('./shared/components/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)}
];
