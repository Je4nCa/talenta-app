import { ESCALA_MAXIMA, ESCALA_MINIMA, useAccesibilidad } from '@/shared/hooks/useAccesibilidad'

const PASO = 0.125

export function TextSizeSlider() {
  const escala = useAccesibilidad((state) => state.escala)
  const setEscala = useAccesibilidad((state) => state.setEscala)
  const porcentaje = Math.round(escala * 100)

  return (
    <div className="w-full rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-talenta-black">Tamaño de texto y elementos</span>
        <span className="text-base font-semibold text-talenta-gold">{porcentaje}%</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="text-base text-talenta-brown-mid">A</span>
        <input
          type="range"
          aria-label="Tamaño de texto y elementos"
          min={ESCALA_MINIMA}
          max={ESCALA_MAXIMA}
          step={PASO}
          value={escala}
          onChange={(e) => setEscala(Number(e.target.value))}
          className="h-3 flex-1 cursor-pointer appearance-none rounded-full bg-talenta-tan accent-talenta-gold"
        />
        <span className="text-2xl text-talenta-brown-mid">A</span>
      </div>

      <p className="mt-3 text-center text-base text-talenta-brown-dark">
        Ejemplo: <span style={{ fontSize: `${escala}rem` }}>Así se verá el texto</span>
      </p>
    </div>
  )
}
