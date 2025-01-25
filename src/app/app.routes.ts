import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'main',
        loadChildren: () => import('./pages/main/main.routes').then(m => m.mainRoutes),
        canActivate: [authGuard]
    },
    { 
        path: '', 
        redirectTo: '/main/dashboard', 
        pathMatch: 'full' 
    },
];
