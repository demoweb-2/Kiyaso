import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Star,
  Clock,
  Truck,
  Leaf,
  Award,
  Users,
  MapPin,
  Phone,
  Calendar,
  Quote,
} from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import {
  fetchCategories,
  fetchPopularItems,
  fetchBranches,
  fetchTestimonials,
  fetchOffers,
} from '@/lib/data';
import type { Category, MenuItem, Branch, Testimonial, Offer } from '@/types';

const heroImage = 'https://images.pexels.com/photos/5779781/pexels-photo-5779781.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.15]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 600], [0, 100]);

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      fetchPopularItems(),
      fetchBranches(),
      fetchTestimonials(),
      fetchOffers(),
    ])
      .then(([cats, items, brs, tests, offs]) => {
        setCategories(cats);
        setPopularItems(items);
        setBranches(brs);
        setTestimonials(tests);
        setOffers(offs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale, y: heroY }}>
          <img
            src={heroImage}
            alt="Kiyaso chef cooking with flames"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/70 via-charcoal-950/50 to-charcoal-950" />
        </motion.div>

        <motion.div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20" style={{ opacity: heroOpacity }}>
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-semibold text-white mb-6"
            >
              <Star className="w-4 h-4 text-accent-gold fill-accent-gold" />
              Premium Casual Dining
            </motion.span>

            <motion.h1
              variants={item}
              className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white text-shadow-glow leading-[0.9] mb-6"
            >
              THE TASTE OF
              <br />
              <span className="text-brand-600">PERFECTION</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-charcoal-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 text-balance"
            >
              Bold flavors. Fresh ingredients. Fast service. Experience Kiyaso — where every dish is crafted to perfection.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/menu" className="btn-primary text-base px-8 py-4">
                  Order Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/reservations" className="btn-outline text-base px-8 py-4">
                  <Calendar className="w-5 h-5" />
                  Reserve a Table
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-charcoal-300"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============ FEATURED CATEGORIES ============ */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="section-label mb-3">Explore</span>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
              OUR CATEGORIES
            </h2>
            <p className="text-charcoal-400 max-w-xl mx-auto">
              From Sri Lankan classics to gourmet burgers — find your favorite.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                >
                  <Link
                    to={`/menu?category=${cat.slug}`}
                    className="group relative block aspect-square rounded-2xl overflow-hidden card card-hover"
                  >
                    <img
                      src={cat.image_url || ''}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg md:text-xl group-hover:text-brand-500 transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ SIGNATURE DISHES ============ */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <span className="section-label mb-3">Most Loved</span>
              <h2 className="font-display text-4xl md:text-5xl text-white">
                SIGNATURE DISHES
              </h2>
            </div>
            <Link to="/menu" className="text-brand-500 font-semibold hover:text-brand-400 transition-colors flex items-center gap-2">
              View Full Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularItems.map((item, i) => (
                <FoodCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ WHY KIYASO ============ */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="section-label mb-3">Why Choose Us</span>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              THE KIYASO DIFFERENCE
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Leaf, title: 'Fresh Ingredients', desc: 'Sourced daily from local markets', color: 'text-accent-green' },
              { icon: Award, title: 'Premium Taste', desc: 'Recipes perfected over years', color: 'text-accent-gold' },
              { icon: Truck, title: 'Fast Delivery', desc: '30-45 min to your door', color: 'text-brand-500' },
              { icon: Users, title: 'Family Friendly', desc: 'A warm welcome for everyone', color: 'text-accent-orange' },
              { icon: MapPin, title: 'Multiple Branches', desc: 'Akurana & Matale', color: 'text-brand-400' },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="card p-6 text-center card-hover"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4"
                >
                  <feat.icon className={`w-7 h-7 ${feat.color}`} />
                </motion.div>
                <h3 className="text-white font-bold text-base mb-2">{feat.title}</h3>
                <p className="text-charcoal-400 text-sm">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OFFERS BANNER ============ */}
      {offers.length > 0 && (
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="section-label mb-3">Limited Time</span>
              <h2 className="font-display text-4xl md:text-5xl text-white">
                SPECIAL OFFERS
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offers.map((offer, i) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8 }}
                  className="card card-hover relative overflow-hidden group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={offer.image_url || ''}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 to-transparent" />
                    {offer.badge_text && (
                      <motion.span
                        initial={{ scale: 0, rotate: -5 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                        className="absolute top-4 right-4 bg-brand-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg"
                      >
                        {offer.badge_text}
                      </motion.span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-bold text-xl mb-2">{offer.title}</h3>
                    <p className="text-charcoal-400 text-sm">{offer.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/offers" className="btn-outline">
                See All Offers <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ DELIVERY SECTION ============ */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="section-label mb-3">Delivery</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                FAST. FRESH.
                <br />
                <span className="text-brand-600">TO YOUR DOOR.</span>
              </h2>
              <p className="text-charcoal-300 text-lg mb-8 max-w-md">
                Hot and fresh in 30-45 minutes. Free delivery on orders above Rs. 2,000. Serving both Akurana and Matale areas.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: Clock, label: 'Estimated Delivery', value: '30-45 minutes' },
                  { icon: Truck, label: 'Free Delivery', value: 'Orders above Rs. 2,000' },
                  { icon: MapPin, label: 'Coverage Area', value: 'Akurana & Matale' },
                ].map((dItem, i) => (
                  <motion.div
                    key={dItem.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-11 h-11 rounded-xl bg-brand-600/20 flex items-center justify-center shrink-0"
                    >
                      <dItem.icon className="w-5 h-5 text-brand-500" />
                    </motion.div>
                    <div>
                      <p className="text-charcoal-400 text-sm">{dItem.label}</p>
                      <p className="text-white font-semibold">{dItem.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link to="/delivery" className="btn-primary">
                Order Delivery <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="rounded-3xl overflow-hidden card"
              >
                <img
                  src="https://images.pexels.com/photos/4393252/pexels-photo-4393252.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200"
                  alt="Food delivery"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ BRANCHES ============ */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-px-8 bg-charcoal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="section-label mb-3">Visit Us</span>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              OUR BRANCHES
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map((branch, i) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="card p-6 card-hover"
              >
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center shrink-0"
                  >
                    <MapPin className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl mb-1">{branch.name}</h3>
                    <p className="text-charcoal-400 text-sm">{branch.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-charcoal-300">
                    <Phone className="w-4 h-4 text-brand-500" />
                    {branch.phone}
                  </div>
                  <div className="flex items-center gap-2 text-charcoal-300">
                    <Clock className="w-4 h-4 text-brand-500" />
                    Daily 11AM - 10PM
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href={branch.map_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center btn-secondary !py-2.5 text-sm"
                  >
                    Directions
                  </a>
                  <Link to="/branches" className="flex-1 text-center btn-primary !py-2.5 text-sm">
                    Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GALLERY PREVIEW ============ */}
      <GalleryPreview />

      {/* ============ TESTIMONIALS ============ */}
      <Testimonials testimonials={testimonials} loading={loading} />

      {/* ============ RESERVATION CTA ============ */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/11923047/pexels-photo-11923047.jpeg?auto=compress&cs=tinysrgb&h=800&w=1920"
            alt="Restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-950/85" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-label mb-3 justify-center">Book a Table</span>
            <h2 className="font-display text-4xl md:text-6xl text-white mb-6 text-shadow-glow">
              RESERVE YOUR
              <br />
              <span className="text-brand-600">EXPERIENCE</span>
            </h2>
            <p className="text-charcoal-200 text-lg mb-10 max-w-xl mx-auto">
              Join us for an unforgettable dining experience. Reserve your table at either of our branches.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/reservations" className="btn-primary text-base px-8 py-4">
                <Calendar className="w-5 h-5" />
                Book a Table
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ============ GALLERY PREVIEW ============
function GalleryPreview() {
  const [images, setImages] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    import('@/lib/data').then(({ fetchGallery }) => {
      fetchGallery().then((items) => setImages(items.slice(0, 8).map((i) => i.image_url)));
    });
  }, []);

  const galleryImages = [
    'https://images.pexels.com/photos/5176006/pexels-photo-5176006.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    'https://images.pexels.com/photos/12653336/pexels-photo-12653336.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/34683317/pexels-photo-34683317.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    'https://images.pexels.com/photos/6617983/pexels-photo-6617983.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/10692546/pexels-photo-10692546.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    'https://images.pexels.com/photos/38550576/pexels-photo-38550576.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/5779781/pexels-photo-5779781.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    'https://images.pexels.com/photos/8753672/pexels-photo-8753672.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  ];

  const displayImages = images.length > 0 ? images : galleryImages;

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="section-label mb-3">Moments</span>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              GALLERY
            </h2>
          </div>
          <Link to="/gallery" className="text-brand-500 font-semibold hover:text-brand-400 transition-colors flex items-center gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                i % 5 === 0 || i % 5 === 3 ? 'row-span-2 aspect-[1/2]' : 'aspect-square'
              }`}
              onClick={() => setLightbox(img)}
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/30 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>

      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            src={lightbox}
            alt="Gallery"
            className="max-w-full max-h-full rounded-2xl"
          />
        </motion.div>
      )}
    </section>
  );
}

// ============ TESTIMONIALS ============
function Testimonials({ testimonials, loading }: { testimonials: Testimonial[]; loading: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (loading || testimonials.length === 0) return null;

  const current = testimonials[index];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label mb-3 justify-center">Reviews</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-12">
            WHAT OUR GUESTS SAY
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="card p-8 md:p-12"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="inline-block mb-6"
            >
              <Quote className="w-10 h-10 text-brand-600 mx-auto" />
            </motion.div>
            <p className="text-charcoal-100 text-lg md:text-xl leading-relaxed mb-6 text-balance">
              "{current.text}"
            </p>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                >
                  <Star
                    className={`w-5 h-5 ${i < current.rating ? 'text-accent-gold fill-accent-gold' : 'text-charcoal-600'}`}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold"
              >
                {current.name.charAt(0)}
              </motion.div>
              <div className="text-left">
                <p className="text-white font-semibold">{current.name}</p>
                <p className="text-charcoal-400 text-sm">via {current.source}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-brand-600' : 'w-2 bg-charcoal-600 hover:bg-charcoal-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
