import { Injectable } from '@angular/core';
import { PlannerData } from './models';

/**
 * Dónde se guardan los datos. Hoy es el navegador (localStorage);
 * más adelante se cambia por Firebase sin tocar los componentes.
 */
export abstract class PlannerStorage {
  abstract load(): PlannerData | null;
  /** Devuelve false si no se pudo guardar (p. ej. almacenamiento lleno). */
  abstract save(data: PlannerData): boolean;
}

@Injectable()
export class LocalPlannerStorage extends PlannerStorage {
  private readonly key = 'paper-planner:v1';

  load(): PlannerData | null {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;
      const data = JSON.parse(raw) as PlannerData;
      return data?.version === 1 ? data : null;
    } catch {
      return null;
    }
  }

  save(data: PlannerData): boolean {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
      return true;
    } catch {
      // Almacenamiento bloqueado o lleno: la app sigue funcionando en memoria.
      return false;
    }
  }

}
