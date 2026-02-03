'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function NewProductPage() {
  const supabase = createClient();

  const [shops, setShops] = useState<any[]>([]);
  const [shopId, setShopId] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('');
  const [storage, setStorage] = useState(128);
  const [price, setPrice] = useState<number | ''>('');
  const [image, setImage] = useState<File | null>(null);

  // 🔹 Load shops WITH room code
  useEffect(() => {
    supabase
      .from('shops')
      .select(`
        id,
        name,
        room:rooms (
          code
        )
      `)
      .order('name')
      .then(({ data }) => {
        setShops(data || []);
      });
  }, []);

  function generateSlug(
    brand: string,
    model: string,
    storage: number
  ) {
    return `${brand} ${model} ${storage}gb`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  const saveProduct = async () => {
    if (!shopId) {
      alert('Please select a shop');
      return;
    }

    // 1️⃣ Create product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        shop_id: shopId,
        brand,
        model,
        storage_gb: storage,
        condition: 'new',
        price_uzs: price,
        slug: generateSlug(brand, model, storage),
      })
      .select()
      .single();

    if (error || !product) {
      alert('Failed to save product');
      return;
    }

    // 2️⃣ Upload image (optional)
    if (image) {
      const fileExt = image.name.split('.').pop();
      const filePath = `${product.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, image, { upsert: true });

      if (uploadError) {
        console.error(uploadError);
        return;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      await supabase.from('product_images').insert({
        product_id: product.id,
        image_url: data.publicUrl,
        order: 0,
      });
    }

    // 3️⃣ Done
    window.location.href = '/admin/products';
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Add Product</h2>

      {/* Shop select */}
      <select
        className="border p-2 w-full"
        value={shopId}
        onChange={(e) => setShopId(e.target.value)}
      >
        <option value="">Select shop</option>
        {shops.map((shop) => (
          <option key={shop.id} value={shop.id}>
            {shop.name}
            {shop.room?.code ? ` — Xona ${shop.room.code}` : ''}
          </option>
        ))}
      </select>

      {/* Brand */}
      <select
        className="border p-2 w-full"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      >
        <option>Apple</option>
        <option>Samsung</option>
        <option>Xiaomi</option>
      </select>

      {/* Model */}
      <input
        className="border p-2 w-full"
        placeholder="Model (e.g. iPhone 13)"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />

      {/* Storage */}
      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Storage (GB)"
        value={storage}
        onChange={(e) => setStorage(Number(e.target.value))}
      />

      {/* Price */}
      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Price (UZS)"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      {/* Image */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <button
        onClick={saveProduct}
        className="bg-black text-white p-2 w-full"
      >
        Save Product
      </button>
    </div>
  );
}