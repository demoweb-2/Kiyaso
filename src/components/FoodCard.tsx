import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Star, Flame } from 'lucide-react';
import type { MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';

interface FoodCardProps {
  item: MenuItem;
  index?: number;
}

export default function FoodCard({ item, index = 0 }: FoodCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.is_available) {
      addItem(item);
      showToast(`${item.name} added to cart`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <Link to={`/menu/${item.slug}`} className="group block h-full">
        <div className="card card-hover h-full flex flex-col">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.img
              src={item.image_url || ''}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {item.is_popular && (
                <motion.span
                  initial={{ scale: 0, rotate: -10 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 + 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-600 text-white text-xs font-bold rounded-lg shadow-lg"
                >
                  <Star className="w-3 h-3 fill-white" />
                  Popular
                </motion.span>
              )}
              {item.is_spicy && (
                <motion.span
                  initial={{ scale: 0, rotate: 10 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 + 0.3, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent-orange text-white text-xs font-bold rounded-lg shadow-lg"
                >
                  <Flame className="w-3 h-3" />
                  Spicy
                </motion.span>
              )}
            </div>
            {!item.is_available && (
              <div className="absolute inset-0 bg-charcoal-950/80 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">Unavailable</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-white font-bold text-base leading-tight mb-1 group-hover:text-brand-500 transition-colors">
              {item.name}
            </h3>
            <p className="text-charcoal-400 text-sm line-clamp-2 mb-3 flex-1">
              {item.description}
            </p>
            <div className="flex items-center justify-between gap-2 mt-auto">
              <span className="text-brand-500 font-bold text-lg">
                Rs. {item.price.toLocaleString()}
              </span>
              <motion.button
                onClick={handleAdd}
                disabled={!item.is_available}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
