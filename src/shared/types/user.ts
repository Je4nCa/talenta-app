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
  /** Versión del instrumento legal aceptada (ver src/modules/auth/constants/textoLegal.ts). */
  terminosVersion: string
  /** Fecha y hora exacta (ISO, UTC) de aceptación — requerido por el instrumento legal, Art. 34. */
  terminosFechaAceptacion: string
  /** Código promocional usado al registrarse (ej. 2026TALENTAOFF). */
  codigoPromocional: string
  /** Fecha (YYYY-MM-DD) en que termina el período de acceso gratuito otorgado por el código. */
  finPeriodoGratuito: string
}

export type NuevoUsuarioInput = {
  nombre: string
  email: string
  password: string
  paisCodigo: string
  codigoPromocional: string
}

export type LoginInput = {
  email: string
  password: string
}
