import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';
import { DashboardComponent } from './pages/dashboard.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { CredentialsComponent } from './pages/credentials.component';
import { MyCredentialsComponent } from './pages/my-credentials.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'credentials', component: CredentialsComponent, canActivate: [authGuard] },
  { path: 'my-credentials', component: MyCredentialsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
