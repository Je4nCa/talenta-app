import { CategoriaBien } from '../types/bien'

/** Orden y etiquetas exactas del formulario "Listado de Bienes (LB)" del manual del estudiante. */
export const CATEGORIAS_BIEN_ORDENADAS: { categoria: CategoriaBien; etiqueta: string }[] = [
  { categoria: CategoriaBien.EfectivoBanco, etiqueta: 'Efectivo - Banco' },
  { categoria: CategoriaBien.CuentaAhorros, etiqueta: 'Cuenta de Ahorros' },
  { categoria: CategoriaBien.AccionesBonos, etiqueta: 'Acciones o Bonos' },
  { categoria: CategoriaBien.Vivienda, etiqueta: 'Vivienda - Casa - Apto.' },
  { categoria: CategoriaBien.OtrosInmuebles, etiqueta: 'Otros bienes inmobiliarios' },
  { categoria: CategoriaBien.CuentasPorCobrar, etiqueta: 'Cuentas por cobrar' },
  { categoria: CategoriaBien.Automoviles, etiqueta: 'Automóviles' },
  { categoria: CategoriaBien.OtrosVehiculos, etiqueta: 'Otros vehículos' },
  { categoria: CategoriaBien.MueblesHogar, etiqueta: 'Muebles del hogar' },
  { categoria: CategoriaBien.ComputadorasEquipos, etiqueta: 'Computadoras y/o equipos electrónicos' },
  { categoria: CategoriaBien.JoyasPrendas, etiqueta: 'Joyas o prendas de valor' },
  { categoria: CategoriaBien.ColeccionesValor, etiqueta: 'Colecciones de valor' },
  { categoria: CategoriaBien.OtrosBienesPersonales, etiqueta: 'Otros bienes personales' },
  { categoria: CategoriaBien.AhorrosPension, etiqueta: 'Ahorros para pensiones o jubilaciones' },
]
