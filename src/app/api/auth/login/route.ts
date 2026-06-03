import { NextResponse } from 'next/server'
import { serviceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export const TOKEN_TTL_MS = 5 * 60 * 1000  // 5 daqiqa

// POST /api/auth/login
// Yangi magic token yaratadi, Telegram bot URL ni qaytaradi
export async function POST() {
  // Eskirgan tokenlarni tozalash (10 daqiqadan eski, hal etilmagan)
  const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  await serviceClient
    .from('auth_tokens')
    .delete()
    .lt('created_at', cutoff)
    .is('user_id', null)

  const token = crypto.randomUUID().replace(/-/g, '')  // 32-char hex

  const { error } = await serviceClient
    .from('auth_tokens')
    .insert({ token })

  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const botUsername = (process.env.TELEGRAM_BOT_USERNAME ?? '').replace('@', '')
  const botUrl      = `https://t.me/${botUsername}?start=login_${token}`

  return NextResponse.json({ token, botUrl, expiresIn: TOKEN_TTL_MS / 1000 })
}
