const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

export async function tgSend(chatId: number, text: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      },
    )
    return res.ok
  } catch {
    return false
  }
}
