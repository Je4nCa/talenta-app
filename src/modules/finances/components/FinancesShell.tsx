import { Outlet, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { DecorativeBackground } from '@/shared/components/DecorativeBackground'
import { FinanceBottomNav } from './FinanceBottomNav'

export function FinancesShell() {
  const navigate = useNavigate()

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
        <h1 className="text-lg font-semibold text-talenta-black">Finanzas</h1>
      </header>

      <main className="relative z-10 pb-28">
        <Outlet />
      </main>

      <FinanceBottomNav />
    </div>
  )
}
