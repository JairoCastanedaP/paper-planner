import { isDevMode } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { ReCaptchaEnterpriseProvider, initializeAppCheck } from 'firebase/app-check';
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

/**
 * Clave del sitio de reCAPTCHA Enterprise (Fraud Defense) para App Check. Es pública:
 * la clave secreta queda solo en Google.
 */
const RECAPTCHA_SITE_KEY = '6LdbgRouAAAAAKS_AW3iQIWwM_4-lrLKpi9pNCYR';

let app: FirebaseApp | undefined;

export function firebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
    startAppCheck(app);
  }
  return app;
}

/**
 * App Check: cada petición a Auth y Firestore lleva un token que demuestra que viene de esta
 * app y no de un script que copió la configuración. Debe iniciarse antes de usar Auth o Firestore.
 *
 * En desarrollo (`ng serve`) se usa un token de depuración: la consola del navegador lo muestra
 * la primera vez y se registra en Firebase → App Check → Administrar tokens de depuración.
 */
function startAppCheck(app: FirebaseApp): void {
  if (isDevMode()) {
    (self as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

export function firebaseAuth(): Auth {
  const auth = getAuth(firebaseApp());
  auth.languageCode = 'es';
  return auth;
}

