import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchOffers } from '@/lib/data';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import type { Offer } from '@/types';

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers().then(setOffers).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label mb-3 justify-center">Save More</span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-4">
              SPECIAL <span className="text-brand-600">OFFERS</span>
            </h1>
            <p className="text-charcoal-400 max-w-xl mx-auto">Exclusive deals and seasonal promotions. Don't miss out!</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(3)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-charcoal-800 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer, i) => (
                <motion.div key={offer.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card overflow-hidden card-hover group">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={offer.image_url || ''} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 to-transparent" />
                    {offer.badge_text && (
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-sm font-bold rounded-lg">
                        <Tag className="w-3.5 h-3.5" /> {offer.badge_text}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-bold text-xl mb-2">{offer.title}</h3>
                    <p className="text-charcoal-400 text-sm mb-4">{offer.description}</p>
                    {offer.valid_until && (
                      <p className="text-charcoal-500 text-xs mb-4">Valid until {new Date(offer.valid_until).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    )}
                    <Link to="/menu" className="btn-primary w-full">Order Now <ArrowRight className="w-4 h-4" /></Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
