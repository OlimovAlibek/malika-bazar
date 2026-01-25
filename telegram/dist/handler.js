import { supabase } from './supabase.js';
export async function handleTelegramUpdate(bot, update) {
    const msg = update.message;
    if (!msg)
        return;
    const chatId = msg.chat.id;
    const user = msg.from;
    const text = msg.text;
    if (!user || !text)
        return;
    console.log('👤 Telegram user:', user.id);
    console.log('📩 Message:', text);
    // Always upsert user
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
            await bot.sendMessage(chatId, '❌ Login havolasi noto‘g‘ri.');
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
            await bot.sendMessage(chatId, '❌ Login havolasi eskirgan.');
            return;
        }
        await supabase
            .from('telegram_login_tokens')
            .update({
            used: true,
            telegram_id: user.id,
        })
            .eq('id', loginToken.id);
        await bot.sendMessage(chatId, '✅ Login muvaffaqiyatli! Endi saytga qayting.');
        return;
    }
    await bot.sendMessage(chatId, '👋 Salom! Login qilish uchun sayt orqali kirish tugmasidan foydalaning.');
}
