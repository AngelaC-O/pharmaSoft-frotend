import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
      },
      {
        path: 'inicio',
        title: 'Inicio',
        loadComponent: () =>
          import('./features/inicio/inicio')
            .then(m => m.Inicio),
      },
      {
        path: 'categorias',
        loadChildren: () =>
          import('./features/categorias/categorias.routes')
            .then(m => m.CATEGORIAS_ROUTES),
      },
      {
        path: 'productos',
        title: 'Productos',
        loadComponent: () =>
          import(
            './features/productos/pages/producto-list/producto-list'
          ).then(m => m.ProductoList),
      },

      // ---------------- VENTAS ----------------
      {
        path: 'ventas',
        loadChildren: () =>
          import('./features/ventas/ventas.routes')
            .then(m => m.VENTAS_ROUTES),
      },

      // ---------------- REPORTES ----------------
      {
        path: 'reportes',
        loadChildren: () =>
          import('./features/reportes/reportes.routes')
            .then(m => m.REPORTES_ROUTES),
      },
    ],
  },

  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () =>
      import('./shared/pages/no-encontrado/no-encontrado')
        .then(m => m.NoEncontrado),
  },
];