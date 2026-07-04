import { Outlet } from 'react-router-dom'
import { DecorativeBackground } from '@/shared/components/DecorativeBackground'
import { BottomNav } from '@/shared/components/layout/BottomNav'

export function AppShell() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-talenta-cream">
      <DecorativeBackground />
      <main className="relative z-10 pb-28">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
