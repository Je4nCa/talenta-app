/**
 * Genera un identificador único para un registro nuevo.
 *
 * **No usar `crypto.randomUUID()` directamente**: solo existe en contextos
 * seguros (HTTPS/localhost) y en navegadores relativamente recientes
 * (Chrome 92+, Safari 15.4+). En producción rompió el guardado de todo
 * ("crypto.randomUUID is not a function") para quien entraba por `http://`
 * o desde un teléfono con navegador viejo — y TALENTA la usan personas de
 * todas las edades, con equipos de todo tipo.
 *
 * Va degradando: UUID nativo → UUID armado con `getRandomValues` →
 * `Math.random`. El último caso no es criptográficamente fuerte, pero estos
 * ids solo identifican filas dentro de la cuenta del propio usuario (no son
 * secretos ni tokens de seguridad), así que basta con que no se repitan.
 */
export function generarId(): string {
  const c: Crypto | undefined = globalThis.crypto

  if (typeof c?.randomUUID === 'function') {
    return c.randomUUID()
  }

  if (typeof c?.getRandomValues === 'function') {
    const bytes = c.getRandomValues(new Uint8Array(16))
    // Marca la versión (4) y la variante, igual que un UUID v4 real.
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}-${Math.random()
    .toString(16)
    .slice(2, 10)}`
}
