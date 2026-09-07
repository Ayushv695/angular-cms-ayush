import { authGuard } from './guards/auth-guard';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LanguagesComponent } from './pages/languages/languages';
import { ItemsComponent } from './pages/items/items';
import { LayoutComponent } from './layout/layout';
import { guestGuard } from './guards/guest-guard';
import { ItemMappingComponent } from './pages/item-mapping/item-mapping';
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
  // Login - WITHOUT dashboard layout
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
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
        path: 'item-mapping',
        component: ItemMappingComponent,
      },
    ],
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
