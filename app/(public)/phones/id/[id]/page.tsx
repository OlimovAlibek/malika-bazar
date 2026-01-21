import { redirect } from 'next/navigation';
import { publicSupabase } from '@/lib/supabase/public';

type Props = {
  params: {
    id: string;
  };
};

export default async function PhoneRedirectPage({ params }: Props) {
  const { data: product } = await publicSupabase
    .from('products')
    .select('slug')
    .eq('id', params.id)
    .single();

  if (!product?.slug) {
    redirect('/phones');
  }

  // 🔥 301-style redirect to SEO slug
  redirect(`/phones/${product.slug}`);
}