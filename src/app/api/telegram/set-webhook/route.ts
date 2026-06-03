import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

export async function POST() {
  const store = await cookies()
  const token = store.get(ADMIN_SESSION_COOKIE)?.value
  if (!token || !(await verifyAdminSession(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const appUrl   = process.env.NEXT_PUBLIC_APP_URL

  if (!botToken || !appUrl) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN or NEXT_PUBLIC_APP_URL missing' }, { status: 500 })
  }

  const webhookUrl = `${appUrl}/api/telegram/webhook`

  const res  = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ url: webhookUrl, drop_pending_updates: true }),
  })
  const data = await res.json() as { ok: boolean; description?: string }

  if (!data.ok) {
    return NextResponse.json({ error: data.description }, { status: 500 })
  }

  return NextResponse.json({ ok: true, webhook_url: webhookUrl })
}
