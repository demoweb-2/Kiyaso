export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  gallery: string[];
  ingredients: string[];
  is_popular: boolean;
  is_spicy: boolean;
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  map_url: string | null;
  latitude: string | null;
  longitude: string | null;
  opening_hours: Record<string, string>;
  delivery_available: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  category: string;
  sort_order: number;
  created_at: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  badge_text: string | null;
  is_active: boolean;
  sort_order: number;
  valid_until: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  source: string;
  avatar_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  branch_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_type: 'pickup' | 'delivery';
  address: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Reservation {
  id: string;
  branch_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  guests: number;
  date: string;
  time: string;
  special_requests: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
}

export interface Settings {
  id: string;
  restaurant_name: string;
  tagline: string;
  logo_url: string | null;
  primary_color: string;
  phone: string;
  email: string;
  address: string;
  social_links: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    whatsapp: string;
  };
  opening_hours: Record<string, string>;
  delivery_fee: number;
  delivery_min_order: number;
  delivery_est_time: string;
  seo_title: string;
  seo_description: string;
}

export interface CateringInquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  event_type: string | null;
  event_date: string | null;
  guest_count: number | null;
  message: string | null;
  status: string;
  created_at: string;
}

export interface CareerApplication {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  position: string;
  message: string | null;
  resume_url: string | null;
  status: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}
