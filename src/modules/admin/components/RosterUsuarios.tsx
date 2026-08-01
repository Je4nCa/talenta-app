import { collection, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { GraduationCap, ShieldCheck, Users } from 'lucide-react'
import { firestore } from '@/shared/lib/firebase'
import type { UserProfile, UserRole } from '@/shared/types/user'

const ETIQUETA_ROL: Record<UserRole, string> = {
  student: 'Estudiante',
  facilitador: 'Facilitador',
  superadmin: 'Administrador',
}

const ICONO_ROL: Record<UserRole, typeof Users> = {
  student: GraduationCap,
  facilitador: Users,
  superadmin: ShieldCheck,
}

function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UserProfile[] | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(firestore, 'users'),
      (snap) => {
        setUsuarios(
          snap.docs
            .map((d) => d.data() as UserProfile)
            .sort((a, b) => (b.creadoEn ?? '').localeCompare(a.creadoEn ?? '')),
        )
        setError(null)
      },
      () => {
        setUsuarios([])
        setError('No se pudo cargar el roster. Revisa que tu cuenta sea de administrador.')
      },
    )
    return unsub
  }, [])

  return { usuarios: usuarios ?? [], cargando: usuarios === undefined, error }
}

export function RosterUsuarios() {
  const { usuarios, cargando, error } = useUsuarios()

  const porRol = (rol: UserRole) => usuarios.filter((u) => u.rol === rol).length

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3">
        {(['student', 'facilitador', 'superadmin'] as UserRole[]).map((rol) => {
          const Icono = ICONO_ROL[rol]
          return (
            <div
              key={rol}
              className="flex min-w-0 flex-col gap-2 rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-3 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-talenta-gold/15 text-talenta-gold">
                <Icono className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="text-xs text-talenta-brown-mid">{ETIQUETA_ROL[rol]}s</span>
              <span className="text-xl font-semibold text-talenta-black">{porRol(rol)}</span>
            </div>
          )
        })}
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-base text-red-700">
          {error}
        </p>
      )}

      {cargando ? (
        <p className="py-6 text-center text-base text-talenta-brown-mid">Cargando…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {usuarios.map((u) => (
            <div
              key={u.uid}
              className="flex items-center gap-3 rounded-xl border border-talenta-tan/60 bg-talenta-white/90 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-medium text-talenta-black">{u.nombre}</p>
                <p className="truncate text-sm text-talenta-brown-mid">{u.email}</p>
              </div>
              <span className="shrink-0 rounded-full bg-talenta-gold/15 px-3 py-1 text-xs font-medium text-talenta-brown-dark">
                {ETIQUETA_ROL[u.rol] ?? u.rol}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
