import { Injectable, computed, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const SESSION_KEY = 'paper-planner:session';

/**
 * Cuenta temporal mientras se conecta un servicio de autenticación real (Firebase Auth).
 * OJO: la validación ocurre en el navegador, así que solo sirve como puerta de entrada,
 * no como protección de los datos.
 */
const TEMP_ACCOUNTS: Record<string, string> = { admin: 'admin' };

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<string | null>(readSession());
  readonly isLoggedIn = computed(() => this.user() !== null);

  login(username: string, password: string): boolean {
    const name = username.trim().toLowerCase();
    if (!name || TEMP_ACCOUNTS[name] !== password) return false;
    this.user.set(name);
    try {
      localStorage.setItem(SESSION_KEY, name);
    } catch {
      // Sin almacenamiento la sesión dura hasta recargar.
    }
    return true;
  }

  logout(): void {
    this.user.set(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Nada que limpiar.
    }
  }
}

function readSession(): string | null {
  try {
    const name = localStorage.getItem(SESSION_KEY);
    return name && name in TEMP_ACCOUNTS ? name : null;
  } catch {
    return null;
  }
}

/** Solo usuarios con sesión; los demás van al login. */
export const authGuard: CanActivateFn = () =>
  inject(AuthService).isLoggedIn() || inject(Router).createUrlTree(['/login']);

/** Bienvenida, login y registro solo sin sesión; con sesión se va al calendario. */
export const guestGuard: CanActivateFn = () =>
  !inject(AuthService).isLoggedIn() || inject(Router).createUrlTree(['/calendario']);
