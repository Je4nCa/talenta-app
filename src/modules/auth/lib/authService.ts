import { db } from '@/shared/lib/db'
import { buscarPais } from '@/shared/lib/paises'
import type { LoginInput, NuevoUsuarioInput, UserProfile } from '@/shared/types/user'
import { hashPassword, verifyPassword } from './password'

export class AuthError extends Error {}

function normalizarEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function registrarUsuario(input: NuevoUsuarioInput): Promise<UserProfile> {
  const email = normalizarEmail(input.email)
  const existente = await db.users.where('email').equals(email).first()
  if (existente) {
    throw new AuthError('Ya existe una cuenta con este correo.')
  }

  const pais = buscarPais(input.paisCodigo)
  if (!pais) {
    throw new AuthError('Selecciona un país válido.')
  }

  const perfil: UserProfile = {
    uid: crypto.randomUUID(),
    nombre: input.nombre.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    idioma: 'es',
    versionBiblia: 'RVR1960',
    onboardingCompletado: false,
    rol: 'student',
    creadoEn: new Date(),
    paisCodigo: pais.codigo,
    monedaCodigo: pais.monedaCodigo,
  }

  await db.users.add(perfil)
  return perfil
}

export async function iniciarSesion(input: LoginInput): Promise<UserProfile> {
  const email = normalizarEmail(input.email)
  const usuario = await db.users.where('email').equals(email).first()
  if (!usuario) {
    throw new AuthError('Correo o contraseña incorrectos.')
  }

  const valido = await verifyPassword(input.password, usuario.passwordHash)
  if (!valido) {
    throw new AuthError('Correo o contraseña incorrectos.')
  }

  return usuario
}
