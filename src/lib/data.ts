import { supabase } from '@/lib/supabase';
import type {
  Category,
  MenuItem,
  Branch,
  GalleryItem,
  Offer,
  Testimonial,
  Order,
  Reservation,
  Settings,
  CateringInquiry,
  CareerApplication,
  ContactMessage,
} from '@/types';

// ---------- Categories ----------
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ---------- Menu Items ----------
export async function fetchMenuItems(categorySlug?: string): Promise<MenuItem[]> {
  let query = supabase
    .from('menu_items')
    .select('*, category:categories(slug)')
    .order('sort_order', { ascending: true });
  if (categorySlug && categorySlug !== 'all') {
    query = query.filter('category.slug', 'eq', categorySlug);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchPopularItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_popular', true)
    .eq('is_available', true)
    .order('sort_order', { ascending: true })
    .limit(6);
  if (error) throw error;
  return data ?? [];
}

// ---------- Branches ----------
export async function fetchBranches(): Promise<Branch[]> {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ---------- Gallery ----------
export async function fetchGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ---------- Offers ----------
export async function fetchOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ---------- Testimonials ----------
export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ---------- Settings ----------
export async function fetchSettings(): Promise<Settings | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ---------- Orders ----------
export async function createOrder(order: Partial<Order>): Promise<Order> {
  const orderNumber = `KY${Date.now().toString().slice(-8)}`;
  const { data, error } = await supabase
    .from('orders')
    .insert({ ...order, order_number: orderNumber })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, branch:branches(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

// ---------- Reservations ----------
export async function createReservation(res: Partial<Reservation>): Promise<Reservation> {
  const { data, error } = await supabase
    .from('reservations')
    .insert(res)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('*, branch:branches(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateReservationStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

// ---------- Catering ----------
export async function createCateringInquiry(inquiry: Partial<CateringInquiry>): Promise<CateringInquiry> {
  const { data, error } = await supabase
    .from('catering_inquiries')
    .insert(inquiry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------- Careers ----------
export async function createCareerApplication(app: Partial<CareerApplication>): Promise<CareerApplication> {
  const { data, error } = await supabase
    .from('career_applications')
    .insert(app)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------- Contact ----------
export async function createContactMessage(msg: Partial<ContactMessage>): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(msg)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------- Admin CRUD helpers ----------
export async function createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
  const { data, error } = await supabase.from('menu_items').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
  const { error } = await supabase.from('menu_items').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw error;
}

export async function createCategory(cat: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert(cat).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  const { error } = await supabase.from('categories').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function createBranch(branch: Partial<Branch>): Promise<Branch> {
  const { data, error } = await supabase.from('branches').insert(branch).select().single();
  if (error) throw error;
  return data;
}

export async function updateBranch(id: string, updates: Partial<Branch>): Promise<void> {
  const { error } = await supabase.from('branches').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteBranch(id: string): Promise<void> {
  const { error } = await supabase.from('branches').delete().eq('id', id);
  if (error) throw error;
}

export async function createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
  const { data, error } = await supabase.from('gallery_items').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<void> {
  const { error } = await supabase.from('gallery_items').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) throw error;
}

export async function createOffer(offer: Partial<Offer>): Promise<Offer> {
  const { data, error } = await supabase.from('offers').insert(offer).select().single();
  if (error) throw error;
  return data;
}

export async function updateOffer(id: string, updates: Partial<Offer>): Promise<void> {
  const { error } = await supabase.from('offers').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteOffer(id: string): Promise<void> {
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) throw error;
}

export async function createTestimonial(t: Partial<Testimonial>): Promise<Testimonial> {
  const { data, error } = await supabase.from('testimonials').insert(t).select().single();
  if (error) throw error;
  return data;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<void> {
  const { error } = await supabase.from('testimonials').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}

export async function updateSettings(id: string, updates: Partial<Settings>): Promise<void> {
  const { error } = await supabase.from('settings').update(updates).eq('id', id);
  if (error) throw error;
}
