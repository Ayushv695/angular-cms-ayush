import { authGuard } from './guards/auth-guard';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LanguagesComponent } from './pages/languages/languages';
import { ItemsComponent } from './pages/items/items';
import { TranslationsComponent } from './pages/translations/translations';
import { LayoutComponent } from './layout/layout';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  // Login - WITHOUT dashboard layout
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },

  // All application pages - WITH dashboard layout
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],

    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },

      {
        path: 'languages',
        component: LanguagesComponent,
      },

      {
        path: 'items',
        component: ItemsComponent,
      },

      {
        path: 'items/:id/translations',
        component: TranslationsComponent,
      },
    ],
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
