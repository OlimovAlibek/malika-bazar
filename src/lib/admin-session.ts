export const ADMIN_SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 8 * 60 * 60  // 8 soat (sekund)

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function fromHex(hex: string): ArrayBuffer {
  const pairs = hex.match(/.{2}/g) ?? []
  const bytes = new Uint8Array(pairs.map(b => parseInt(b, 16)))
  return bytes.buffer as ArrayBuffer
}

export async function signAdminSession(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET!
  const exp = Date.now() + SESSION_MAX_AGE * 1000
  const payload = btoa(JSON.stringify({ exp }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const key = await getKey(secret)
  const rawSig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return `${payload}.${toHex(rawSig)}`
}

export async function verifyAdminSession(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET
    if (!secret) return false

    const dot = token.lastIndexOf('.')
    if (dot === -1) return false

    const payloadB64 = token.slice(0, dot)
    const sigHex = token.slice(dot + 1)

    // Payload decode
    const padded = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(padded + '=='.slice((payloadB64.length % 4) || 4))
    const { exp } = JSON.parse(json)
    if (!exp || exp < Date.now()) return false

    // Signature verify
    const key = await getKey(secret)
    const sig = fromHex(sigHex)
    return crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(payloadB64))
  } catch {
    return false
  }
}
