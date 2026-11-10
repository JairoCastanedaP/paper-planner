import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth';
import { LoginPage } from './features/auth/login-page';
import { RegisterPage } from './features/auth/register-page';
import { CalendarPage } from './features/calendar-page/calendar-page';

export const routes: Routes = [
  { path: 'login', component: LoginPage, canActivate: [guestGuard], title: 'Iniciar sesión · Paper Planner' },
  { path: 'registro', component: RegisterPage, canActivate: [guestGuard], title: 'Crear cuenta · Paper Planner' },
  { path: '', component: CalendarPage, canActivate: [authGuard], title: 'Paper Planner' },
  { path: '**', redirectTo: '' },
];
