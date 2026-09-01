import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle, User, Phone, Mail, Calendar, Users, MessageSquare, Trash2 } from 'lucide-react';
import { createCateringInquiry, cancelCateringInquiry } from '@/lib/data';
import type { CateringInquiry } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  event_type: z.string().min(1, 'Please select event type'),
  event_date: z.string().optional(),
  guest_count: z.number().optional(),
  message: z.string().min(5, 'Please tell us about your event'),
});

type FormData = z.infer<typeof schema>;

const packages = [
  { name: 'Standard Package', price: 'From Rs. 1,500/person', desc: 'Perfect for small gatherings and family events', features: ['Choice of 5 main dishes', '2 sides & salads', 'Rice & bread', 'Dessert', 'Serves up to 50 guests'], image: 'https://images.pexels.com/photos/306046/pexels-photo-306046.jpeg?auto=compress&cs=tinysrgb&h=500&w=700' },
  { name: 'Premium Package', price: 'From Rs. 2,500/person', desc: 'Elevated dining for corporate events and celebrations', features: ['Choice of 8 main dishes', '4 sides & salads', 'Seafood selection', 'Premium desserts', 'Live cooking station', 'Serves up to 150 guests'], image: 'https://images.pexels.com/photos/4005229/pexels-photo-4005229.jpeg?auto=compress&cs=tinysrgb&h=500&w=700' },
  { name: 'Custom Package', price: 'Tailored to your needs', desc: 'Bespoke menu designed around your event', features: ['Fully customized menu', 'Any number of dishes', 'Dedicated event coordinator', 'Staff & setup available', 'No guest limit'], image: 'https://images.pexels.com/photos/8753672/pexels-photo-8753672.jpeg?auto=compress&cs=tinysrgb&h=500&w=700' },
];

const eventTypes = ['Wedding', 'Corporate Event', 'Birthday Party', 'Family Gathering', 'Religious Event', 'Other'];

export default function Catering() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const inquiry: CateringInquiry = await createCateringInquiry({
        name: data.name, phone: data.phone, email: data.email || null,
        event_type: data.event_type, event_date: data.event_date || null,
        guest_count: data.guest_count || null, message: data.message,
      });
      setInquiryId(inquiry.id);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  const FIVE_MIN = 5 * 60 * 1000;
  const canCancel = inquiryId && elapsed < FIVE_MIN;
  const remainingMs = FIVE_MIN - elapsed;
  const remainingMin = Math.floor(remainingMs / 60000);
  const remainingSec = Math.floor((remainingMs % 60000) / 1000);

  useEffect(() => {
    if (!submitted || !inquiryId) return;
    const start = Date.now();
    const interval = setInterval(() => setElapsed(Date.now() - start), 1000);
    return () => clearInterval(interval);
  }, [submitted, inquiryId]);

  const handleCancel = async () => {
    if (!inquiryId) return;
    if (!confirm('Cancel this inquiry? This cannot be undone.')) return;
    setCancelling(true);
    try {
      await cancelCateringInquiry(inquiryId);
      setSubmitted(false);
      setInquiryId(null);
      setElapsed(0);
    } finally { setCancelling(false); }
  };

  return (
    <div className="pt-20">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/8753672/pexels-photo-8753672.jpeg?auto=compress&cs=tinysrgb&h=800&w=1920" alt="Catering" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal-950/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label mb-3 justify-center">Catering</span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-4">
              CATERING <span className="text-brand-600">SERVICES</span>
            </h1>
            <p className="text-charcoal-200 text-lg max-w-xl mx-auto">Make your event unforgettable with Kiyaso's premium catering. From intimate gatherings to large celebrations.</p>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <motion.div key={pkg.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card overflow-hidden card-hover flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-xl mb-1">{pkg.name}</h3>
                  <p className="text-brand-500 font-bold text-lg mb-2">{pkg.price}</p>
                  <p className="text-charcoal-400 text-sm mb-4">{pkg.desc}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-charcoal-300">
                        <CheckCircle className="w-4 h-4 text-accent-green shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#inquiry" className="btn-primary w-full">Inquire Now</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-8">PAST EVENTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['34307855', '28976231', '29086309', '4005229', '8753672', '35247187', '306046', '38431262'].map((id, i) => (
              <motion.div key={id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="aspect-square rounded-2xl overflow-hidden">
                <img src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&h=400&w=400`} alt={`Event ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquiry" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-8">INQUIRE NOW</h2>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-12 text-center">
              <CheckCircle className="w-16 h-16 text-accent-green mx-auto mb-4" />
              <h3 className="font-display text-2xl text-white mb-2">INQUIRY SENT!</h3>
              <p className="text-charcoal-300 mb-6">We'll get back to you within 24 hours to discuss your event.</p>
              {canCancel && (
                <div className="mb-6">
                  <p className="text-accent-orange text-sm mb-3">Cancel within {remainingMin}m {remainingSec}s</p>
                  <button onClick={handleCancel} disabled={cancelling} className="btn-primary disabled:opacity-50">
                    <Trash2 className="w-4 h-4" /> {cancelling ? 'Cancelling...' : 'Cancel Inquiry'}
                  </button>
                </div>
              )}
              <button onClick={() => { setSubmitted(false); setInquiryId(null); setElapsed(0); }} className="btn-outline">New Inquiry</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="card p-6 md:p-8 space-y-5">
              {error && <div className="p-4 bg-accent-orange/10 border border-accent-orange/30 rounded-xl text-accent-orange text-sm">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold text-sm mb-2 block">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                    <input {...register('name')} placeholder="Your name" className="input-field pl-10" />
                  </div>
                  {errors.name && <p className="text-accent-orange text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="text-white font-semibold text-sm mb-2 block">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                    <input {...register('phone')} placeholder="+94 77 123 4567" className="input-field pl-10" />
                  </div>
                  {errors.phone && <p className="text-accent-orange text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div>
                <label className="text-white font-semibold text-sm mb-2 block">Email (optional)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                  <input {...register('email')} placeholder="you@email.com" className="input-field pl-10" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-white font-semibold text-sm mb-2 block">Event Type</label>
                  <select {...register('event_type')} className="input-field cursor-pointer">
                    <option value="">Select</option>
                    {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.event_type && <p className="text-accent-orange text-xs mt-1">{errors.event_type.message}</p>}
                </div>
                <div>
                  <label className="text-white font-semibold text-sm mb-2 block">Event Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                    <input type="date" {...register('event_date')} className="input-field pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-white font-semibold text-sm mb-2 block">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                    <input type="number" {...register('guest_count')} placeholder="50" min={1} className="input-field pl-10" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-white font-semibold text-sm mb-2 block">Tell us about your event</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-charcoal-500" />
                  <textarea {...register('message')} rows={4} placeholder="Describe your event, dietary preferences, etc." className="input-field pl-10 resize-none" />
                </div>
                {errors.message && <p className="text-accent-orange text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
