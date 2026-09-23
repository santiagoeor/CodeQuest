import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./core/auth/components/auth-callback/auth-callback.component').then(
        (m) => m.AuthCallbackComponent
      ),
  },
  {
    path: 'assessment',
    loadComponent: () =>
      import('./features/assessment/assessment.component').then((m) => m.AssessmentComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'paths',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/paths/paths.component').then((m) => m.PathsComponent),
  },
  {
    path: 'paths/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/paths/paths.component').then((m) => m.PathsComponent),
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/courses/courses.component').then((m) => m.CoursesComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
