import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookHeart, Home, ShieldCheck, UserRound, Wallet } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useAuth } from '@/modules/auth/hooks/useAuth'

const enlacesBase = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/biblia', label: 'Biblia', icon: BookHeart, end: false },
  { to: '/finanzas', label: 'Finanzas', icon: Wallet, end: false },
  { to: '/perfil', label: 'Perfil', icon: UserRound, end: false },
]

function EnlaceNav({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string
  label: string
  icon: typeof Home
  end: boolean
}) {
  return (
    <li className="flex-1">
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center gap-1 py-3 text-xs font-medium text-talenta-brown-mid transition-colors',
            isActive && 'text-talenta-gold',
          )
        }
      >
        {({ isActive }) => (
          <>
            <span className="relative flex h-9 w-9 items-center justify-center">
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-xl bg-talenta-gold/15"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="relative h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
            </span>
            {label}
          </>
        )}
      </NavLink>
    </li>
  )
}

export function BottomNav() {
  const esAdmin = useAuth((state) => state.usuario?.rol === 'admin')
  const enlaces = esAdmin
    ? [...enlacesBase, { to: '/admin', label: 'Admin', icon: ShieldCheck, end: false }]
    : enlacesBase

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-talenta-tan/60 bg-talenta-white/90 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {enlaces.map((enlace) => (
          <EnlaceNav key={enlace.to} {...enlace} />
        ))}
      </ul>
    </nav>
  )
}
