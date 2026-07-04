# TALENTA — Claude Code Context

Aplicación multiplataforma de mayordomía financiera y crecimiento espiritual para el ministerio de Carlos y Alicia (Costa Rica).

**Repo:** `https://github.com/Je4nCa/talenta-app`
**Fase activa:** Fase 1 + Finanzas Esencial

---

## Estructura del repositorio

```
talenta-app/
  src/
    modules/
      auth/           # Login, registro, onboarding
      course/         # Curso, lecciones, manual, tests
      bible/          # Biblia, versículo diario, memorización
      finances/       # Módulo de finanzas (migrado desde /modulo-finanzas)
      payments/       # TiloPay integración
      admin/          # Panel de Carlos y Alicia
      notifications/  # FCM, preferencias
    shared/
      components/     # Componentes reutilizables entre módulos
      hooks/          # Hooks compartidos
      types/          # Tipos globales
      lib/            # Firebase, utils, constantes
    router/
    App.tsx
    main.tsx
  modulo-finanzas/    # App de finanzas original (Je4nCa/app-finanzas), adaptada a otro contexto
                      # Leer antes de tocar el módulo finances/
  public/
  index.html
```

La carpeta `modulo-finanzas/` es el código fuente original de la app de finanzas, adaptado actualmente a otro contexto. No la modifiques directamente. Léela para entender la lógica existente (Dexie, Zustand, hooks) y adáptala en `src/modules/finances/` al esquema de usuario de TALENTA.

---

## Stack tecnológico

Mismo stack que `Finanzas/` para mantener consistencia. No agregar librerías sin justificación.

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** TailwindCSS + shadcn/ui (Radix UI)
- **Estado:** Zustand
- **Almacenamiento local:** Dexie (IndexedDB) — usado mientras Firebase no está configurado
- **Backend:** Firebase (Auth, Firestore, Cloud Functions, FCM, Hosting) — **pendiente de configurar**
- **Pagos:** TiloPay SDK
- **Biblia:** bible-api.com envuelta detrás de una interfaz `BibleProvider`
- **Gráficos:** Recharts
- **Animaciones:** Framer Motion
- **Multiplataforma:** Capacitor (iOS, Android, Web) — configurar después de tener la PWA estable
- **CI/CD:** GitHub Actions → Firebase Hosting

---

## Firebase — estado actual

Firebase **aún no está configurado**. Mientras no exista el proyecto de Firebase:

- Usar Dexie para persistencia local (ya probado en `Finanzas/`)
- Usar Zustand para estado en memoria
- Crear una capa de abstracción `src/shared/lib/db.ts` que exponga las mismas funciones tanto para Dexie como para Firestore, de modo que el switch sea un cambio de implementación sin tocar los módulos

Cuando Firebase esté listo, se migrará módulo por módulo sin reescribir los componentes.

---

## Diseño — tokens de marca

```css
--color-black: #1F1B17;
--color-brown-dark: #5B4631;
--color-brown-mid: #A67C52;
--color-tan: #DBC6B2;
--color-cream: #F2ECE6;
--color-white: #FDFAF7;
--color-gold: #C4943A;
```

Tipografías: **Poppins** (UI), **Caveat** (texto decorativo/espiritual).
Logo: tres círculos dorados — Tiempo, Talentos, Tesoro.
Lema: *"Administrando para la Gloria de Dios"*
Acróstico: *"Talentos Administrados con Lealtad Al Señor, Nos llevan a una Transformación de Abundancia"*

Solo TailwindCSS para estilos. Sin estilos inline. Sin CSS modules. Los tokens de marca van en `tailwind.config.ts`.

---

## Principio de arquitectura: la matriz

Todo cuelga del `uid` del usuario. Los módulos no se importan entre sí directamente — se comunican a través del perfil de usuario y los hooks compartidos.

```
users/{uid}
  /course        → progreso de lecciones, resultados de tests
  /finances      → presupuesto, transacciones, categorías
  /spiritual     → rachas de versículos, progreso de memorización
  /payments      → estado de suscripción TiloPay, recibos
  /assessments   → respuestas del test diagnóstico y valoración final
```

Cada módulo tiene su propio hook principal (`useCourse`, `useFinances`, `useBible`, etc.) que abstrae la fuente de datos (Dexie ahora, Firestore después). Los componentes solo consumen hooks — nunca llaman a Firebase o Dexie directamente.

---

## Módulos de Fase 1 + Finanzas Esencial

### Auth
- Registro y login con email + contraseña, validado contra la base de datos local (Dexie). Sin Google OAuth.
- Sin Firebase Auth por ahora: el perfil y las credenciales se crean y validan localmente. Cuando Firebase esté listo, migrar a Firebase Auth manteniendo el mismo flujo de email/contraseña.
- Al registrarse: crear perfil de usuario + ejecutar test de diagnóstico
- Campos del perfil: nombre, email, idioma, versión de Biblia preferida, estado de onboarding, rol (`student` | `admin`)

