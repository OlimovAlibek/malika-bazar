import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const update = await req.json();

  // Only handle messages
  const message = update.message;
  if (!message?.text || !message.from) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text;
  const user = message.from;

  const supabase = await createClient();

  // Save telegram user
  await supabase.from('telegram_users').upsert({
    telegram_id: user.id,
    username: user.username,
    first_name: user.first_name,
    language_code: user.language_code,
    source: text.startsWith('login_') ? 'magic_login' : 'direct',
  });

  // MAGIC LOGIN
  if (text.startsWith('/start login_') || text.startsWith('login_')) {
    const token = text.split('login_')[1]?.trim();

    if (!token) {
      return NextResponse.json({ ok: true });
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
      return NextResponse.json({ ok: true });
    }

    await supabase
      .from('telegram_login_tokens')
      .update({
        used: true,
        telegram_id: user.id,
      })
      .eq('id', loginToken.id);

    await sendMessage(chatId, '✅ Login muvaffaqiyatli! Endi saytga qayting.');
    return NextResponse.json({ ok: true });
  }

  await sendMessage(
    chatId,
    '👋 Salom! Login qilish uchun sayt orqali kirish tugmasidan foydalaning.'
  );

  return NextResponse.json({ ok: true });
}

// 🔹 Telegram API sender
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