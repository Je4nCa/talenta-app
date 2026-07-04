import { useState, type FormEvent } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useAuth } from '../hooks/useAuth'

export function RegisterForm() {
  const { registrar, loading, error, limpiarError } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
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

    try {
      await registrar({ nombre, email, password })
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

      {(errorLocal || error) && (
        <p role="alert" className="text-base font-medium text-red-700">
          {errorLocal ?? error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="mt-2">
        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>
    </form>
  )
}
