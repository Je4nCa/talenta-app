const CLAVE_UID_RECORDADO = 'talenta:uid-recordado'

export function guardarUidRecordado(uid: string): void {
  localStorage.setItem(CLAVE_UID_RECORDADO, uid)
}

export function obtenerUidRecordado(): string | null {
  return localStorage.getItem(CLAVE_UID_RECORDADO)
}

export function limpiarUidRecordado(): void {
  localStorage.removeItem(CLAVE_UID_RECORDADO)
}
