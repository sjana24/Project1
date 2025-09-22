// ✅ Product
export interface IProduct {
  product_id: number;
  provider_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string;
  specifications: string | null;
  is_approved: number;
  is_delete: number;
  created_at: string;
  updated_at: string;
  status?: 'approved' | 'rejected' | 'pending';
}

// ✅ Service
export interface IService {
  service_id: number;
  provider_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_approved: number;
  is_active: number;
  is_delete: number;
  created_at: string;
  updated_at: string;
  status?: 'active' | 'inactive' | 'approved' | 'pending';
}

// ✅ Order
export interface IOrder {
  order_id: number;
  customer_id: number;
  order_date: string;
  total_amount: number;
  delivery_charge: number;
  status: string;
  shipping_address: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  provider_total_amount?: number;
  provider_total_items?: number;
  items?: IOrderItem[];
}

export interface IOrderItem {
  item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product_name: string;
  product_images: string;
  product_category: string;
}

// ✅ Project
export interface IOngoingProject {
  project_id: number;
  request_id: number;
  project_name: string;
  status: string;
  start_date: string;
  due_date: string;
  completed_date: string | null;
  payment_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface IReview {
  review_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface IProduct {
  product_id: number;
  name: string;
  description: string;
  price: number;
  images: string; // stored path from backend
  category: string;
  specifications: string;
  is_approved: number;
  created_at: string;
  reviews?: IReview[];
}