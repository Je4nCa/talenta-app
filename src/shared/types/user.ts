export type UserRole = 'student' | 'admin'

export interface UserProfile {
  uid: string
  nombre: string
  email: string
  passwordHash: string
  idioma: 'es'
  versionBiblia: string
  onboardingCompletado: boolean
  rol: UserRole
  creadoEn: Date
  paisCodigo: string
  monedaCodigo: string
}

export type NuevoUsuarioInput = {
  nombre: string
  email: string
  password: string
  paisCodigo: string
}

export type LoginInput = {
  email: string
  password: string
}
