import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type AuthError as FirebaseAuthError,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { firebaseAuth, firestore } from '@/shared/lib/firebase'
import { sha256Hex } from '@/shared/lib/hash'
import { buscarPais } from '@/shared/lib/paises'
import type { LoginInput, NuevoUsuarioInput, UserProfile, UserRole } from '@/shared/types/user'
import { CORREOS_ESTUDIANTES_HASH } from '../constants/estudiantesInscritos'
import { VERSION_TERMINOS } from '../constants/legal'
import {
  CODIGO_PROMOCIONAL_FACILITADOR,
  CODIGO_PROMOCIONAL_SUPERADMIN,
  CODIGO_PROMOCIONAL_VALIDO,
  obtenerFinPeriodoGratuito,
} from '../constants/promociones'

export class AuthError extends Error {}

function normalizarEmail(email: string): string {
  return email.trim().toLowerCase()
}

function esErrorFirebase(err: unknown): err is FirebaseAuthError {
  return typeof err === 'object' && err !== null && 'code' in err
}

function docUsuario(uid: string) {
  return doc(firestore, 'users', uid)
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
    const emailHash = await sha256Hex(email)
    if (!CORREOS_ESTUDIANTES_HASH.includes(emailHash)) {
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
      throw new AuthError('Ya existe una cuenta con este correo.')
    }
    throw err
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
    throw new AuthError('No se encontró tu perfil. Contacta a soporte.')
  }

  return snap.data() as UserProfile
}
