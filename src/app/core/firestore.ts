import {
  Firestore,
  clearIndexedDbPersistence,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  terminate,
} from 'firebase/firestore';
import { firebaseApp } from './firebase';

// Archivo aparte de firebase.ts para que Firestore solo se descargue al abrir el calendario.

let db: Firestore | undefined;

/**
 * Firestore con copia local en el dispositivo (IndexedDB): la app funciona sin
 * internet y sincroniza sola al volver la conexión, también con varias pestañas.
 */
export function firebaseDb(): Firestore {
  return (db ??= initializeFirestore(firebaseApp(), {
    ignoreUndefinedProperties: true,
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  }));
}

/**
 * Borra la copia local del calendario (al cerrar sesión), para que en un computador
 * compartido nadie más la vea. Si hay otra pestaña de la app abierta, la copia no se
 * puede borrar en ese momento; igual queda protegida porque sin sesión no se muestra.
 */
export async function clearFirestoreCache(): Promise<void> {
  const current = db;
  if (!current) return;
  db = undefined;
  await terminate(current);
  await clearIndexedDbPersistence(current).catch((e) => console.warn('No se pudo borrar la copia local', e));
}
