export type UserSession = {
  id:   string          // seller_id yoki buyer_id
  role: 'seller' | 'buyer'
}

export const USER_SESSION_COOKIE = 'mb_user'

const SECRET = process.env.ADMIN_SESSION_SECRET!

const SESSION_TTL_S = 60 * 60 * 24 * 30  // 30 kun

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

export async function createUserToken(session: UserSession): Promise<string> {
  const payload = btoa(JSON.stringify({
    id:   session.id,
    role: session.role,
    exp:  Math.floor(Date.now() / 1000) + SESSION_TTL_S,
  }))
  const sig = await hmac(payload)
  return `${payload}.${sig}`
}

export async function verifyUserToken(token: string): Promise<UserSession | null> {
  const dot = token.lastIndexOf('.')
  if (dot === -1) return null
  const payload = token.slice(0, dot)
  const sig     = token.slice(dot + 1)
  if (sig !== await hmac(payload)) return null
  try {
    const data = JSON.parse(atob(payload)) as { id: string; role: string; exp?: number }
    if (data.exp && Math.floor(Date.now() / 1000) > data.exp) return null
    if (!data.id || !data.role) return null
    return { id: data.id, role: data.role as UserSession['role'] }
  } catch {
    return null
  }
}
