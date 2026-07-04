import { useEffect, useState } from 'react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { obtenerPasaje } from '../lib/bibliaClient'
import { formatearReferenciaLocalizada, obtenerIdiomaDeBiblia } from '../lib/referencias'
import { VERSICULOS_DESTACADOS } from '../constants/versiculosDestacados'

function diaDelAnio(): number {
  const ahora = new Date()
  const inicioAnio = new Date(ahora.getFullYear(), 0, 0)
  const diferencia = ahora.getTime() - inicioAnio.getTime()
  return Math.floor(diferencia / (1000 * 60 * 60 * 24))
}

interface VersiculoDelDia {
  referencia: string
  texto: string
  cargando: boolean
  error: string | null
}

export function useVersiculoDelDia(): VersiculoDelDia {
  const usuario = useAuth((state) => state.usuario)
  const bibliaId = usuario?.versionBiblia ?? 'RVR60'

  const [texto, setTexto] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const elegido = VERSICULOS_DESTACADOS[diaDelAnio() % VERSICULOS_DESTACADOS.length]

  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError(null)

    obtenerPasaje(bibliaId, elegido.referencia)
      .then((datos) => {
        if (!cancelado) setTexto(datos)
      })
      .catch(() => {
        if (!cancelado) setError('No se pudo cargar el versículo del día.')
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [bibliaId, elegido.referencia])

  return {
    referencia: formatearReferenciaLocalizada(elegido.referencia, obtenerIdiomaDeBiblia(bibliaId)),
    texto,
    cargando,
    error,
  }
}
