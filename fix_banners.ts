/**
 * Shop banner va avatar rasmlarini GSMArena rasmiy CDN bilan yangilash
 * pnpm tsx fix_banners.ts
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

const G = 'https://fdn2.gsmarena.com/vv/pics'

// Barcha URLlar curl bilan tekshirilgan (HTTP 200)
const SHOP_BANNERS: Record<string, { banner: string; avatar: string }> = {

  // ── Apple ixtisosligi ───────────────────────────────────────────────────────
  'itech-plaza': {
    banner: `${G}/apple/apple-iphone-16-pro-2.jpg`,    // iPhone 16 Pro — rang variantlari
    avatar: `${G}/apple/apple-iphone-16-pro-1.jpg`,
  },
  'istore-pro': {
    banner: `${G}/apple/apple-iphone-15-pro-3.jpg`,    // iPhone 15 Pro — orqa rasm
    avatar: `${G}/apple/apple-iphone-16-pro-max-1.jpg`,
  },

  // ── Samsung ixtisosligi ─────────────────────────────────────────────────────
  'samsung-center': {
    banner: `${G}/samsung/samsung-galaxy-s23-ultra-5g-2.jpg`,  // S23 Ultra — S Pen bilan
    avatar: `${G}/samsung/samsung-galaxy-s23-ultra-5g-1.jpg`,
  },
  'galaxy-hub': {
    banner: `${G}/samsung/samsung-galaxy-z-fold6-2.jpg`,        // Z Fold 6 — ochilgan holat
    avatar: `${G}/samsung/samsung-galaxy-z-fold6-1.jpg`,
  },

  // ── Xiaomi ixtisosligi ──────────────────────────────────────────────────────
  'smartworld': {
    banner: `${G}/xiaomi/xiaomi-14-ultra-3.jpg`,               // Xiaomi 14 Ultra — kamera
    avatar: `${G}/xiaomi/xiaomi-14-ultra-1.jpg`,
  },
  'digital-zone': {
    banner: `${G}/xiaomi/xiaomi-14t-pro-2.jpg`,                // 14T Pro — yon rasm
    avatar: `${G}/xiaomi/xiaomi-14t-pro-1.jpg`,
  },

  // ── Aralash do'konlar ───────────────────────────────────────────────────────
  'mobimax': {
    banner: `${G}/samsung/samsung-galaxy-z-flip6-2.jpg`,       // Z Flip 6 — yopiq/ochiq
    avatar: `${G}/samsung/samsung-galaxy-z-flip6-1.jpg`,
  },
  'phonemart': {
    banner: `${G}/samsung/samsung-galaxy-s24-fe-2.jpg`,        // S24 FE — rang variantlari
    avatar: `${G}/samsung/samsung-galaxy-s24-fe-1.jpg`,
  },
  'techshop': {
    banner: `${G}/apple/apple-iphone-16-pro-3.jpg`,            // iPhone 16 Pro — profil
    avatar: `${G}/apple/apple-iphone-16-pro-1.jpg`,
  },

  // ── Ishlatilgan ixtisosligi ─────────────────────────────────────────────────
  'megamobile': {
    banner: `${G}/samsung/samsung-galaxy-z-flip6-3.jpg`,       // Z Flip 6 — detallar
    avatar: `${G}/apple/apple-iphone-14-pro-1.jpg`,
  },
}

async function fixBanners() {
  console.log('🖼️  Banner rasmlarini yangilash...\n')

  const { data: shops, error } = await supabase
    .from('shops')
    .select('id, slug, name')
    .neq('slug', '')

  if (error || !shops) {
    console.error('Xato:', error?.message)
    return
  }

  let updated = 0

  for (const shop of shops) {
    const imgs = SHOP_BANNERS[shop.slug as string]
    if (!imgs) {
      console.warn(`  ⚠️  ${shop.slug} — banner topilmadi`)
      continue
    }

    await supabase
      .from('shops')
      .update({
        banner_url: imgs.banner,
        avatar_url: imgs.avatar,
      })
      .eq('id', shop.id)

    const bannerFile = imgs.banner.split('/').pop()
    console.log(`  ✅ ${shop.name.padEnd(20)} → ${bannerFile}`)
    updated++
  }

  console.log(`\n✅ ${updated} ta do'kon banneri yangilandi`)
}

fixBanners().catch(console.error)
