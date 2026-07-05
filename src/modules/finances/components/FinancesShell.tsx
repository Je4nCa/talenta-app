import { Outlet, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { DecorativeBackground } from '@/shared/components/DecorativeBackground'
import { buscarMoneda, buscarPais, emojiDeBandera } from '@/shared/lib/paises'
import { FinanceBottomNav } from './FinanceBottomNav'

export function FinancesShell() {
  const navigate = useNavigate()
  const usuario = useAuth((state) => state.usuario)
  const pais = usuario ? buscarPais(usuario.paisCodigo) : undefined
  const moneda = usuario ? buscarMoneda(usuario.monedaCodigo) : undefined

  return (
    <div className="relative min-h-dvh overflow-hidden bg-talenta-cream">
      <DecorativeBackground />

      <header className="relative z-10 flex items-center gap-3 px-5 pb-2 pt-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Volver al inicio de TALENTA"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-talenta-white/80 text-talenta-brown-dark shadow-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-talenta-black">Finanzas</h1>
          {moneda && (
            <span className="text-xs text-talenta-brown-mid">
              Moneda: {moneda.nombre} {pais && emojiDeBandera(pais.codigo)}
            </span>
          )}
        </div>
      </header>

      <main className="relative z-10 pb-28">
        <Outlet />
      </main>

      <FinanceBottomNav />
    </div>
  )
}
