import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, CalendarCheck, UtensilsCrossed, Building2,
  Image as ImageIcon, Tag, Star, Briefcase, Settings as SettingsIcon, BarChart3, Menu as MenuIcon, X,
  TrendingUp, Clock, Users, DollarSign, Plus, Edit2, Trash2, Search, Flame, Check, ArrowLeft,
  Facebook, Instagram, Youtube, Music, MessageCircle, LogOut, Lock,
} from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import {
  fetchOrders, updateOrderStatus, fetchReservations, updateReservationStatus,
  fetchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem,
  fetchCategories, createCategory, updateCategory, deleteCategory,
  fetchBranches, createBranch, updateBranch, deleteBranch,
  fetchGallery, createGalleryItem, deleteGalleryItem,
  fetchOffers, createOffer, updateOffer, deleteOffer,
  fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  fetchSettings, updateSettings,
} from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { useSettings } from '@/hooks/useSettings';
import ImageUpload from '@/components/ImageUpload';
import type { Order, Reservation, MenuItem, Category, Branch, GalleryItem, Offer, Testimonial, Settings as SettingsType } from '@/types';

type Tab = 'dashboard' | 'orders' | 'reservations' | 'menu' | 'categories' | 'branches' | 'gallery' | 'offers' | 'testimonials' | 'careers' | 'settings';

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'reservations', label: 'Reservations', icon: CalendarCheck },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'categories', label: 'Categories', icon: UtensilsCrossed },
  { id: 'branches', label: 'Branches', icon: Building2 },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'offers', label: 'Offers', icon: Tag },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'careers', label: 'Careers', icon: Briefcase },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

