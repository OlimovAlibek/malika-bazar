const ADMIN_GROUP_ID = -3764873609;

import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Telegram MUST always get 200 OK, even on errors.
  // IMPORTANT: Avoid "fire-and-forget" background work on serverless (not reliable).
  try {
    const update = await req.json();
    await processUpdate(update);
  } catch (err) {
    console.error('[telegram webhook]', err);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}


/* ===============================
   ASYNC PROCESSING (SAFE)
================================ */
async function processUpdate(update: any) {
  const message = update.message;
  if (!message || !message.from) return;

  const chatId = message.chat.id;
  const text = message.text;
  const user = message.from;
  const supabase = supabaseService;

  // ===============================
// 🧑‍💼 ADMIN REPLY HANDLER
// ===============================
if (
  message.chat.id === ADMIN_GROUP_ID &&
  message.reply_to_message?.text
) {
  const replyText = message.text;
  const original = message.reply_to_message.text;

  // Extract telegram_id from forwarded message
  const match = original.match(/ID:(\d+)/);
  if (!match) return;

  const telegramId = Number(match[1]);

  // Save admin reply
  await supabase
    .from('support_messages')
    .update({
      admin_reply: replyText,
      replied_at: new Date().toISOString(),
    })
    .eq('telegram_id', telegramId)
    .is('admin_reply', null);

  // Send reply to user
  await sendMessage(
    telegramId,
    `🧑‍💼 Yordam markazi:\n\n${replyText}`
  );

  return;
}

  // 📞 PHONE SHARING HANDLER (must be first, before text check)
  if (message.contact) {
    const phone = message.contact.phone_number;
    const telegramId = user.id;

    // Upsert to avoid losing phone if the user row doesn't exist yet
    await supabase
      .from('telegram_users')
      .upsert(
        { telegram_id: telegramId, phone },
        { onConflict: 'telegram_id' }
      );

    await sendMessage(
      chatId,
      '✅ Rahmat! Telefon raqamingiz saqlandi.'
    );

    return;
  }

  // Skip if no text (e.g., only contact was sent)
  if (!text) return;

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
    if (!token) {
      await sendMessage(chatId, '👋 Salom! Login qilish uchun sayt orqali kirish tugmasidan foydalaning.');
      return;
    }

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

    // ✅ CRITICAL: MARK TOKEN AS USED FIRST (THIS UNBLOCKS WEBSITE LOGIN)
    // This MUST happen before any phone logic - login is complete at this point
    await supabase
      .from('telegram_login_tokens')
      .update({
        used: true,
        telegram_id: user.id,
      })
      .eq('id', loginToken.id);

    // ✅ ALWAYS send success message (login is complete, regardless of phone)
    await sendMessage(chatId, '✅ Login muvaffaqiyatli! Endi saytga qayting.');

    // 🔍 OPTIONAL: Request phone if missing (non-blocking, doesn't affect login)
    const { data: tgUser } = await supabase
      .from('telegram_users')
      .select('phone')
      .eq('telegram_id', user.id)
      .single();

    if (!tgUser?.phone) {
      // Request phone separately, login is already complete
      await requestPhone(chatId);
    }

    return;
  }

  // ===============================
// 💬 USER SUPPORT MESSAGE
// ===============================
await supabase.from('support_messages').insert({
  telegram_id: user.id,
  chat_id: chatId,
  user_message: text,
});

await sendMessage(
  chatId,
  '📨 Xabaringiz qabul qilindi. Tez orada javob beramiz.'
);

// Forward to admin group
await sendMessage(
  ADMIN_GROUP_ID,
  `📩 YANGI MUROJAAT\n\n` +
  `👤 ${user.first_name ?? 'User'}\n` +
  `🔗 @${user.username ?? 'no_username'}\n` +
  `🆔 ID:${user.id}\n\n` +
  `💬 ${text}`
);

return;
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
