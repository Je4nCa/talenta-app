import type { ID, FechaHoraISO, FechaISO } from './comunes'

/**
 * Categorías del "Listado de Deudas (LD)" de la Lección 1 del curso de
 * Sanidad Financiera (método SSYLF) — no son libres, siguen exactamente
 * las 7 categorías del formulario oficial del manual del estudiante.
 */
export enum TipoDeuda {
  TarjetaCredito = 'tarjeta_credito',
  PrestamoPrendario = 'prestamo_prendario',
  HipotecaVivienda = 'hipoteca_vivienda',
  DeudaFamiliarAmigos = 'deuda_familiar_amigos',
  CuentaMedica = 'cuenta_medica',
  FinanciamientoEducacion = 'financiamiento_educacion',
  FiadorPersonaEmpresa = 'fiador_persona_empresa',
}

export interface Deuda {
  id: ID
  uid: string
  /** "Acreedor" en el formulario LD del manual. */
  nombre: string
  tipo: TipoDeuda
  montoOriginal: number
  /** Se reduce con cada abono registrado. */
  saldoActual: number
  /** % anual, opcional — no todas las deudas tienen tasa (ej. préstamo con un familiar). */
  tasaInteres?: number
  /** Pago mensual esperado, opcional. */
  cuotaMensual?: number
  fechaInicio: FechaISO
  /** Fecha estimada de liquidación total de la deuda, opcional (campo del formulario LD). */
  fechaLiquidacion?: FechaISO
  notas?: string
  creadoEn: FechaHoraISO
  actualizadoEn: FechaHoraISO
}

export interface AbonoDeuda {
  id: ID
  deudaId: ID
  uid: string
  monto: number
  fecha: FechaISO
  creadoEn: FechaHoraISO
}
