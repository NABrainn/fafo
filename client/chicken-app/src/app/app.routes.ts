import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostPageComponent } from '../features/post/post-page/post-page.component';

export const routes: Routes = [
    {path: 'posty', component: PostPageComponent},
    {path: '', redirectTo: '/posty', pathMatch: 'full'},
    {path: '**', loadComponent: () => import('./components/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)}
];
