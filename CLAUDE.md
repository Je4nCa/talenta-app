# TALENTA — Claude Code Context

Aplicación multiplataforma de mayordomía financiera y crecimiento espiritual para el ministerio de Carlos y Alicia (Costa Rica).

**Repo:** `https://github.com/Je4nCa/talenta-app`
**Fase activa:** Fase 1 + Finanzas Esencial

**Hosting:** por ahora el código solo vive en GitHub (sin deploy). El plan es lanzar primero como web (dominio propio por comprar) y luego publicar en iOS y Android. Por eso el diseño debe ser responsive desde el día uno, no una adaptación posterior.

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

Mismo stack que `modulo-finanzas/` para mantener consistencia. No agregar librerías sin justificación.

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** TailwindCSS + shadcn/ui (Radix UI)
- **Estado:** Zustand
- **Almacenamiento local:** Dexie (IndexedDB) — usado mientras Firebase no está configurado
- **Backend:** Firebase (Auth, Firestore, Cloud Functions, FCM, Hosting) — **pendiente de configurar**
- **Pagos:** TiloPay SDK
- **Biblia:** API de Biblia.com (`api.biblia.com`), requiere API key — ver sección Biblia para el detalle de la key y sus implicaciones de seguridad
- **Gráficos:** Recharts
- **Animaciones:** Framer Motion
- **Multiplataforma:** Capacitor (iOS, Android, Web) — configurar después de tener la PWA estable
- **CI/CD:** GitHub Actions → Firebase Hosting

---

## Firebase — estado actual

Firebase **aún no está configurado**. Mientras no exista el proyecto de Firebase:

- Usar Dexie para persistencia local (ya probado en `modulo-finanzas/`)
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

## Responsive y multi-dispositivo

La app inicia como web (GitHub → luego dominio propio) antes de empaquetarse con Capacitor para iOS/Android. Todo componente y pantalla debe construirse mobile-first y funcionar correctamente en cualquier resolución (celular, tablet, desktop, orientación landscape/portrait), usando los breakpoints de Tailwind (`sm`, `md`, `lg`, `xl`). No asumir un tamaño de pantalla fijo ni diseñar solo para desktop. Probar siempre en al menos un tamaño móvil y uno de escritorio antes de dar por terminada una UI.

---

## Accesibilidad y usabilidad (usuarios de todas las edades)

TALENTA será usada también por personas mayores, así que la UI debe ser 100% user-friendly:

- Tipografías modernas y suaves, ya definidas (Poppins para UI, Caveat solo para acentos decorativos/espirituales) — nunca fuentes finas, condensadas o decorativas en texto funcional.
- Tamaños de letra generosos y alto contraste (usar los colores de marca respetando contraste legible); evitar texto pequeño (nunca por debajo de `text-base` en contenido principal).
- Botones y áreas táctiles grandes, espaciado generoso entre elementos, jerarquía visual clara.
- Lenguaje simple y directo en toda la UI, evitando tecnicismos.
- Flujos cortos y explícitos (pocos pasos, confirmaciones claras) antes que interacciones complejas u ocultas (swipes, gestos avanzados, menús anidados).

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
- Campos del perfil: nombre, email, idioma, versión de Biblia preferida, estado de onboarding, rol (`student` | `admin`), país y moneda
- Al registrarse el usuario selecciona su país (lista en `src/shared/lib/paises.ts`); la moneda (`monedaCodigo`) se deriva automáticamente de ese país como valor inicial. **Actualización de la decisión original:** ya no es fija de por vida — el usuario puede cambiarla manualmente después desde Perfil (`SelectorMoneda` en `ProfileScreen.tsx`, action `useAuth().cambiarMoneda()`). El cambio solo afecta cómo se muestran los montos (símbolo y formato) en Finanzas; **no** convierte ni recalcula los montos ya registrados — es un simple re-etiquetado, no hay tipo de cambio ni conversión.
- **Perfil** (`ProfileScreen.tsx`): datos del usuario, un selector de **Moneda** (`MONEDAS` en `paises.ts` — lista de monedas únicas derivada de `PAISES`, deduplicada porque varios países comparten moneda, ej. USD), slider de accesibilidad de tamaño de texto/elementos (`TextSizeSlider.tsx` + `useAccesibilidad`, ver regla en "Reglas de código" sobre `rem` vs px), una sección **"Acerca de"** — logo `LogoMark` de TALENTA, "Un proyecto de Carlos Arias y Alicia Barazarte", y "Desarrollado por Montevo Studio" junto a Montevito (mascota de Montevo, `public/assets/Montevito.png`) en una insignia cuadrada redondeada — y un botón **"Enviar feedback"** (`FeedbackForm.tsx`, ver detalle en sección Notificaciones/EmailJS más abajo).

