import type { Plan } from '../types/plan'

export class TilopayError extends Error {}

interface TilopayMetodo {
  id: string
  name: string
  type: string
}

interface TilopayTarjetaGuardada {
  id: string
  name: string
  brand: string
}

interface TilopayInitResponse {
  message: string
  environment: string
  methods: TilopayMetodo[]
  cards: TilopayTarjetaGuardada[]
}

interface TilopaySdk {
  Init(opciones: Record<string, unknown>): Promise<TilopayInitResponse>
  startPayment(): Promise<void>
}

function obtenerSdkGlobal(): TilopaySdk {
  const global = window as unknown as { Tilopay?: TilopaySdk }
  if (!global.Tilopay) {
    throw new TilopayError('El SDK de TiloPay no se cargó correctamente.')
  }
  return global.Tilopay
}

/**
 * TiloPay no publica un paquete npm — su SDK (ver
 * https://app.tilopay.com/sdk/documentation.pdf) se integra con dos
 * <script> cargados en el navegador (jQuery es dependencia obligatoria del
 * SDK). Se inyectan dinámicamente solo cuando el usuario llega al checkout,
 * no como dependencia empaquetada del build, para no arrastrar jQuery al
 * resto de la app.
 */
function cargarScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new TilopayError(`No se pudo cargar ${src}`))
    document.head.appendChild(script)
  })
}

async function cargarSdkTilopay(): Promise<void> {
  await cargarScript('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js')
  await cargarScript('https://app.tilopay.com/sdk/v1/sdk.min.js')
}

/**
 * URL de un futuro backend (Cloud Function de Firebase, pendiente de
 * construir) que llama server-side al método `GetTokenSdk` de la API de
 * TiloPay usando el API Key / API User / API Password del comercio
 * (obtenidos en admin.tilopay.com). Esas tres credenciales NUNCA deben vivir
 * en el frontend — a diferencia de la API key de Biblia.com o la Public Key
 * de EmailJS (seguras de exponer por diseño de esos servicios), estas son
 * credenciales de cobro reales: si se filtran, cualquiera podría generar
 * tokens de cobro a nombre del comercio.
 *
 * Este es el único "conector" que falta para que el módulo funcione:
 * cuando exista la Cloud Function, basta con configurar
 * VITE_TILOPAY_TOKEN_ENDPOINT (.env.local en desarrollo, GitHub Actions
 * secret en producción) — nada más en este archivo necesita cambiar.
 */
function endpointTokenConfigurado(): string | undefined {
  return import.meta.env.VITE_TILOPAY_TOKEN_ENDPOINT
}

export function tilopayEstaConfigurado(): boolean {
  return Boolean(endpointTokenConfigurado())
}

async function obtenerTokenSdk(ordenId: string): Promise<string> {
  const endpoint = endpointTokenConfigurado()
  if (!endpoint) {
    throw new TilopayError('El endpoint de TiloPay no está configurado.')
  }

  const respuesta = await fetch(`${endpoint}?orden=${encodeURIComponent(ordenId)}`)
  if (!respuesta.ok) {
    throw new TilopayError('No se pudo obtener el token de TiloPay.')
  }

  const datos = (await respuesta.json()) as { token?: string }
  if (!datos.token) {
    throw new TilopayError('Respuesta inválida del endpoint de TiloPay.')
  }
  return datos.token
}

interface IniciarCheckoutInput {
  plan: Plan
  ordenId: string
  nombreUsuario: string
  emailUsuario: string
  urlRedirect: string
}

/**
 * Arranca el flujo de pago: carga el SDK, obtiene el token vía el backend
 * (pendiente) y llama a `Tilopay.Init(...)` — devuelve los métodos de pago
 * y tarjetas guardadas disponibles para que la UI los renderice.
 * `subscription: 1` le pide a TiloPay que guarde la tarjeta tokenizada para
 * poder re-cobrar automáticamente en el siguiente ciclo (mensual/trimestral/
 * anual) — el recobro en sí todavía no está implementado, ver nota en
 * CLAUDE.md sección Pagos.
 */
export async function iniciarCheckoutTilopay({
  plan,
  ordenId,
  nombreUsuario,
  emailUsuario,
  urlRedirect,
}: IniciarCheckoutInput): Promise<TilopayInitResponse> {
  if (!tilopayEstaConfigurado()) {
    throw new TilopayError('Los pagos en línea todavía no están configurados.')
  }

  await cargarSdkTilopay()
  const token = await obtenerTokenSdk(ordenId)
  const Tilopay = obtenerSdkGlobal()

  return Tilopay.Init({
    token,
    currency: 'USD',
    language: 'es',
    amount: plan.precioUSD.toFixed(2),
    billToEmail: emailUsuario,
    billToFirstName: nombreUsuario,
    orderNumber: ordenId,
    capture: 1,
    subscription: 1,
    redirect: urlRedirect,
  })
}

export async function ejecutarPagoTilopay(): Promise<void> {
  const Tilopay = obtenerSdkGlobal()
  await Tilopay.startPayment()
}
