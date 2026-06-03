# Tezku — Malika bozor telefon narxlari

Toshkentdagi Malika bozori telefon do'konlari uchun narx aggregatori. Xaridorlar narxlarni solishtirib ko'radi, sotuvchilar o'z do'konini va mahsulotlarini boshqaradi.

## Texnologiyalar

| Qatlam | Stack |
|--------|-------|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + PostgREST) |
| Auth | Telegram OTP (xaridorlar) · Admin panel (sotuvchilar) |
| Rasmlar | Cloudinary (WebP auto-convert) |
| Notifications | Telegram Bot API |
| PWA | Service Worker · Web App Manifest |

## Asosiy imkoniyatlar

**Xaridorlar**
- Telefon qidirish, brand va narx bo'yicha filtrlash
- Cursor-based pagination (infinite scroll)
- Sevimlilar ro'yxati
- Telegram OTP orqali kirish
- Profil tahrirlash (ism, rasm)

**Sotuvchilar**
- Do'kon sahifasi (banner, avatar, lokatsiya, tavsif)
- Mahsulot qo'shish / tahrirlash / o'chirish
- Dashboard: statistika, so'nggi faollik

**Admin**
- Sotuvchilarni boshqarish (qo'shish, bloklash, o'chirish)
- Mahsulotlar moderatsiyasi
- Do'kon ma'lumotlarini tahrirlash

**Umumiy**
- PWA — mobil va desktopda o'rnatish imkoni
- Support forma (Telegram orqali)
- Dark mode

## Loyiha tuzilmasi

```
src/
├── app/
│   ├── (public)/        # Marketplace, telefon sahifalari, profil
│   ├── (seller)/        # Sotuvchi paneli
│   ├── (admin)/         # Admin panel
│   ├── (auth)/          # Login sahifalari
│   ├── api/             # Route handlers
│   ├── manifest.ts      # PWA manifest
│   └── layout.tsx
├── actions/             # Server Actions
├── components/
│   ├── admin/
│   ├── layout/
│   ├── product/
│   ├── profile/
│   ├── seller/
│   └── support/
└── lib/
    ├── db/              # DB query funksiyalari
    ├── supabase/        # Supabase client
    ├── auth.ts
    ├── format.ts
    └── user-session.ts
```

## Local ishga tushirish

```bash
pnpm install
cp .env.example .env.local
# .env.local ni to'ldiring (quyiga qarang)
pnpm dev
```

## Environment o'zgaruvchilari

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=

# Telegram — asosiy bot (OTP auth)
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=

# Telegram — support bot
SUPPORT_BOT_TOKEN=
SUPPORT_CHAT_ID=

# Admin
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=

# App
NEXT_PUBLIC_APP_URL=https://tezku.uz
```

## Database

```bash
# Supabase SQL Editor da ishga tushiring:
schema_final.sql   # To'liq sxema (bir martalik)
```

Webhook sozlash (Telegram bot uchun):

```
/api/telegram/set-webhook   # POST — admin panelidan yoki to'g'ridan-to'g'ri
```

## Build & Deploy

```bash
pnpm build
pnpm start
```

Vercel yoki boshqa Node.js hostingga deploy qilinadi. `NEXT_PUBLIC_APP_URL` ni production URL ga o'zgartiring.
