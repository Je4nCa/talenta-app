import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { DecorativeBackground } from './DecorativeBackground'
import { LogoMark } from './LogoMark'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export function AuthScreen() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-talenta-cream px-4 py-10 sm:px-6">
      <DecorativeBackground />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          className="mx-auto mb-8 w-40 text-talenta-gold sm:w-48"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <LogoMark />
        </motion.div>

        <motion.p
          className="mb-8 text-center font-decorative text-2xl italic text-talenta-brown-mid sm:text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Administrando para la Gloria de Dios
        </motion.p>

        <motion.div
          className="rounded-2xl border border-talenta-tan/60 bg-talenta-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Tabs defaultValue="login">
            <TabsList>
              <TabsTrigger value="login">Ingresar</TabsTrigger>
              <TabsTrigger value="register">Crear cuenta</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <motion.p
        className="relative z-10 mt-10 text-center text-[11px] tracking-wide text-talenta-brown-mid/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        Desarrollado por Montevo Studio, 2026
      </motion.p>
    </div>
  )
}
