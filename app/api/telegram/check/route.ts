import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(data: Record<string, any>) {
  return NextResponse.json(data, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}



export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) {
    return json({ loggedIn: false, reason: 'missing_token' });
  }

  // Use service role for reliability (RLS-safe) — cookie is still set manually below.
  const supabase = supabaseService;

  // First, check if token exists and is used
  const { data: loginToken, error: tokenError } = await supabase
    .from('telegram_login_tokens')
    .select('telegram_id, used, expires_at')
    .eq('token', token)
    .single();

  console.log('[telegram/check] Token lookup:', { 
    token: token.substring(0, 8) + '...', 
    found: !!loginToken, 
    used: loginToken?.used,
    hasTelegramId: !!loginToken?.telegram_id,
    error: tokenError?.message 
  });

  if (!loginToken) {
    console.log('[telegram/check] Token not found in database');
    return json({ loggedIn: false, reason: 'token_not_found' });
  }

  // Expired token → treat as not logged in
  if (loginToken.expires_at && new Date(loginToken.expires_at).getTime() <= Date.now()) {
    console.log('[telegram/check] Token expired');
    return json({ loggedIn: false, reason: 'token_expired' });
  }

  if (!loginToken.used) {
    console.log('[telegram/check] Token exists but not yet marked as used by bot');
    return json({ loggedIn: false, reason: 'token_not_used_yet' });
  }

  if (!loginToken.telegram_id) {
    console.log('[telegram/check] Token is used but missing telegram_id');
    return json({ loggedIn: false, reason: 'missing_telegram_id' });
  }

  const { data: tgUser } = await supabase
    .from('telegram_users')
    .select('telegram_id, username, first_name, phone')
    .eq('telegram_id', loginToken.telegram_id)
    .single();

  if (!tgUser) {
    // IMPORTANT: Do NOT block website login on telegram_users existence.
    // The webhook may upsert telegram_users slightly later, or it may fail independently.
    console.log('[telegram/check] Telegram user not found; proceeding with minimal user');
  }

  // Upsert user - include phone from telegram_users
  // This ensures phone is available in users table for getCurrentUser()
  const { data: user, error: userError } = await supabase
    .from('users')
    .upsert(
      {
        telegram_id: tgUser?.telegram_id ?? loginToken.telegram_id,
        username: tgUser?.username ?? null,
        first_name: tgUser?.first_name ?? null,
        phone: tgUser?.phone ?? null, // Copy phone from telegram_users when available
      },
      {
        onConflict: 'telegram_id',
      }
    )
    .select()
    .single();

  if (userError) {
    console.error('[telegram/check] User upsert error:', userError);
    return json({ loggedIn: false, reason: 'user_upsert_error', message: userError.message });
  }

  if (!user) {
    console.log('[telegram/check] User upsert returned null');
    return json({ loggedIn: false, reason: 'user_upsert_null' });
  }

  console.log('[telegram/check] User found/created:', user.id);

  

  const response = json({ loggedIn: true });

  // Set cookie with proper security settings
  const isProduction = process.env.NODE_ENV === 'production';
  
  response.cookies.set({
    name: 'mb_user',
    value: String(user.id),
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: isProduction, // Only secure in production (HTTPS required)
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  console.log('[telegram/check] ✅ Login successful, cookie set for user', user.id);

  return response;

  
}