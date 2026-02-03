import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseService } from '@/lib/supabase/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const userId = cookieStore.get('mb_user')?.value;

  if (!userId) {
    return NextResponse.json(
      { error: 'unauthorized' },
      { status: 401 }
    );
  }

  const supabase = supabaseService;

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      product:products (
        id,
        slug,
        brand,
        model,
        storage_gb,
        price_uzs,
        updated_at,
        shop:shops!inner (
          name,
          room:rooms (
            code
          )
        ),
        product_images (
          image_url
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[favorites/list]', error);
    return NextResponse.json(
      { error: 'failed' },
      { status: 500 }
    );
  }

  // normalize result
  const products = data.map((row: any) => row.product);

  return NextResponse.json({ products });
}