async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashPassword(password: string): Promise<string> {
  return sha256Hex(password)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return (await sha256Hex(password)) === hash
}
