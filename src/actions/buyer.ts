'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'
import { serviceClient } from '@/lib/supabase/service'

export async function updateBuyerProfile(data: {
  first_name: string
  avatar_url?: string | null
}) {
  const store   = await cookies()
  const token   = store.get(USER_SESSION_COOKIE)?.value
  if (!token) throw new Error('Unauthorized')

  const session = await verifyUserToken(token)
  if (!session || session.role !== 'buyer') throw new Error('Unauthorized')

  const name = data.first_name.trim()
  if (!name) throw new Error('Ism kiritilishi shart')

  const update: Record<string, string> = { first_name: name }
  if (data.avatar_url !== undefined) {
    update.avatar_url = data.avatar_url ?? ''
  }

  const { error } = await serviceClient
    .from('buyers')
    .update(update)
    .eq('id', session.id)

  if (error) throw new Error(error.message)
  revalidatePath('/profile')
}
