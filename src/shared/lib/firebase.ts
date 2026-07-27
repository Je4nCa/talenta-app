import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

/**
 * Config del proyecto de Firebase — no son secretos que haya que proteger
 * (misma naturaleza que la API key de Biblia.com o la Public Key de
 * EmailJS, ver CLAUDE.md): identifican el proyecto, no autorizan nada por
 * sí solas. Se leen de variables de entorno solo por consistencia con el
 * resto del proyecto (`.env.local` en desarrollo, GitHub Actions secrets en
 * producción), no porque deban ocultarse.
 *
 * Firebase todavía no reemplaza a Dexie en ningún módulo — esto solo deja
 * el proyecto conectado y listo. La migración de datos (Auth, Firestore)
 * ocurre módulo por módulo, en pasos separados (ver CLAUDE.md).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseApp = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(firebaseApp)
export const firestore = getFirestore(firebaseApp)
