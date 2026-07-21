import { useState, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { LogOut, ShieldCheck } from 'lucide-react'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { Select } from '@/shared/components/ui/select'
import { TextSizeSlider } from '@/shared/components/TextSizeSlider'
import { buscarPais, MONEDAS } from '@/shared/lib/paises'
import { useAuth } from '../hooks/useAuth'
import { FeedbackForm } from './FeedbackForm'
import { LogoMark } from './LogoMark'

function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? '')
    .join('')
}

function SelectorMoneda({ monedaCodigo }: { monedaCodigo: string }) {
  const cambiarMoneda = useAuth((state) => state.cambiarMoneda)
  const [guardando, setGuardando] = useState(false)

  async function manejarCambio(e: ChangeEvent<HTMLSelectElement>) {
    setGuardando(true)
    await cambiarMoneda(e.target.value)
    setGuardando(false)
  }

  return (
    <div className="w-full rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-left shadow-sm">
      <div className="flex flex-col gap-2">
        <Label htmlFor="perfil-moneda">Moneda</Label>
        <Select
          id="perfil-moneda"
          value={monedaCodigo}
          onChange={manejarCambio}
          disabled={guardando}
        >
          {MONEDAS.map((moneda) => (
            <option key={moneda.codigo} value={moneda.codigo}>
              {moneda.simbolo} {moneda.nombre}
            </option>
          ))}
        </Select>
        <p className="text-sm text-talenta-brown-mid">
          Cambia solo cómo se muestran los montos en Finanzas — no convierte los montos que ya
          registraste.
        </p>
      </div>
    </div>
  )
}

function diasRestantes(finPeriodoGratuito: string): number {
  const hoy = new Date()
  const fin = new Date(`${finPeriodoGratuito}T00:00:00`)
  return Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
}

export function ProfileScreen() {
  const usuario = useAuth((state) => state.usuario)
  const logout = useAuth((state) => state.logout)

  if (!usuario) return null

  const pais = buscarPais(usuario.paisCodigo)
  const dias = diasRestantes(usuario.finPeriodoGratuito)

  return (
    <motion.div
      className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-10 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-talenta-gold text-3xl font-semibold text-talenta-white shadow-lg">
        {iniciales(usuario.nombre)}
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-talenta-black">{usuario.nombre}</h1>
        <p className="mt-1 text-base text-talenta-brown-mid">{usuario.email}</p>
      </div>

      {usuario.rol === 'admin' && (
        <span className="flex items-center gap-2 rounded-full bg-talenta-gold/15 px-4 py-1.5 text-sm font-medium text-talenta-brown-dark">
          <ShieldCheck className="h-4 w-4" />
          Administrador
        </span>
      )}

      <div className="mt-4 w-full rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-left shadow-sm">
        <dl className="flex flex-col gap-3 text-base">
          <div className="flex items-center justify-between">
            <dt className="text-talenta-brown-mid">Idioma</dt>
            <dd className="font-medium text-talenta-black">Español</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-talenta-brown-mid">Versión de Biblia</dt>
            <dd className="font-medium text-talenta-black">{usuario.versionBiblia}</dd>
          </div>
          {pais && (
            <div className="flex items-center justify-between">
              <dt className="text-talenta-brown-mid">País</dt>
              <dd className="font-medium text-talenta-black">{pais.nombre}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="w-full rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-left shadow-sm">
        <p className="text-base font-semibold text-talenta-black">
          {dias > 0 ? 'Prueba gratuita activa' : 'Tu prueba gratuita ya terminó'}
        </p>
        <p className="mt-1 text-sm text-talenta-brown-mid">
          {dias > 0
            ? `Te quedan ${dias} ${dias === 1 ? 'día' : 'días'} de acceso gratis (hasta el ${usuario.finPeriodoGratuito}).`
            : `Venció el ${usuario.finPeriodoGratuito}. Pronto podrás suscribirte para seguir usando TALENTA.`}
        </p>
      </div>

      <SelectorMoneda monedaCodigo={usuario.monedaCodigo} />

      <TextSizeSlider />

      <div className="w-full rounded-2xl border border-talenta-tan/60 bg-talenta-white/80 p-5 text-left shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-talenta-black">Acerca de</h2>

        <div className="flex items-center gap-3">
          <LogoMark className="h-auto w-11 shrink-0 text-talenta-gold" />
          <div>
            <p className="text-base font-semibold text-talenta-black">TALENTA</p>
            <p className="text-sm text-talenta-brown-mid">Administrando para la Gloria de Dios</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-talenta-brown-mid">
          Un proyecto de{' '}
          <span className="font-medium text-talenta-black">Carlos Arias</span> y{' '}
          <span className="font-medium text-talenta-black">Alicia Barazarte</span>.
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-talenta-tan/50 pt-4">
          <img
            src={`${import.meta.env.BASE_URL}assets/Montevito.png`}
            alt="Montevito, la mascota de Montevo Studio"
            className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-sm"
          />
          <p className="text-sm text-talenta-brown-mid">
            Desarrollado por <span className="font-medium text-talenta-black">Montevo Studio</span>
          </p>
        </div>
      </div>

      <FeedbackForm nombre={usuario.nombre} email={usuario.email} />

      <Button
        variant="outline"
        size="lg"
        className="mt-4 w-full gap-2"
        onClick={() => logout()}
      >
        <LogOut className="h-5 w-5" />
        Cerrar sesión
      </Button>
    </motion.div>
  )
}
