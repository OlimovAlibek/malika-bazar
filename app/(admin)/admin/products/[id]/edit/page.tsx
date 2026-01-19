import { createClient } from '@/lib/supabase/server';
import EditProductForm from './EditProductForm';

type Props = {
  params: { id: string };
};

export default async function EditProductPage({ params }: Props) {
  const supabase = await createClient();

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

  const { data: shops } = await supabase
    .from('shops')
    .select('id, name, shop_number');

  if (error || !product) {
    return <div>Product not found</div>;
  }

  return (
    <EditProductForm
      product={product}
      shops={shops || []}
    />
  );
}