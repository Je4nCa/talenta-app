/** Minúsculas y sin espacios: la forma mínima con la que se guarda un correo. */
export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Forma canónica del buzón: dos escrituras distintas que llegan al **mismo**
 * correo real dan el mismo resultado.
 *
 * En Gmail, `juan.perez@gmail.com`, `juanperez@gmail.com` y
 * `juanperez+curso@gmail.com` son el mismo buzón (ignora los puntos y todo lo
 * que sigue a un `+`), pero para Firebase Auth y para un hash son cadenas
 * distintas. Sin esto, un estudiante inscrito con una escritura y registrado
 * con otra no coincidiría con la lista de inscritos.
 *
 * Solo se usa para **comparar**; el correo que se guarda y con el que se
 * autentica el usuario sigue siendo el que él escribió.
 */
export function canonizarEmail(email: string): string {
  const normalizado = normalizarEmail(email)
  const [local, dominio] = normalizado.split('@')
  if (!dominio) return normalizado

  const sinAlias = local.split('+')[0]
  const esGmail = dominio === 'gmail.com' || dominio === 'googlemail.com'
  return `${esGmail ? sinAlias.replace(/\./g, '') : sinAlias}@${dominio}`
}
