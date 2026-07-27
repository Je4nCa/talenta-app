/**
 * SHA-256 vía Web Crypto (nativo del navegador, sin dependencias). Se usa
 * para comparar el correo de un estudiante contra la lista de inscritos sin
 * guardar los correos reales en texto plano en el código fuente.
 */
export async function sha256Hex(texto: string): Promise<string> {
  const bytes = new TextEncoder().encode(texto)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}
