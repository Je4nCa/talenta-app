import { Label } from '@/shared/components/ui/label'
import { buscarMoneda } from '@/shared/lib/paises'
import { cn } from '@/shared/lib/utils'
import { useMonedas } from '../hooks/useMonedas'

/**
 * Deja elegir en cuál de las dos monedas del usuario ocurrió el movimiento.
 * Si solo tiene una moneda activa no se muestra nada — no tiene sentido
 * pedirle que elija entre una sola opción.
 */
export function SelectorMonedaMovimiento({
  id,
  valor,
  onCambiar,
}: {
  id: string
  valor: string
  onCambiar: (moneda: string) => void
}) {
  const { tieneDosMonedas, monedasDisponibles } = useMonedas()

  if (!tieneDosMonedas) return null

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>¿En qué moneda?</Label>
      <div id={id} className="grid grid-cols-2 gap-3">
        {monedasDisponibles.map((codigo) => {
          const moneda = buscarMoneda(codigo)
          const activa = valor === codigo
          return (
            <button
              key={codigo}
              type="button"
              onClick={() => onCambiar(codigo)}
              aria-pressed={activa}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-base font-medium transition-colors',
                activa
                  ? 'border-talenta-gold bg-talenta-gold/15 text-talenta-brown-dark'
                  : 'border-talenta-tan text-talenta-brown-mid',
              )}
            >
              <span className="text-lg">{moneda?.simbolo ?? codigo}</span>
              {codigo}
            </button>
          )
        })}
      </div>
    </div>
  )
}
