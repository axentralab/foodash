export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  rating: number;
  review_count: number;
  prep_time: number;
  is_available: boolean;
  is_featured: boolean;
  tags: string[];
}

export interface CartItem {
  id: string;
  menu_item: MenuItem;
  quantity: number;
  subtotal: number;
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  menu_item_name: string;
  menu_item_image: string;
  quantity: number;
  price: number;
}

export interface Rider {
  name: string;
  phone: string;
  rating: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "picked_up"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  status: OrderStatus;
  total_price: number;
  delivery_fee: number;
  discount: number;
  delivery_address: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
  rider?: Rider;
}
