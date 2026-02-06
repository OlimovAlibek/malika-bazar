import { MetadataRoute } from 'next';
import { publicSupabase } from '@/lib/supabase/public';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  /* ======================
     PRODUCTS
  ====================== */
  const { data: products } = await publicSupabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)
    .not('slug', 'is', null);

  const productUrls =
    products?.map((p) => ({
      url: `${siteUrl}/phones/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })) ?? [];

  /* ======================
     ROOMS
  ====================== */
  const { data: rooms } = await publicSupabase
    .from('rooms')
    .select('code')
    .eq('is_active', true);

  const roomUrls =
    rooms?.map((r) => ({
      url: `${siteUrl}/${r.code}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) ?? [];

  /* ======================
     SHOPS
  ====================== */
  const { data: shops } = await publicSupabase
    .from('shops')
    .select(`
      slug,
      rooms ( code )
    `)
    .eq('is_active', true);

  const shopUrls =
    shops?.flatMap((shop: any) =>
      shop.rooms
        ? [
            {
              url: `${siteUrl}/${shop.rooms.code}/${shop.slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly' as const,
              priority: 0.8,
            },
          ]
        : []
    ) ?? [];

  /* ======================
     RETURN ALL
  ====================== */
  return [
    // 🏠 Homepage
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },

    // 📱 Phones listing
    {
      url: `${siteUrl}/phones`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },

    // 🧱 Rooms
    ...roomUrls,

    // 🏪 Shops
    ...shopUrls,

    // 📦 Products
    ...productUrls,
  ];
}