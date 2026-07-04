import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { LogoMark } from './LogoMark'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export function AuthScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-talenta-cream px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <motion.div
          className="mb-8 text-talenta-gold"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <LogoMark className="w-40 sm:w-48" />
        </motion.div>

        <motion.p
          className="mb-8 text-center font-decorative text-2xl text-talenta-brown-mid sm:text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Administrando para la Gloria de Dios
        </motion.p>

        <motion.div
          className="rounded-2xl bg-talenta-white p-6 shadow-lg sm:p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
    </div>
  )
}
