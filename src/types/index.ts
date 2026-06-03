export type Role = "buyer" | "seller" | "admin";

export type User = {
  id: string;
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  phone: string | null;
  role: Role;
  created_at: string;
};

export type Room = {
  id: string;
  code: string;
  created_at: string;
};

export type Shop = {
  id: string;
  room_id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  phone_number: string | null;
  telegram_username: string | null;
  is_active: boolean;
  created_at: string;
};

export type ShopWithRoom = Shop & {
  room: { code: string };
};

export type Condition = "new" | "used";

export type Product = {
  id: string;
  shop_id: string;
  brand: string;
  model: string;
  storage_gb: number | null;
  condition: Condition;
  price_uzs: number;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
};

export type ProductCard = Pick<
  Product,
  | "id"
  | "slug"
  | "brand"
  | "model"
  | "storage_gb"
  | "condition"
  | "price_uzs"
  | "updated_at"
> & {
  shop: { name: string; slug: string; room: { code: string } };
  image_url: string | null;
};

export type SortOption = "price_asc" | "price_desc" | "newest";

export type EventType = "call" | "telegram" | "view";
