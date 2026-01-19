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
  

  useEffect(() => {
    supabase.from('shops').select('*').then(({ data }) => {
      setShops(data || []);
    });
  }, []);

  const saveProduct = async () => {
    // 1️⃣ Save product first
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        shop_id: shopId,
        brand,
        model,
        storage_gb: storage,
        condition: 'new',
        price_uzs: price,
      })
      .select()
      .single();
  
    if (error || !product) {
      alert('Failed to save product');
      return;
    }
  
    // 2️⃣ Upload image (if provided)
    if (image) {
      const fileExt = image.name.split('.').pop();
      const filePath = `${product.id}.${fileExt}`;
  
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, image, {
          upsert: true,
        });
  
      if (uploadError) {
        console.error(uploadError);
        return;
      }
  
      // 3️⃣ Get public URL
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
  
      // 4️⃣ Save image URL in DB
      await supabase.from('product_images').insert({
        product_id: product.id,
        image_url: data.publicUrl,
        order: 0,
      });
    }
  
    // 5️⃣ Done
    window.location.href = '/admin/products';
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Add Product</h2>

      <select
        className="border p-2 w-full"
        onChange={(e) => setShopId(e.target.value)}
      >
        <option value="">Select shop</option>
        {shops.map((shop) => (
          <option key={shop.id} value={shop.id}>
            {shop.name} — {shop.shop_number}
          </option>
        ))}
      </select>

      <select
        className="border p-2 w-full"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      >
        <option>Apple</option>
        <option>Samsung</option>
        <option>Xiaomi</option>
      </select>

      <input
        className="border p-2 w-full"
        placeholder="Model (e.g. iPhone 13)"
        onChange={(e) => setModel(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Storage (GB)"
        value={storage}
        onChange={(e) => setStorage(Number(e.target.value))}
      />

      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Price (UZS)"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

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