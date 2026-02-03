import { createClient } from '@/lib/supabase/server';
import EditProductForm from './EditProductForm';

type Props = {
  params: { id: string };
};

export default async function EditProductPage({ params }: Props) {
  const supabase = await createClient();

  // 1️⃣ Get product
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      brand,
      model,
      storage_gb,
      price_uzs,
      shop_id,
      product_images (
        image_url
      )
    `)
    .eq('id', params.id)
    .single();

  if (error || !product) {
    return <div>Product not found</div>;
  }

  // 2️⃣ Get shops WITH room code
  const { data: shops } = await supabase
    .from('shops')
    .select(`
      id,
      name,
      room:rooms!inner (
        code
      )
    `)
    .order('name');

  const formattedShops = (shops || []).map(shop => ({
    ...shop,
    room: Array.isArray(shop.room) && shop.room.length > 0 ? shop.room[0] : null,
  }));

  return (
    <EditProductForm
      product={product}
      shops={formattedShops}
    />
  );
}