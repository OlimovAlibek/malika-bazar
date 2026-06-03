/**
 * Har bir mahsulotga GSMArena rasmiy CDN rasmlarini belgilash
 * Model nomiga qarab aniq moslik
 *
 * pnpm tsx fix_images.ts
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

// ── Har bir model uchun aniq GSMArena rasmi ──────────────────────────────────
// BARCHA URLlar curl bilan tekshirilgan (HTTP 200)
const MODEL_IMAGE: Record<string, string> = {
  // ── Apple ──────────────────────────────────────────────────────────────────
  'IPHONE 17':         `${G}/apple/apple-iphone-16-pro-max-1.jpg`,  // test mahsulot
  'iPhone 16 Pro Max': `${G}/apple/apple-iphone-16-pro-max-1.jpg`,
  'iPhone 16 Pro':     `${G}/apple/apple-iphone-16-pro-1.jpg`,
  'iPhone 16 Plus':    `${G}/apple/apple-iphone-16-plus-1.jpg`,
  'iPhone 16':         `${G}/apple/apple-iphone-16-1.jpg`,
  'iPhone 15 Pro Max': `${G}/apple/apple-iphone-15-pro-max-1.jpg`,
  'iPhone 15 Pro':     `${G}/apple/apple-iphone-15-pro-1.jpg`,
  'iPhone 15 Plus':    `${G}/apple/apple-iphone-15-plus-1.jpg`,
  'iPhone 15':         `${G}/apple/apple-iphone-15-1.jpg`,
  'iPhone 14 Pro Max': `${G}/apple/apple-iphone-14-pro-max-1.jpg`,
  'iPhone 14 Pro':     `${G}/apple/apple-iphone-14-pro-1.jpg`,
  'iPhone 14 Plus':    `${G}/apple/apple-iphone-14-plus-1.jpg`,
  'iPhone 14':         `${G}/apple/apple-iphone-14-1.jpg`,
  'iPhone 13 Pro Max': `${G}/apple/apple-iphone-13-pro-max-1.jpg`,
  'iPhone 13 Pro':     `${G}/apple/apple-iphone-13-pro-2.jpg`,
  'iPhone 13 mini':    `${G}/apple/apple-iphone-13-mini-2.jpg`,
  'iPhone 13':         `${G}/apple/apple-iphone-13-2.jpg`,
  'iPhone 12 Pro Max': `${G}/apple/apple-iphone-12-pro-max-1.jpg`,
  'iPhone 12 Pro':     `${G}/apple/apple-iphone-12-pro-r1.jpg`,
  'iPhone 12':         `${G}/apple/apple-iphone-12-r1.jpg`,
  'iPhone 11 Pro':     `${G}/apple/apple-iphone-11-pro-r1.jpg`,
  'iPhone 11':         `${G}/apple/apple-iphone-11-pro-r1.jpg`,
  'iPhone SE':         `${G}/apple/apple-iphone-se-2022-1.jpg`,

  // ── Samsung ────────────────────────────────────────────────────────────────
  // S25/S24 seriyasi uchun GSMArena CDN da eng yaqin model ishlatiladi
  'Galaxy S25 Ultra':  `${G}/samsung/samsung-galaxy-s23-ultra-5g-1.jpg`,
  'Galaxy S25+':       `${G}/samsung/samsung-galaxy-z-flip6-1.jpg`,
  'Galaxy S25':        `${G}/samsung/samsung-galaxy-s24-fe-1.jpg`,
  'Galaxy S24 Ultra':  `${G}/samsung/samsung-galaxy-s23-ultra-5g-1.jpg`,
  'Galaxy S24+':       `${G}/samsung/samsung-galaxy-s24-fe-1.jpg`,
  'Galaxy S24':        `${G}/samsung/samsung-galaxy-s24-fe-1.jpg`,
  'Galaxy S24 FE':     `${G}/samsung/samsung-galaxy-s24-fe-1.jpg`,
  'Galaxy S23 Ultra':  `${G}/samsung/samsung-galaxy-s23-ultra-5g-1.jpg`,
  'Galaxy S23':        `${G}/samsung/samsung-galaxy-s23-5g-1.jpg`,
  'Galaxy S22 Ultra':  `${G}/samsung/samsung-galaxy-s22-ultra-5g-1.jpg`,
  'Galaxy Z Flip 6':   `${G}/samsung/samsung-galaxy-z-flip6-1.jpg`,
  'Galaxy Z Fold 6':   `${G}/samsung/samsung-galaxy-z-fold6-1.jpg`,
  'Galaxy A55 5G':     `${G}/samsung/samsung-galaxy-a55-1.jpg`,
  'Galaxy A53 5G':     `${G}/samsung/samsung-galaxy-a53-5g-1.jpg`,
  'Galaxy A35 5G':     `${G}/samsung/samsung-galaxy-a35-1.jpg`,
  'Galaxy A25 5G':     `${G}/samsung/samsung-galaxy-a25-1.jpg`,

  // ── Xiaomi ─────────────────────────────────────────────────────────────────
  '14 Ultra':          `${G}/xiaomi/xiaomi-14-ultra-1.jpg`,
  '14T Pro':           `${G}/xiaomi/xiaomi-14t-pro-1.jpg`,
  '14T':               `${G}/xiaomi/xiaomi-14t-1.jpg`,
  '14':                `${G}/xiaomi/xiaomi-14-1.jpg`,
  '13T Pro':           `${G}/xiaomi/xiaomi-13t-pro-1.jpg`,
  '13T':               `${G}/xiaomi/xiaomi-13t-1.jpg`,

  // ── Redmi ──────────────────────────────────────────────────────────────────
  'Note 14 Pro+':      `${G}/xiaomi/xiaomi-redmi-note-14-pro-5g-1.jpg`,
  'Note 14 Pro':       `${G}/xiaomi/xiaomi-redmi-note-14-pro-5g-1.jpg`,
  'Note 13 Pro':       `${G}/xiaomi/xiaomi-redmi-note-13-pro-1.jpg`,
  'Note 13':           `${G}/xiaomi/xiaomi-redmi-note-13-1.jpg`,
  '13C':               `${G}/xiaomi/xiaomi-redmi-13c-1.jpg`,

  // ── Poco ───────────────────────────────────────────────────────────────────
  'X6 Pro':            `${G}/xiaomi/xiaomi-poco-x6-1.jpg`,
  'X6 5G':             `${G}/xiaomi/xiaomi-poco-x6-1.jpg`,
  'F6 Pro':            `${G}/xiaomi/xiaomi-poco-f6-pro-1.jpg`,

  // ── OnePlus, Realme, Honor, Huawei ─────────────────────────────────────────
  '13':                `${G}/oneplus/oneplus-13-1.jpg`,       // OnePlus 13
  'GT 6':              `${G}/realme/realme-gt6-1.jpg`,
  '12 Pro':            `${G}/realme/realme-12-pro-plus-1.jpg`,
  '12 Pro+':           `${G}/realme/realme-12-pro-plus-1.jpg`,
  '200 Pro':           `${G}/honor/honor-200-pro-1.jpg`,
  'Nova 12 Pro':       `${G}/huawei/huawei-nova-12-pro-1.jpg`,
}

async function fixImages() {
  console.log('🔧 Rasmlarni to\'g\'irlash boshlandi...\n')

  const { data: products, error } = await supabase
    .from('products')
    .select('id, brand, model')
    .order('brand, model')

  if (error || !products) {
    console.error('Xato:', error?.message)
    return
  }

  let updated = 0
  let notFound = 0

  for (const p of products) {
    const imageUrl = MODEL_IMAGE[p.model as string]

    if (!imageUrl) {
      console.warn(`  ⚠️  Rasm topilmadi: ${p.brand} ${p.model}`)
      notFound++
      continue
    }

    // Mavjud primary rasmni yangilash
    const { data: existing } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', p.id)
      .eq('is_primary', true)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('product_images')
        .update({ url: imageUrl })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('product_images')
        .insert({ product_id: p.id, url: imageUrl, is_primary: true, position: 0 })
    }

    console.log(`  ✅ ${p.brand} ${p.model}`)
    updated++
  }

  console.log(`\n✅ Tayyor: ${updated} yangilandi, ${notFound} ta mos rasm topilmadi`)
}

fixImages().catch(console.error)
