import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';



export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ loggedIn: false });
  }

  const supabase = await createClient();

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
    return NextResponse.json({ loggedIn: false });
  }

  if (!loginToken.used) {
    console.log('[telegram/check] Token exists but not yet marked as used by bot');
    return NextResponse.json({ loggedIn: false });
  }

  if (!loginToken.telegram_id) {
    console.log('[telegram/check] Token is used but missing telegram_id');
    return NextResponse.json({ loggedIn: false });
  }

  const { data: tgUser } = await supabase
    .from('telegram_users')
    .select('telegram_id, username, first_name')
    .eq('telegram_id', loginToken.telegram_id)
    .single();

  if (!tgUser) {
    return NextResponse.json({ loggedIn: false });
  }

  // Upsert user - specify telegram_id as conflict target
  const { data: user, error: userError } = await supabase
    .from('users')
    .upsert(
      {
        telegram_id: tgUser.telegram_id,
        username: tgUser.username,
        first_name: tgUser.first_name,
      },
      {
        onConflict: 'telegram_id',
      }
    )
    .select()
    .single();

  if (userError) {
    console.error('[telegram/check] User upsert error:', userError);
    return NextResponse.json({ loggedIn: false });
  }

  if (!user) {
    console.log('[telegram/check] User upsert returned null');
    return NextResponse.json({ loggedIn: false });
  }

  console.log('[telegram/check] User found/created:', user.id);

  

  const response = NextResponse.json({ loggedIn: true });

  response.cookies.set({
    name: 'mb_user',
    value: String(user.id),
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 24 * 30,
  });

  console.log('[telegram/check] set mb_user cookie for user', user.id);

  return response;

  
}