// ============ AUTH GATE ============
function AdminLogin({ onLogin }: { onLogin: (session: Session) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) onLogin(data.session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mb-3">
            <Flame className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-2xl text-white tracking-wide">KIYASO</h1>
          <p className="text-[10px] text-brand-500 font-semibold uppercase tracking-[0.2em]">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div className="flex items-center gap-2 text-charcoal-300 mb-2">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-semibold">Sign in to manage your restaurant</span>
          </div>
          <div>
            <label className="text-white text-sm font-semibold mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="text-white text-sm font-semibold mb-1 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
          </div>
          {error && <p className="text-brand-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!authReady) return <div className="min-h-screen bg-charcoal-950" />;
  if (!session) return <AdminLogin onLogin={setSession} />;

  return (
    <div className="min-h-screen bg-charcoal-950 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-charcoal-900 border-r border-white/5 overflow-y-auto transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4">
          <div className="flex items-center gap-2 px-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg text-white tracking-wide">KIYASO</span>
              <span className="text-[9px] text-brand-500 font-semibold uppercase tracking-[0.2em]">Admin Panel</span>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-brand-600 text-white' : 'text-charcoal-300 hover:bg-white/5 hover:text-white'}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Admin Header */}
        <header className="sticky top-0 z-20 bg-charcoal-900/95 backdrop-blur-lg border-b border-white/5 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
              <MenuIcon className="w-5 h-5 text-white" />
            </button>
            <h1 className="font-display text-lg text-white">{tabs.find(t => t.id === activeTab)?.label}</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-charcoal-300 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> View Site
            </a>
            <button onClick={handleLogout} className="flex items-center gap-2 text-charcoal-300 hover:text-white text-sm transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
              {activeTab === 'orders' && <Orders />}
              {activeTab === 'reservations' && <Reservations />}
              {activeTab === 'menu' && <MenuManagement />}
              {activeTab === 'categories' && <CategoryManagement />}
              {activeTab === 'branches' && <BranchManagement />}
              {activeTab === 'gallery' && <GalleryManagement />}
              {activeTab === 'offers' && <OfferManagement />}
              {activeTab === 'testimonials' && <TestimonialManagement />}
              {activeTab === 'careers' && <CareersManagement />}
              {activeTab === 'settings' && <SettingsManagement />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ============ DASHBOARD ============
function Dashboard({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const { data: orders, loading: ordersLoading } = useRealtimeTable<Order>('orders', fetchOrders);
  const { data: reservations, loading: resLoading } = useRealtimeTable<Reservation>('reservations', fetchReservations);

  const loading = ordersLoading || resLoading;

  const revenue = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const recentOrders = orders.slice(0, 5);
  const recentReservations = reservations.slice(0, 5);

  if (loading) return <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" />;

  const statCards: { label: string; value: string | number; icon: typeof DollarSign; color: string; tab: Tab }[] = [
    { label: 'Total Revenue', value: `Rs. ${revenue.toLocaleString()}`, icon: DollarSign, color: 'text-accent-green', tab: 'orders' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-brand-500', tab: 'orders' },
    { label: 'Reservations', value: reservations.length, icon: CalendarCheck, color: 'text-accent-gold', tab: 'reservations' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'text-accent-orange', tab: 'orders' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <button
            key={s.label}
            onClick={() => onNavigate(s.tab)}
            className="card p-5 text-left hover:bg-charcoal-800 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`w-6 h-6 ${s.color}`} />
              <TrendingUp className="w-4 h-4 text-charcoal-500 group-hover:text-brand-500 transition-colors" />
            </div>
            <p className="text-white font-bold text-xl md:text-2xl">{s.value}</p>
            <p className="text-charcoal-400 text-sm">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Recent Orders</h3>
            <button onClick={() => onNavigate('orders')} className="text-brand-500 text-sm hover:text-brand-400">View all</button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-charcoal-400 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => onNavigate('orders')}
                  className="w-full flex items-center justify-between p-3 bg-charcoal-900 rounded-xl hover:bg-charcoal-800 transition-colors text-left"
                >
                  <div>
                    <p className="text-white font-semibold text-sm">{order.order_number}</p>
                    <p className="text-charcoal-400 text-xs">{order.customer_name} • {order.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-500 font-bold text-sm">Rs. {Number(order.total).toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'pending' ? 'bg-accent-orange/20 text-accent-orange' : 'bg-accent-green/20 text-accent-green'}`}>
                      {order.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Recent Reservations</h3>
            <button onClick={() => onNavigate('reservations')} className="text-brand-500 text-sm hover:text-brand-400">View all</button>
          </div>
          {recentReservations.length === 0 ? (
            <p className="text-charcoal-400 text-sm">No reservations yet.</p>
          ) : (
            <div className="space-y-3">
              {recentReservations.map((res) => (
                <button
                  key={res.id}
                  onClick={() => onNavigate('reservations')}
                  className="w-full flex items-center justify-between p-3 bg-charcoal-900 rounded-xl hover:bg-charcoal-800 transition-colors text-left"
                >
                  <div>
                    <p className="text-white font-semibold text-sm">{res.name}</p>
                    <p className="text-charcoal-400 text-xs">{res.date} • {res.time} • {res.guests} guests</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${res.status === 'pending' ? 'bg-accent-orange/20 text-accent-orange' : res.status === 'approved' ? 'bg-accent-green/20 text-accent-green' : 'bg-charcoal-600 text-charcoal-200'}`}>
                    {res.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ ORDERS ============
function Orders() {
  const { data: orders, loading } = useRealtimeTable<Order>('orders', fetchOrders);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search && !o.order_number.toLowerCase().includes(search.toLowerCase()) && !o.customer_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

  const handleStatusChange = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="input-field pl-10" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field sm:w-48 cursor-pointer">
          <option value="all">All Status</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" /> : filtered.length === 0 ? (
        <p className="text-charcoal-400 text-center py-12">No orders found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-bold text-sm">{order.order_number}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'pending' ? 'bg-accent-orange/20 text-accent-orange' : order.status === 'cancelled' ? 'bg-brand-600/20 text-brand-500' : 'bg-accent-green/20 text-accent-green'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-charcoal-400 text-xs">{order.customer_name} • {order.customer_phone}</p>
                  <p className="text-charcoal-500 text-xs">{new Date(order.created_at).toLocaleString()}</p>
                  <p className="text-charcoal-300 text-xs mt-1">{order.items.length} items • {order.delivery_type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-brand-500 font-bold">Rs. {Number(order.total).toLocaleString()}</p>
                  <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="bg-charcoal-900 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm cursor-pointer focus:outline-none focus:border-brand-500">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ RESERVATIONS ============
function Reservations() {
  const { data: reservations, loading } = useRealtimeTable<Reservation>('reservations', fetchReservations);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? reservations : reservations.filter((r) => r.status === filter);
  const statuses = ['pending', 'approved', 'rejected', 'completed'];

  const handleStatus = async (id: string, status: string) => { await updateReservationStatus(id, status); };

  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field sm:w-48 mb-4 cursor-pointer">
        <option value="all">All</option>
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      {loading ? <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" /> : filtered.length === 0 ? (
        <p className="text-charcoal-400 text-center py-12">No reservations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((res) => (
            <div key={res.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-bold text-sm">{res.name}</p>
                  <p className="text-charcoal-400 text-xs">{res.phone}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${res.status === 'pending' ? 'bg-accent-orange/20 text-accent-orange' : res.status === 'approved' ? 'bg-accent-green/20 text-accent-green' : res.status === 'rejected' ? 'bg-brand-600/20 text-brand-500' : 'bg-charcoal-600 text-charcoal-200'}`}>
                  {res.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-charcoal-300 mb-3">
                <div><p className="text-charcoal-500">Date</p><p className="text-white">{res.date}</p></div>
                <div><p className="text-charcoal-500">Time</p><p className="text-white">{res.time}</p></div>
                <div><p className="text-charcoal-500">Guests</p><p className="text-white">{res.guests}</p></div>
              </div>
              {res.special_requests && <p className="text-charcoal-400 text-xs mb-3">"{res.special_requests}"</p>}
              <div className="flex gap-2">
                {statuses.map((s) => (
                  <button key={s} onClick={() => handleStatus(res.id, s)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${res.status === s ? 'bg-brand-600 text-white' : 'bg-charcoal-900 text-charcoal-300 hover:bg-white/5'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ NUMBER INPUT HELPER ============
function useNumberInput(initial: number | null | undefined) {
  const [value, setValue] = useState<string>(initial != null && initial !== 0 ? String(initial) : '');
  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    rawValue: value === '' ? null : Number(value),
    setValue,
  };
}

// ============ MENU MANAGEMENT ============
function MenuManagement() {
  const { data: items, loading } = useRealtimeTable<MenuItem>('menu_items', fetchMenuItems);
  const { data: categories } = useRealtimeTable<Category>('categories', fetchCategories);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    await deleteMenuItem(id);
  };

  const handleSave = async (data: Partial<MenuItem>) => {
    if (editing) {
      await updateMenuItem(editing.id, data);
    } else {
      await createMenuItem(data as MenuItem);
    }
    setShowForm(false); setEditing(null);
  };

  if (showForm) return <MenuItemForm item={editing} categories={categories} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary !py-2"><Plus className="w-4 h-4" /> Add Item</button>
      </div>
      {loading ? <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => {
            const cat = categories.find((c) => c.id === item.category_id);
            return (
              <div key={item.id} className="card p-3 flex gap-3">
                <img src={item.image_url || ''} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                    <div className="flex gap-1 shrink-0">
                      {item.is_popular && <Star className="w-3.5 h-3.5 text-accent-gold fill-accent-gold" />}
                      {item.is_spicy && <Flame className="w-3.5 h-3.5 text-accent-orange" />}
                    </div>
                  </div>
                  <p className="text-charcoal-500 text-xs">{cat?.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-brand-500 font-bold text-sm">Rs. {item.price.toLocaleString()}</p>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditing(item); setShowForm(true); }} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><Edit2 className="w-3.5 h-3.5 text-white" /></button>
                      <button onClick={() => handleDelete(item.id)} className="w-7 h-7 rounded-lg bg-brand-600/10 flex items-center justify-center hover:bg-brand-600/20"><Trash2 className="w-3.5 h-3.5 text-brand-500" /></button>
                    </div>
                  </div>
                  {!item.is_available && <span className="text-xs text-accent-orange">Unavailable</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MenuItemForm({ item, categories, onSave, onCancel }: { item: MenuItem | null; categories: Category[]; onSave: (data: Partial<MenuItem>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: item?.name || '',
    slug: item?.slug || '',
    description: item?.description || '',
    image_url: item?.image_url || '',
    category_id: item?.category_id || categories[0]?.id || '',
    is_popular: item?.is_popular || false,
    is_spicy: item?.is_spicy || false,
    is_available: item?.is_available ?? true,
    ingredients: (item?.ingredients || []).join(', '),
  });
  const priceInput = useNumberInput(item?.price);
  const sortInput = useNumberInput(item?.sort_order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      image_url: form.image_url || null,
      price: priceInput.rawValue ?? 0,
      sort_order: sortInput.rawValue ?? 0,
      ingredients: form.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-2xl space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button type="button" onClick={onCancel} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><ArrowLeft className="w-4 h-4 text-white" /></button>
        <h2 className="font-display text-xl text-white">{item ? 'Edit' : 'Add'} Menu Item</h2>
      </div>
      <ImageUpload label="Image" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url || '' })} aspectClass="aspect-video w-full max-w-sm" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-white text-sm font-semibold mb-1 block">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
        <div><label className="text-white text-sm font-semibold mb-1 block">Price (Rs.)</label><input type="number" value={priceInput.value} onChange={priceInput.onChange} className="input-field" required /></div>
      </div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-field resize-none" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-white text-sm font-semibold mb-1 block">Category</label><select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field cursor-pointer">{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className="text-white text-sm font-semibold mb-1 block">Sort Order</label><input type="number" value={sortInput.value} onChange={sortInput.onChange} className="input-field" /></div>
      </div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Ingredients (comma-separated)</label><input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="input-field" /></div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-white text-sm cursor-pointer"><input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} className="w-4 h-4 accent-brand-600" /> Popular</label>
        <label className="flex items-center gap-2 text-white text-sm cursor-pointer"><input type="checkbox" checked={form.is_spicy} onChange={(e) => setForm({ ...form, is_spicy: e.target.checked })} className="w-4 h-4 accent-brand-600" /> Spicy</label>
        <label className="flex items-center gap-2 text-white text-sm cursor-pointer"><input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="w-4 h-4 accent-brand-600" /> Available</label>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="btn-primary flex-1"><Check className="w-4 h-4" /> Save</button>
        <button type="button" onClick={onCancel} className="btn-secondary"><X className="w-4 h-4" /> Cancel</button>
      </div>
    </form>
  );
}

// ============ CATEGORY MANAGEMENT ============
function CategoryManagement() {
  const { data: categories, loading } = useRealtimeTable<Category>('categories', fetchCategories);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const handleDelete = async (id: string) => { if (!confirm('Delete this category?')) return; await deleteCategory(id); };
  const handleSave = async (data: Partial<Category>) => {
    if (editing) await updateCategory(editing.id, data);
    else await createCategory(data as Category);
    setShowForm(false); setEditing(null);
  };

  if (showForm) return <CategoryForm editing={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary !py-2"><Plus className="w-4 h-4" /> Add</button>
      </div>
      {loading ? <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-3">
              <img src={cat.image_url || ''} alt={cat.name} className="w-full h-24 rounded-lg object-cover mb-2" />
              <p className="text-white font-semibold text-sm">{cat.name}</p>
              <p className="text-charcoal-500 text-xs mb-2">/{cat.slug}</p>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(cat); setShowForm(true); }} className="flex-1 py-1.5 rounded-lg bg-white/5 text-white text-xs flex items-center justify-center gap-1 hover:bg-white/10"><Edit2 className="w-3 h-3" /> Edit</button>
                <button onClick={() => handleDelete(cat.id)} className="px-2 py-1.5 rounded-lg bg-brand-600/10 text-brand-500 hover:bg-brand-600/20"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryForm({ editing, onSave, onCancel }: { editing: Category | null; onSave: (data: Partial<Category>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: editing?.name || '',
    slug: editing?.slug || '',
    description: editing?.description || '',
    image_url: editing?.image_url || '',
  });
  const sortInput = useNumberInput(editing?.sort_order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      image_url: form.image_url || null,
      sort_order: sortInput.rawValue ?? 0,
      is_active: true,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-lg space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button type="button" onClick={onCancel} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><ArrowLeft className="w-4 h-4 text-white" /></button>
        <h2 className="font-display text-xl text-white">{editing ? 'Edit' : 'Add'} Category</h2>
      </div>
      <ImageUpload label="Image" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url || '' })} aspectClass="aspect-video w-full max-w-sm" />
      <div><label className="text-white text-sm font-semibold mb-1 block">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Slug</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" placeholder="auto-generated if empty" /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-field resize-none" /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Sort Order</label><input type="number" value={sortInput.value} onChange={sortInput.onChange} className="input-field" /></div>
      <div className="flex gap-3"><button type="submit" className="btn-primary flex-1">Save</button><button type="button" onClick={onCancel} className="btn-secondary">Cancel</button></div>
    </form>
  );
}

// ============ BRANCH MANAGEMENT ============
function BranchManagement() {
  const { data: branches, loading } = useRealtimeTable<Branch>('branches', fetchBranches);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);

  const handleDelete = async (id: string) => { if (!confirm('Delete this branch?')) return; await deleteBranch(id); };
  const handleSave = async (data: Partial<Branch>) => {
    if (editing) await updateBranch(editing.id, data);
    else await createBranch(data as Branch);
    setShowForm(false); setEditing(null);
  };

  if (showForm) return <BranchForm editing={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary !py-2"><Plus className="w-4 h-4" /> Add</button>
      </div>
      {loading ? <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {branches.map((b) => (
            <div key={b.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div><p className="text-white font-bold">{b.name}</p><p className="text-charcoal-400 text-sm">{b.address}</p></div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(b); setShowForm(true); }} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><Edit2 className="w-3.5 h-3.5 text-white" /></button>
                  <button onClick={() => handleDelete(b.id)} className="w-7 h-7 rounded-lg bg-brand-600/10 flex items-center justify-center hover:bg-brand-600/20"><Trash2 className="w-3.5 h-3.5 text-brand-500" /></button>
                </div>
              </div>
              <p className="text-charcoal-300 text-sm">{b.phone}</p>
              {b.delivery_available && <span className="text-xs text-accent-green">Delivery available</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BranchForm({ editing, onSave, onCancel }: { editing: Branch | null; onSave: (data: Partial<Branch>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: editing?.name || '',
    address: editing?.address || '',
    phone: editing?.phone || '',
    map_url: editing?.map_url || '',
    latitude: editing?.latitude || '',
    longitude: editing?.longitude || '',
    delivery_available: editing?.delivery_available ?? true,
  });
  const sortInput = useNumberInput(editing?.sort_order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, is_active: true, sort_order: sortInput.rawValue ?? 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-lg space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button type="button" onClick={onCancel} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><ArrowLeft className="w-4 h-4 text-white" /></button>
        <h2 className="font-display text-xl text-white">{editing ? 'Edit' : 'Add'} Branch</h2>
      </div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" required /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" required /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Map URL</label><input value={form.map_url} onChange={(e) => setForm({ ...form, map_url: e.target.value })} className="input-field" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-white text-sm font-semibold mb-1 block">Latitude</label><input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} className="input-field" /></div>
        <div><label className="text-white text-sm font-semibold mb-1 block">Longitude</label><input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} className="input-field" /></div>
      </div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Sort Order</label><input type="number" value={sortInput.value} onChange={sortInput.onChange} className="input-field" /></div>
      <label className="flex items-center gap-2 text-white text-sm cursor-pointer"><input type="checkbox" checked={form.delivery_available} onChange={(e) => setForm({ ...form, delivery_available: e.target.checked })} className="w-4 h-4 accent-brand-600" /> Delivery Available</label>
      <div className="flex gap-3"><button type="submit" className="btn-primary flex-1">Save</button><button type="button" onClick={onCancel} className="btn-secondary">Cancel</button></div>
    </form>
  );
}

// ============ GALLERY MANAGEMENT ============
function GalleryManagement() {
  const { data: items, loading } = useRealtimeTable<GalleryItem>('gallery_items', fetchGallery);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => { if (!confirm('Delete this image?')) return; await deleteGalleryItem(id); };

  if (showForm) return <GalleryForm onSave={async () => { setShowForm(false); }} onCancel={() => setShowForm(false)} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setShowForm(true)} className="btn-primary !py-2"><Plus className="w-4 h-4" /> Add Image</button>
      </div>
      {loading ? <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" /> : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden">
              <img src={item.image_url} alt={item.title || ''} className="w-full h-32 object-cover" />
              <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5 text-white" /></button>
              <p className="absolute bottom-1 left-2 text-white text-xs font-medium drop-shadow-lg">{item.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food');
  const sortInput = useNumberInput(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) { alert('Please upload an image.'); return; }
    await createGalleryItem({ image_url: imageUrl, title: title || null, category, sort_order: sortInput.rawValue ?? 0 });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-lg space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button type="button" onClick={onCancel} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><ArrowLeft className="w-4 h-4 text-white" /></button>
        <h2 className="font-display text-xl text-white">Add Gallery Image</h2>
      </div>
      <ImageUpload label="Image" value={imageUrl} onChange={setImageUrl} aspectClass="aspect-video w-full" />
      <div><label className="text-white text-sm font-semibold mb-1 block">Title (optional)</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Category</label><input value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" placeholder="Food, Kitchen, Interior..." /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Sort Order</label><input type="number" value={sortInput.value} onChange={sortInput.onChange} className="input-field" /></div>
      <div className="flex gap-3"><button type="submit" className="btn-primary flex-1">Save</button><button type="button" onClick={onCancel} className="btn-secondary">Cancel</button></div>
    </form>
  );
}

// ============ OFFER MANAGEMENT ============
function OfferManagement() {
  const { data: offers, loading } = useRealtimeTable<Offer>('offers', fetchOffers);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);

  const handleDelete = async (id: string) => { if (!confirm('Delete this offer?')) return; await deleteOffer(id); };
  const handleSave = async (data: Partial<Offer>) => {
    if (editing) await updateOffer(editing.id, data);
    else await createOffer(data as Offer);
    setShowForm(false); setEditing(null);
  };

  if (showForm) return <OfferForm editing={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary !py-2"><Plus className="w-4 h-4" /> Add</button>
      </div>
      {loading ? <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {offers.map((o) => (
            <div key={o.id} className="card p-4 flex gap-3">
              <img src={o.image_url || ''} alt={o.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <p className="text-white font-bold text-sm">{o.title}</p>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(o); setShowForm(true); }} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><Edit2 className="w-3.5 h-3.5 text-white" /></button>
                    <button onClick={() => handleDelete(o.id)} className="w-7 h-7 rounded-lg bg-brand-600/10 flex items-center justify-center hover:bg-brand-600/20"><Trash2 className="w-3.5 h-3.5 text-brand-500" /></button>
                  </div>
                </div>
                <p className="text-charcoal-400 text-xs">{o.description}</p>
                {o.badge_text && <span className="inline-block mt-1 text-xs bg-brand-600 text-white px-2 py-0.5 rounded">{o.badge_text}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OfferForm({ editing, onSave, onCancel }: { editing: Offer | null; onSave: (data: Partial<Offer>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: editing?.title || '',
    description: editing?.description || '',
    image_url: editing?.image_url || '',
    badge_text: editing?.badge_text || '',
    valid_until: editing?.valid_until || '',
    is_active: editing?.is_active ?? true,
  });
  const sortInput = useNumberInput(editing?.sort_order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      image_url: form.image_url || null,
      sort_order: sortInput.rawValue ?? 0,
      valid_until: form.valid_until || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-lg space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button type="button" onClick={onCancel} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><ArrowLeft className="w-4 h-4 text-white" /></button>
        <h2 className="font-display text-xl text-white">{editing ? 'Edit' : 'Add'} Offer</h2>
      </div>
      <ImageUpload label="Image" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url || '' })} aspectClass="aspect-video w-full" />
      <div><label className="text-white text-sm font-semibold mb-1 block">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-field resize-none" /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Badge Text</label><input value={form.badge_text} onChange={(e) => setForm({ ...form, badge_text: e.target.value })} className="input-field" placeholder="20% OFF" /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Valid Until</label><input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className="input-field" /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Sort Order</label><input type="number" value={sortInput.value} onChange={sortInput.onChange} className="input-field" /></div>
      <label className="flex items-center gap-2 text-white text-sm cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-brand-600" /> Active</label>
      <div className="flex gap-3"><button type="submit" className="btn-primary flex-1">Save</button><button type="button" onClick={onCancel} className="btn-secondary">Cancel</button></div>
    </form>
  );
}

// ============ TESTIMONIAL MANAGEMENT ============
function TestimonialManagement() {
  const { data: items, loading } = useRealtimeTable<Testimonial>('testimonials', fetchTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const handleDelete = async (id: string) => { if (!confirm('Delete this testimonial?')) return; await deleteTestimonial(id); };
  const handleSave = async (data: Partial<Testimonial>) => {
    if (editing) await updateTestimonial(editing.id, data);
    else await createTestimonial(data as Testimonial);
    setShowForm(false); setEditing(null);
  };

  if (showForm) return <TestimonialForm editing={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary !py-2"><Plus className="w-4 h-4" /> Add</button>
      </div>
      {loading ? <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" /> : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-bold text-sm">{t.name} <span className="text-charcoal-500 text-xs">via {t.source}</span></p>
                  <div className="flex gap-0.5 my-1">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-accent-gold fill-accent-gold' : 'text-charcoal-600'}`} />)}</div>
                  <p className="text-charcoal-400 text-sm">"{t.text}"</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(t); setShowForm(true); }} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><Edit2 className="w-3.5 h-3.5 text-white" /></button>
                  <button onClick={() => handleDelete(t.id)} className="w-7 h-7 rounded-lg bg-brand-600/10 flex items-center justify-center hover:bg-brand-600/20"><Trash2 className="w-3.5 h-3.5 text-brand-500" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TestimonialForm({ editing, onSave, onCancel }: { editing: Testimonial | null; onSave: (data: Partial<Testimonial>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: editing?.name || '',
    rating: editing?.rating ?? 5,
    text: editing?.text || '',
    source: editing?.source || 'Google',
    avatar_url: editing?.avatar_url || '',
    is_active: editing?.is_active ?? true,
  });
  const sortInput = useNumberInput(editing?.sort_order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, avatar_url: form.avatar_url || null, sort_order: sortInput.rawValue ?? 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-lg space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button type="button" onClick={onCancel} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><ArrowLeft className="w-4 h-4 text-white" /></button>
        <h2 className="font-display text-xl text-white">{editing ? 'Edit' : 'Add'} Testimonial</h2>
      </div>
      <ImageUpload label="Avatar (optional)" value={form.avatar_url} onChange={(url) => setForm({ ...form, avatar_url: url || '' })} aspectClass="aspect-square w-32" />
      <div><label className="text-white text-sm font-semibold mb-1 block">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-white text-sm font-semibold mb-1 block">Rating (1-5)</label><input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="input-field" /></div>
        <div><label className="text-white text-sm font-semibold mb-1 block">Source</label><input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="input-field" /></div>
      </div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Review Text</label><textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} className="input-field resize-none" required /></div>
      <div><label className="text-white text-sm font-semibold mb-1 block">Sort Order</label><input type="number" value={sortInput.value} onChange={sortInput.onChange} className="input-field" /></div>
      <label className="flex items-center gap-2 text-white text-sm cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-brand-600" /> Active</label>
      <div className="flex gap-3"><button type="submit" className="btn-primary flex-1">Save</button><button type="button" onClick={onCancel} className="btn-secondary">Cancel</button></div>
    </form>
  );
}

// ============ CAREERS MANAGEMENT ============
function CareersManagement() {
  const [applications, setApplications] = useState<{ id: string; name: string; phone: string; email: string | null; position: string; message: string | null; status: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = () => {
      supabase.from('career_applications').select('*').order('created_at', { ascending: false }).then(({ data }) => {
        if (mounted) { setApplications(data || []); setLoading(false); }
      });
    };
    load();
    const channel = supabase.channel('realtime-career_applications').on('postgres_changes', { event: '*', schema: 'public', table: 'career_applications' }, load).subscribe();
    return () => { mounted = false; supabase.removeChannel(channel); };
  }, []);

  return (
    <div>
      {loading ? <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" /> : applications.length === 0 ? (
        <p className="text-charcoal-400 text-center py-12">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-bold text-sm">{app.name}</p>
                  <p className="text-charcoal-400 text-xs">{app.phone} • {app.position}</p>
                  {app.email && <p className="text-charcoal-400 text-xs">{app.email}</p>}
                  {app.message && <p className="text-charcoal-300 text-sm mt-2">"{app.message}"</p>}
                  <p className="text-charcoal-500 text-xs mt-1">{new Date(app.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-charcoal-700 text-charcoal-200">{app.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ SETTINGS MANAGEMENT ============
function SettingsManagement() {
  const settings = useSettings();
  const [form, setForm] = useState<SettingsType | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      await updateSettings(form.id, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  };

  if (!form) return <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" />;

  const socialLinks = form.social_links || { facebook: '', instagram: '', tiktok: '', youtube: '', whatsapp: '' };
  const socialFields: { key: keyof typeof socialLinks; label: string; icon: typeof Facebook }[] = [
    { key: 'facebook', label: 'Facebook', icon: Facebook },
    { key: 'instagram', label: 'Instagram', icon: Instagram },
    { key: 'tiktok', label: 'TikTok', icon: Music },
    { key: 'youtube', label: 'YouTube', icon: Youtube },
    { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  ];

  return (
    <form onSubmit={handleSave} className="card p-6 max-w-2xl space-y-6">
      <h2 className="font-display text-xl text-white">Restaurant Settings</h2>

      {/* Logo upload */}
      <div>
        <h3 className="text-white text-sm font-semibold mb-2">Logo</h3>
        <p className="text-charcoal-500 text-xs mb-3">Upload a logo to replace the flame icon. The KIYASO text and tagline stay as-is.</p>
        <ImageUpload value={form.logo_url} onChange={(url) => setForm({ ...form, logo_url: url })} aspectClass="w-28 h-28 rounded-2xl" />
      </div>

      {/* Basic info */}
      <div className="space-y-4">
        <h3 className="text-white text-sm font-semibold">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-white text-sm font-semibold mb-1 block">Restaurant Name</label><input value={form.restaurant_name} onChange={(e) => setForm({ ...form, restaurant_name: e.target.value })} className="input-field" /></div>
          <div><label className="text-white text-sm font-semibold mb-1 block">Tagline</label><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="input-field" /></div>
        </div>
        <div><label className="text-white text-sm font-semibold mb-1 block">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" /></div>
        <div><label className="text-white text-sm font-semibold mb-1 block">Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" /></div>
        <div><label className="text-white text-sm font-semibold mb-1 block">Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" /></div>
      </div>

      {/* Social media */}
      <div className="space-y-4">
        <h3 className="text-white text-sm font-semibold">Social Media</h3>
        {socialFields.map(({ key, label, icon: Icon }) => (
          <div key={key}>
            <label className="text-white text-sm font-semibold mb-1 flex items-center gap-2"><Icon className="w-4 h-4 text-charcoal-400" /> {label}</label>
            <input
              value={socialLinks[key] || ''}
              onChange={(e) => setForm({ ...form, social_links: { ...socialLinks, [key]: e.target.value } })}
              className="input-field"
              placeholder={`https://${label.toLowerCase()}.com/...`}
            />
          </div>
        ))}
      </div>

      {/* Delivery settings */}
      <div className="space-y-4">
        <h3 className="text-white text-sm font-semibold">Delivery Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="text-white text-sm font-semibold mb-1 block">Delivery Fee</label><input type="number" value={form.delivery_fee} onChange={(e) => setForm({ ...form, delivery_fee: Number(e.target.value) })} className="input-field" /></div>
          <div><label className="text-white text-sm font-semibold mb-1 block">Min Order</label><input type="number" value={form.delivery_min_order} onChange={(e) => setForm({ ...form, delivery_min_order: Number(e.target.value) })} className="input-field" /></div>
          <div><label className="text-white text-sm font-semibold mb-1 block">Est. Time</label><input value={form.delivery_est_time} onChange={(e) => setForm({ ...form, delivery_est_time: e.target.value })} className="input-field" /></div>
        </div>
      </div>

      {/* SEO */}
      <div className="space-y-4">
        <h3 className="text-white text-sm font-semibold">SEO</h3>
        <div><label className="text-white text-sm font-semibold mb-1 block">SEO Title</label><input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} className="input-field" /></div>
        <div><label className="text-white text-sm font-semibold mb-1 block">SEO Description</label><textarea value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} rows={2} className="input-field resize-none" /></div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
      </button>
    </form>
  );
}
