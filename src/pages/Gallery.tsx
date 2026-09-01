import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchGallery } from '@/lib/data';
import type { GalleryItem } from '@/types';

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery().then(setItems).finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = activeCategory === 'All' ? items : items.filter((i) => i.category === activeCategory);

  return (
    <div className="pt-20">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label mb-3 justify-center">Moments</span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-4">
              OUR <span className="text-brand-600">GALLERY</span>
            </h1>
            <p className="text-charcoal-400 max-w-xl mx-auto">A glimpse into the Kiyaso experience — food, kitchen, and ambiance.</p>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 sticky top-16 z-30 bg-charcoal-950/95 backdrop-blur-lg border-y border-white/5">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide justify-center">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-brand-600 text-white' : 'bg-charcoal-900 text-charcoal-300 border border-white/10 hover:border-white/20'}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="mb-4 aspect-square rounded-2xl bg-charcoal-800 animate-pulse break-inside-avoid" />)}
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {filtered.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (i % 8) * 0.05 }} className="mb-4 break-inside-avoid cursor-pointer group relative rounded-2xl overflow-hidden" onClick={() => setLightbox(item.image_url)}>
                  <img src={item.image_url} alt={item.title || `Gallery ${i + 1}`} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/40 transition-all flex items-end p-4">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.title && <p className="text-white font-semibold text-sm">{item.title}</p>}
                      <p className="text-charcoal-300 text-xs">{item.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4 cursor-pointer" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Gallery" className="max-w-full max-h-full rounded-2xl" />
        </div>
      )}
    </div>
  );
}
