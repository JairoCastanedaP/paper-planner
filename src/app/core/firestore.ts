import {
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
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
