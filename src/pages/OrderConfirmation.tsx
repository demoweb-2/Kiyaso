import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Phone, ArrowRight } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderNumber = (location.state as { orderNumber?: string })?.orderNumber || 'KY00000000';
  const total = (location.state as { total?: number })?.total || 0;

  return (
    <div className="pt-32 pb-20 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="max-w-lg mx-auto text-center">
        <div className="w-24 h-24 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-accent-green" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-white mb-3">ORDER PLACED!</h1>
        <p className="text-charcoal-300 text-lg mb-8">Thank you for your order. We're preparing your food now!</p>

        <div className="card p-6 mb-8 text-left">
          <div className="flex justify-between mb-4">
            <span className="text-charcoal-400 text-sm">Order Number</span>
            <span className="text-white font-bold">{orderNumber}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-charcoal-400 text-sm">Total Amount</span>
            <span className="text-brand-500 font-bold">Rs. {total.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-charcoal-900 rounded-xl mt-4">
            <Clock className="w-5 h-5 text-brand-500 shrink-0" />
            <p className="text-charcoal-300 text-sm">Estimated preparation time: <span className="text-white font-semibold">20-30 minutes</span></p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/menu" className="btn-primary">Order More <ArrowRight className="w-4 h-4" /></Link>
          <a href="tel:+94812345678" className="btn-outline">
            <Phone className="w-4 h-4" /> Call Us
          </a>
        </div>
      </motion.div>
    </div>
  );
}
