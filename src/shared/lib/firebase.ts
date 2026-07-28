import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'

/**
 * Config del proyecto de Firebase — no son secretos que haya que proteger
 * (misma naturaleza que la API key de Biblia.com o la Public Key de
 * EmailJS, ver CLAUDE.md): identifican el proyecto, no autorizan nada por
 * sí solas. Se leen de variables de entorno solo por consistencia con el
 * resto del proyecto (`.env.local` en desarrollo, GitHub Actions secrets en
 * producción), no porque deban ocultarse.
 *
 * Toda la app (Auth, Biblia, Finanzas, Pagos) persiste aquí — ya no queda
 * nada en Dexie (ver CLAUDE.md).
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

/**
 * `ignoreUndefinedProperties: true` es **obligatorio** aquí, no una
 * preferencia: por defecto Firestore *lanza* un error si un objeto trae
 * cualquier campo en `undefined`, y el modelo de datos de la app está lleno
 * de campos opcionales que se pasan explícitamente como `undefined` cuando
 * no aplican (`tarjetaId` en un gasto de contado, `limite`/`diaCierre` en una
 * tarjeta de débito, `saldoInicial` en una de crédito, etc.). En Dexie eso
 * era inofensivo; al migrar a Firestore rompió el guardado de tarjetas y
 * gastos en producción (bug real reportado por estudiantes del curso). Con
 * esta opción, los campos `undefined` simplemente se omiten del documento.
 */
export const firestore = initializeFirestore(firebaseApp, {
  ignoreUndefinedProperties: true,
})
