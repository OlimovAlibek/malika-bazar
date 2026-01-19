import { createClient } from '@/lib/supabase/server';
import EditShopForm from './EditShopForm';

type Props = {
  params: { id: string };
};

export default async function EditShopPage({ params }: Props) {
  const supabase = await createClient();

  const { data: shop, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !shop) {
    return <div>Shop not found</div>;
  }

  return <EditShopForm shop={shop} />;
}