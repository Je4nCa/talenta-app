import { TipoDeuda } from '../types/deuda'

/** Orden y etiquetas exactas del formulario "Listado de Deudas (LD)" del manual del estudiante. */
export const CATEGORIAS_DEUDA_ORDENADAS: { tipo: TipoDeuda; etiqueta: string }[] = [
  { tipo: TipoDeuda.TarjetaCredito, etiqueta: 'Tarjetas de crédito' },
  { tipo: TipoDeuda.PrestamoPrendario, etiqueta: 'Préstamos prendarios / leasing' },
  { tipo: TipoDeuda.HipotecaVivienda, etiqueta: 'Hipotecas de vivienda' },
  { tipo: TipoDeuda.DeudaFamiliarAmigos, etiqueta: 'Deuda con familiares y/o amigos' },
  { tipo: TipoDeuda.CuentaMedica, etiqueta: 'Cuentas médicas' },
  { tipo: TipoDeuda.FinanciamientoEducacion, etiqueta: 'Financiamiento de educación' },
  { tipo: TipoDeuda.FiadorPersonaEmpresa, etiqueta: 'Fiadores de personas o empresa' },
]
