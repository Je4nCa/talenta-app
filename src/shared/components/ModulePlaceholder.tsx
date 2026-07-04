import type { LucideIcon } from 'lucide-react'

interface ModulePlaceholderProps {
  icon: LucideIcon
  titulo: string
  descripcion: string
}

export function ModulePlaceholder({ icon: Icon, titulo, descripcion }: ModulePlaceholderProps) {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-talenta-gold/15 text-talenta-gold">
        <Icon className="h-8 w-8" strokeWidth={1.75} />
      </div>
      <h1 className="text-2xl font-semibold text-talenta-black sm:text-3xl">{titulo}</h1>
      <p className="max-w-sm text-base text-talenta-brown-dark">{descripcion}</p>
    </div>
  )
}
