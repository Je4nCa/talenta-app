import { motion, type Variants } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BookHeart, BookOpen, ChevronRight, ShieldCheck, Wallet, type LucideIcon } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

interface ModuloCard {
  to: string
  titulo: string
  descripcion: string
  icon: LucideIcon
}

const modulos: ModuloCard[] = [
  {
    to: '/curso',
    titulo: 'Curso',
    descripcion: '8 lecciones para crecer en mayordomía',
    icon: BookOpen,
  },
  {
    to: '/biblia',
    titulo: 'Biblia',
    descripcion: 'Versículo diario y memorización',
    icon: BookHeart,
  },
  {
    to: '/finanzas',
    titulo: 'Finanzas',
    descripcion: 'Presupuesto, gastos y balances',
    icon: Wallet,
  },
]

const contenedor: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export function HubScreen() {
  const usuario = useAuth((state) => state.usuario)
  const navigate = useNavigate()

  const tarjetas = usuario?.rol === 'admin'
    ? [
        ...modulos,
        {
          to: '/admin',
          titulo: 'Administración',
          descripcion: 'Roster, pagos y seguimiento',
          icon: ShieldCheck,
        },
      ]
    : modulos

  const primerNombre = usuario?.nombre.trim().split(/\s+/)[0] ?? ''

  return (
    <div className="mx-auto max-w-md px-5 pt-10 sm:pt-14">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-sm font-medium uppercase tracking-widest text-talenta-brown-mid/70">
          TALENTA
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-talenta-black">Hola, {primerNombre}</h1>
        <p className="mt-1 font-decorative text-xl italic text-talenta-brown-mid">
          ¿Qué quieres hacer hoy?
        </p>
      </motion.div>

      <motion.div
        className="mt-8 flex flex-col gap-4"
        variants={contenedor}
        initial="hidden"
        animate="visible"
      >
        {tarjetas.map(({ to, titulo, descripcion, icon: Icon }) => (
          <motion.button
            key={to}
            type="button"
            variants={item}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -2 }}
            onClick={() => navigate(to)}
            className="flex items-center gap-4 rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-5 text-left shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-talenta-gold/15 text-talenta-gold">
              <Icon className="h-7 w-7" strokeWidth={1.75} />
            </span>
            <span className="flex-1">
              <span className="block text-lg font-medium text-talenta-black">{titulo}</span>
              <span className="block text-sm text-talenta-brown-mid">{descripcion}</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-talenta-brown-mid/60" />
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
