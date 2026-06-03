import { NextResponse } from 'next/server'
import { serviceClient } from '@/lib/supabase/service'
import { tgSend } from '@/lib/telegram'
import { TOKEN_TTL_MS } from '@/app/api/auth/login/route'

export const dynamic = 'force-dynamic'

const PHONE_RE = /^\+\d{9,15}$/

function genOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST /api/auth/send-otp
// Body: { phone: "+998901234567" }
// Telefon raqami bo'yicha foydalanuvchini topib, Telegram OTP yuboradi
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const phone = (body?.phone ?? '').trim()

  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: 'Telefon raqami noto\'g\'ri' }, { status: 400 })
  }

  // 1. Sotuvchimi yoki xaridormi?
  let telegramId: number | null = null
  let userId: string | null     = null
  let role: 'seller' | 'buyer'  = 'buyer'

  const { data: seller } = await serviceClient
    .from('sellers')
    .select('id, telegram_id, is_blocked')
    .eq('phone', phone)
    .maybeSingle()

  if (seller) {
    if (seller.is_blocked) {
      return NextResponse.json({ error: 'Hisob bloklangan' }, { status: 403 })
    }
    telegramId = seller.telegram_id
    userId     = seller.id
    role       = 'seller'
  } else {
    const { data: buyer } = await serviceClient
      .from('buyers')
      .select('id, telegram_id, is_blocked')
      .eq('phone', phone)
      .maybeSingle()

    if (buyer) {
      if (buyer.is_blocked) {
        return NextResponse.json({ error: 'Hisob bloklangan' }, { status: 403 })
      }
      telegramId = buyer.telegram_id
      userId     = buyer.id
      role       = 'buyer'
    }
  }

  if (!userId) {
    // Xavfsizlik: telefon mavjud yoki yo'qligini bildirmaymiz
    return NextResponse.json({ error: 'Telegram bot bilan bog\'laning: @' + (process.env.TELEGRAM_BOT_USERNAME ?? '') }, { status: 404 })
  }

  if (!telegramId) {
    const botUsername = (process.env.TELEGRAM_BOT_USERNAME ?? '').replace('@', '')
    return NextResponse.json(
      { error: `Avval @${botUsername} botiga /start yuboring` },
      { status: 422 },
    )
  }

  // 2. Eski tokenlarni tozalash (bu telefon uchun)
  const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  await serviceClient
    .from('auth_tokens')
    .delete()
    .eq('phone', phone)
    .lt('created_at', cutoff)

  // 3. Yangi token va OTP
  const token = crypto.randomUUID().replace(/-/g, '')
  const otp   = genOtp()

  const { error: insertError } = await serviceClient
    .from('auth_tokens')
    .insert({ token, otp, phone, telegram_id: telegramId, role, user_id: userId })

  if (insertError) {
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }

  // 4. Telegram orqali OTP yuborish
  const sent = await tgSend(
    telegramId,
    `🔐 <b>Tezku kirish kodi</b>\n\nKod: <code>${otp}</code>\n\nMuddati: ${TOKEN_TTL_MS / 60000} daqiqa`,
  )

  if (!sent) {
    await serviceClient.from('auth_tokens').delete().eq('token', token)
    return NextResponse.json({ error: 'Telegram xabari yuborilmadi' }, { status: 502 })
  }

  return NextResponse.json({ token, expiresIn: TOKEN_TTL_MS / 1000 })
}
