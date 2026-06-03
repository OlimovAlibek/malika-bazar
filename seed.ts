/**
 * Tezku — Demo Seed Script
 * 10 sotuvchi × 10 telefon = 100 ta mahsulot
 *
 * Ishga tushirish:
 *   pnpm tsx seed.ts
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

// ─── Image helpers ────────────────────────────────────────────────────────────
const IMG = (id: string, w = 600, h = 750) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=85`

const BANNER = (id: string) => IMG(id, 1200, 400)

// Telefon rasmlari (Unsplash stable IDs)
const IMGS = {
  iphone_black:   IMG('1510557880182-3d4d3cba35a5'),
  iphone_silver:  IMG('1592750475338-740b2d2e70c3'),
  iphone_gold:    IMG('1565849904461-04a58ad377e0'),
  iphone_color:   IMG('1621524440988-8bc849e47d8e'),
  iphone_14:      IMG('1678685888221-cda773a3dcdb'),
  iphone_15:      IMG('1695048133142-1a20484d2569'),
  samsung_black:  IMG('1574755393849-623942496936'),
  samsung_blue:   IMG('1611532736597-de2d4265fba3'),
  samsung_hand:   IMG('1598327105666-5b89351aff97'),
  phone_generic:  IMG('1556656793-8538c3b7db58'),
  phone_flat:     IMG('1584824486509-112e4181ff6b'),
  phone_hand:     IMG('1601784551446-20c9e07cdbdb'),
  xiaomi_black:   IMG('1546054454-aa26e2b734c7'),
}

const BANNERS = {
  apple:    BANNER('1636466497217-26a8cbeaf0aa'),
  samsung:  BANNER('1616348436168-de43ad0db179'),
  phones:   BANNER('1573998359955-62fb1da18f00'),
  mixed:    BANNER('1585771724684-38269d6639fd'),
  xiaomi:   BANNER('1635870723802-e88d76b9e40c'),
}

// ─── Description helpers ──────────────────────────────────────────────────────
function descNew(opts: {
  color: string
  storage: number
  ram?: number
  chip?: string
  box: 'Fullbox' | 'Qutisiz'
  extra?: string
  room: string
}) {
  return [
    `📱 Rang: ${opts.color}`,
    `💾 Xotira: ${opts.storage}GB${opts.ram ? ` | RAM: ${opts.ram}GB` : ''}${opts.chip ? ` | ${opts.chip}` : ''}`,
    `🔋 Batareya: 100% — yangi, ishlatilmagan`,
    `📦 Komplektatsiya: ${opts.box}${opts.box === 'Fullbox' ? ' (kabel + adapter)' : ''}`,
    `✅ Holat: Yangi • Ideal`,
    `🔢 IMEI: Sotib olishdan oldin tekshiriladi`,
    `🛡️ Kafolat: 1 yil rasmiy kafolat`,
    `📍 Malika bozor • ${opts.room} xona`,
    '',
    opts.extra ?? 'Barcha funksiyalar ko\'z oldingizda tekshiriladi.',
  ].join('\n')
}

function descUsed(opts: {
  color: string
  storage: number
  ram?: number
  battery: number
  cycles?: number
  box: 'Fullbox' | 'Qutisiz'
  grade: 'Ideal' | 'Yaxshi' | "O'rtacha"
  note?: string
  warranty: number
  room: string
}) {
  const gradeNote = {
    'Ideal':    'old va orqa tomoni mukammal, hech qanday iz yo\'q',
    'Yaxshi':   'old tomoni A+, orqa tomonda minimal iz bor',
    "O'rtacha": 'ishlatilish izlari ko\'zga tashlanadi, ekran butun',
  }[opts.grade]

  return [
    `📱 Rang: ${opts.color}`,
    `💾 Xotira: ${opts.storage}GB${opts.ram ? ` | RAM: ${opts.ram}GB` : ''}`,
    `🔋 Batareya: ${opts.battery}%${opts.cycles ? ` • ${opts.cycles} tsikl` : ''}`,
    `📦 Komplektatsiya: ${opts.box}`,
    `✅ Holat: ${opts.grade} — ${gradeNote}`,
    `🔢 IMEI: Ko'rsatish mumkin — so'rang`,
    `🛡️ Kafolat: ${opts.warranty} oy do'kon kafolati`,
    `📍 Malika bozor • ${opts.room} xona`,
    '',
    opts.note ?? 'Sotib olishdan oldin barcha funksiyalarni o\'zingiz tekshirasiz.',
  ].join('\n')
}

// ─── Shop + Products data ─────────────────────────────────────────────────────
const SHOPS_DATA = [

  // ── 1. iTech Plaza ── Apple yangi ──────────────────────────────────────────
  {
    seller:  { full_name: 'Alisher Karimov',  phone: '+998901112233' },
    shop: {
      name:             'iTech Plaza',
      room_code:        'A-12',
      description:      'Malika bozordagi eng ishonchli Apple iPhone do\'koni.\niPhone 11 dan iPhone 16 Pro gacha barcha modellar — yangi va ishlatilgan.\nHar bir telefon to\'liq tekshirilgan, kafolat beriladi.\n\n📍 2-qavat, A-12 xona\n🕘 09:00–19:00 (Dush–Shan)\n✅ Rasmiy IMEI tekshiruvi mavjud',
      phone:            '+998953733336',
      telegram_username:'itech_plaza',
      banner_url:       BANNERS.apple,
      avatar_url:       IMG('1592750475338-740b2d2e70c3', 200, 200),
    },
    products: [
      { brand:'Apple', model:'iPhone 16 Pro',     color:'Black Titanium',    storage_gb:256, condition:'new',  price_uzs:17_200_000, ram_gb:8,  chip:'A18 Pro',   box:'Fullbox' as const, img: IMGS.iphone_black  },
      { brand:'Apple', model:'iPhone 16',          color:'Ultramarine',       storage_gb:128, condition:'new',  price_uzs:13_200_000, ram_gb:8,  chip:'A18',       box:'Fullbox' as const, img: IMGS.iphone_color  },
      { brand:'Apple', model:'iPhone 15 Pro',      color:'Natural Titanium',  storage_gb:256, condition:'new',  price_uzs:15_500_000, ram_gb:8,  chip:'A17 Pro',   box:'Fullbox' as const, img: IMGS.iphone_silver },
      { brand:'Apple', model:'iPhone 15',          color:'Black',             storage_gb:128, condition:'new',  price_uzs:10_500_000, ram_gb:6,  chip:'A16',       box:'Fullbox' as const, img: IMGS.iphone_black  },
      { brand:'Apple', model:'iPhone 14 Pro',      color:'Deep Purple',       storage_gb:256, condition:'new',  price_uzs:13_800_000, ram_gb:6,  chip:'A16 Bionic',box:'Fullbox' as const, img: IMGS.iphone_color  },
      { brand:'Apple', model:'iPhone 14',          color:'Blue',              storage_gb:128, condition:'used', price_uzs: 7_500_000, ram_gb:6,  battery:88, cycles:210, grade:'Ideal' as const,   warranty:3, box:'Qutisiz' as const, img: IMGS.iphone_14    },
      { brand:'Apple', model:'iPhone 13 Pro',      color:'Alpine Green',      storage_gb:256, condition:'used', price_uzs: 8_200_000, ram_gb:6,  battery:84, cycles:265, grade:'Yaxshi' as const,  warranty:3, box:'Qutisiz' as const, img: IMGS.iphone_color },
      { brand:'Apple', model:'iPhone 13',          color:'Midnight',          storage_gb:128, condition:'used', price_uzs: 5_800_000, ram_gb:4,  battery:86, cycles:214, grade:'Ideal' as const,   warranty:3, box:'Qutisiz' as const, img: IMGS.iphone_black  },
      { brand:'Apple', model:'iPhone 12',          color:'Purple',            storage_gb:128, condition:'used', price_uzs: 4_500_000, ram_gb:4,  battery:82, cycles:298, grade:'Yaxshi' as const,  warranty:2, box:'Qutisiz' as const, img: IMGS.iphone_color },
      { brand:'Apple', model:'iPhone SE',          color:'Starlight',         storage_gb:128, condition:'used', price_uzs: 2_800_000, ram_gb:4,  battery:79, cycles:341, grade:"O'rtacha" as const, warranty:1, box:'Qutisiz' as const, img: IMGS.iphone_silver},
    ],
  },

  // ── 2. Samsung Center ── Samsung mutaxassisi ────────────────────────────────
  {
    seller:  { full_name: 'Bobur Rahimov',    phone: '+998902223344' },
    shop: {
      name:             'Samsung Center',
      room_code:        'B-07',
      description:      'Samsung smartfonlarining rasmiy dilerlik do\'koni.\nGalaxy S seriyasi, A seriyasi, Z Fold va Z Flip — barchasi original.\n\n📍 2-qavat, B-07 xona\n🕘 09:00–19:00 (Dush–Shan)\n🔵 Samsung One UI demo ishlash imkoni mavjud',
      phone:            '+998917979113',
      telegram_username:'samsung_center_mbs',
      banner_url:       BANNERS.samsung,
      avatar_url:       IMG('1574755393849-623942496936', 200, 200),
    },
    products: [
      { brand:'Samsung', model:'Galaxy S25 Ultra',  color:'Titanium Black',  storage_gb:512, condition:'new',  price_uzs:23_500_000, ram_gb:12, chip:'Snapdragon 8 Elite', box:'Fullbox' as const, img: IMGS.samsung_black  },
      { brand:'Samsung', model:'Galaxy S25+',       color:'Icy Blue',        storage_gb:256, condition:'new',  price_uzs:16_500_000, ram_gb:12, chip:'Snapdragon 8 Elite', box:'Fullbox' as const, img: IMGS.samsung_blue   },
      { brand:'Samsung', model:'Galaxy S25',        color:'Navy',            storage_gb:256, condition:'new',  price_uzs:13_500_000, ram_gb:12, chip:'Snapdragon 8 Elite', box:'Fullbox' as const, img: IMGS.samsung_black  },
      { brand:'Samsung', model:'Galaxy Z Flip 6',   color:'Crafted Black',   storage_gb:256, condition:'new',  price_uzs:17_500_000, ram_gb:12, chip:'Snapdragon 8 Gen 3', box:'Fullbox' as const, img: IMGS.samsung_blue   },
      { brand:'Samsung', model:'Galaxy S24',        color:'Cobalt Violet',   storage_gb:128, condition:'new',  price_uzs:11_500_000, ram_gb:8,  chip:'Exynos 2400',        box:'Fullbox' as const, img: IMGS.samsung_black  },
      { brand:'Samsung', model:'Galaxy S24 FE',     color:'Blue',            storage_gb:128, condition:'new',  price_uzs: 8_200_000, ram_gb:8,  chip:'Exynos 2500',        box:'Fullbox' as const, img: IMGS.samsung_blue   },
      { brand:'Samsung', model:'Galaxy A55 5G',     color:'Iceblue',         storage_gb:256, condition:'new',  price_uzs: 5_500_000, ram_gb:8,  chip:'Exynos 1480',        box:'Fullbox' as const, img: IMGS.samsung_blue   },
      { brand:'Samsung', model:'Galaxy A35 5G',     color:'Navy',            storage_gb:256, condition:'new',  price_uzs: 4_200_000, ram_gb:8,  chip:'Exynos 1380',        box:'Fullbox' as const, img: IMGS.samsung_black  },
      { brand:'Samsung', model:'Galaxy A25 5G',     color:'Yellow',          storage_gb:256, condition:'new',  price_uzs: 3_200_000, ram_gb:8,  chip:'Exynos 1280',        box:'Fullbox' as const, img: IMGS.samsung_blue   },
      { brand:'Samsung', model:'Galaxy S24 Ultra',  color:'Titanium Gray',   storage_gb:256, condition:'used', price_uzs:15_500_000, ram_gb:12, battery:91, cycles:0,   grade:'Ideal' as const,   warranty:4, box:'Fullbox' as const, img: IMGS.samsung_black },
    ],
  },

  // ── 3. MobiMax ── Aralash brendlar ─────────────────────────────────────────
  {
    seller:  { full_name: 'Dilnoza Yusupova',  phone: '+998903334455' },
    shop: {
      name:             'MobiMax',
      room_code:        'C-15',
      description:      'Apple, Samsung, Xiaomi — barcha yetakchi brendlar bir joyda.\nHar qanday byudjetga mos telefon topasiz.\n\n📍 3-qavat, C-15 xona\n🕘 09:30–19:00 (Dush–Jum)\n💳 Muddatli to\'lov: 6, 12, 24 oyga',
      phone:            '+998901234567',
      telegram_username:'mobimax_malika',
      banner_url:       BANNERS.phones,
      avatar_url:       IMG('1556656793-8538c3b7db58', 200, 200),
    },
    products: [
      { brand:'Apple',   model:'iPhone 15 Pro Max',  color:'Natural Titanium', storage_gb:256, condition:'new',  price_uzs:18_500_000, ram_gb:8,  chip:'A17 Pro',          box:'Fullbox' as const, img: IMGS.iphone_silver  },
      { brand:'Samsung', model:'Galaxy S25',         color:'Icy Blue',         storage_gb:256, condition:'new',  price_uzs:13_500_000, ram_gb:12, chip:'Snapdragon 8 Elite',box:'Fullbox' as const, img: IMGS.samsung_blue   },
      { brand:'Xiaomi',  model:'14 Ultra',           color:'Black',            storage_gb:512, condition:'new',  price_uzs:16_500_000, ram_gb:16, chip:'Snapdragon 8 Gen 3',box:'Fullbox' as const, img: IMGS.xiaomi_black   },
      { brand:'Apple',   model:'iPhone 14',          color:'Midnight',         storage_gb:128, condition:'used', price_uzs: 6_800_000, ram_gb:6,  battery:87, cycles:198, grade:'Yaxshi' as const,  warranty:3, box:'Qutisiz' as const, img: IMGS.iphone_black  },
      { brand:'Samsung', model:'Galaxy S23 Ultra',   color:'Phantom Black',    storage_gb:256, condition:'used', price_uzs:12_500_000, ram_gb:12, battery:88, cycles:0,   grade:'Ideal' as const,   warranty:3, box:'Fullbox' as const, img: IMGS.samsung_black },
      { brand:'Redmi',   model:'Note 14 Pro',        color:'Black',            storage_gb:256, condition:'new',  price_uzs: 4_800_000, ram_gb:12, chip:'Dimensity 7300',    box:'Fullbox' as const, img: IMGS.phone_generic  },
      { brand:'Apple',   model:'iPhone 13',          color:'Pink',             storage_gb:128, condition:'used', price_uzs: 5_800_000, ram_gb:4,  battery:83, cycles:245, grade:'Yaxshi' as const,  warranty:2, box:'Qutisiz' as const, img: IMGS.iphone_color  },
      { brand:'Samsung', model:'Galaxy A55 5G',      color:'Iceblue',          storage_gb:128, condition:'new',  price_uzs: 5_200_000, ram_gb:8,  chip:'Exynos 1480',       box:'Fullbox' as const, img: IMGS.samsung_blue   },
      { brand:'Xiaomi',  model:'13T',                color:'Black',            storage_gb:256, condition:'new',  price_uzs: 7_500_000, ram_gb:12, chip:'Dimensity 8200',    box:'Fullbox' as const, img: IMGS.xiaomi_black   },
      { brand:'Redmi',   model:'Note 13',            color:'Arctic White',     storage_gb:128, condition:'new',  price_uzs: 3_200_000, ram_gb:8,  chip:'Snapdragon 685',    box:'Fullbox' as const, img: IMGS.phone_flat     },
    ],
  },

  // ── 4. iStore Pro ── Apple yangi + ishlatilgan ──────────────────────────────
  {
    seller:  { full_name: 'Eldor Nazarov',     phone: '+998904445566' },
    shop: {
      name:             'iStore Pro',
      room_code:        'A-05',
      description:      'Apple mahsulotlarining professional do\'koni.\nYangi va ishlatilgan iPhonelar — barchasi original va kafolatlangan.\nBepul diagnostika xizmati mavjud.\n\n📍 2-qavat, A-05 xona\n🕘 09:00–18:30',
      phone:            '+998905556677',
      telegram_username:'istore_pro_mb',
      banner_url:       BANNERS.apple,
      avatar_url:       IMG('1695048133142-1a20484d2569', 200, 200),
    },
    products: [
      { brand:'Apple', model:'iPhone 16 Pro Max',  color:'Black Titanium',    storage_gb:512, condition:'new',  price_uzs:23_500_000, ram_gb:8,  chip:'A18 Pro', box:'Fullbox' as const, img: IMGS.iphone_black  },
      { brand:'Apple', model:'iPhone 16 Pro',      color:'White Titanium',    storage_gb:128, condition:'new',  price_uzs:16_800_000, ram_gb:8,  chip:'A18 Pro', box:'Fullbox' as const, img: IMGS.iphone_silver },
      { brand:'Apple', model:'iPhone 16 Plus',     color:'Teal',              storage_gb:256, condition:'new',  price_uzs:15_500_000, ram_gb:8,  chip:'A18',     box:'Fullbox' as const, img: IMGS.iphone_color  },
      { brand:'Apple', model:'iPhone 15 Pro Max',  color:'Black Titanium',    storage_gb:256, condition:'used', price_uzs:17_500_000, ram_gb:8,  battery:93, cycles:89,  grade:'Ideal' as const,   warranty:6, box:'Fullbox' as const, img: IMGS.iphone_black  },
      { brand:'Apple', model:'iPhone 15',          color:'Green',             storage_gb:256, condition:'new',  price_uzs:11_500_000, ram_gb:6,  chip:'A16', box:'Fullbox' as const,   img: IMGS.iphone_color  },
      { brand:'Apple', model:'iPhone 14 Pro Max',  color:'Gold',              storage_gb:256, condition:'used', price_uzs:14_500_000, ram_gb:6,  battery:89, cycles:187, grade:'Ideal' as const,   warranty:4, box:'Fullbox' as const, img: IMGS.iphone_gold   },
      { brand:'Apple', model:'iPhone 14 Pro',      color:'Silver',            storage_gb:128, condition:'used', price_uzs:11_500_000, ram_gb:6,  battery:85, cycles:231, grade:'Yaxshi' as const,  warranty:3, box:'Qutisiz' as const, img: IMGS.iphone_silver },
      { brand:'Apple', model:'iPhone 13 Pro Max',  color:'Gold',              storage_gb:256, condition:'used', price_uzs: 9_800_000, ram_gb:6,  battery:82, cycles:301, grade:'Yaxshi' as const,  warranty:3, box:'Qutisiz' as const, img: IMGS.iphone_gold   },
      { brand:'Apple', model:'iPhone 13 Pro',      color:'Sierra Blue',       storage_gb:128, condition:'used', price_uzs: 8_500_000, ram_gb:6,  battery:88, cycles:195, grade:'Ideal' as const,   warranty:3, box:'Qutisiz' as const, img: IMGS.iphone_color  },
      { brand:'Apple', model:'iPhone 12 Pro',      color:'Pacific Blue',      storage_gb:128, condition:'used', price_uzs: 5_800_000, ram_gb:6,  battery:80, cycles:378, grade:"O'rtacha" as const, warranty:2, box:'Qutisiz' as const, img: IMGS.iphone_color  },
    ],
  },

  // ── 5. Galaxy Hub ── Samsung + Xiaomi ──────────────────────────────────────
  {
    seller:  { full_name: 'Farida Tosheva',    phone: '+998906667788' },
    shop: {
      name:             'Galaxy Hub',
      room_code:        'D-22',
      description:      'Samsung va Xiaomi smartfonlari — yangi avlod flagmanlardan byudjet modellarigacha.\n5G tarmoq qo\'llab-quvvatlovchi barcha modellar mavjud.\n\n📍 1-qavat, D-22 xona\n🕘 09:00–19:00 (Dush–Shan)',
      phone:            '+998907778899',
      telegram_username:'galaxyhub_malika',
      banner_url:       BANNERS.samsung,
      avatar_url:       IMG('1611532736597-de2d4265fba3', 200, 200),
    },
    products: [
      { brand:'Samsung', model:'Galaxy S25 Ultra',   color:'Titanium Black',   storage_gb:256, condition:'new',  price_uzs:22_500_000, ram_gb:12, chip:'Snapdragon 8 Elite', box:'Fullbox' as const, img: IMGS.samsung_black  },
      { brand:'Samsung', model:'Galaxy Z Fold 6',    color:'Crafted Black',    storage_gb:512, condition:'new',  price_uzs:35_000_000, ram_gb:12, chip:'Snapdragon 8 Gen 3', box:'Fullbox' as const, img: IMGS.samsung_black  },
      { brand:'Samsung', model:'Galaxy S24+',        color:'Cobalt Violet',    storage_gb:256, condition:'new',  price_uzs:15_500_000, ram_gb:12, chip:'Snapdragon 8 Gen 3', box:'Fullbox' as const, img: IMGS.samsung_blue   },
      { brand:'Xiaomi',  model:'14T Pro',            color:'Titan Black',      storage_gb:512, condition:'new',  price_uzs:12_500_000, ram_gb:12, chip:'Dimensity 9300+',    box:'Fullbox' as const, img: IMGS.xiaomi_black   },
      { brand:'Samsung', model:'Galaxy S23',         color:'Phantom Black',    storage_gb:256, condition:'used', price_uzs: 9_500_000, ram_gb:8,  battery:90, cycles:0,   grade:'Ideal' as const,   warranty:3, box:'Qutisiz' as const, img: IMGS.samsung_black },
      { brand:'Xiaomi',  model:'14',                 color:'Black',            storage_gb:256, condition:'new',  price_uzs:12_500_000, ram_gb:12, chip:'Snapdragon 8 Gen 3', box:'Fullbox' as const, img: IMGS.xiaomi_black   },
      { brand:'Samsung', model:'Galaxy A55 5G',      color:'Iceblue',          storage_gb:128, condition:'new',  price_uzs: 5_200_000, ram_gb:8,  chip:'Exynos 1480',        box:'Fullbox' as const, img: IMGS.samsung_blue   },
      { brand:'Xiaomi',  model:'13T Pro',            color:'Black',            storage_gb:256, condition:'used', price_uzs: 7_500_000, ram_gb:12, battery:88, cycles:0,   grade:'Ideal' as const,   warranty:3, box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'Samsung', model:'Galaxy A35 5G',      color:'Lilac',            storage_gb:128, condition:'new',  price_uzs: 3_800_000, ram_gb:8,  chip:'Exynos 1380',        box:'Fullbox' as const, img: IMGS.samsung_blue   },
      { brand:'Redmi',   model:'Note 14 Pro',        color:'Phantom Purple',   storage_gb:256, condition:'new',  price_uzs: 4_800_000, ram_gb:12, chip:'Dimensity 7300',     box:'Fullbox' as const, img: IMGS.phone_generic  },
    ],
  },

  // ── 6. SmartWorld ── Xiaomi + Redmi ─────────────────────────────────────────
  {
    seller:  { full_name: 'Gulsanam Mirzaeva', phone: '+998908889900' },
    shop: {
      name:             'SmartWorld',
      room_code:        'B-14',
      description:      'Xiaomi va Redmi smartfonlarining asosiy distribyutori.\nEng past narxda original Xiaomi mahsulotlari.\nMIUI/HyperOS sozlash xizmati mavjud.\n\n📍 2-qavat, B-14 xona\n🕘 09:30–18:30',
      phone:            '+998901234568',
      telegram_username:'smartworld_mb',
      banner_url:       BANNERS.xiaomi,
      avatar_url:       IMG('1546054454-aa26e2b734c7', 200, 200),
    },
    products: [
      { brand:'Xiaomi', model:'14 Ultra',         color:'White',         storage_gb:512, condition:'new', price_uzs:16_500_000, ram_gb:16, chip:'Snapdragon 8 Gen 3', box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'Xiaomi', model:'14T Pro',          color:'Titan Gray',    storage_gb:512, condition:'new', price_uzs:12_500_000, ram_gb:12, chip:'Dimensity 9300+',    box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'Xiaomi', model:'14',               color:'White',         storage_gb:256, condition:'new', price_uzs:12_500_000, ram_gb:12, chip:'Snapdragon 8 Gen 3', box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'Xiaomi', model:'13T Pro',          color:'Alpine Blue',   storage_gb:256, condition:'new', price_uzs: 9_500_000, ram_gb:12, chip:'Dimensity 9200+',    box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'Redmi',  model:'Note 14 Pro+',     color:'Black',         storage_gb:256, condition:'new', price_uzs: 5_800_000, ram_gb:12, chip:'Dimensity 9200',     box:'Fullbox' as const, img: IMGS.phone_generic },
      { brand:'Redmi',  model:'Note 14 Pro',      color:'Aurora Purple', storage_gb:256, condition:'new', price_uzs: 4_800_000, ram_gb:12, chip:'Dimensity 7300',     box:'Fullbox' as const, img: IMGS.phone_generic },
      { brand:'Redmi',  model:'Note 13 Pro',      color:'Forest Green',  storage_gb:256, condition:'new', price_uzs: 4_200_000, ram_gb:12, chip:'Dimensity 7200',     box:'Fullbox' as const, img: IMGS.phone_flat    },
      { brand:'Redmi',  model:'Note 13',          color:'Arctic White',  storage_gb:256, condition:'new', price_uzs: 3_500_000, ram_gb:8,  chip:'Snapdragon 685',     box:'Fullbox' as const, img: IMGS.phone_flat    },
      { brand:'Poco',   model:'X6 Pro',           color:'Black',         storage_gb:256, condition:'new', price_uzs: 6_500_000, ram_gb:12, chip:'Dimensity 8300',     box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'Redmi',  model:'13C',              color:'Starlight Black',storage_gb:128, condition:'new', price_uzs: 2_200_000, ram_gb:8,  chip:'Helio G85',          box:'Fullbox' as const, img: IMGS.phone_flat    },
    ],
  },

  // ── 7. PhoneMart ── Aralash ─────────────────────────────────────────────────
  {
    seller:  { full_name: 'Husan Qodirov',     phone: '+998901234569' },
    shop: {
      name:             'PhoneMart',
      room_code:        'C-08',
      description:      'Har qanday smartfon — eng qulay narxda.\nYangi va ishlatilgan telefonlar, aksessuarlar.\nSotib olishdan oldin 30 daqiqa sinab ko\'rish imkoni.\n\n📍 3-qavat, C-08 xona\n🕘 09:00–19:00',
      phone:            '+998909876543',
      telegram_username:'phonemart_malika',
      banner_url:       BANNERS.mixed,
      avatar_url:       IMG('1601784551446-20c9e07cdbdb', 200, 200),
    },
    products: [
      { brand:'Apple',   model:'iPhone 16',       color:'Black',        storage_gb:128, condition:'new',  price_uzs:13_200_000, ram_gb:8,  chip:'A18',            box:'Fullbox' as const, img: IMGS.iphone_black  },
      { brand:'Samsung', model:'Galaxy S25',      color:'Silver Shadow',storage_gb:128, condition:'new',  price_uzs:12_500_000, ram_gb:12, chip:'Snapdragon 8 Elite',box:'Fullbox' as const, img: IMGS.samsung_black },
      { brand:'Xiaomi',  model:'14T',             color:'Black',        storage_gb:256, condition:'new',  price_uzs: 8_500_000, ram_gb:12, chip:'Dimensity 8300',  box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'Apple',   model:'iPhone 15',       color:'Yellow',       storage_gb:128, condition:'used', price_uzs: 9_200_000, ram_gb:6,  battery:91, cycles:95,  grade:'Ideal' as const,   warranty:4, box:'Fullbox' as const, img: IMGS.iphone_color  },
      { brand:'Samsung', model:'Galaxy S24 FE',   color:'Blue',         storage_gb:256, condition:'new',  price_uzs: 9_200_000, ram_gb:8,  chip:'Exynos 2500',     box:'Fullbox' as const, img: IMGS.samsung_blue  },
      { brand:'Redmi',   model:'Note 14 Pro',     color:'Black',        storage_gb:128, condition:'new',  price_uzs: 4_500_000, ram_gb:8,  chip:'Dimensity 7300',  box:'Fullbox' as const, img: IMGS.phone_generic },
      { brand:'Apple',   model:'iPhone 13',       color:'Blue',         storage_gb:128, condition:'used', price_uzs: 5_800_000, ram_gb:4,  battery:85, cycles:230, grade:'Yaxshi' as const,  warranty:2, box:'Qutisiz' as const, img: IMGS.iphone_color  },
      { brand:'Samsung', model:'Galaxy A55 5G',   color:'Navy',         storage_gb:256, condition:'new',  price_uzs: 5_500_000, ram_gb:8,  chip:'Exynos 1480',     box:'Fullbox' as const, img: IMGS.samsung_black },
      { brand:'Poco',    model:'F6 Pro',          color:'Black',        storage_gb:256, condition:'new',  price_uzs: 9_800_000, ram_gb:12, chip:'Snapdragon 8 Gen 2',box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'Realme',  model:'12 Pro',          color:'Submarine Blue',storage_gb:256, condition:'new', price_uzs: 4_800_000, ram_gb:8,  chip:'Snapdragon 6 Gen 1',box:'Fullbox' as const, img: IMGS.phone_flat    },
    ],
  },

  // ── 8. TechShop ── Apple + Samsung flagmanlar ───────────────────────────────
  {
    seller:  { full_name: 'Iroda Sultonova',   phone: '+998905551234' },
    shop: {
      name:             'TechShop',
      room_code:        'A-18',
      description:      'Apple va Samsung flagmanlari — premium savdo nuqtasi.\nFaqat yangi yoki ideal holatdagi telefonlar.\nHar bir telefonga 2D/3D shisha va chexol sovg\'a.\n\n📍 2-qavat, A-18 xona\n🕘 09:00–19:00 (Dush–Shan)',
      phone:            '+998995551234',
      telegram_username:'techshop_malika',
      banner_url:       BANNERS.phones,
      avatar_url:       IMG('1510557880182-3d4d3cba35a5', 200, 200),
    },
    products: [
      { brand:'Apple',   model:'iPhone 16 Pro Max',  color:'Desert Titanium',  storage_gb:256, condition:'new',  price_uzs:19_500_000, ram_gb:8,  chip:'A18 Pro', box:'Fullbox' as const, img: IMGS.iphone_gold    },
      { brand:'Apple',   model:'iPhone 16 Pro',      color:'Black Titanium',   storage_gb:256, condition:'new',  price_uzs:17_200_000, ram_gb:8,  chip:'A18 Pro', box:'Fullbox' as const, img: IMGS.iphone_black   },
      { brand:'Samsung', model:'Galaxy S25 Ultra',   color:'Titanium Black',   storage_gb:512, condition:'new',  price_uzs:23_500_000, ram_gb:12, chip:'Snapdragon 8 Elite', box:'Fullbox' as const, img: IMGS.samsung_black },
      { brand:'Apple',   model:'iPhone 15 Pro',      color:'White Titanium',   storage_gb:128, condition:'new',  price_uzs:14_500_000, ram_gb:8,  chip:'A17 Pro', box:'Fullbox' as const, img: IMGS.iphone_silver  },
      { brand:'Samsung', model:'Galaxy S25',         color:'Icy Blue',         storage_gb:256, condition:'new',  price_uzs:13_500_000, ram_gb:12, chip:'Snapdragon 8 Elite', box:'Fullbox' as const, img: IMGS.samsung_blue  },
      { brand:'Apple',   model:'iPhone 14 Pro Max',  color:'Space Black',      storage_gb:512, condition:'used', price_uzs:16_500_000, ram_gb:6,  battery:92, cycles:112, grade:'Ideal' as const,   warranty:5, box:'Fullbox' as const, img: IMGS.iphone_black  },
      { brand:'Samsung', model:'Galaxy S24 Ultra',   color:'Titanium Black',   storage_gb:512, condition:'used', price_uzs:14_500_000, ram_gb:12, battery:90, cycles:0,   grade:'Yaxshi' as const,  warranty:4, box:'Fullbox' as const, img: IMGS.samsung_black },
      { brand:'Apple',   model:'iPhone 14',          color:'Starlight',        storage_gb:128, condition:'used', price_uzs: 7_800_000, ram_gb:6,  battery:88, cycles:176, grade:'Ideal' as const,   warranty:3, box:'Qutisiz' as const, img: IMGS.iphone_silver },
      { brand:'Samsung', model:'Galaxy S23 Ultra',   color:'Green',            storage_gb:256, condition:'used', price_uzs:10_500_000, ram_gb:12, battery:87, cycles:0,   grade:'Yaxshi' as const,  warranty:3, box:'Qutisiz' as const, img: IMGS.samsung_black },
      { brand:'Apple',   model:'iPhone 13 mini',     color:'Green',            storage_gb:256, condition:'used', price_uzs: 5_500_000, ram_gb:4,  battery:84, cycles:267, grade:'Yaxshi' as const,  warranty:2, box:'Qutisiz' as const, img: IMGS.iphone_color  },
    ],
  },

  // ── 9. MegaMobile ── Ishlatilgan telefonlar mutaxassisi ─────────────────────
  {
    seller:  { full_name: 'Jasur Razzaqov',    phone: '+998901239999' },
    shop: {
      name:             'MegaMobile',
      room_code:        'D-03',
      description:      'Ishlatilgan telefonlar ixtisoslashuvi.\nHar bir telefon 50+ nuqta bo\'yicha tekshiriladi.\nBatareya holati, IMEI va barcha funksiyalar garantiyasi.\n\n📍 1-qavat, D-03 xona\n🕘 09:30–18:00\n🔧 Diagnostika bepul',
      phone:            '+998901239999',
      telegram_username:'megamobile_mb',
      banner_url:       BANNERS.mixed,
      avatar_url:       IMG('1584824486509-112e4181ff6b', 200, 200),
    },
    products: [
      { brand:'Apple',   model:'iPhone 14 Pro',     color:'Gold',           storage_gb:256, condition:'used', price_uzs:11_500_000, ram_gb:6,  battery:91, cycles:134, grade:'Ideal' as const,   warranty:4, box:'Fullbox' as const, img: IMGS.iphone_gold   },
      { brand:'Samsung', model:'Galaxy S24',        color:'Marble Gray',    storage_gb:256, condition:'used', price_uzs: 9_500_000, ram_gb:8,  battery:89, cycles:0,   grade:'Ideal' as const,   warranty:3, box:'Qutisiz' as const, img: IMGS.samsung_black },
      { brand:'Apple',   model:'iPhone 13 Pro Max', color:'Sierra Blue',    storage_gb:256, condition:'used', price_uzs:10_500_000, ram_gb:6,  battery:85, cycles:278, grade:'Ideal' as const,   warranty:3, box:'Qutisiz' as const, img: IMGS.iphone_color  },
      { brand:'Samsung', model:'Galaxy S23',        color:'Phantom Black',  storage_gb:128, condition:'used', price_uzs: 7_500_000, ram_gb:8,  battery:87, cycles:0,   grade:'Yaxshi' as const,  warranty:3, box:'Qutisiz' as const, img: IMGS.samsung_black },
      { brand:'Apple',   model:'iPhone 13',         color:'Product Red',    storage_gb:128, condition:'used', price_uzs: 5_800_000, ram_gb:4,  battery:82, cycles:289, grade:'Yaxshi' as const,  warranty:2, box:'Qutisiz' as const, img: IMGS.iphone_color  },
      { brand:'Apple',   model:'iPhone 12 Pro Max', color:'Pacific Blue',   storage_gb:256, condition:'used', price_uzs: 6_500_000, ram_gb:6,  battery:80, cycles:342, grade:'Yaxshi' as const,  warranty:2, box:'Qutisiz' as const, img: IMGS.iphone_color  },
      { brand:'Samsung', model:'Galaxy S22 Ultra',  color:'Phantom Black',  storage_gb:256, condition:'used', price_uzs: 8_500_000, ram_gb:12, battery:84, cycles:0,   grade:'Yaxshi' as const,  warranty:3, box:'Qutisiz' as const, img: IMGS.samsung_black },
      { brand:'Apple',   model:'iPhone 12',         color:'White',          storage_gb: 64, condition:'used', price_uzs: 3_800_000, ram_gb:4,  battery:78, cycles:401, grade:"O'rtacha" as const, warranty:1, box:'Qutisiz' as const, img: IMGS.iphone_silver },
      { brand:'Samsung', model:'Galaxy A53 5G',     color:'Awesome Blue',   storage_gb:256, condition:'used', price_uzs: 3_500_000, ram_gb:8,  battery:85, cycles:0,   grade:'Yaxshi' as const,  warranty:2, box:'Qutisiz' as const, img: IMGS.samsung_blue  },
      { brand:'Apple',   model:'iPhone 11 Pro',     color:'Midnight Green', storage_gb:256, condition:'used', price_uzs: 4_200_000, ram_gb:6,  battery:77, cycles:456, grade:"O'rtacha" as const, warranty:1, box:'Qutisiz' as const, img: IMGS.iphone_color  },
    ],
  },

  // ── 10. Digital Zone ── Xiaomi + Poco + Realme ──────────────────────────────
  {
    seller:  { full_name: 'Kamola Umarova',    phone: '+998901230000' },
    shop: {
      name:             'Digital Zone',
      room_code:        'B-21',
      description:      'Xiaomi, Poco, Realme, OnePlus — yangi avlod smartfonlari.\nEng past narxda eng yuqori ishlash quvvati.\nO\'yin va multimedia uchun ideal telefonlar.\n\n📍 2-qavat, B-21 xona\n🕘 09:00–19:30',
      phone:            '+998901230000',
      telegram_username:'digitalzone_mb',
      banner_url:       BANNERS.xiaomi,
      avatar_url:       IMG('1546054454-aa26e2b734c7', 200, 200),
    },
    products: [
      { brand:'Xiaomi',  model:'14 Ultra',      color:'Black',              storage_gb:256, condition:'new',  price_uzs:16_500_000, ram_gb:16, chip:'Snapdragon 8 Gen 3', box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'Poco',    model:'F6 Pro',        color:'Black',              storage_gb:512, condition:'new',  price_uzs:11_800_000, ram_gb:16, chip:'Snapdragon 8 Gen 2', box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'OnePlus', model:'13',            color:'Black',              storage_gb:512, condition:'new',  price_uzs:14_500_000, ram_gb:16, chip:'Snapdragon 8 Elite', box:'Fullbox' as const, img: IMGS.phone_generic },
      { brand:'Realme',  model:'GT 6',          color:'Fluid Silver',       storage_gb:256, condition:'new',  price_uzs: 7_200_000, ram_gb:12, chip:'Snapdragon 8s Gen 3',box:'Fullbox' as const, img: IMGS.phone_flat    },
      { brand:'Xiaomi',  model:'13T',           color:'Alpine Blue',        storage_gb:256, condition:'used', price_uzs: 7_200_000, ram_gb:12, battery:92, cycles:0,   grade:'Ideal' as const,   warranty:3, box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'Poco',    model:'X6 5G',         color:'Blue',               storage_gb:256, condition:'new',  price_uzs: 5_800_000, ram_gb:8,  chip:'Snapdragon 7s Gen 2',box:'Fullbox' as const, img: IMGS.xiaomi_black  },
      { brand:'Realme',  model:'12 Pro+',       color:'Navigator Beige',    storage_gb:512, condition:'new',  price_uzs: 5_800_000, ram_gb:12, chip:'Snapdragon 7s Gen 2',box:'Fullbox' as const, img: IMGS.phone_flat    },
      { brand:'Honor',   model:'200 Pro',       color:'Black',              storage_gb:512, condition:'new',  price_uzs: 8_500_000, ram_gb:12, chip:'Snapdragon 8s Gen 3',box:'Fullbox' as const, img: IMGS.phone_generic },
      { brand:'Redmi',   model:'Note 14 Pro+',  color:'Black',              storage_gb:512, condition:'new',  price_uzs: 6_500_000, ram_gb:12, chip:'Dimensity 9200',     box:'Fullbox' as const, img: IMGS.phone_generic },
      { brand:'Huawei',  model:'Nova 12 Pro',   color:'Black',              storage_gb:256, condition:'new',  price_uzs: 7_500_000, ram_gb:12, chip:'Kirin 8000',         box:'Fullbox' as const, img: IMGS.phone_flat    },
    ],
  },
]

// ─── Main seed function ────────────────────────────────────────────────────────
async function seed() {
  console.log('🚀 Seed boshlandi...\n')

  for (const entry of SHOPS_DATA) {
    console.log(`\n📦 ${entry.shop.name} (${entry.seller.full_name})`)

    // 1. Seller yaratish + bo'sh shop
    const { data: sellerId, error: sellerErr } = await supabase.rpc('fn_create_seller', {
      p_full_name: entry.seller.full_name,
      p_phone:     entry.seller.phone,
    })
    if (sellerErr) {
      console.error(`  ❌ Seller yaratishda xato: ${sellerErr.message}`)
      continue
    }
    console.log(`  ✅ Seller yaratildi: ${sellerId}`)

    // 2. Shop ID ni olish
    const { data: shopRow } = await supabase
      .from('shops')
      .select('id')
      .eq('seller_id', sellerId)
      .single()

    if (!shopRow) {
      console.error('  ❌ Shop topilmadi')
      continue
    }
    const shopId = shopRow.id

    // 3. Shop slug yaratish
    const { data: shopSlug } = await supabase.rpc('fn_shop_slug', {
      p_name: entry.shop.name,
    })

    // 4. Shop ma'lumotlarini yangilash
    const { error: shopErr } = await supabase
      .from('shops')
      .update({
        name:             entry.shop.name,
        slug:             shopSlug ?? entry.shop.name.toLowerCase().replace(/\s+/g, '-'),
        room_code:        entry.shop.room_code,
        description:      entry.shop.description,
        phone:            entry.shop.phone,
        telegram_username:entry.shop.telegram_username,
        banner_url:       entry.shop.banner_url,
        avatar_url:       entry.shop.avatar_url,
        is_active:        true,
      })
      .eq('id', shopId)

    if (shopErr) {
      console.error(`  ❌ Shop yangilashda xato: ${shopErr.message}`)
      continue
    }
    console.log(`  🏪 Shop yangilandi: /${shopSlug}`)

    // 5. Mahsulotlar
    for (const p of entry.products) {
      const isNew = p.condition === 'new'

      // Description build
      const description = isNew
        ? descNew({
            color:   p.color,
            storage: p.storage_gb,
            ram:     p.ram_gb,
            chip:    (p as any).chip,
            box:     p.box,
            room:    entry.shop.room_code,
          })
        : descUsed({
            color:    p.color,
            storage:  p.storage_gb,
            ram:      p.ram_gb,
            battery:  (p as any).battery,
            cycles:   (p as any).cycles || undefined,
            box:      p.box,
            grade:    (p as any).grade,
            warranty: (p as any).warranty,
            room:     entry.shop.room_code,
          })

      // Slug yaratish
      const { data: productSlug } = await supabase.rpc('fn_product_slug', {
        p_brand:      p.brand,
        p_model:      p.model,
        p_storage_gb: p.storage_gb,
      })

      // Product insert
      const { data: product, error: prodErr } = await supabase
        .from('products')
        .insert({
          shop_id:     shopId,
          brand:       p.brand,
          model:       p.model,
          slug:        productSlug ?? `${p.brand}-${p.model}-${Date.now()}`.toLowerCase().replace(/\s+/g, '-'),
          storage_gb:  p.storage_gb,
          ram_gb:      p.ram_gb ?? null,
          color:       p.color,
          condition:   p.condition,
          price_uzs:   p.price_uzs,
          description,
          is_active:   true,
        })
        .select('id')
        .single()

      if (prodErr || !product) {
        console.error(`    ❌ ${p.brand} ${p.model}: ${prodErr?.message}`)
        continue
      }

      // Image insert
      await supabase.from('product_images').insert({
        product_id: product.id,
        url:        p.img,
        is_primary: true,
        position:   0,
      })

      const price = new Intl.NumberFormat('uz-UZ').format(p.price_uzs)
      console.log(`    📱 ${p.brand} ${p.model} ${p.color} — ${price} UZS`)
    }
  }

  console.log('\n\n✅ Seed muvaffaqiyatli yakunlandi!')
  console.log(`📊 Jami: ${SHOPS_DATA.length} do'kon, ${SHOPS_DATA.reduce((a, s) => a + s.products.length, 0)} mahsulot`)
}

seed().catch(console.error)
