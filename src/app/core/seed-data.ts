import { DEFAULT_CATEGORIES } from './categories';
import { PlannerData } from './models';

/**
 * Datos del primer uso: solo las categorías, sin actividades.
 *
 * Para trabajar en local con datos propios, crea `seed-data.local.ts`
 * (ignorado por git) con la misma función y levanta la app con
 * `npm run start:local`, que reemplaza este archivo por ese.
 */
export function createSeedData(): PlannerData {
  return { version: 1, categories: DEFAULT_CATEGORIES, events: [], highlights: {}, goals: [] };
}
