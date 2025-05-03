import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { PostListComponent } from './features/post/components/post-list/post-list.component';

export const routes: Routes = [
    {path: 'posty', component: PostListComponent, canActivate: [authGuard]},
    {path: 'rejestracja', loadComponent: () => import('./auth/components/register-form/register-form.component').then(c => c.RegisterFormComponent)},
    {path: 'logowanie', loadComponent: () => import('./auth/components/login-form/login-form.component').then(c => c.LoginFormComponent)},
    {path: '', redirectTo: '/posty', pathMatch: 'full'},
    {path: '**', loadComponent: () => import('./core/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)}
];