### Curso
- Estructura: 3 módulos, 8 lecciones, 8 semanas
- Contenido de lecciones almacenado en base de datos (no hardcodeado) para que Carlos pueda actualizar sin redesplegar
- Manual descargable en PDF (Firebase Storage en el futuro; URL externa por ahora)
- Test de diagnóstico al iniciar la app (pre-curso)
- Tracking de completado por lección con timestamp
- Recordatorios push cuando una lección está vencida (FCM cron — pendiente)

### Biblia

**IMPORTANTE — decisión ya tomada (no re-explorar):** no se usa bible-api.com. Se usa la **API real de Biblia.com** (`https://api.biblia.com/v1/bible/...`, servicio de Logos/Faithlife), que sí requiere API key vía parámetro `?key=`.

- **La API key vive en `VITE_BIBLIA_API_KEY`** (`.env.local`, gitignorado — nunca commitear la key real). En producción se inyecta como GitHub Actions secret del mismo nombre (`.github/workflows/deploy.yml`, paso Build). **Advertencia de seguridad real y sin resolver:** como TALENTA hoy es un SPA 100% estático sin backend, la key queda visible en cualquier request de red que haga un visitante del sitio desplegado (inspeccionable en las DevTools). No hay forma de evitar esto sin un proxy backend (ideal: una Cloud Function de Firebase que guarde la key server-side, cuando Firebase esté configurado). Mientras tanto es una limitación aceptada, no un descuido.
- **Endpoints usados** (`src/modules/bible/lib/bibliaClient.ts`):
  - `GET /v1/bible/content/{bibliaId}.txt.json?passage={libro capitulo}&style=oneVersePerLine` → capítulo completo. La respuesta trae una primera línea de cita (ej. "1 Corinthians 1 (RVR60)") que **siempre** hay que descartar por posición, no por patrón — libros como "1 Corintios" o "2 Reyes" empiezan con número y rompen cualquier regex que intente detectar la cita por su formato.
  - `GET /v1/bible/search/{bibliaId}.js?query=...&mode=verse&preview=text` → búsqueda. La respuesta usa el campo `title` para la referencia (no `passage`, a pesar de lo que sugiere la documentación pública). Puede traer resultados duplicados; no usar la referencia sola como React key.
- **Idioma de la Biblia vs. idioma de la interfaz — regla ya decidida:** la interfaz *propia de TALENTA* (botones, pestañas Leer/Buscar/Guardados, mensajes de error/vacío) es siempre español, fija. Pero todo lo que es *contenido/referencia bíblica* — nombre del libro, "Cap."/"Ch."/"פרק", encabezado "Antiguo/Nuevo Testamento", la cita mostrada en cada versículo — sigue el idioma de la Biblia activa (`BIBLIAS_DISPONIBLES[].idioma` en `constants/biblias.ts`), no el español fijo de la app. Si el usuario elige KJV, ve "John 3" y "Ch. 3"; si elige TANAKH, ve "בְּרֵאשִׁית 1"; etc. Por defecto sigue siendo español (`BIBLIA_POR_DEFECTO = 'RVR60'`), guardado en `usuario.versionBiblia` vía `useAuth().cambiarVersionBiblia()`.
  - Implementado en `src/modules/bible/constants/nombresLibrosPorIdioma.ts`: nombres de los 66 libros + etiqueta de capítulo + "Antiguo/Nuevo Testamento" para los 12 idiomas que aparecen en `BIBLIAS_DISPONIBLES`. Confianza alta en español/inglés/francés/italiano/portugués/neerlandés/ruso/árabe (idiomas muy estandarizados); **confianza media-baja en griego, hebreo, finlandés y esperanto** (mejor esfuerzo, especialmente el Nuevo Testamento en hebreo y esperanto en general — no hay una convención única, se recomienda que alguien con el idioma lo revise antes de confiar del todo).
  - `src/modules/bible/lib/referencias.ts` expone `obtenerIdiomaDeBiblia(bibliaId)` y `nombreLibroLocalizado(libro, idioma)` — usarlos siempre en vez de `libro.nombre` directo al mostrar algo relacionado a la Biblia.
