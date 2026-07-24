import type { ID, FechaHoraISO } from './comunes'

/**
 * Categorías fijas del "Listado de Bienes (LB)" de la Lección 1 del curso
 * de Sanidad Financiera (método SSYLF) — igual que en el formulario
 * oficial del manual del estudiante, cada categoría tiene un único valor
 * actual (no es una lista libre de entradas repetibles como los Gastos).
 */
export enum CategoriaBien {
  EfectivoBanco = 'efectivo_banco',
  CuentaAhorros = 'cuenta_ahorros',
  AccionesBonos = 'acciones_bonos',
  Vivienda = 'vivienda',
  OtrosInmuebles = 'otros_inmuebles',
  CuentasPorCobrar = 'cuentas_por_cobrar',
  Automoviles = 'automoviles',
  OtrosVehiculos = 'otros_vehiculos',
  MueblesHogar = 'muebles_hogar',
  ComputadorasEquipos = 'computadoras_equipos',
  JoyasPrendas = 'joyas_prendas',
  ColeccionesValor = 'colecciones_valor',
  OtrosBienesPersonales = 'otros_bienes_personales',
  AhorrosPension = 'ahorros_pension',
}

export interface Bien {
  /** Determinístico: `${uid}-${categoria}`, para poder hacer upsert por categoría. */
  id: ID
  uid: string
  categoria: CategoriaBien
  valorActual: number
  actualizadoEn: FechaHoraISO
}
