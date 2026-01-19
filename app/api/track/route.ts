import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();

  const body = await req.json();
  const { product_id, shop_id, event_type } = body;

  if (!product_id || !shop_id || !event_type) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await supabase.from('product_events').insert({
    product_id,
    shop_id,
    event_type,
  });

  return NextResponse.json({ success: true });
}