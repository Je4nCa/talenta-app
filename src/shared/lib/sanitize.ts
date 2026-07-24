const ENTIDADES_HTML: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/**
 * `\r` nunca se permite (no aporta nada legítimo y es la mitad del clásico
 * `\r\n` usado para inyectar cabeceras extra en un correo). `\t` siempre se
 * permite (indentación, inofensivo). `\n` solo se permite si el valor es
 * texto multilínea (`permitirSaltoDeLinea`) — para valores de una sola línea
 * (email, fecha) un salto de línea es exactamente el vector de inyección de
 * cabeceras que se quiere evitar.
 */
function quitarCaracteresDeControl(texto: string, permitirSaltoDeLinea: boolean): string {
  let resultado = ''
  for (const caracter of texto) {
    const codigo = caracter.codePointAt(0) ?? 0
    if (codigo === 0x09) {
      resultado += caracter
      continue
    }
    if (permitirSaltoDeLinea && codigo === 0x0a) {
      resultado += caracter
      continue
    }
    if (codigo <= 0x1f || codigo === 0x7f) {
      continue
    }
    resultado += caracter
  }
  return resultado
}

/**
 * Neutraliza texto libre escrito por el usuario antes de interpolarlo en la
 * plantilla de EmailJS (que renderiza el correo como HTML) — evita que
 * alguien inyecte etiquetas/scripts/enlaces ocultos en el correo que reciben
 * Carlos y Alicia. También quita caracteres de control invisibles (usados
 * para ofuscar texto o falsificar enlaces) y limita el largo para evitar
 * abuso con payloads gigantes. Permite `\n` porque es texto multilínea
 * (viene de un `<textarea>`).
 */
export function sanitizarTextoLibre(texto: string, maxLargo = 2000): string {
  const sinControl = quitarCaracteresDeControl(texto, true)
  const escapado = sinControl.replace(/[&<>"']/g, (caracter) => ENTIDADES_HTML[caracter])
  return escapado.trim().slice(0, maxLargo)
}

/**
 * Para valores de una sola línea que EmailJS usa como cabecera de correo
 * (ej. `Reply-To`), no como HTML del cuerpo — escapar entidades HTML aquí
 * corrompería el valor. Quita caracteres de control y saltos de línea
 * (incluido `\n`, a diferencia de `sanitizarTextoLibre`), que es lo que
 * previene la inyección de cabeceras (ej. intentar agregar un `Bcc:` extra
 * metiendo un salto de línea dentro del valor).
 */
export function sanitizarValorPlano(texto: string, maxLargo = 254): string {
  return quitarCaracteresDeControl(texto, false).trim().slice(0, maxLargo)
}
