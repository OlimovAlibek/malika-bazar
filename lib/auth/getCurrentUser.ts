// lib/auth/getCurrentUser.ts
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get('mb_user')?.value;

  if (!userId) return null;

  const supabase = await createClient();

  const { data: user } = await supabase
    .from('users')
    .select('id, username, first_name')
    .eq('id', userId)
    .single();

  return user || null;
}