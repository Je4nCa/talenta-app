import { useState, type FormEvent } from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useAuth } from '../hooks/useAuth'

export function RecuperarContrasenaForm({ onVolver }: { onVolver: () => void }) {
  const { recuperarContrasena, loading, error, limpiarError } = useAuth()
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    limpiarError()
    try {
      await recuperarContrasena(email)
      setEnviado(true)
    } catch {
      // el error ya queda expuesto en el store
    }
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <CheckCircle2 className="h-10 w-10 text-talenta-gold" />
        <p className="text-base font-medium text-talenta-black">Revisa tu correo</p>
        <p className="text-sm text-talenta-brown-mid">
          Si {email} tiene una cuenta en TALENTA, te enviamos un enlace para crear una contraseña
          nueva.
        </p>
        <Button type="button" variant="outline" size="lg" className="mt-2 w-full" onClick={onVolver}>
          Volver a ingresar
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <button
        type="button"
        onClick={onVolver}
        className="flex items-center gap-2 text-sm text-talenta-brown-mid transition-colors hover:text-talenta-gold"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a ingresar
      </button>

      <div className="flex flex-col gap-2">
        <Label htmlFor="recuperar-email">Correo electrónico</Label>
        <Input
          id="recuperar-email"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className="text-sm text-talenta-brown-mid">
          Te enviaremos un enlace para crear una contraseña nueva.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-base font-medium text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="mt-2">
        {loading ? 'Enviando…' : 'Enviar enlace'}
      </Button>
    </form>
  )
}
