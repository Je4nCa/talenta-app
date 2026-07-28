import { useEffect, useState } from 'react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { buscarMoneda } from '@/shared/lib/paises'
import { convertir, obtenerTasas, type TasasCambio } from '@/shared/lib/tipoCambio'

/**
 * Monedas activas del usuario y conversión entre ellas.
 *
 * `monedaPrincipal` es en la que se muestran todos los totales; la
 * `monedaSecundaria` es opcional (quien recibe ingresos o paga deudas en dos
 * monedas). Cada gasto/ingreso guarda la moneda en la que realmente ocurrió,
 * y `aPrincipal()` lo lleva a la principal para poder sumar.
 */
export function useMonedas() {
  const usuario = useAuth((state) => state.usuario)
  const [tasas, setTasas] = useState<TasasCambio | null>(null)

  const monedaPrincipal = usuario?.monedaCodigo ?? 'USD'
  const monedaSecundaria = usuario?.monedaSecundaria
  const tieneDosMonedas = Boolean(monedaSecundaria && monedaSecundaria !== monedaPrincipal)

  useEffect(() => {
    if (!tieneDosMonedas) return
    let cancelado = false
    obtenerTasas().then((t) => {
      if (!cancelado) setTasas(t)
    })
    return () => {
      cancelado = true
    }
  }, [tieneDosMonedas])

  /** Lista de monedas que el usuario puede elegir al registrar un movimiento. */
  const monedasDisponibles = tieneDosMonedas
    ? [monedaPrincipal, monedaSecundaria as string]
    : [monedaPrincipal]

  /**
   * Convierte un monto a la moneda principal. Si no hay tasa disponible
   * devuelve el monto tal cual — preferimos un total ligeramente impreciso
   * y visible que una pantalla rota o en blanco.
   */
  function aPrincipal(monto: number, moneda: string | undefined): number {
    const origen = moneda ?? monedaPrincipal
    if (origen === monedaPrincipal) return monto
    return convertir(monto, origen, monedaPrincipal, tasas) ?? monto
  }

  /** Suma una lista de movimientos llevando cada uno a la moneda principal. */
  function sumarEnPrincipal<T>(
    items: T[],
    obtenerMonto: (item: T) => number,
    obtenerMoneda: (item: T) => string | undefined,
  ): number {
    return items.reduce((acc, item) => acc + aPrincipal(obtenerMonto(item), obtenerMoneda(item)), 0)
  }

  return {
    monedaPrincipal,
    monedaSecundaria,
    tieneDosMonedas,
    monedasDisponibles,
    tasas,
    fechaTasas: tasas?.fecha,
    aPrincipal,
    sumarEnPrincipal,
    nombreMoneda: (codigo: string) => buscarMoneda(codigo)?.nombre ?? codigo,
  }
}
