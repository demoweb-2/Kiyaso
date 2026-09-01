import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Clock, Package, ChefHat, Bike, XCircle, Phone, ArrowRight,
  Edit2, Trash2, ArrowLeft,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchOrderByNumber, cancelOrder } from '@/lib/data';
import type { Order, OrderStatus } from '@/types';

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-accent-orange' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-accent-green' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'text-brand-500' },
  ready: { label: 'Ready', icon: Package, color: 'text-accent-gold' },
  delivered: { label: 'Completed', icon: CheckCircle, color: 'text-accent-green' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-brand-600' },
};

const FIVE_MINUTES = 5 * 60 * 1000;

export default function OrderTracking() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;
    setLoading(true);
    fetchOrderByNumber(orderNumber).then((data) => {
      setOrder(data);
      setLoading(false);
    });

    const channel = supabase
      .channel(`order-track-${orderNumber}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `order_number=eq.${orderNumber}` },
        () => {
          fetchOrderByNumber(orderNumber!).then(setOrder);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderNumber]);

  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - new Date(order.created_at).getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  if (loading) {
    return (
      <div className="pt-32 px-4 max-w-2xl mx-auto">
        <div className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 px-4 text-center">
        <p className="text-charcoal-400 text-lg mb-4">Order not found</p>
        <Link to="/menu" className="btn-primary">Back to Menu</Link>
      </div>
    );
  }

  const canEdit = order.status === 'pending' && elapsed < FIVE_MINUTES;
  const remainingMs = FIVE_MINUTES - elapsed;
  const remainingMin = Math.floor(remainingMs / 60000);
  const remainingSec = Math.floor((remainingMs % 60000) / 1000);

  const handleCancel = async () => {
    if (!confirm('Cancel this order? This cannot be undone.')) return;
    setCancelling(true);
    try {
      await cancelOrder(order.id);
    } finally {
      setCancelling(false);
    }
  };

  const currentStepIndex = order.status === 'cancelled' ? -1 : STATUS_FLOW.indexOf(order.status);

  return (
    <div className="pt-20 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/menu" className="flex items-center gap-2 text-charcoal-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>

        {/* Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-charcoal-400 text-sm">Order Number</p>
              <p className="text-white font-bold text-xl">{order.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-charcoal-400 text-sm">Total</p>
              <p className="text-brand-500 font-bold text-xl">Rs. {Number(order.total).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className={`text-xs px-3 py-1 rounded-full ${order.status === 'cancelled' ? 'bg-brand-600/20 text-brand-500' : 'bg-accent-green/20 text-accent-green'}`}>
              {statusConfig[order.status]?.label || order.status}
            </span>
            <span className="text-charcoal-500 text-xs">{new Date(order.created_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Status tracker */}
        {order.status !== 'cancelled' ? (
          <div className="card p-6 mb-6">
            <h3 className="text-white font-bold text-lg mb-6">Order Status</h3>
            <div className="relative">
              {STATUS_FLOW.map((status, i) => {
                const config = statusConfig[status];
                const Icon = config.icon;
                const isDone = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={status} className="flex items-center gap-4 mb-6 last:mb-0 relative">
                    {i < STATUS_FLOW.length - 1 && (
                      <div className={`absolute left-5 top-12 w-0.5 h-8 ${i < currentStepIndex ? 'bg-accent-green' : 'bg-white/10'}`} />
                    )}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        isDone ? 'bg-accent-green/20' : 'bg-white/5'
                      } ${isCurrent ? 'ring-2 ring-accent-green' : ''}`}
                    >
                      <Icon className={`w-5 h-5 ${isDone ? config.color : 'text-charcoal-500'}`} />
                    </motion.div>
                    <div>
                      <p className={`font-semibold text-sm ${isDone ? 'text-white' : 'text-charcoal-500'}`}>
                        {config.label}
                      </p>
                      {isCurrent && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-accent-green text-xs"
                        >
                          In progress...
                        </motion.p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card p-6 mb-6 text-center">
            <XCircle className="w-12 h-12 text-brand-600 mx-auto mb-3" />
            <p className="text-white font-bold text-lg">Order Cancelled</p>
            <p className="text-charcoal-400 text-sm mt-1">This order has been cancelled.</p>
          </div>
        )}

        {/* Edit/cancel window */}
        {canEdit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-5 mb-6 border border-accent-orange/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-accent-orange" />
              <p className="text-accent-orange text-sm font-semibold">
                Edit window: {remainingMin}m {remainingSec}s remaining
              </p>
            </div>
            <p className="text-charcoal-300 text-sm mb-4">
              You can cancel this order within 5 minutes of placing it. After that, the order is locked.
            </p>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="btn-primary w-full disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </motion.div>
        )}

        {/* Order details */}
        <div className="card p-6 mb-6">
          <h3 className="text-white font-bold text-lg mb-4">Order Details</h3>
          <div className="space-y-3 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.image_url && <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />}
                  <div>
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    <p className="text-charcoal-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-white text-sm font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-300">Subtotal</span>
              <span className="text-white">Rs. {Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-300">Delivery Fee</span>
              <span className="text-white">{order.delivery_fee === 0 ? 'Free' : `Rs. ${Number(order.delivery_fee).toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/5">
              <span className="text-white font-bold">Total</span>
              <span className="text-brand-500 font-bold">Rs. {Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Customer info */}
        <div className="card p-6">
          <h3 className="text-white font-bold text-lg mb-4">Customer Info</h3>
          <div className="space-y-2 text-sm">
            <p className="text-charcoal-300"><span className="text-charcoal-500">Name:</span> {order.customer_name}</p>
            <p className="text-charcoal-300"><span className="text-charcoal-500">Phone:</span> {order.customer_phone}</p>
            {order.customer_email && <p className="text-charcoal-300"><span className="text-charcoal-500">Email:</span> {order.customer_email}</p>}
            <p className="text-charcoal-300"><span className="text-charcoal-500">Type:</span> {order.delivery_type}</p>
            {order.address && <p className="text-charcoal-300"><span className="text-charcoal-500">Address:</span> {order.address}</p>}
            {order.notes && <p className="text-charcoal-300"><span className="text-charcoal-500">Notes:</span> {order.notes}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
