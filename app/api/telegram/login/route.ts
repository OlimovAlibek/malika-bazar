import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseService } from '@/lib/supabase/service';

export async function POST() {
  // Use service role so token insert/cleanup never fails due to RLS.
  const supabase = supabaseService;

  await supabase
  .from('telegram_login_tokens')
  .delete()
  .lt('expires_at', new Date().toISOString());

  // 1️⃣ Generate random token
  const token = crypto.randomBytes(24).toString('hex');

  // 2️⃣ Expiration (5 minutes)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // 3️⃣ Save token
  const { error } = await supabase
    .from('telegram_login_tokens')
    .insert({
      token,
      expires_at: expiresAt,
    });

  if (error) {
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    token,
    telegram_url: `https://t.me/tezkubot?start=login_${token}`,
  });
}