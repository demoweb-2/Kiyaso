import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-charcoal-900 border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={totalItems > 0 ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <ShoppingBag className="w-5 h-5 text-brand-500" />
                </motion.div>
                <h2 className="text-white font-bold text-lg">Your Cart</h2>
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <motion.button
                whileTap={{ scale: 0.9, rotate: 90 }}
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4"
                  >
                    <ShoppingBag className="w-8 h-8 text-charcoal-500" />
                  </motion.div>
                  <p className="text-charcoal-300 font-medium mb-1">Your cart is empty</p>
                  <p className="text-charcoal-500 text-sm mb-6">Add some delicious items to get started</p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/menu');
                    }}
                    className="btn-primary"
                  >
                    Browse Menu
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-4 p-3 rounded-xl bg-charcoal-800 border border-white/5"
                      >
                        <img
                          src={item.image_url || ''}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-white font-semibold text-sm truncate">{item.name}</h4>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => removeItem(item.id)}
                              className="text-charcoal-500 hover:text-brand-500 transition-colors shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <p className="text-brand-500 font-bold text-sm mt-1">
                            Rs. {item.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                            >
                              <Minus className="w-3.5 h-3.5 text-white" />
                            </motion.button>
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                              className="text-white font-semibold text-sm w-6 text-center"
                            >
                              {item.quantity}
                            </motion.span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5 text-white" />
                            </motion.button>
                            <span className="text-charcoal-300 text-sm ml-auto">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="border-t border-white/5 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-300 text-sm">Subtotal</span>
                    <motion.span
                      key={subtotal}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className="text-white font-bold text-xl"
                    >
                      Rs. {subtotal.toLocaleString()}
                    </motion.span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/checkout');
                    }}
                    className="btn-primary w-full"
                  >
                    Checkout
                  </motion.button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-charcoal-400 text-sm hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
