'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type Shop = {
  id: string;
  name: string;
  room?: {
    code: string;
  } | null;
};

type Props = {
  product: any;
  shops: Shop[];
};

export default function EditProductForm({ product, shops }: Props) {
  const supabase = createClient();

  const [brand, setBrand] = useState(product.brand);
  const [model, setModel] = useState(product.model);
  const [storage, setStorage] = useState(product.storage_gb);
  const [price, setPrice] = useState(product.price_uzs);
  const [shopId, setShopId] = useState(product.shop_id);
  const [image, setImage] = useState<File | null>(null);

  const currentImage = product.product_images?.[0]?.image_url;

  const save = async () => {
    // 1️⃣ Update product fields
    await supabase
      .from('products')
      .update({
        brand,
        model,
        storage_gb: storage,
        price_uzs: price,
        shop_id: shopId,
      })
      .eq('id', product.id);

    // 2️⃣ Replace image if uploaded
    if (image) {
      const fileExt = image.name.split('.').pop();
      const filePath = `${product.id}.${fileExt}`;

      await supabase.storage
        .from('product-images')
        .upload(filePath, image, { upsert: true });

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (currentImage) {
        await supabase
          .from('product_images')
          .update({ image_url: data.publicUrl })
          .eq('product_id', product.id);
      } else {
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: data.publicUrl,
          order: 0,
        });
      }
    }

    window.location.href = '/admin/products';
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Edit Product</h2>

      {/* Image preview */}
      {currentImage && (
        <div className="relative w-full h-40 rounded bg-gray-100 overflow-hidden">
          <Image
            src={currentImage}
            alt="Product preview"
            fill
            className="object-contain"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      {/* Shop selector */}
      <select
        className="border p-2 w-full"
        value={shopId}
        onChange={(e) => setShopId(e.target.value)}
      >
        {shops.map((shop) => (
          <option key={shop.id} value={shop.id}>
            {shop.name} — Xona {shop.room?.code ?? '—'}
          </option>
        ))}
      </select>

      <input
        className="border p-2 w-full"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        placeholder="Brand"
      />

      <input
        className="border p-2 w-full"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        placeholder="Model"
      />

      <input
        className="border p-2 w-full"
        type="number"
        value={storage}
        onChange={(e) => setStorage(Number(e.target.value))}
        placeholder="Storage (GB)"
      />

      <input
        className="border p-2 w-full"
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price"
      />

      <button
        onClick={save}
        className="bg-black text-white p-2 w-full rounded"
      >
        Save Changes
      </button>
    </div>
  );
}