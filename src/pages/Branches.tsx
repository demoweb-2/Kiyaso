import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, Truck } from 'lucide-react';
import { fetchBranches } from '@/lib/data';
import type { Branch } from '@/types';

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Branches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches().then(setBranches).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label mb-3 justify-center">Find Us</span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-4">
              OUR <span className="text-brand-600">BRANCHES</span>
            </h1>
            <p className="text-charcoal-400 max-w-xl mx-auto">Visit us at either of our locations for dine-in, pickup, or delivery.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => <div key={i} className="h-96 rounded-2xl bg-charcoal-800 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {branches.map((branch, i) => (
                <motion.div key={branch.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card overflow-hidden card-hover">
                  {/* Map embed */}
                  <div className="relative aspect-[16/10] bg-charcoal-800">
                    <iframe
                      title={branch.name}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(branch.address)}&output=embed`}
                      className="w-full h-full border-0 grayscale invert opacity-80"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl mb-1">{branch.name}</h3>
                        <p className="text-charcoal-400 text-sm">{branch.address}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                        <a href={`tel:${branch.phone}`} className="text-charcoal-300 hover:text-white transition-colors">{branch.phone}</a>
                      </div>
                      {branch.delivery_available && (
                        <div className="flex items-center gap-3 text-sm">
                          <Truck className="w-4 h-4 text-accent-green shrink-0" />
                          <span className="text-charcoal-300">Delivery available</span>
                        </div>
                      )}
                    </div>

                    {/* Hours */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-brand-500" />
                        <h4 className="text-white font-semibold text-sm">Opening Hours</h4>
                      </div>
                      <div className="space-y-1.5">
                        {days.map((day, idx) => (
                          <div key={day} className="flex justify-between text-sm">
                            <span className="text-charcoal-400">{dayLabels[idx]}</span>
                            <span className="text-charcoal-300">{branch.opening_hours[day] || 'Closed'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <a href={branch.map_url || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                      <Navigation className="w-4 h-4" /> Get Directions
                    </a>
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
