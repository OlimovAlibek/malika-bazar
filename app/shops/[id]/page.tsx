// app/shops/[id]/page.tsx
import { redirect, notFound } from 'next/navigation';
import { publicSupabase } from '@/lib/supabase/public';

type Props = {
  params: { id: string };
};

export const revalidate = 0;

export default async function ShopRedirectPage({ params }: Props) {
  const shopId = params.id;

  const { data: shop, error } = await publicSupabase
    .from('shops')
    .select(`
      slug,
      room:rooms!inner (
        code
      )
    `)
    .eq('id', shopId)
    .single();

  if (error || !shop) {
    notFound();
  }

  redirect(`/room/${shop.room[0].code}/${shop.slug}`);
}