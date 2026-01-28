import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseService } from '@/lib/supabase/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const cookieStore = cookies();
  const userId = cookieStore.get('mb_user')?.value;

  if (!userId) {
    return NextResponse.json(
      { error: 'unauthorized' },
      { status: 401 }
    );
  }

  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json(
      { error: 'missing_product_id' },
      { status: 400 }
    );
  }

  const supabase = supabaseService;

  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    // 💔 Remove favorite
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    return NextResponse.json({ liked: false });
  }

  // ❤️ Add favorite
  await supabase.from('favorites').insert({
    user_id: userId,
    product_id: productId,
  });

  return NextResponse.json({ liked: true });
}