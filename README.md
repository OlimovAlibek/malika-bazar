# Malika Bazar

MVP web application for comparing phone prices from Malika market.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (auth + database)
- Deployed on Vercel

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

3. Run development server:
```bash
npm run dev
```

## Database Schema

### SHOPS
- id
- name
<!-- - shop_number (required, unique) -->
- phone_number
- telegram_username
- created_at
- is_active

### PRODUCTS
- id
- shop_id
- brand
- model
- storage_gb
- condition (new/used)
- price_uzs (required)
- is_active
- created_at
- updated_at

### PRODUCT_IMAGES (optional)
- id
- product_id
- image_url
- order
