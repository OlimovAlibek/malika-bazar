// lib/auth/getCurrentUser.ts
import { cookies } from 'next/headers';
import { supabaseService } from '@/lib/supabase/service';

export async function getCurrentUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get('mb_user')?.value;

  if (!userId) return null;

  // Use service role to avoid RLS blocking server-side auth checks.
  // This app uses custom cookie auth (mb_user), not Supabase Auth sessions.
  const supabase = supabaseService;

  // Get base user (phone is stored in telegram_users)
  const { data: user } = await supabase
    .from('users')
    .select('id, telegram_id, username, first_name')
    .eq('id', userId)
    .single();

  if (!user) return null;

  let phone: string | null = null;
  if (user.telegram_id) {
    const { data: tg } = await supabase
      .from('telegram_users')
      .select('phone')
      .eq('telegram_id', user.telegram_id)
      .single();
    phone = tg?.phone ?? null;
  }

  return { ...user, phone };
}