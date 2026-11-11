import { Injectable, signal } from '@angular/core';

const MOON_KEY = 'paper-planner:show-moon';

/** Preferencias de visualización de este dispositivo (como el tema de colores). */
@Injectable({ providedIn: 'root' })
export class PreferencesService {
  /** Mostrar las fases de la luna en el día exacto en que ocurren. */
  readonly showMoon = signal(read(MOON_KEY));

  toggleMoon(): void {
    this.showMoon.update((on) => !on);
    write(MOON_KEY, this.showMoon());
  }
}

function read(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function write(key: string, on: boolean): void {
  try {
    if (on) localStorage.setItem(key, '1');
    else localStorage.removeItem(key);
  } catch {
    // Sin almacenamiento la preferencia dura hasta recargar.
  }
}
