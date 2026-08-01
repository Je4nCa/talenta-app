import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { canonizarEmail, normalizarEmail } from '@/shared/lib/email'
import { firestore } from '@/shared/lib/firebase'
import { sha256Hex } from '@/shared/lib/hash'
import type { CorreoAutorizado } from '../types/correoAutorizado'

const COLECCION = 'correosAutorizados'

function ref(hash: string) {
  return doc(firestore, COLECCION, hash)
}

/**
 * Comprueba si un correo está autorizado. Solo hace `get` del documento cuyo
 * id es el hash del correo — nunca lista la colección, así que funciona
 * durante el registro (sin sesión) sin exponer la lista a nadie.
 *
 * Prueba la forma literal y la canónica, porque en Gmail `juan.perez@` y
 * `juanperez@` son el mismo buzón.
 */
export async function estaAutorizadoEnFirestore(email: string): Promise<boolean> {
  const [hashLiteral, hashCanonico] = await Promise.all([
    sha256Hex(normalizarEmail(email)),
    sha256Hex(canonizarEmail(email)),
  ])

  const [porLiteral, porCanonico] = await Promise.all([
    getDoc(ref(hashLiteral)),
    hashLiteral === hashCanonico ? Promise.resolve(null) : getDoc(ref(hashCanonico)),
  ])

  return porLiteral.exists() || Boolean(porCanonico?.exists())
}

/** Listado completo — solo lo puede leer un superadmin (ver reglas). */
export async function listarCorreosAutorizados(): Promise<CorreoAutorizado[]> {
  const snap = await getDocs(collection(firestore, COLECCION))
  return snap.docs
    .map((d) => d.data() as CorreoAutorizado)
    .sort((a, b) => a.email.localeCompare(b.email))
}

export async function autorizarCorreo(
  email: string,
  agregadoPor: string,
  nota?: string,
): Promise<void> {
  const limpio = normalizarEmail(email)
  const hashLiteral = await sha256Hex(limpio)
  const hashCanonico = await sha256Hex(canonizarEmail(limpio))

  const registro: CorreoAutorizado = {
    id: hashLiteral,
    email: limpio,
    agregadoPor,
    agregadoEn: new Date().toISOString(),
    ...(nota ? { nota } : {}),
  }

  // Se guardan ambas variantes para que la persona pueda escribir su correo
  // con o sin puntos; el registro canónico apunta al mismo correo mostrado.
  await setDoc(ref(hashLiteral), registro)
  if (hashCanonico !== hashLiteral) {
    await setDoc(ref(hashCanonico), { ...registro, id: hashCanonico })
  }
}

export async function quitarCorreoAutorizado(email: string): Promise<void> {
  const limpio = normalizarEmail(email)
  const hashLiteral = await sha256Hex(limpio)
  const hashCanonico = await sha256Hex(canonizarEmail(limpio))

  await deleteDoc(ref(hashLiteral))
  if (hashCanonico !== hashLiteral) {
    await deleteDoc(ref(hashCanonico)).catch(() => {})
  }
}
