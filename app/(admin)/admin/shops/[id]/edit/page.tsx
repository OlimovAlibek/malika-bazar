import { createClient } from '@/lib/supabase/server';
import EditShopForm from './EditShopForm';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

export default async function EditShopPage({ params }: Props) {
  const supabase = await createClient();

  // 1️⃣ Get shop
  const { data: shop, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !shop) {
    notFound();
  }

  // 2️⃣ Get rooms (THIS WAS MISSING)
  const { data: rooms } = await supabase
    .from('rooms')
    .select('id, code')
    .order('code');

  return (
    <EditShopForm
      shop={shop}
      rooms={rooms || []}   // ✅ THIS PREVENTS CRASH
    />
  );
}