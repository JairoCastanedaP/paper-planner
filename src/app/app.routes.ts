import { Routes } from '@angular/router';
import { authGuard, guestGuard, unverifiedGuard } from './core/auth';
import { LoginPage } from './features/auth/login-page';
import { RegisterPage } from './features/auth/register-page';
import { VerifyPage } from './features/auth/verify-page';
import { LandingPage } from './features/landing/landing-page';

export const routes: Routes = [
  // Bienvenida: solo sin sesión (con sesión se va directo al calendario).
  { path: '', component: LandingPage, canActivate: [guestGuard], title: 'Paper Planner · Tu calendario de papel, ahora digital' },
  { path: 'login', component: LoginPage, canActivate: [guestGuard], title: 'Iniciar sesión · Paper Planner' },
  { path: 'registro', component: RegisterPage, canActivate: [guestGuard], title: 'Crear cuenta · Paper Planner' },
  { path: 'verificar', component: VerifyPage, canActivate: [unverifiedGuard], title: 'Verifica tu correo · Paper Planner' },
  // El calendario (y Firestore) se descargan solo al entrar: la bienvenida y el login cargan más rápido.
  {
    path: 'calendario',
    loadComponent: () => import('./features/calendar-page/calendar-page').then((m) => m.CalendarPage),
    canActivate: [authGuard],
    title: 'Paper Planner',
  },
  { path: '**', redirectTo: '' },
];