### Curso
- Estructura: 3 módulos, 8 lecciones, 8 semanas
- Contenido de lecciones almacenado en base de datos (no hardcodeado) para que Carlos pueda actualizar sin redesplegar
- Manual descargable en PDF (Firebase Storage en el futuro; URL externa por ahora)
- Test de diagnóstico al iniciar la app (pre-curso)
- Tracking de completado por lección con timestamp
- Recordatorios push cuando una lección está vencida (FCM cron — pendiente)

### Biblia
- Interfaz `BibleProvider` con una implementación inicial: `BibleApiProvider` (bible-api.com, sin API key, CORS habilitado)
- Preparar la interfaz para que agregar `ApiBibleProvider` en el futuro sea solo una nueva implementación
- Versículo diario: la Cloud Function lo selecciona según la lección activa y lo envía por FCM a las 7am hora del usuario (pendiente Firebase)
- Memorización: mostrar el versículo completo → ocultar palabras progresivamente → el usuario lo reconstruye

### Finanzas Esencial
Adaptar desde `Finanzas/`. Leer ese código primero. Reutilizar la lógica de Dexie, hooks y componentes que ya funcionan; adaptarlos al esquema de usuario de TALENTA.

Schema de datos:
```ts
// finances/budget/{mes-año}
{ income: number, fixedExpenses: number, variableExpenses: number, savings: number }

// finances/transactions/{txId}
{ amount: number, type: 'income' | 'expense', category: string, date: Date, note?: string }

// finances/categories/{catId}
{ name: string, type: 'fixed' | 'variable' | 'hormiga' | 'transporte' | 'custom' }
```

Categorías predefinidas: Gastos hormiga, Bus/transporte, Peajes, Comida, Servicios. El usuario puede agregar las suyas.

Balance diario = ingresos − suma de egresos del día.
Resumen semanal = vista agregada por categoría, calculada en cliente.

### Pagos (TiloPay)
- Checkout embebido (sin redirección fuera de la app)
- Webhook que actualiza el estado de suscripción del usuario (Cloud Function pendiente)
- Estado de pago verificado en rutas protegidas
- Comisiones: 4.25% + $0.35 por tarjeta, 2% + $0.35 por SINPE Móvil — mostrar esto al usuario antes de confirmar el pago

### Panel de administración
- Ruta protegida por `role === 'admin'` en el perfil del usuario
- Roster paginado con columnas: nombre, pagó (sí/no), descargó el manual (sí/no), lección actual, última actividad
- Vista de seguimiento semanal: usuarios sin actividad en los últimos 7 días
- Desglose de completado por lección
- Buzón de sugerencias (solo lectura)

### Notificaciones
- Función `sendNotification(uid, title, body, data)` como único punto de envío FCM
- Preferencias por tipo en el perfil del usuario (opt-out)
- Tipos: versículo diario, recordatorio de lección, confirmación de pago

---

## Lo que NO se construye en Fase 1

Estas rutas existen como pantalla "Próximamente" sin ninguna lógica:

- Resumen de gastos con IA
- Mentor virtual IA
- Calculadora de endeudamiento (regla del 30%)
- Comunidad y peticiones de oración
- Multi-idioma (UI solo en español por ahora; preparar claves i18n pero solo el locale `es`)

---

## Reglas de código

- Sin `any` en TypeScript. Si no se conoce la forma exacta, usar `unknown` con un guard.
- Todos los accesos a la base de datos (Dexie o Firestore) van en hooks. Nunca en componentes directamente.
- Componentes funcionales únicamente.
- Los hooks de Firebase/Dexie deben manejar tres estados: `loading`, `error`, `data`. Siempre.
- Error boundaries a nivel de ruta.
- Sin librerías nuevas sin consultar primero.
- El código del módulo `Finanzas/` original no se modifica. Se lee, se adapta en `src/modules/finances/`.

---

## Primeras tareas (empezar aquí)

1. Leer `modulo-finanzas/src/` completo antes de escribir una sola línea del módulo de finanzas
2. Crear `tailwind.config.ts` con los tokens de marca de TALENTA
3. Crear la estructura de carpetas `src/modules/` con un `index.ts` vacío en cada módulo
4. Crear `src/shared/lib/db.ts` con la abstracción Dexie → Firestore
5. Construir el shell de la app: navegación inferior con tabs Curso / Biblia / Finanzas / Perfil; tab Admin visible solo para admins
6. Implementar el flujo de auth (con mock si Firebase no está listo)
7. Módulo por módulo en el orden definido arriba

---

## Referencia rápida

| Qué | Dónde |
|-----|-------|
| App de finanzas original | `modulo-finanzas/` |
| Logo TALENTA | `public/assets/talenta-logo.png` |
| Tokens de marca | `tailwind.config.ts` |
| Tipos globales | `src/shared/types/` |
| Abstracción de base de datos | `src/shared/lib/db.ts` |
| Feature flags | `src/shared/lib/featureFlags.ts` |
