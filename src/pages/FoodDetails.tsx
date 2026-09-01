import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Star, Flame, ShoppingBag, Check } from 'lucide-react';
import { fetchMenuItemBySlug, fetchMenuItems } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';
import type { MenuItem } from '@/types';
import FoodCard from '@/components/FoodCard';

export default function FoodDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, setIsOpen } = useCart();
  const { showToast } = useToast();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [related, setRelated] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchMenuItemBySlug(slug)
      .then(async (data) => {
        setItem(data);
        if (data) {
          const all = await fetchMenuItems();
          setRelated(all.filter((i) => i.category_id === data.category_id && i.id !== data.id).slice(0, 4));
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!item) return;
    for (let i = 0; i < quantity; i++) addItem(item);
    setAdded(true);
    showToast(`${item.name} added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!item) return;
    for (let i = 0; i < quantity; i++) addItem(item);
    setIsOpen(true);
  };

  if (loading) {
    return (
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-3xl bg-charcoal-800 animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 bg-charcoal-800 rounded-xl animate-pulse w-3/4" />
            <div className="h-6 bg-charcoal-800 rounded-xl animate-pulse w-1/2" />
            <div className="h-32 bg-charcoal-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-32 px-4 text-center">
        <p className="text-charcoal-400 text-lg mb-4">Dish not found</p>
        <Link to="/menu" className="btn-primary">Back to Menu</Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button onClick={() => navigate('/menu')} className="flex items-center gap-2 text-charcoal-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="relative rounded-3xl overflow-hidden card">
              <img src={item.image_url || ''} alt={item.name} className="w-full h-[400px] md:h-[500px] object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                {item.is_popular && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white text-sm font-bold rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-white" /> Popular
                  </span>
                )}
                {item.is_spicy && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent-orange text-white text-sm font-bold rounded-lg">
                    <Flame className="w-3.5 h-3.5" /> Spicy
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-3">{item.name}</h1>
            <p className="text-brand-500 font-bold text-3xl mb-6">Rs. {item.price.toLocaleString()}</p>

            <p className="text-charcoal-300 text-lg leading-relaxed mb-8">{item.description}</p>

            {/* Ingredients */}
            {item.ingredients.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ing) => (
                    <span key={ing} className="px-3 py-1.5 bg-charcoal-800 border border-white/5 rounded-lg text-charcoal-200 text-sm">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-white font-semibold">Quantity</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl bg-charcoal-800 border border-white/10 flex items-center justify-center hover:bg-charcoal-700 transition-all">
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="text-white font-bold text-xl w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-xl bg-charcoal-800 border border-white/10 flex items-center justify-center hover:bg-charcoal-700 transition-all">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleAddToCart} disabled={!item.is_available} className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed">
                {added ? <><Check className="w-5 h-5" /> Added!</> : <><Plus className="w-5 h-5" /> Add to Cart</>}
              </button>
              <button onClick={handleBuyNow} disabled={!item.is_available} className="btn-secondary flex-1 disabled:opacity-40 disabled:cursor-not-allowed">
                <ShoppingBag className="w-5 h-5" /> Buy Now
              </button>
            </div>

            {!item.is_available && (
              <p className="text-accent-orange text-sm mt-3">This item is currently unavailable.</p>
            )}
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-3xl text-white mb-6">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((r, i) => (
                <FoodCard key={r.id} item={r} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
