import type { ID, FechaHoraISO } from './comunes'

/**
 * Categorías fijas del "Registro de Ingresos y Egresos (RIE)" de la Lección 1
 * del curso de Sanidad Financiera (método SSYLF) — igual que en el
 * formulario oficial del manual del estudiante: cuadrícula de 31 días x 15
 * categorías, para hacer seguimiento de un mes completo de movimientos.
 */
export enum CategoriaRIE {
  IngresosSalario = 'ingresos_salario',
  Donaciones = 'donaciones',
  Impuestos = 'impuestos',
  Ahorros = 'ahorros',
  Vivienda = 'vivienda',
  Alimentos = 'alimentos',
  Servicios = 'servicios',
  Transporte = 'transporte',
  RopaOtros = 'ropa_otros',
  MedicoSalud = 'medico_salud',
  Educacion = 'educacion',
  Entretenimiento = 'entretenimiento',
  Personal = 'personal',
  Deudas = 'deudas',
  Otros = 'otros',
}

export interface CeldaRIE {
  /** Determinístico: `${uid}-${dia}-${categoria}`, para poder hacer upsert por celda. */
  id: ID
  uid: string
  /** Día del mes, 1 a 31. */
  dia: number
  categoria: CategoriaRIE
  monto: number
  actualizadoEn: FechaHoraISO
}
