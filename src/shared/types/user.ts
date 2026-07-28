export type UserRole = 'student' | 'facilitador' | 'superadmin'

export interface UserProfile {
  uid: string
  nombre: string
  email: string
  idioma: 'es'
  versionBiblia: string
  onboardingCompletado: boolean
  rol: UserRole
  /** ISO, UTC — la contraseña ya no vive aquí, la maneja Firebase Authentication. */
  creadoEn: string
  paisCodigo: string
  /** Moneda principal: en la que se muestran todos los totales y balances. */
  monedaCodigo: string
  /**
   * Segunda moneda, opcional — para quien recibe ingresos o paga deudas en
   * dos monedas (ej. colones y dólares). Cuando está definida, los
   * formularios dejan elegir en cuál de las dos ocurrió cada movimiento, y
   * los totales se convierten a `monedaCodigo` al tipo de cambio del día.
   */
  monedaSecundaria?: string
  /** Versión del instrumento legal aceptada (ver src/modules/auth/constants/textoLegal.ts). */
  terminosVersion: string
  /** Fecha y hora exacta (ISO, UTC) de aceptación — requerido por el instrumento legal, Art. 34. */
  terminosFechaAceptacion: string
  /** Código promocional usado al registrarse (ej. 2026TALENTAOFF). */
  codigoPromocional: string
  /**
   * Fecha (YYYY-MM-DD) en que termina el período de acceso gratuito otorgado
   * por el código de estudiante. `undefined` significa acceso completo sin
   * fecha de vencimiento ni costo — así se registran las cuentas `facilitador`
   * y `superadmin`, que nunca tienen prueba gratuita ni pasan por suscripción.
   */
  finPeriodoGratuito?: string
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
