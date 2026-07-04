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
}

export type NuevoUsuarioInput = {
  nombre: string
  email: string
  password: string
}

export type LoginInput = {
  email: string
  password: string
}
