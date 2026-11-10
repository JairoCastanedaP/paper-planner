import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth';
import { LoginPage } from './features/auth/login-page';
import { RegisterPage } from './features/auth/register-page';
import { CalendarPage } from './features/calendar-page/calendar-page';
import { LandingPage } from './features/landing/landing-page';

export const routes: Routes = [
  // Bienvenida: solo sin sesión (con sesión se va directo al calendario).
  { path: '', component: LandingPage, canActivate: [guestGuard], title: 'Paper Planner · Tu calendario de papel, ahora digital' },
  { path: 'login', component: LoginPage, canActivate: [guestGuard], title: 'Iniciar sesión · Paper Planner' },
  { path: 'registro', component: RegisterPage, canActivate: [guestGuard], title: 'Crear cuenta · Paper Planner' },
  { path: 'calendario', component: CalendarPage, canActivate: [authGuard], title: 'Paper Planner' },
  { path: '**', redirectTo: '' },
];
