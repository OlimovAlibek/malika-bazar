import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export async function POST(req: Request) {
  try {
    const update = await req.json();

    // Only handle messages
    const message = update.message;
    if (!message?.text || !message.from) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const chatId = message.chat.id;
    const text = message.text;
    const user = message.from;

    const supabase = supabaseService;

    // Save telegram user
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
        return NextResponse.json({ ok: true }, { status: 200 });
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
        return NextResponse.json({ ok: true }, { status: 200 });
      }

      await supabase
        .from('telegram_login_tokens')
        .update({
          used: true,
          telegram_id: user.id,
        })
        .eq('id', loginToken.id);

      await sendMessage(chatId, '✅ Login muvaffaqiyatli! Endi saytga qayting.');
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    await sendMessage(
      chatId,
      '👋 Salom! Login qilish uchun sayt orqali kirish tugmasidan foydalaning.'
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[webhook] Error:', error);
    // Always return 200 to Telegram, even on error
    return NextResponse.json({ ok: true }, { status: 200 });
  }
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