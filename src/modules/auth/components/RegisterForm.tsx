import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select } from '@/shared/components/ui/select'
import { PAISES } from '@/shared/lib/paises'
import { useAuth } from '../hooks/useAuth'
import { ModalTerminos } from './ModalTerminos'

export function RegisterForm() {
  const { registrar, loading, error, limpiarError } = useAuth()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [paisCodigo, setPaisCodigo] = useState('')
  const [codigoPromocional, setCodigoPromocional] = useState('')
  const [terminosAceptados, setTerminosAceptados] = useState(false)
  const [mostrandoTerminos, setMostrandoTerminos] = useState(false)
  const [errorLocal, setErrorLocal] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    limpiarError()
    setErrorLocal(null)

    if (password.length < 6) {
      setErrorLocal('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmarPassword) {
      setErrorLocal('Las contraseñas no coinciden.')
      return
    }
    if (!paisCodigo) {
      setErrorLocal('Selecciona tu país.')
      return
    }
    if (!terminosAceptados) {
      setErrorLocal('Debes leer y aceptar los Términos y Condiciones para continuar.')
      return
    }

    try {
      await registrar({ nombre, email, password, paisCodigo, codigoPromocional })
      navigate('/', { replace: true })
    } catch {
      // el error ya queda expuesto en el store
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="register-nombre">Nombre completo</Label>
        <Input
          id="register-nombre"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-email">Correo electrónico</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-password">Contraseña</Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-confirm">Confirmar contraseña</Label>
        <Input
          id="register-confirm"
          type="password"
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-pais">País</Label>
        <Select
          id="register-pais"
          value={paisCodigo}
          onChange={(e) => setPaisCodigo(e.target.value)}
          required
        >
          <option value="" disabled>
            Selecciona tu país
          </option>
          {PAISES.map((pais) => (
            <option key={pais.codigo} value={pais.codigo}>
              {pais.nombre}
            </option>
          ))}
        </Select>
        <p className="text-sm text-talenta-brown-mid">
          Usaremos tu país para mostrar Finanzas en tu moneda local.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-codigo">Código promocional</Label>
        <Input
          id="register-codigo"
          type="text"
          placeholder="Ej. 2026TALENTAOFF"
          value={codigoPromocional}
          onChange={(e) => setCodigoPromocional(e.target.value)}
          required
        />
        <p className="text-sm text-talenta-brown-mid">
          El código de tu curso te da acceso gratis a TALENTA durante 1 mes.
        </p>
      </div>

      <label htmlFor="register-terminos" className="flex cursor-pointer items-start gap-3">
        <Checkbox
          id="register-terminos"
          checked={terminosAceptados}
          onCheckedChange={(checked) => setTerminosAceptados(checked === true)}
        />
        <span className="text-sm text-talenta-brown-dark">
          He leído y acepto los{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setMostrandoTerminos(true)
            }}
            className="font-medium text-talenta-gold underline underline-offset-2"
          >
            Términos y Condiciones, Política de Privacidad y Acuerdo de Confidencialidad
          </button>{' '}
          de TALENTA.
        </span>
      </label>

      {(errorLocal || error) && (
        <p role="alert" className="text-base font-medium text-red-700">
          {errorLocal ?? error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="mt-2">
        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>

      {mostrandoTerminos && <ModalTerminos onCerrar={() => setMostrandoTerminos(false)} />}
    </form>
  )
}
