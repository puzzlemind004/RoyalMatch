import { Routes } from '@angular/router';

export const routes: Routes = [
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