- **Referencias van en inglés canónico internamente:** el parámetro `passage` de la API solo entiende nombres de libro en inglés (`John`, `1 Corinthians`, `Genesis`...), sin importar el idioma de la Biblia elegida — confirmado probando con LSG (francés), TANAKH (hebreo) y BYZ (griego): la cita que regresa el API siempre usa el nombre canónico en inglés. Por eso `src/modules/bible/constants/libros.ts` sigue guardando esa referencia en inglés como llave interna (`referencia`), separada del nombre mostrado al usuario (que ahora depende del idioma, ver arriba). Mapea los 66 libros: `referencia` (inglés, para la API) + `nombre` (español, fallback/tabla base) + cantidad de capítulos + testamento.
- **Persistencia local (Dexie, `talenta-biblia-db`):** tabla `guardados` (versículos guardados/marcadores) y `subrayados` (resaltado por versículo), ambas escopadas por `uid`. Sin sincronización remota todavía (coherente con el resto de la app hoy).
- **Módulo de lectura** (`src/modules/bible/components/`): mismo patrón para cualquier Biblia — selector de versión, selector de libro/capítulo, lector con tap-para-subrayar y botón de guardar por versículo, buscador por palabra/frase, y lista de guardados. Vive dentro del `AppShell` principal (no es una mini-app con su propio bottom nav como Finanzas — no se justifica ese nivel de estructura aquí).
- **Pendiente para después:** versículo diario + notificación push (requiere Firebase/FCM, ver sección Firebase), memorización progresiva (ocultar palabras).

### Finanzas Esencial

**IMPORTANTE — decisión de arquitectura ya tomada (no re-explorar):** `modulo-finanzas/` en su forma original vive 100% en Firestore (tiempo real vía `onSnapshot`) con Google Auth y modela un hogar de 2 personas con gastos compartidos (splits 50/50, porcentaje, uno paga todo, montos fijos) y selector de moneda USD/CRC. Ya se decidió **no** portar eso tal cual:
- **Backend:** Dexie local (no Firestore). El propio `modulo-finanzas/src/database/db.ts` ya definía un schema Dexie que nunca se usaba en runtime (todo pasaba por Firestore); ese schema fue la base para `src/modules/finances/lib/db.ts` (Dexie db separada: `talenta-finanzas-db`).
- **Modelo de usuario:** individual, no de hogar. Se eliminó `usuarioId` multi-persona → cada registro tiene `uid` (dueño = usuario de TALENTA autenticado). Se eliminó por completo `esCompartido`/`DetalleCompartido` y la pantalla `SeleccionUsuario`.
- **Moneda:** viene de `usuario.monedaCodigo` (ver Auth) — sin tipo de cambio ni conversión real (eso sí se eliminó del original), pero **el usuario puede cambiarla manualmente desde Perfil**, decisión revertida más adelante (ver sección Auth). Todas las páginas de Finanzas (`Dashboard.tsx`, `Gastos.tsx`, `Pagos.tsx`, `Tarjetas.tsx`) leen `usuario.monedaCodigo` directamente — **nunca** recalcular la moneda a partir de `buscarPais(usuario.paisCodigo)`, porque eso ignora silenciosamente el cambio manual del usuario (bug real que existió brevemente al implementar el selector: las 4 páginas derivaban la moneda del país en vez de leer el campo ya guardado del usuario).

**Estructura de navegación:** Finanzas es un mini-app dentro de TALENTA con **su propio bottom nav** (`FinanceBottomNav`, 5 tabs: Inicio/Gastos/Tarjetas/Pagos/Tasa 0%) y su propio header con flecha de regreso al Hub principal. Vive en rutas anidadas `/finanzas/*` (`src/router/AppRoutes.tsx`) fuera del `AppShell` principal — es decir, al entrar se reemplaza por completo la navegación de TALENTA, no coexisten los dos bottom nav. La entrada (`FinancesEntry.tsx`) muestra el `ModuleScreen` splash una sola vez al entrar (no se repite al navegar entre tabs internos de Finanzas). El header (`FinancesShell.tsx`) muestra debajo de "Finanzas" un subtítulo pequeño "Moneda: {nombre de la moneda} {emoji de bandera}" (ej. "Moneda: Colón costarricense 🇨🇷"). **La bandera sigue a la moneda elegida, no al país registrado del usuario** — ambos salen de `buscarMoneda(usuario.monedaCodigo)`, que ahora incluye un campo `paisCodigo` (país representativo de esa moneda, ver `MONEDAS`/`PAIS_REPRESENTATIVO_POR_MONEDA` en `paises.ts`). Si el usuario cambia la moneda manualmente en Perfil a una de otro país (ej. Peso argentino), la bandera cambia con ella (🇦🇷), sin importar cuál sea su país registrado — bug real corregido: la primera versión mostraba la bandera de `usuario.paisCodigo` sin importar la moneda elegida. El emoji se genera en código a partir del código ISO (`emojiDeBandera()`, convierte cada letra a su símbolo de indicador regional Unicode), no es un emoji hardcodeado por país.

