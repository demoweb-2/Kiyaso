import { motion } from 'framer-motion';
import { Leaf, Award, Truck, Users, Heart, Target, Eye, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/19300593/pexels-photo-19300593.jpeg?auto=compress&cs=tinysrgb&h=800&w=1920"
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-950/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label mb-3 justify-center">Our Story</span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-6">
              THE KIYASO <span className="text-brand-600">JOURNEY</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl max-w-2xl mx-auto text-balance">
              Born from a passion for bold flavors and fresh ingredients, Kiyaso has become a beloved dining destination in Akurana and Matale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="section-label mb-3">Who We Are</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
              PREMIUM CASUAL DINING
            </h2>
            <div className="space-y-4 text-charcoal-300 text-lg leading-relaxed">
              <p>
                Kiyaso — The Taste was founded with a simple mission: to bring bold, authentic flavors to the heart of Sri Lanka. What started as a small kitchen has grown into two thriving branches serving thousands of happy customers.
              </p>
              <p>
                We believe great food doesn't need to be complicated. It needs to be fresh, bold, and made with care. Every dish that leaves our kitchen is a testament to our commitment to quality.
              </p>
              <p>
                From our signature kottu to gourmet burgers, from fresh seafood to indulgent desserts — we craft every plate to deliver an experience worth coming back for.
              </p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.pexels.com/photos/5779781/pexels-photo-5779781.jpeg?auto=compress&cs=tinysrgb&h=500&w=400" alt="Chef" className="rounded-2xl w-full h-64 object-cover" loading="lazy" />
              <img src="https://images.pexels.com/photos/8753672/pexels-photo-8753672.jpeg?auto=compress&cs=tinysrgb&h=500&w=400" alt="Food spread" className="rounded-2xl w-full h-64 object-cover mt-8" loading="lazy" />
              <img src="https://images.pexels.com/photos/11923047/pexels-photo-11923047.jpeg?auto=compress&cs=tinysrgb&h=500&w=400" alt="Interior" className="rounded-2xl w-full h-64 object-cover -mt-8" loading="lazy" />
              <img src="https://images.pexels.com/photos/5176006/pexels-photo-5176006.jpeg?auto=compress&cs=tinysrgb&h=500&w=400" alt="Food" className="rounded-2xl w-full h-64 object-cover" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label mb-3">Our Values</span>
            <h2 className="font-display text-4xl md:text-5xl text-white">WHAT DRIVES US</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Target, title: 'Our Mission', desc: 'Deliver bold, fresh, and memorable dining experiences to every guest.' },
              { icon: Eye, title: 'Our Vision', desc: 'Be the most loved premium casual dining brand in Sri Lanka.' },
              { icon: Heart, title: 'Our Promise', desc: 'Quality you can taste, service you can feel, every single time.' },
              { icon: Flame, title: 'Our Passion', desc: 'Every dish is crafted with fire, flavor, and genuine care.' },
            ].map((val, i) => (
              <motion.div key={val.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="card p-6 card-hover">
                <div className="w-14 h-14 rounded-2xl bg-brand-600/20 flex items-center justify-center mb-4">
                  <val.icon className="w-7 h-7 text-brand-500" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{val.title}</h3>
                <p className="text-charcoal-400 text-sm">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '28+', label: 'Menu Items' },
              { value: '2', label: 'Branches' },
              { value: '4.8', label: 'Avg Rating' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="font-display text-5xl md:text-6xl text-brand-600 mb-2">{stat.value}</p>
                <p className="text-charcoal-400 text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl text-white mb-6">
            READY TO <span className="text-brand-600">TASTE</span>?
          </h2>
          <p className="text-charcoal-300 text-lg mb-8">Order online or visit us at either branch.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-primary">Order Now</Link>
            <Link to="/reservations" className="btn-outline">Reserve a Table</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
