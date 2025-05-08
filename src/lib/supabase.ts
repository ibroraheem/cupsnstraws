import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;

// Types for our database tables
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerAddress {
  id: string;
  customer_id: string;
  address: string;
  city: string;
  state: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  size: string;
}

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  sizes: ProductSize[];
  created_at: string;
  updated_at: string;
};

export type ProductSize = {
  id: string;
  product_id: string;
  size: string;
  price: number;
  in_stock: boolean;
};

export type AdminUser = {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
}; 