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
