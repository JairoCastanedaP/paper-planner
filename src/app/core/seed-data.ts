import { createDemoData } from './demo-data';
import { PlannerData } from './models';

/**
 * Datos del primer uso: un calendario de ejemplo para conocer la app
 * (se puede borrar con "Empezar en blanco").
 *
 * Para trabajar en local con datos propios, crea `seed-data.local.ts`
 * (ignorado por git) con la misma función y levanta la app con
 * `npm run start:local`, que reemplaza este archivo por ese.
 */
export function createSeedData(): PlannerData {
  return createDemoData();
}
