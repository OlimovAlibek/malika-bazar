// Database types matching Supabase schema

export type Shop = {
  id: string;
  name: string;
  shop_number: string; // required, unique
  phone_number: string | null;
  telegram_username: string | null;
  created_at: string;
  is_active: boolean;
};

export type Product = {
  id: string;
  shop_id: string;
  brand: string;
  model: string;
  storage_gb: number | null;
  condition: "new" | "used";
  price_uzs: number; // required
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  order: number;
};
