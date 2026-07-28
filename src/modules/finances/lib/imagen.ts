/**
 * Firestore no puede almacenar `Blob`/`File` (sí lo hacía IndexedDB/Dexie),
 * y además limita cada documento a 1 MB — una foto de celular pesa 2-5 MB.
 * Por eso la factura se redimensiona y recomprime a JPEG antes de guardarse,
 * y se persiste como data URL (string) dentro del propio documento del gasto.
 *
 * Se eligió data URL en el documento (en vez de Firebase Storage) porque
 * Storage exige activar el plan de pago Blaze, y el objetivo aquí es que la
 * foto sea un respaldo visual del comprobante, no un archivo de alta fidelidad.
 */

/** Suficiente para leer un comprobante sin acercarse al límite de 1 MB. */
const LADO_MAXIMO_PX = 1400
const CALIDAD_JPEG = 0.7

/** Margen de seguridad bajo el límite de 1 MB por documento de Firestore. */
const TAMANO_MAXIMO_BYTES = 700_000

function cargarImagen(archivo: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen.'))
    }
    img.src = url
  })
}

function redimensionar(img: HTMLImageElement, calidad: number): string {
  const escala = Math.min(1, LADO_MAXIMO_PX / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * escala)
  canvas.height = Math.round(img.height * escala)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen.')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg', calidad)
}

/**
 * Convierte la foto elegida por el usuario en un data URL JPEG comprimido,
 * lo bastante liviano para caber en el documento de Firestore. Si aun así
 * queda muy pesado (fotos enormes), baja la calidad progresivamente antes
 * de rendirse.
 */
export async function comprimirFacturaADataUrl(archivo: File): Promise<string> {
  const img = await cargarImagen(archivo)

  let calidad = CALIDAD_JPEG
  let dataUrl = redimensionar(img, calidad)

  while (dataUrl.length > TAMANO_MAXIMO_BYTES && calidad > 0.3) {
    calidad -= 0.15
    dataUrl = redimensionar(img, calidad)
  }

  if (dataUrl.length > TAMANO_MAXIMO_BYTES) {
    throw new Error('La foto es demasiado pesada. Intenta con una imagen más pequeña.')
  }

  return dataUrl
}
