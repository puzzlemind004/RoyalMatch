import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.page').then((m) => m.RegisterPage),
    canActivate: [guestGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },
  {
    path: 'demo',
    loadComponent: () =>
      import('./features/demo/layout/demo-layout.component').then((m) => m.DemoLayoutComponent),
    children: [
      {
        path: 'cards',
        loadComponent: () =>
          import('./features/demo/pages/card-demo/card-demo.page').then((m) => m.CardDemoPage),
      },
      {
        path: 'effects',
        loadComponent: () =>
          import('./features/demo/pages/effect-demo/effect-demo.page').then(
            (m) => m.EffectDemoPage,
          ),
      },
      {
        path: 'roulette',
        loadComponent: () =>
          import('./features/demo/pages/roulette-demo/roulette-demo.page').then(
            (m) => m.RouletteDemoPage,
          ),
      },
      {
        path: 'hierarchy',
        loadComponent: () =>
          import('./features/demo/pages/hierarchy-demo/hierarchy-demo.component').then(
            (m) => m.HierarchyDemoComponent,
          ),
      },
      {
        path: 'trick-resolution',
        loadComponent: () =>
          import('./features/demo/pages/trick-resolution-demo/trick-resolution-demo.component').then(
            (m) => m.TrickResolutionDemoComponent,
          ),
      },
      {
        path: 'objective-distribution',
        loadComponent: () =>
          import('./features/demo/objective-distribution-demo/objective-distribution-demo.component').then(
            (m) => m.ObjectiveDistributionDemoComponent,
          ),
      },
      {
        path: 'objective-validation',
        loadComponent: () =>
          import('./features/demo/pages/objective-validation-demo/objective-validation-demo').then(
            (m) => m.ObjectiveValidationDemoComponent,
          ),
      },
      {
        path: 'objective-verification',
        loadComponent: () =>
          import('./features/demo/pages/objective-verification-demo/objective-verification-demo').then(
            (m) => m.ObjectiveVerificationDemoComponent,
          ),
      },
      {
        path: 'scoring',
        loadComponent: () =>
          import('./features/demo/pages/scoring-demo/scoring-demo').then(
            (m) => m.ScoringDemoComponent,
          ),
      },
      {
        path: 'ranks',
        loadComponent: () =>
          import('./features/demo/pages/rank-demo/rank-demo.page').then(
            (m) => m.RankDemoPage,
          ),
      },
      {
        path: 'auth',
        loadComponent: () =>
          import('./features/demo/pages/auth-demo/auth-demo.page').then(
            (m) => m.AuthDemoPage,
          ),
      },
      {
        path: '',
        redirectTo: 'cards',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'websocket-test',
    loadComponent: () =>
      import('./features/websocket-test/websocket-test.component').then(
        (m) => m.WebSocketTestComponent,
      ),
  },
  {
    path: '',
    redirectTo: '/demo',
    pathMatch: 'full',
  },
];
