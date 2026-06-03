/**
 * Barcha mahsulot rasmlarini Pexels CDN bilan yangilash
 * pnpm tsx update_images.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// Pexels CDN — barchasi 200 OK deb tasdiqlangan
const PX = (id: number, w = 600, h = 750) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`

const PXB = (id: number) => PX(id, 1200, 400)   // banner

// ── Brendga mos rasmlar ────────────────────────────────────────────────────────
const BRAND_IMAGES: Record<string, number[]> = {
  Apple:   [47261, 5081914, 9286848, 5082579, 16006293, 1092644],
  Samsung: [1440727, 6802042, 7236793, 4068315, 3812433, 8728291],
  Xiaomi:  [1092644, 6483626, 14683985, 3812433, 699122, 15866445],
  Redmi:   [699122, 6483626, 3812433, 14683985, 1647095, 2651374],
  Poco:    [8728291, 6483626, 3812433, 1092644, 699122],
  OnePlus: [2651374, 14683985, 15866445, 607812, 3952032],
  Realme:  [15866445, 14683985, 2651374, 607812, 1647095],
  Honor:   [14683985, 2651374, 607812, 3952032, 1647095],
  Huawei:  [3952032, 2651374, 14683985, 607812, 12899281],
}
const FALLBACK = [607812, 3952032, 12899281, 2387793, 1647095]

// ── Shop bannerlar ─────────────────────────────────────────────────────────────
const SHOP_BANNERS: Record<string, number> = {
  'itech-plaza':    47261,
  'samsung-center': 1440727,
  'mobimax':        2387793,
  'istore-pro':     5081914,
  'galaxy-hub':     6802042,
  'smartworld':     6483626,
  'phonemart':      12899281,
  'techshop':       16006293,
  'megamobile':     2651374,
  'digital-zone':   15866445,
}

async function updateImages() {
  console.log('🖼️  Rasmlarni yangilash boshlandi...\n')

  // 1. Barcha mahsulotlarni olish
  const { data: products, error } = await supabase
    .from('products')
    .select('id, brand, model, slug')
    .order('created_at', { ascending: true })

  if (error || !products) {
    console.error('Mahsulotlar topilmadi:', error?.message)
    return
  }
  console.log(`📦 Jami mahsulot: ${products.length}`)

  // Brendga qarab tartib raqami (har brand uchun alohida hisoblagich)
  const brandCounter: Record<string, number> = {}

  for (const p of products) {
    const brand = p.brand as string
    brandCounter[brand] = (brandCounter[brand] ?? 0)
    const imgs = BRAND_IMAGES[brand] ?? FALLBACK
    const imgId = imgs[brandCounter[brand] % imgs.length]
    brandCounter[brand]++

    const newUrl = PX(imgId)

    // Mavjud rasmni yangilash yoki qaytadan insert
    const { data: existing } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', p.id)
      .eq('is_primary', true)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('product_images')
        .update({ url: newUrl })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('product_images')
        .insert({
          product_id: p.id,
          url:        newUrl,
          is_primary: true,
          position:   0,
        })
    }

    console.log(`  ✅ ${brand} ${p.model}  →  pexels-${imgId}`)
  }

  // 2. Shop bannerlarini ham yangilash
  console.log('\n🏪 Do\'kon bannerlari yangilanmoqda...')
  const { data: shops } = await supabase
    .from('shops')
    .select('id, slug')
    .neq('slug', '')

  for (const sh of shops ?? []) {
    const slug = sh.slug as string
    const pxId = SHOP_BANNERS[slug]
    if (!pxId) continue

    const bannerUrl = PXB(pxId)
    const avatarUrl = PX(pxId, 200, 200)

    await supabase
      .from('shops')
      .update({ banner_url: bannerUrl, avatar_url: avatarUrl })
      .eq('id', sh.id)

    console.log(`  🏪 ${slug}  →  pexels-${pxId}`)
  }

  console.log('\n✅ Barcha rasmlar yangilandi!')
  console.log(`📊 ${products.length} mahsulot + ${(shops ?? []).length} do'kon banner`)
}

updateImages().catch(console.error)
