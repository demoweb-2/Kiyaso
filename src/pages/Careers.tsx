import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle, User, Phone, Mail, Briefcase, MessageSquare, Trash2 } from 'lucide-react';
import { createCareerApplication, cancelCareerApplication } from '@/lib/data';
import type { CareerApplication } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  position: z.string().min(1, 'Please select a position'),
  message: z.string().min(10, 'Tell us why you\'d be a good fit'),
});

type FormData = z.infer<typeof schema>;

const positions = ['Head Chef', 'Sous Chef', 'Line Cook', 'Kitchen Staff', 'Waiter/Waitress', 'Cashier', 'Delivery Rider', 'Manager', 'Cleaner', 'Other'];
const benefits = [
  { title: 'Competitive Pay', desc: 'Above industry standard salaries' },
  { title: 'Growth Opportunities', desc: 'Promote from within culture' },
  { title: 'Staff Meals', desc: 'Free meals during shifts' },
  { title: 'Flexible Hours', desc: 'Full-time and part-time roles' },
];

export default function Careers() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [appId, setAppId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const app: CareerApplication = await createCareerApplication({ name: data.name, phone: data.phone, email: data.email || null, position: data.position, message: data.message });
      setAppId(app.id);
      setSubmitted(true);
    } catch { setError('Something went wrong. Please try again.'); }
  };

  const FIVE_MIN = 5 * 60 * 1000;
  const canCancel = appId && elapsed < FIVE_MIN;
  const remainingMs = FIVE_MIN - elapsed;
  const remainingMin = Math.floor(remainingMs / 60000);
  const remainingSec = Math.floor((remainingMs % 60000) / 1000);

  useEffect(() => {
    if (!submitted || !appId) return;
    const start = Date.now();
    const interval = setInterval(() => setElapsed(Date.now() - start), 1000);
    return () => clearInterval(interval);
  }, [submitted, appId]);

  const handleCancel = async () => {
    if (!appId) return;
    if (!confirm('Cancel this application? This cannot be undone.')) return;
    setCancelling(true);
    try {
      await cancelCareerApplication(appId);
      setSubmitted(false);
      setAppId(null);
      setElapsed(0);
    } finally { setCancelling(false); }
  };

  return (
    <div className="pt-20">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/5779787/pexels-photo-5779787.jpeg?auto=compress&cs=tinysrgb&h=800&w=1920" alt="Careers" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal-950/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label mb-3 justify-center">Join Our Team</span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-4">
              BUILD YOUR <span className="text-brand-600">CAREER</span>
            </h1>
            <p className="text-charcoal-200 text-lg max-w-xl mx-auto">Join the Kiyaso family. We're always looking for passionate people who love great food and great service.</p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-12">WHY WORK WITH US</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center card-hover">
                <h3 className="text-white font-bold text-base mb-1">{b.title}</h3>
                <p className="text-charcoal-400 text-sm">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-8">APPLY NOW</h2>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-12 text-center">
              <CheckCircle className="w-16 h-16 text-accent-green mx-auto mb-4" />
              <h3 className="font-display text-2xl text-white mb-2">APPLICATION SENT!</h3>
              <p className="text-charcoal-300 mb-6">Thank you for your interest. We'll reach out if there's a match.</p>
              {canCancel && (
                <div className="mb-6">
                  <p className="text-accent-orange text-sm mb-3">Cancel within {remainingMin}m {remainingSec}s</p>
                  <button onClick={handleCancel} disabled={cancelling} className="btn-primary disabled:opacity-50">
                    <Trash2 className="w-4 h-4" /> {cancelling ? 'Cancelling...' : 'Cancel Application'}
                  </button>
                </div>
              )}
              <button onClick={() => { setSubmitted(false); setAppId(null); setElapsed(0); }} className="btn-outline">New Application</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="card p-6 md:p-8 space-y-5">
              {error && <div className="p-4 bg-accent-orange/10 border border-accent-orange/30 rounded-xl text-accent-orange text-sm">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold text-sm mb-2 block">Full Name</label>
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
              <div>
                <label className="text-white font-semibold text-sm mb-2 block">Position</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                  <select {...register('position')} className="input-field pl-10 cursor-pointer">
                    <option value="">Select position</option>
                    {positions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                {errors.position && <p className="text-accent-orange text-xs mt-1">{errors.position.message}</p>}
              </div>
              <div>
                <label className="text-white font-semibold text-sm mb-2 block">Why should we hire you?</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-charcoal-500" />
                  <textarea {...register('message')} rows={4} placeholder="Tell us about your experience and why you'd be a great fit..." className="input-field pl-10 resize-none" />
                </div>
                {errors.message && <p className="text-accent-orange text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
