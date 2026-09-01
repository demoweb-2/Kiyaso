import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Store, Truck, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { fetchBranches, fetchSettings, createOrder } from '@/lib/data';
import type { Branch, Settings } from '@/types';

const schema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  customer_phone: z.string().min(10, 'Valid phone required'),
  customer_email: z.string().email('Invalid email').optional().or(z.literal('')),
  delivery_type: z.enum(['pickup', 'delivery']),
  branch_id: z.string().min(1, 'Please select a branch'),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { delivery_type: 'pickup' },
  });

  const deliveryType = watch('delivery_type');
  const deliveryFee = deliveryType === 'delivery' ? (settings?.delivery_fee ?? 150) : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    Promise.all([fetchBranches(), fetchSettings()]).then(([b, s]) => {
      setBranches(b);
      setSettings(s);
    });
  }, []);

  if (items.length === 0 && !submitting) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="font-display text-3xl text-white mb-4">YOUR CART IS EMPTY</h2>
          <p className="text-charcoal-400 mb-8">Add some delicious items before checking out.</p>
          <button onClick={() => navigate('/menu')} className="btn-primary">Browse Menu</button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    if (data.delivery_type === 'delivery' && !data.address?.trim()) {
      setError('Please enter your delivery address');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image_url: i.image_url }));
      const order = await createOrder({
        branch_id: data.branch_id,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email || null,
        delivery_type: data.delivery_type,
        address: data.address || null,
        items: orderItems,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        notes: data.notes || null,
        status: 'pending',
      });
      clearCart();
      navigate('/order-confirmation', { state: { orderNumber: order.order_number, total } });
    } catch {
      setError('Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl text-white">CHECKOUT</h1>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && <div className="p-4 bg-accent-orange/10 border border-accent-orange/30 rounded-xl text-accent-orange text-sm">{error}</div>}

              {/* Delivery type */}
              <div className="card p-6">
                <h3 className="text-white font-bold text-lg mb-4">Order Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${deliveryType === 'pickup' ? 'border-brand-600 bg-brand-600/10' : 'border-white/10 hover:border-white/20'}`}>
                    <input type="radio" value="pickup" {...register('delivery_type')} className="sr-only" />
                    <Store className={`w-5 h-5 ${deliveryType === 'pickup' ? 'text-brand-500' : 'text-charcoal-400'}`} />
                    <div>
                      <p className="text-white font-semibold text-sm">Pickup</p>
                      <p className="text-charcoal-400 text-xs">Collect from branch</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${deliveryType === 'delivery' ? 'border-brand-600 bg-brand-600/10' : 'border-white/10 hover:border-white/20'}`}>
                    <input type="radio" value="delivery" {...register('delivery_type')} className="sr-only" />
                    <Truck className={`w-5 h-5 ${deliveryType === 'delivery' ? 'text-brand-500' : 'text-charcoal-400'}`} />
                    <div>
                      <p className="text-white font-semibold text-sm">Delivery</p>
                      <p className="text-charcoal-400 text-xs">Rs. {settings?.delivery_fee ?? 150} fee</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Branch */}
              <div className="card p-6">
                <h3 className="text-white font-bold text-lg mb-4">Select Branch</h3>
                <select {...register('branch_id')} className="input-field cursor-pointer">
                  <option value="">Choose a branch</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.address}</option>)}
                </select>
                {errors.branch_id && <p className="text-accent-orange text-xs mt-1">{errors.branch_id.message}</p>}
              </div>

              {/* Customer info */}
              <div className="card p-6">
                <h3 className="text-white font-bold text-lg mb-4">Your Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-semibold text-sm mb-2 block">Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                      <input {...register('customer_name')} placeholder="Your name" className="input-field pl-10" />
                    </div>
                    {errors.customer_name && <p className="text-accent-orange text-xs mt-1">{errors.customer_name.message}</p>}
                  </div>
                  <div>
                    <label className="text-white font-semibold text-sm mb-2 block">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                      <input {...register('customer_phone')} placeholder="+94 77 123 4567" className="input-field pl-10" />
                    </div>
                    {errors.customer_phone && <p className="text-accent-orange text-xs mt-1">{errors.customer_phone.message}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-white font-semibold text-sm mb-2 block">Email (optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                    <input {...register('customer_email')} placeholder="you@email.com" className="input-field pl-10" />
                  </div>
                </div>
              </div>

              {/* Address (if delivery) */}
              {deliveryType === 'delivery' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Delivery Address</h3>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-charcoal-500" />
                    <textarea {...register('address')} rows={3} placeholder="Your full delivery address" className="input-field pl-10 resize-none" />
                  </div>
                </motion.div>
              )}

              {/* Notes */}
              <div className="card p-6">
                <h3 className="text-white font-bold text-lg mb-4">Order Notes (optional)</h3>
                <textarea {...register('notes')} rows={2} placeholder="Any special instructions..." className="input-field resize-none" />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full text-base py-4 disabled:opacity-50">
                {submitting ? 'Placing Order...' : `Place Order — Rs. ${total.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="text-white font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.image_url || ''} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      <p className="text-charcoal-400 text-xs">Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10">
                        <Minus className="w-3 h-3 text-white" />
                      </button>
                      <span className="text-white text-sm w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10">
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-1 text-charcoal-500 hover:text-brand-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-300">Subtotal</span>
                  <span className="text-white font-semibold">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-300">Delivery Fee</span>
                  <span className="text-white font-semibold">{deliveryFee === 0 ? 'Free' : `Rs. ${deliveryFee.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/5">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-brand-500 font-bold text-xl">Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
