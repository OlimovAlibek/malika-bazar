export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const token  = process.env.TELEGRAM_BOT_TOKEN
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!token || !appUrl) {
    console.warn('[webhook] TELEGRAM_BOT_TOKEN or NEXT_PUBLIC_APP_URL missing — skipping webhook registration')
    return
  }

  const webhookUrl = `${appUrl}/api/telegram/webhook`

  try {
    const res  = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ url: webhookUrl, drop_pending_updates: true }),
    })
    const data = await res.json() as { ok: boolean; description?: string }

    if (data.ok) {
      console.log(`[webhook] ✓ Webhook set → ${webhookUrl}`)
    } else {
      console.error(`[webhook] ✗ setWebhook failed: ${data.description}`)
    }
  } catch (e) {
    console.error('[webhook] setWebhook error:', e)
  }
}
