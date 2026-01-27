import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const update = await req.json();

  // ✅ IMMEDIATE RESPONSE TO TELEGRAM
  // Do NOT await anything critical before this
  processUpdate(update).catch(err => {
    console.error('[telegram webhook async error]', err);
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}

/* ===============================
   ASYNC PROCESSING (SAFE)
================================ */
async function processUpdate(update: any) {
  const message = update.message;
  if (!message || !message.from) return;

  // 📞 PHONE SHARING HANDLER
if (message.contact) {
  const phone = message.contact.phone_number;
  const telegramId = message.from.id;
  const chatId = message.chat.id;

  await supabaseService
    .from('telegram_users')
    .update({ phone })
    .eq('telegram_id', telegramId);

  await sendMessage(
    chatId,
    '✅ Rahmat! Telefon raqamingiz saqlandi.'
  );

  return;
}

  const chatId = message.chat.id;
  const text = message.text;
  const user = message.from;

  const supabase = supabaseService;

  // Save telegram user (non-blocking)
  await supabase.from('telegram_users').upsert({
    telegram_id: user.id,
    username: user.username,
    first_name: user.first_name,
    language_code: user.language_code,
    source: text.includes('login_') ? 'magic_login' : 'direct',
  });

  // MAGIC LOGIN
  if (text.startsWith('/start login_') || text.includes('login_')) {
    const token = text.split('login_')[1]?.trim().split(/\s+/)[0];
    if (!token) return;

    const { data: loginToken } = await supabase
      .from('telegram_login_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!loginToken) {
      await sendMessage(chatId, '❌ Login havolasi eskirgan yoki yaroqsiz.');
      return;
    }

    await supabase
  .from('telegram_login_tokens')
  .update({
    used: true,
    telegram_id: user.id,
  })
  .eq('id', loginToken.id);

// 🔍 Check if phone exists
const { data: tgUser } = await supabase
  .from('telegram_users')
  .select('phone')
  .eq('telegram_id', user.id)
  .single();

if (!tgUser?.phone) {
  await requestPhone(chatId);
} else {
  await sendMessage(chatId, '✅ Login muvaffaqiyatli! Endi saytga qayting.');
}

return;
  }

  await sendMessage(
    chatId,
    '👋 Salom! Login qilish uchun sayt orqali kirish tugmasidan foydalaning.'
  );
}

/* ===============================
   TELEGRAM SENDER
================================ */
async function sendMessage(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });
}

async function requestPhone(chatId: number) {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: '📞 Profilingizni to‘liq qilish uchun telefon raqamingizni ulashing',
      reply_markup: {
        keyboard: [
          [{ text: '📞 Telefon raqamni ulashish', request_contact: true }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }),
  });
}
