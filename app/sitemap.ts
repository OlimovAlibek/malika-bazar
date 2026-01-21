import { MetadataRoute } from 'next';
import { publicSupabase } from '@/lib/supabase/public';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  // 1️⃣ Fetch active products
  const { data: products } = await publicSupabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)
    .not('slug', 'is', null);

  const productUrls =
    products?.map((product) => ({
      url: `${siteUrl}/phones/${product.slug}`,
      lastModified: product.updated_at
        ? new Date(product.updated_at)
        : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })) ?? [];

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

    // 📦 Product pages
    ...productUrls,
  ];
}