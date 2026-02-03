import { createClient } from '@/lib/supabase/server';
import { InlinePriceEditor } from '@/components/InlinePriceEditor';
import Image from 'next/image';
import { ToggleActive } from '@/components/ToggleActive';

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      brand,
      model,
      storage_gb,
      price_uzs,
      is_active,
      shop:shops (
        name,
        room:rooms (
          code
        )
      ),
      product_images (
        image_url
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Products</h2>

      <a
        href="/admin/products/new"
        className="inline-block bg-black text-white px-4 py-2 rounded"
      >
        + Add Product
      </a>

      <ul className="space-y-2">
        {products?.map((product) => (
          <li
            key={product.id}
            className="border p-3 rounded space-y-2"
          >
            {product.product_images?.[0]?.image_url && (
              <div className="relative w-full h-40 rounded overflow-hidden">
                <Image
                  src={product.product_images[0].image_url}
                  alt={`${product.brand} ${product.model}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <div>
              <div className="font-medium">
                {product.brand} {product.model} {product.storage_gb}GB
              </div>

              <div className="text-sm text-gray-600">
                {product.shop?.[0]?.name} — Xona {product.shop?.[0]?.room?.[0]?.code}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <InlinePriceEditor
                productId={product.id}
                price={product.price_uzs}
              />

              <ToggleActive
                productId={product.id}
                initialValue={product.is_active}
              />

              <a
                href={`/admin/products/${product.id}/edit`}
                className="text-sm underline"
              >
                Edit
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}