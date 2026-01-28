'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneCard } from '@/components/PhoneCard';



export default function FavoritesGrid() {
  const [products, setProducts] = useState<any[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/favorites/list')
      .then(async res => {
        if (res.status === 401) {
          router.push('/tg');
          return;
        }
        const data = await res.json();
        setProducts(data.products);
      })
      .catch(() => setProducts([]));
  }, [router]);

  if (products === null) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        ❤️ Hali sevimli telefonlar yo‘q
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3">
      {products.map(product => {
        const shop = Array.isArray(product.shop)
          ? product.shop[0]
          : product.shop;

        const imageUrl = product.product_images?.[0]?.image_url;

        return (
          <PhoneCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            brand={product.brand}
            model={product.model}
            storage_gb={product.storage_gb}
            price_uzs={product.price_uzs}
            updated_at={product.updated_at}
            shopName={shop.name}
            shopNumber={shop.shop_number}
            imageUrl={imageUrl}
            variant="grid"
            liked={true}
            onUnliked={() => {
                // ✅ REMOVE FROM UI IMMEDIATELY
                setProducts(prev =>
                  prev!.filter(p => p.id !== product.id)
                );
              }}
          />
        );
      })}
    </ul>
  );
}