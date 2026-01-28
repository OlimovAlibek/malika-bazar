import { cookies } from 'next/headers';
import { supabaseService } from '@/lib/supabase/service';

export async function getUserFavoriteProductIds(): Promise<Set<string>> {
  const cookieStore = cookies();
  const userId = cookieStore.get('mb_user')?.value;

  if (!userId) return new Set();

  const { data } = await supabaseService
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId);

  return new Set(data?.map(f => f.product_id) ?? []);
}