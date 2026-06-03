import { cookies } from 'next/headers'
import type { Role, User } from '@/types'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'
import { serviceClient } from '@/lib/supabase/service'

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies()
  const raw = store.get(USER_SESSION_COOKIE)?.value
  if (!raw) return null

  const session = await verifyUserToken(raw)
  if (!session) return null

  if (session.role === 'seller') {
    const { data } = await serviceClient
      .from('sellers')
      .select('id, telegram_id, full_name, phone, is_blocked, created_at')
      .eq('id', session.id)
      .maybeSingle()

    if (!data || data.is_blocked) return null

    return {
      id:          data.id,
      telegram_id: data.telegram_id as number,
      username:    null,
      first_name:  data.full_name,
      phone:       data.phone,
      role:        'seller',
      created_at:  data.created_at,
    }
  }

  if (session.role === 'buyer') {
    const { data } = await serviceClient
      .from('buyers')
      .select('id, telegram_id, username, first_name, phone, is_blocked, joined_at')
      .eq('id', session.id)
      .maybeSingle()

    if (!data || data.is_blocked) return null

    return {
      id:          data.id,
      telegram_id: data.telegram_id as number,
      username:    data.username,
      first_name:  data.first_name,
      phone:       data.phone,
      role:        'buyer',
      created_at:  data.joined_at,
    }
  }

  return null
}

export async function requireRole(role: Role): Promise<User> {
  const user = await getCurrentUser()
  if (!user || user.role !== role) {
    throw new Error('Unauthorized')
  }
  return user
}
