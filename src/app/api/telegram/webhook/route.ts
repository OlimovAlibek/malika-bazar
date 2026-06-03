import { NextResponse } from 'next/server'
import { serviceClient } from '@/lib/supabase/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

async function tg(method: string, body: object) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
}

async function reply(chat_id: number, text: string, extra: object = {}) {
  await tg('sendMessage', { chat_id, text, parse_mode: 'HTML', ...extra })
}

function normalizePhone(raw: string): string {
  return `+${raw.replace(/\D/g, '')}`
}

function genOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  try {
    const update = await req.json() as {
      message?: {
        from:     { id: number; first_name: string; last_name?: string; username?: string }
        text?:    string
        contact?: { phone_number: string }
      }
    }

    const msg = update.message
    if (!msg?.from) return NextResponse.json({ ok: true })

    const chatId  = msg.from.id
    const text    = (msg.text ?? '').trim()
    const contact = msg.contact

    // ── /start ────────────────────────────────────────────────────
    if (text === '/start' || text.startsWith('/start ')) {
      await reply(chatId,
        `Salom! 👋\n\nTizimga kirish uchun telefon raqamingizni yuboring:`,
        {
          reply_markup: {
            keyboard:          [[{ text: '📱 Telefon raqamini yuborish', request_contact: true }]],
            resize_keyboard:   true,
            one_time_keyboard: true,
          },
        },
      )
      return NextResponse.json({ ok: true })
    }

    // ── Kontakt ulashildi ─────────────────────────────────────────
    if (contact) {
      const phone = normalizePhone(contact.phone_number)

      // Sotuvchimi?
      const { data: seller } = await serviceClient
        .from('sellers')
        .select('id, full_name, is_blocked')
        .eq('phone', phone)
        .maybeSingle()

      if (seller?.is_blocked) {
        await reply(chatId, '❌ Hisobingiz bloklangan. Admin bilan bog\'laning.', {
          reply_markup: { remove_keyboard: true },
        })
        return NextResponse.json({ ok: true })
      }

      // Xaridormi?
      let userId: string | null = null
      let role:   'seller' | 'buyer' = 'buyer'

      if (seller) {
        userId = seller.id
        role   = 'seller'
        // telegram_id va last_active_at ni yangilash
        await serviceClient
          .from('sellers')
          .update({ telegram_id: chatId, last_active_at: new Date().toISOString() })
          .eq('id', seller.id)
      } else {
        const { data: buyer } = await serviceClient
          .from('buyers')
          .select('id, is_blocked')
          .eq('telegram_id', chatId)
          .maybeSingle()

        if (buyer?.is_blocked) {
          await reply(chatId, '❌ Hisobingiz bloklangan.', {
            reply_markup: { remove_keyboard: true },
          })
          return NextResponse.json({ ok: true })
        }

        if (buyer) {
          userId = buyer.id
          await serviceClient
            .from('buyers')
            .update({ phone, username: msg.from.username ?? null, last_active_at: new Date().toISOString() })
            .eq('id', buyer.id)
        } else {
          const { data: newBuyer, error } = await serviceClient
            .from('buyers')
            .insert({
              telegram_id: chatId,
              first_name:  msg.from.first_name,
              last_name:   msg.from.last_name  ?? null,
              username:    msg.from.username   ?? null,
              phone,
            })
            .select('id')
            .single()

          if (error || !newBuyer) {
            await reply(chatId, 'Xatolik yuz berdi. Iltimos keyinroq urinib ko\'ring.')
            return NextResponse.json({ ok: true })
          }
          userId = newBuyer.id
        }
        role = 'buyer'
      }

      if (!userId) {
        await reply(chatId, 'Foydalanuvchi topilmadi.', { reply_markup: { remove_keyboard: true } })
        return NextResponse.json({ ok: true })
      }

      // Eski OTP tokenlarni tozalash (bu telefon uchun)
      const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString()
      await serviceClient
        .from('auth_tokens')
        .delete()
        .eq('phone', phone)
        .lt('created_at', cutoff)

      // Yangi OTP yaratish va saqlash
      const token = crypto.randomUUID().replace(/-/g, '')
      const otp   = genOtp()

      await serviceClient
        .from('auth_tokens')
        .insert({ token, otp, phone, telegram_id: chatId, role, user_id: userId })

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tezku.uz'
      await reply(chatId,
        `🔐 <b>Kirish kodi</b>\n\n<code>${otp}</code>\n\nBu kodni <a href="${appUrl}/profile">saytda</a> kiriting.\nMuddati: 5 daqiqa`,
        { reply_markup: { remove_keyboard: true } },
      )
    }

  } catch (e) {
    console.error('[webhook]', e)
  }

  return NextResponse.json({ ok: true })
}
