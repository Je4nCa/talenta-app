import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookHeart, BookOpen, Home, ShieldCheck, UserRound, Wallet } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useAuth } from '@/modules/auth/hooks/useAuth'

const enlacesIzquierda = [
  { to: '/curso', label: 'Curso', icon: BookOpen },
  { to: '/biblia', label: 'Biblia', icon: BookHeart },
]

const enlacesDerecha = [
  { to: '/finanzas', label: 'Finanzas', icon: Wallet },
  { to: '/perfil', label: 'Perfil', icon: UserRound },
]

function EnlaceNav({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Home }) {
  return (
    <li className="flex-1">
      <NavLink
        to={to}
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
  const derecha = esAdmin
    ? [...enlacesDerecha, { to: '/admin', label: 'Admin', icon: ShieldCheck }]
    : enlacesDerecha

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-talenta-tan/60 bg-talenta-white/90 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {enlacesIzquierda.map((enlace) => (
          <EnlaceNav key={enlace.to} {...enlace} />
        ))}

        <li className="flex flex-1 items-start justify-center">
          <NavLink to="/" end className="group -translate-y-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-talenta-black text-talenta-gold shadow-lg ring-4 ring-talenta-white transition-transform group-active:scale-95">
              <Home className="h-6 w-6" strokeWidth={2} />
            </span>
          </NavLink>
        </li>

        {derecha.map((enlace) => (
          <EnlaceNav key={enlace.to} {...enlace} />
        ))}
      </ul>
    </nav>
  )
}