**Formato de montos (`formatearMonto`, `src/modules/finances/lib/formato.ts`):** muestra el **símbolo** de la moneda (`₡`, `$`, `€`...) pegado al número (ej. `₡75.000`), nunca el código ISO (`CRC`, `USD`) — el símbolo sale de `Pais.monedaSimbolo` (curado a mano en `paises.ts`), no del símbolo que infiere `Intl.NumberFormat` con `style: 'currency'` (para monedas menos comunes como CRC, ICU no siempre conoce un símbolo y cae de vuelta al código, que es exactamente lo que no se quería mostrar). El número en sí se formatea aparte con `Intl.NumberFormat('es-CO', { maximumFractionDigits })` — **nunca uses el locale genérico `'es'` a secas para formatear números:** tiene un bug real de ICU donde omite el separador de miles para valores de 4 dígitos (`8000` en vez de `8.000`) pero sí lo aplica desde 10.000 en adelante; confirmado probando múltiples locales, `'es-CO'` es el que agrupa con punto de forma consistente en todo rango. Bug real encontrado y corregido (afectaba cualquier gasto/ingreso entre 1.000 y 9.999).

**Código fuente:** `src/modules/finances/` — `types/`, `lib/db.ts`, `repositories/` (mismo contrato CRUD que el original: `obtenerPorId/obtenerTodos/crear/crearBulk/actualizar/eliminar/contar`, pero implementado sobre Dexie en vez de Firestore), `hooks/` (usan `dexie-react-hooks`'s `useLiveQuery`, equivalente reactivo local al `onSnapshot` original), `components/pages/`.

**Estado actual:**
- ✅ `Dashboard` (Inicio): navegación por mes, balance del período, 3 tarjetas estadísticas (variables/fijos/cuotas), sección "Mis ingresos" (ver detalle abajo).
  - **Ingresos ya no asumen una frecuencia fija (ni quincena):** `Ingreso` (`types/ingreso.ts`) es una entrada libre con `titulo` + `monto` + `fecha` real, igual que un `Gasto` — no hay un enum de frecuencia ni casillas fijas de "primera/segunda quincena". El usuario agrega tantas entradas como reciba: 1 si es mensual, 2 si es quincenal, ~4 si es semanal, o cualquier ingreso extra (freelance, bono, venta) como una entrada más sin estructura especial. UI en Dashboard: botón "+ Agregar ingreso" (`FormularioIngreso.tsx`) + lista editable/eliminable, mismo patrón que Gastos. Esto reemplazó el modelo viejo `Salario` (quincena 1/2 con casillas fijas); la migración de Dexie `version(3)` en `db.ts` convierte automáticamente los registros viejos de quincena a este nuevo formato (quincena 1 → día 1 del mes, quincena 2 → día 16, como aproximación histórica).
- ✅ `Gastos`: 4 tabs — Variables (por mes), Fijos (recurrentes, pausar/reactivar), **Categorías** (ver detalle abajo) y **Resumen** (balance diario + resumen semanal, ver detalle abajo). `src/modules/finances/components/FormularioGasto.tsx` y `FormularioGastoFijo.tsx`. En móvil el `TabsList` usa grid 2×2 (`grid grid-cols-2 sm:flex`) porque 4 pestañas con texto legible no caben en una sola fila de 375px de ancho.
  - **Tab Resumen** (`TabResumen.tsx`): balance diario = ingresos del día − egresos del día, listado solo para los días con movimiento (no los 30 días vacíos), usando la fecha real de cada `Ingreso` (ya no una convención artificial). Los gastos fijos (recurrentes) no tienen día exacto en el modelo, así que no entran en el balance diario (sí en el total mensual del Dashboard). Resumen semanal agrupa los gastos variables del mes en 4 buckets fijos por rango de día (1–7, 8–14, 15–21, 22–fin), desglosados por categoría — es un bucketing simple por día-del-mes, no semanas calendario ISO real.
  - **Compra a futuro:** un `Gasto` puede tener `fechaCobro` opcional, distinta de `fecha` (fecha real de la compra). Si existe, el gasto se cuenta en el mes de `fechaCobro`, no en el de `fecha` — así una compra de hoy que se cobra a fin de mes (o el mes siguiente) impacta el presupuesto del mes correcto. Se activa con un checkbox "Es una compra que se cobra después" en `FormularioGasto`; la lista muestra un badge "Se cobra el {fecha}". Ver `useGastosPorPeriodo` / `gastosRepository.obtenerPorPeriodo` — filtran por `fechaCobro ?? fecha`.
  - **Foto de factura (respaldo, opcional):** un `Gasto` puede tener `facturaImagen?: Blob` — se guarda tal cual como Blob en Dexie (IndexedDB lo soporta nativamente, no hace falta base64). En `FormularioGasto` hay un `<input type="file" accept="image/*">` sin el atributo `capture` a propósito, para que el navegador móvil ofrezca tanto "Tomar foto" como "Elegir de galería" en el mismo picker nativo. La miniatura se muestra en la lista de gastos vía `VisorFactura.tsx`, que crea un `URL.createObjectURL(blob)` (con cleanup en `useEffect`) y abre un visor de pantalla completa al tocar la miniatura.
  - **Categorías son dinámicas, no una lista fija:** viven en la tabla Dexie `categorias` (escopada por `uid`), no en una constante. `constants/categorias.ts` solo tiene `CATEGORIAS_SEMILLA` (las 12 originales, algunas con `porcentajeRecomendado` predefinido para educación financiera: Apartamento 30%, Comida 15%, Transporte 10%, etc.), que se copian a Dexie la primera vez que el usuario entra a Finanzas (`categoriasRepository.sembrarSiNecesario`, llamado desde `useCategorias()`). A partir de ahí el usuario puede editar cualquiera (incluidas las 12 originales) o crear las suyas (`FormularioCategoria.tsx` — nombre, ícono de una lista fija de emojis, color por swatches, % recomendado opcional). Solo las categorías con `esPersonalizada: true` se pueden borrar (las 12 semilla no, para no dejar huérfanos los gastos que ya las usan). **Nunca usar el `CategoriaId` como unión fija ni importar una constante estática de categorías en un componente nuevo — siempre `useCategorias()`.**
  - **Tab Categorías:** por cada categoría muestra el monto gastado en el mes activo (variables + fijos activos) y, si tiene `porcentajeRecomendado`, una barra de progreso contra la meta calculada como `% × ingreso total del período` (de `useIngresosPorPeriodo`) — en rojo si se excede. Este es el gancho de "educación financiera" de la app: no solo registra gastos, compara contra lo recomendado.
- ✅ `Tarjetas`: alta de tarjetas crédito/débito (`FormularioTarjeta.tsx`, selector de color con swatches en vez de color picker crudo — más simple para el usuario), lista con disponible (débito) o gastado/límite con barra de progreso (crédito).
- ✅ `Pagos`: por cada tarjeta de crédito, calcula el período de facturación real (`src/modules/finances/lib/billingCycle.ts`, mismo algoritmo que el original) según el día de corte, suma gastos + fijos asignados a esa tarjeta dentro del período, permite registrar abonos (`FormularioAbono.tsx`) y muestra el pendiente. Si el usuario no tiene ninguna tarjeta de crédito, muestra un estado vacío en vez de una pantalla rota.
- ⏳ `Tasa cero`: sigue como placeholder "Próximamente" — cuotas sin intereses, siguiente fase.
- Nota de alcance: por simplicidad ("fácil para el usuario"), Pagos no incluye todavía el override de "monto manual" que sí tenía el original — se puede agregar después si hace falta.

Categorías semilla (12, ver arriba la nota de que ahora son dinámicas): Comida, Apartamento, Café, Compras, Transporte, Salud, Entretenimiento, Suscripciones, Viajes, Educación, Mascotas, Otros.

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
- Buzón de sugerencias (solo lectura) — **pendiente**, distinto del botón de feedback de abajo: este buzón implica guardar el feedback en Firestore para que el admin lo vea dentro de la app, y no existe todavía (requiere Firebase).

### Feedback de usuarios (EmailJS)

**Decisión ya tomada:** TALENTA hoy es una SPA estática sin backend, así que no hay forma de enviar un correo desde un servidor propio. Se usa **EmailJS** (`@emailjs/browser`) para enviar el feedback directo desde el navegador, sin pasar por el buzón de Firestore de arriba (ese es para más adelante).

- **Botón "Enviar feedback"** en Perfil (`src/modules/auth/components/FeedbackForm.tsx`), debajo de "Acerca de". Al enviar, llama a `emailjs.send(serviceId, templateId, { nombre_usuario, email_usuario, mensaje, fecha }, { publicKey })` — el nombre y correo del usuario se toman automáticamente de su perfil (`usuario.nombre` / `usuario.email`), no los vuelve a escribir, así Carlos y Alicia siempre saben quién mandó cada feedback. `fecha` se formatea en el cliente con `toLocaleString('es', { dateStyle: 'long', timeStyle: 'short' })`.
- **Ya configurado y verificado end-to-end** (correo de destino `montevostudio@outlook.com`). Las tres claves (Service ID, Template ID, Public Key) viven en `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` y `VITE_EMAILJS_PUBLIC_KEY` — mismo patrón que `VITE_BIBLIA_API_KEY`: `.env.local` en desarrollo (gitignorado, ver `.env.example`), GitHub Actions secrets del mismo nombre en producción (`.github/workflows/deploy.yml`).
- **Ojo con la plantilla de EmailJS:** las plantillas nuevas de EmailJS traen un contenido de ejemplo con variables `{{name}}` / `{{message}}` que no coinciden con lo que manda el código (`nombre_usuario`, `email_usuario`, `mensaje`, `fecha`) — si no se reemplaza el contenido de la plantilla, el correo llega vacío/con el texto de ejemplo sin romper nada (bug real encontrado y corregido: el primer envío de prueba llegó como plantilla demo). La plantilla actual ya fue reemplazada por un diseño con los colores de marca de TALENTA y las variables correctas; el campo "To Email" y "Reply To" (`{{email_usuario}}`) se configuran en la pestaña "Settings" de la plantilla, no en "Content".
- **Misma advertencia de seguridad que la key de Biblia.com:** la Public Key de EmailJS queda visible en el navegador de cualquier visitante (es pública por diseño del servicio, pensada para usarse así desde el cliente), y el Service ID/Template ID tampoco son secretos. No hay forma de evitar esto sin backend propio. Aceptado como limitación, no un descuido.
- Sin las tres variables configuradas, `FeedbackForm` falla de forma controlada (mensaje "No se pudo enviar tu feedback...") sin romper la UI.

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
- **Nunca usar valores arbitrarios de Tailwind en px para texto o íconos** (`text-[11px]`, `h-[18px]`) — el slider de accesibilidad (`useAccesibilidad`, `src/shared/hooks/useAccesibilidad.ts`) escala toda la interfaz cambiando el `font-size` del `<html>`, y eso solo funciona con unidades `rem` (las clases normales de Tailwind como `text-xs`, `h-5`, o arbitrarios en rem como `text-[0.6875rem]`). Un valor en px absoluto queda congelado sin importar el ajuste del usuario. Bug real encontrado y corregido en `FinanceBottomNav.tsx`.
- **Nunca hardcodear una ruta absoluta (`/assets/...`) para un archivo de `public/` dentro de un componente React** — en producción el build usa `base: '/talenta-app/'` (`vite.config.ts`, por GitHub Pages sirviendo desde un subpath), así que `/assets/x.png` resuelve a `github.io/assets/x.png` (404) en vez de `github.io/talenta-app/assets/x.png`. Usar siempre `` `${import.meta.env.BASE_URL}assets/x.png` ``. En `index.html` (favicon, manifest, etc.) usar el placeholder `%BASE_URL%assets/x.png`, que Vite sustituye en build — una ruta absoluta ahí tiene el mismo bug. Bug real encontrado y corregido en `ProfileScreen.tsx` (logo de Montevo Studio) e `index.html`.

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
| Cliente API de Biblia.com | `src/modules/bible/lib/bibliaClient.ts` |
| API key de Biblia.com (local) | `.env.local` → `VITE_BIBLIA_API_KEY` (gitignorado, ver `.env.example`) |
| API key de Biblia.com (deploy) | GitHub Actions secret `VITE_BIBLIA_API_KEY` del repo |
| Botón de feedback de usuarios | `src/modules/auth/components/FeedbackForm.tsx` (Perfil) |
| Claves de EmailJS (local) | `.env.local` → `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` |
| Claves de EmailJS (deploy) | GitHub Actions secrets del mismo nombre en el repo |
