import dotenv from 'dotenv';
const result = dotenv.config({ path: '../.env.local' });
import TelegramBot from 'node-telegram-bot-api';
import { supabase } from './supabase.js';
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is missing');
}
const bot = new TelegramBot(token, { polling: true });
console.log('🤖 Telegram bot started (polling mode)');
bot.on('message', async (msg) => {
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
        source: text.startsWith('login_') ? 'magic_login' : 'direct',
    });
    // MAGIC LOGIN
    if (text.startsWith('/start login_') || text.startsWith('login_')) {
        // Extract token: handle both "/start login_abc" and "login_abc" formats
        // Token is everything after "login_"
        let token = '';
        if (text.includes('login_')) {
            const parts = text.split('login_');
            token = parts[1]?.trim().split(/\s+/)[0] || ''; // Take first word after login_
        }
        else {
            token = text.replace('/start ', '').replace('login_', '').trim();
        }
        if (!token) {
            console.log('[bot] Could not extract token from:', text);
            await bot.sendMessage(chatId, '❌ Login havolasi noto\'g\'ri.');
            return;
        }
        console.log('[bot] Processing login token:', token.substring(0, 8) + '...');
        const { data: loginToken, error: findError } = await supabase
            .from('telegram_login_tokens')
            .select('*')
            .eq('token', token)
            .eq('used', false)
            .gt('expires_at', new Date().toISOString())
            .single();
        if (!loginToken) {
            console.log('[bot] Token not found or already used:', findError?.message);
            await bot.sendMessage(chatId, '❌ Login havolasi eskirgan yoki yaroqsiz.');
            return;
        }
        const { error: updateError } = await supabase
            .from('telegram_login_tokens')
            .update({
            used: true,
            telegram_id: user.id,
        })
            .eq('id', loginToken.id);
        if (updateError) {
            console.error('[bot] Failed to update token:', updateError);
            await bot.sendMessage(chatId, '❌ Xatolik yuz berdi. Qayta urinib ko\'ring.');
            return;
        }
        console.log('[bot] Token marked as used for telegram_id:', user.id);
        await bot.sendMessage(chatId, '✅ Login muvaffaqiyatli! Endi saytga qayting.');
        return;
    }
    // Default reply
    await bot.sendMessage(chatId, '👋 Salom! Login qilish uchun sayt orqali kirish tugmasidan foydalaning.');
});
