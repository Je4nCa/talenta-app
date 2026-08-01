import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  type AuthError as FirebaseAuthError,
  type UserCredential,
} from 'firebase/auth'
import { deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { firebaseAuth, firestore } from '@/shared/lib/firebase'
import { canonizarEmail, normalizarEmail } from '@/shared/lib/email'
import { sha256Hex } from '@/shared/lib/hash'
import { buscarPais } from '@/shared/lib/paises'
import type { LoginInput, NuevoUsuarioInput, UserProfile, UserRole } from '@/shared/types/user'
import { estaAutorizadoEnFirestore } from '@/modules/admin/repositories/correosAutorizados.repository'
import { CORREOS_ESTUDIANTES_HASH } from '../constants/estudiantesInscritos'
import { VERSION_TERMINOS } from '../constants/legal'
import {
  CODIGO_PROMOCIONAL_FACILITADOR,
  CODIGO_PROMOCIONAL_SUPERADMIN,
  CODIGO_PROMOCIONAL_VALIDO,
  obtenerFinPeriodoGratuito,
} from '../constants/promociones'

export class AuthError extends Error {}

function esErrorFirebase(err: unknown): err is FirebaseAuthError {
  return typeof err === 'object' && err !== null && 'code' in err
}

function docUsuario(uid: string) {
  return doc(firestore, 'users', uid)
}

/**
 * Caso "registro a medias": el correo ya existe en Firebase Auth. Si la
 * contraseña es correcta y la cuenta **no** tiene perfil en Firestore,
 * devolvemos la credencial para que `registrarUsuario` termine de crear el
 * perfil. Si sí tiene perfil, es un correo ya registrado de verdad.
 */
async function recuperarRegistroIncompleto(
  email: string,
  password: string,
): Promise<UserCredential> {
  let credencial: UserCredential
  try {
    credencial = await signInWithEmailAndPassword(firebaseAuth, email, password)
  } catch {
    // No sabemos la contraseña de esa cuenta: para nosotros es simplemente
    // un correo ya tomado.
    throw new AuthError('Ya existe una cuenta con este correo.')
  }

  const snap = await getDoc(docUsuario(credencial.user.uid))
  if (snap.exists()) {
    throw new AuthError('Ya existe una cuenta con este correo. Intenta iniciar sesión.')
  }

  return credencial
}

/**
 * ¿Este correo puede registrarse como estudiante?
 *
 * Primero consulta la lista que Carlos y Alicia administran desde el panel
 * (Firestore); si ahí no está, cae a `CORREOS_ESTUDIANTES_HASH`, la lista
 * inicial que vive en el código. Ese respaldo evita que un fallo de red o
 * una colección todavía vacía dejen fuera a los estudiantes ya inscritos.
 *
 * En ambos casos se prueba el correo tal como se escribió y su forma
 * canónica, porque en Gmail `juan.perez@` y `juanperez@` son el mismo buzón.
 */
async function esEstudianteInscrito(email: string): Promise<boolean> {
  try {
    if (await estaAutorizadoEnFirestore(email)) return true
  } catch {
    // Sin conexión o sin permisos: seguimos con la lista del código.
  }

  const [hashLiteral, hashCanonico] = await Promise.all([
    sha256Hex(email),
    sha256Hex(canonizarEmail(email)),
  ])
  return (
    CORREOS_ESTUDIANTES_HASH.includes(hashLiteral) ||
    CORREOS_ESTUDIANTES_HASH.includes(hashCanonico)
  )
}

export async function registrarUsuario(input: NuevoUsuarioInput): Promise<UserProfile> {
  const email = normalizarEmail(input.email)

  const pais = buscarPais(input.paisCodigo)
  if (!pais) {
    throw new AuthError('Selecciona un país válido.')
  }

  const codigoPromocional = input.codigoPromocional.trim().toUpperCase()
  let rol: UserRole = 'student'

  if (codigoPromocional === CODIGO_PROMOCIONAL_SUPERADMIN) {
    rol = 'superadmin'
  } else if (codigoPromocional === CODIGO_PROMOCIONAL_FACILITADOR) {
    rol = 'facilitador'
  } else if (codigoPromocional === CODIGO_PROMOCIONAL_VALIDO) {
    if (!(await esEstudianteInscrito(email))) {
      throw new AuthError('Este correo no está en la lista de estudiantes inscritos en el curso.')
    }
  } else {
    throw new AuthError('Código promocional inválido.')
  }

  let credencial
  try {
    credencial = await createUserWithEmailAndPassword(firebaseAuth, email, input.password)
  } catch (err) {
    if (esErrorFirebase(err) && err.code === 'auth/email-already-in-use') {
      // La cuenta existe en Firebase Auth. Puede ser un registro que quedó a
      // medias: si la creación del perfil en Firestore falló, la cuenta de
      // Auth pudo quedar huérfana (sin perfil), y entonces el usuario queda
      // atrapado — no puede entrar ("no se encontró tu perfil") ni volver a
      // registrarse ("ya existe una cuenta"). Le pasó a una usuaria real.
      // Si nos da la contraseña correcta y efectivamente no tiene perfil,
      // terminamos el registro que quedó incompleto en vez de bloquearla.
      credencial = await recuperarRegistroIncompleto(email, input.password)
    } else {
      throw err
    }
  }

  const ahora = new Date().toISOString()
  const perfil: UserProfile = {
    uid: credencial.user.uid,
    nombre: input.nombre.trim(),
    email,
    idioma: 'es',
    versionBiblia: 'RVR60',
    onboardingCompletado: false,
    rol,
    creadoEn: ahora,
    paisCodigo: pais.codigo,
    monedaCodigo: pais.monedaCodigo,
    terminosVersion: VERSION_TERMINOS,
    terminosFechaAceptacion: ahora,
    codigoPromocional,
    // Las cuentas facilitador y superadmin tienen acceso completo sin costo
    // desde el registro — no aplica período de prueba. Solo los estudiantes
    // reciben finPeriodoGratuito.
    ...(rol === 'student' ? { finPeriodoGratuito: obtenerFinPeriodoGratuito() } : {}),
  }

  try {
    await setDoc(docUsuario(perfil.uid), perfil)
  } catch (err) {
    // Si no se pudo guardar el perfil, no dejar huérfana la cuenta de Auth
    // recién creada — el usuario podría quedar "registrado" sin perfil.
    await credencial.user.delete().catch(() => {})
    throw err
  }

  return perfil
}

export async function actualizarVersionBiblia(uid: string, versionBiblia: string): Promise<void> {
  await updateDoc(docUsuario(uid), { versionBiblia })
}

export async function actualizarMoneda(uid: string, monedaCodigo: string): Promise<void> {
  await updateDoc(docUsuario(uid), { monedaCodigo })
}

/** `null` desactiva la segunda moneda (el usuario vuelve a manejar una sola). */
export async function actualizarMonedaSecundaria(
  uid: string,
  monedaSecundaria: string | null,
): Promise<void> {
  await updateDoc(docUsuario(uid), { monedaSecundaria: monedaSecundaria ?? deleteField() })
}

/**
 * Envía el correo de restablecimiento de contraseña de Firebase Auth. No
 * revela si el correo existe o no en el sistema (si `sendPasswordResetEmail`
 * falla por `auth/user-not-found`, no se propaga el error) — evita que este
 * flujo se use para averiguar qué correos tienen cuenta en TALENTA.
 */
export async function enviarCorreoRecuperacion(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(firebaseAuth, normalizarEmail(email))
  } catch (err) {
    if (esErrorFirebase(err) && err.code === 'auth/user-not-found') {
      return
    }
    throw err
  }
}

export async function iniciarSesion(input: LoginInput): Promise<UserProfile> {
  const email = normalizarEmail(input.email)

  let credencial
  try {
    credencial = await signInWithEmailAndPassword(firebaseAuth, email, input.password)
  } catch {
    throw new AuthError('Correo o contraseña incorrectos.')
  }

  const snap = await getDoc(docUsuario(credencial.user.uid))
  if (!snap.exists()) {
    // Registro que quedó a medias (cuenta en Auth, sin perfil). Se resuelve
    // solo: al volver a "Crear cuenta" con este mismo correo y contraseña,
    // `registrarUsuario` detecta el caso y termina de crear el perfil.
    throw new AuthError(
      'Tu registro quedó incompleto. Ve a "Crear cuenta" y regístrate de nuevo con este mismo correo y contraseña para terminarlo.',
    )
  }

  return snap.data() as UserProfile
}
