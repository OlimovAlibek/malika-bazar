'use server'

import { cookies } from 'next/headers'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'
import { serviceClient } from '@/lib/supabase/service'

export async function sendSupportMessage(message: string): Promise<{ error?: string }> {
  const trimmed = message.trim()
  if (!trimmed) return { error: "Xabar bo'sh bo'lishi mumkin emas" }
  if (trimmed.length > 1000) return { error: 'Xabar juda uzun (max 1000 belgi)' }

  const store = await cookies()
  const token = store.get(USER_SESSION_COOKIE)?.value
  if (!token) return { error: 'Tizimga kirmagansiz' }

  const session = await verifyUserToken(token)
  if (!session) return { error: 'Sessiya muddati tugagan' }

  let userName = ''
  let userContact = ''

  if (session.role === 'seller') {
    const { data } = await serviceClient
      .from('sellers')
      .select('full_name, phone, telegram_username')
      .eq('id', session.id)
      .maybeSingle()
    if (data) {
      userName    = data.full_name
      userContact = data.telegram_username ? `@${data.telegram_username}` : (data.phone ?? '')
    }
  } else {
    const { data } = await serviceClient
      .from('buyers')
      .select('first_name, phone, username')
      .eq('id', session.id)
      .maybeSingle()
    if (data) {
      userName    = data.first_name
      userContact = data.username ? `@${data.username}` : (data.phone ?? '')
    }
  }

  const roleLabel = session.role === 'seller' ? 'Sotuvchi' : 'Xaridor'

  const text = [
    `📩 <b>Yangi murojaat</b>`,
    ``,
    `👤 <b>${userName}</b> (${roleLabel})`,
    userContact ? `📞 ${userContact}` : null,
    ``,
    `💬 ${trimmed}`,
  ].filter(Boolean).join('\n')

  const botToken = process.env.SUPPORT_BOT_TOKEN
  const chatId   = process.env.SUPPORT_CHAT_ID

  if (!botToken || !chatId) return { error: 'Support bot sozlanmagan' }

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    cache: 'no-store',
  })

  if (!res.ok) return { error: 'Xabar yuborilmadi. Qayta urinib ko\'ring' }
  return {}
}
