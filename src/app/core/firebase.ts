import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

/**
 * Configuración web del proyecto de Firebase "paper-planner-col".
 * No es secreta: viaja dentro de la app en todos los proyectos web de Firebase.
 * Lo que protege los datos son las reglas de seguridad de Firestore y los
 * dominios autorizados de Authentication.
 */
const firebaseConfig = {
  apiKey: 'AIzaSyAOw7gDcW5a2wy9FwUe7n2q15uSfyBQ648',
  authDomain: 'paper-planner-col.firebaseapp.com',
  projectId: 'paper-planner-col',
  storageBucket: 'paper-planner-col.firebasestorage.app',
  messagingSenderId: '578527318718',
  appId: '1:578527318718:web:1a48dad34a9a95171c04ef',
};

let app: FirebaseApp | undefined;

export function firebaseApp(): FirebaseApp {
  return (app ??= initializeApp(firebaseConfig));
}

export function firebaseAuth(): Auth {
  const auth = getAuth(firebaseApp());
  auth.languageCode = 'es';
  return auth;
}
