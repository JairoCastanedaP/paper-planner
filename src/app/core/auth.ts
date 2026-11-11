import { Injectable, computed, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { firebaseAuth } from './firebase';

/** Quien está usando la app: una cuenta real o un visitante viendo la demo. */
export interface AppUser {
  uid: string;
  name: string;
  email: string | null;
  guest: boolean;
}

const GUEST_KEY = 'paper-planner:guest';
const GUEST: AppUser = { uid: 'guest', name: 'Invitado', email: null, guest: true };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = firebaseAuth();
  private readonly account = signal<AppUser | null>(null);
  private readonly guest = signal(readGuest());

  readonly user = computed<AppUser | null>(() => this.account() ?? (this.guest() ? GUEST : null));
  readonly isLoggedIn = computed(() => this.user() !== null);

  /** Se resuelve cuando Firebase ya sabe si había una sesión abierta (al cargar la página). */
  readonly ready: Promise<void>;

  constructor() {
    this.ready = new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        this.account.set(user ? toAppUser(user) : null);
        if (user) this.setGuest(false);
        resolve();
      });
    });
  }

  /** Devuelve un mensaje de error o `null` si todo salió bien. */
  async login(email: string, password: string): Promise<string | null> {
    try {
      await signInWithEmailAndPassword(this.auth, email.trim(), password);
      return null;
    } catch (e) {
      return authMessage(e);
    }
  }

  async register(name: string, email: string, password: string): Promise<string | null> {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, email.trim(), password);
      await updateProfile(user, { displayName: name.trim() });
      // onAuthStateChanged ya disparó antes de tener el nombre: se actualiza aquí.
      this.account.set(toAppUser(user));
      return null;
    } catch (e) {
      return authMessage(e);
    }
  }

  async resetPassword(email: string): Promise<string | null> {
    try {
      await sendPasswordResetEmail(this.auth, email.trim());
      return null;
    } catch (e) {
      return authMessage(e);
    }
  }

  /** Entrar sin cuenta para conocer la app con los datos de ejemplo. */
  enterAsGuest(): void {
    this.setGuest(true);
  }

  async logout(): Promise<void> {
    this.setGuest(false);
    if (this.account()) await signOut(this.auth);
  }

  private setGuest(on: boolean): void {
    this.guest.set(on);
    try {
      if (on) localStorage.setItem(GUEST_KEY, '1');
      else localStorage.removeItem(GUEST_KEY);
    } catch {
      // Sin almacenamiento el modo invitado dura hasta recargar.
    }
  }
}

function toAppUser(user: User): AppUser {
  return {
    uid: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'Usuario',
    email: user.email,
    guest: false,
  };
}

function readGuest(): boolean {
  try {
    return localStorage.getItem(GUEST_KEY) === '1';
  } catch {
    return false;
  }
}

/** Traduce los errores de Firebase Auth a mensajes para el usuario. */
function authMessage(error: unknown): string {
  const code = error instanceof FirebaseError ? error.code : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contraseña incorrectos.';
    case 'auth/invalid-email':
      return 'Ese correo no parece válido.';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese correo. Inicia sesión.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';
    case 'auth/network-request-failed':
      return 'No hay conexión a internet. Revisa tu red e inténtalo de nuevo.';
    case 'auth/operation-not-allowed':
      return 'El acceso con correo aún no está habilitado en el servidor.';
    default:
      console.error(error);
      return 'Algo salió mal. Inténtalo de nuevo.';
  }
}

/** Solo usuarios con sesión (o en modo demo); los demás van al login. */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  return auth.isLoggedIn() || router.createUrlTree(['/login']);
};

/** Bienvenida, login y registro solo sin sesión; con sesión se va al calendario. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  return !auth.isLoggedIn() || router.createUrlTree(['/calendario']);
};
