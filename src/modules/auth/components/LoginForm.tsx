import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useAuth } from '../hooks/useAuth'

export function LoginForm() {
  const { login, loading, error, limpiarError } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [recordar, setRecordar] = useState(true)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    limpiarError()
    try {
      await login({ email, password }, recordar)
      navigate('/', { replace: true })
    } catch {
      // el error ya queda expuesto en el store
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email">Correo electrónico</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password">Contraseña</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <label htmlFor="login-recordar" className="flex cursor-pointer items-center gap-3">
        <Checkbox
          id="login-recordar"
          checked={recordar}
          onCheckedChange={(checked) => setRecordar(checked === true)}
        />
        <span className="text-base text-talenta-brown-dark">
          Recordar mi cuenta en este dispositivo
        </span>
      </label>

      {error && (
        <p role="alert" className="text-base font-medium text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="mt-2">
        {loading ? 'Ingresando…' : 'Ingresar'}
      </Button>
    </form>
  )
}
