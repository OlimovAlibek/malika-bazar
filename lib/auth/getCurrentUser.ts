// lib/auth/getCurrentUser.ts
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get('mb_user')?.value;

  if (!userId) return null;

  const supabase = await createClient();

  // Get user with phone from users table (phone is synced from telegram_users in /api/telegram/check)
  const { data: user } = await supabase
    .from('users')
    .select('id, username, first_name, phone')
    .eq('id', userId)
    .single();

  return user || null;
}