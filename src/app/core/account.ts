import { EmailAuthProvider, deleteUser, reauthenticateWithCredential } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { authMessage } from './auth';
import { firebaseAuth } from './firebase';
import { clearFirestoreCache, firebaseDb } from './firestore';
import { PRIVACY_VERSION, TERMS_VERSION } from './legal';

/*
 * Operaciones de la cuenta que usan Firestore. Van en un archivo aparte para que la
 * bienvenida y el login no descarguen Firestore (se importa bajo demanda).
 */

/** Guarda la prueba de la autorización: qué versiones aceptó y cuándo (hora del servidor). */
export async function saveConsent(uid: string): Promise<void> {
  await setDoc(doc(firebaseDb(), 'users', uid), {
    privacyVersion: PRIVACY_VERSION,
    termsVersion: TERMS_VERSION,
    acceptedAt: serverTimestamp(),
  });
}

/** true si la cuenta ya aceptó las versiones vigentes de la política y los términos. */
export async function hasCurrentConsent(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(firebaseDb(), 'users', uid));
  return snap.get('privacyVersion') === PRIVACY_VERSION && snap.get('termsVersion') === TERMS_VERSION;
}

/**
 * Elimina la cuenta y todo su contenido (derecho de supresión).
 * Pide la contraseña porque Firebase exige un inicio de sesión reciente para borrar la cuenta.
 * Devuelve un mensaje de error o `null` si todo salió bien.
 */
export async function deleteAccount(password: string): Promise<string | null> {
  const user = firebaseAuth().currentUser;
  if (!user?.email) return 'Inicia sesión de nuevo.';
  try {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
  } catch (e) {
    return authMessage(e);
  }
  try {
    const db = firebaseDb();
    const images = await getDocs(collection(db, 'users', user.uid, 'dayImages'));
    const batch = writeBatch(db);
    for (const image of images.docs) batch.delete(image.ref);
    batch.delete(doc(db, 'users', user.uid, 'planner', 'data'));
    batch.delete(doc(db, 'users', user.uid));
    await batch.commit();
    await deleteUser(user);
  } catch (e) {
    console.error(e);
    return 'No se pudo eliminar la cuenta. Revisa tu conexión e inténtalo de nuevo.';
  }
  await clearFirestoreCache();
  return null;
}
