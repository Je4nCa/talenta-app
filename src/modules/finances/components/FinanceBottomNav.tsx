import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, LayoutDashboard, Percent, Receipt, Wallet } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const enlaces = [
  { to: '/finanzas', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/finanzas/gastos', label: 'Gastos', icon: Receipt, end: false },
  { to: '/finanzas/tarjetas', label: 'Tarjetas', icon: CreditCard, end: false },
  { to: '/finanzas/pagos', label: 'Pagos', icon: Wallet, end: false },
  { to: '/finanzas/tasa-cero', label: 'Tasa 0%', icon: Percent, end: false },
]

export function FinanceBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-talenta-tan/60 bg-talenta-white/90 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-1">
        {enlaces.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-3 text-[11px] font-medium text-talenta-brown-mid transition-colors',
                  isActive && 'text-talenta-gold',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative flex h-8 w-8 items-center justify-center">
                    {isActive && (
                      <motion.span
                        layoutId="finance-nav-active"
                        className="absolute inset-0 rounded-xl bg-talenta-gold/15"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="relative h-[18px] w-[18px]" strokeWidth={isActive ? 2.25 : 1.75} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
