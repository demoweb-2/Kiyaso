import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Truck, MapPin, Phone, ArrowRight, CheckCircle } from 'lucide-react';

export default function Delivery() {
  return (
    <div className="pt-20">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/4393252/pexels-photo-4393252.jpeg?auto=compress&cs=tinysrgb&h=800&w=1920" alt="Delivery" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal-950/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label mb-3 justify-center">Delivery</span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-4">
              FAST <span className="text-brand-600">DELIVERY</span>
            </h1>
            <p className="text-charcoal-200 text-lg max-w-xl mx-auto mb-8">Hot and fresh to your door in 30-45 minutes. Serving Akurana and Matale.</p>
            <Link to="/menu" className="btn-primary text-base px-8 py-4">Order Now <ArrowRight className="w-5 h-5" /></Link>
          </motion.div>
        </div>
      </section>

      {/* Info cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Clock, title: '30-45 min', desc: 'Average delivery time' },
            { icon: Truck, title: 'Free Delivery', desc: 'On orders above Rs. 2,000' },
            { icon: MapPin, title: 'Two Areas', desc: 'Akurana & Matale' },
          ].map((card, i) => (
            <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center card-hover">
              <div className="w-14 h-14 rounded-2xl bg-brand-600/20 flex items-center justify-center mx-auto mb-4">
                <card.icon className="w-7 h-7 text-brand-500" />
              </div>
              <h3 className="text-white font-bold text-xl mb-1">{card.title}</h3>
              <p className="text-charcoal-400 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">HOW IT WORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Browse Menu', desc: 'Explore our full range of dishes' },
              { step: '02', title: 'Add to Cart', desc: 'Pick your favorites and add to cart' },
              { step: '03', title: 'Checkout', desc: 'Choose delivery, enter your address' },
              { step: '04', title: 'Enjoy!', desc: 'Hot and fresh food at your door' },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="font-display text-5xl text-brand-600/30 mb-2">{item.step}</p>
                <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-charcoal-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">DELIVERY COVERAGE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Akurana', areas: ['Akurana Town', 'Alawathupitiya', 'Harankahawa', 'Kengalla', 'Pujapitiya'], phone: '+94 81 234 5678' },
              { name: 'Matale', areas: ['Matale Town', 'Trincomalee Street', 'Gammaduwa', 'Ukuwela', 'Rattota'], phone: '+94 66 345 6789' },
            ].map((branch, i) => (
              <motion.div key={branch.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
                <h3 className="text-white font-bold text-xl mb-4">{branch.name} Branch</h3>
                <div className="space-y-2 mb-4">
                  {branch.areas.map((area) => (
                    <div key={area} className="flex items-center gap-2 text-sm text-charcoal-300">
                      <CheckCircle className="w-4 h-4 text-accent-green" /> {area}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-400 pt-4 border-t border-white/5">
                  <Phone className="w-4 h-4 text-brand-500" /> {branch.phone}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl text-white mb-6">HUNGRY?</h2>
          <p className="text-charcoal-300 text-lg mb-8">Order now and get it delivered hot and fresh.</p>
          <Link to="/menu" className="btn-primary text-base px-8 py-4">Browse Menu <ArrowRight className="w-5 h-5" /></Link>
        </div>
      </section>
    </div>
  );
}
