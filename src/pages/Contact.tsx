import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Clock, CheckCircle, User, MessageSquare } from 'lucide-react';
import { createContactMessage, fetchBranches } from '@/lib/data';
import { useEffect } from 'react';
import type { Branch } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message is required'),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => { fetchBranches().then(setBranches); }, []);

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await createContactMessage({ name: data.name, phone: data.phone, email: data.email || null, subject: data.subject || null, message: data.message });
      setSubmitted(true);
    } catch { setError('Something went wrong. Please try again.'); }
  };

  return (
    <div className="pt-20">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label mb-3 justify-center">Get in Touch</span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-4">
              CONTACT <span className="text-brand-600">US</span>
            </h1>
            <p className="text-charcoal-400 max-w-xl mx-auto">Questions, feedback, or just want to say hello? We'd love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            {branches.map((branch, i) => (
              <motion.div key={branch.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{branch.name}</h3>
                    <p className="text-charcoal-400 text-sm">{branch.address}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 ml-16">
                  <a href={`tel:${branch.phone}`} className="flex items-center gap-2 text-charcoal-300 text-sm hover:text-brand-500 transition-colors">
                    <Phone className="w-4 h-4" /> {branch.phone}
                  </a>
                  <span className="flex items-center gap-2 text-charcoal-300 text-sm">
                    <Clock className="w-4 h-4" /> 11AM - 10PM
                  </span>
                </div>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-green flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">WhatsApp</h3>
                  <p className="text-charcoal-400 text-sm mb-2">Chat with us directly on WhatsApp for quick responses.</p>
                  <a href="https://wa.me/94812345678" target="_blank" rel="noopener noreferrer" className="text-accent-green font-semibold text-sm">+94 81 234 5678</a>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Email</h3>
                  <a href="mailto:hello@kiyaso.lk" className="text-brand-500 font-semibold text-sm">hello@kiyaso.lk</a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-12 text-center h-full flex flex-col items-center justify-center">
                <CheckCircle className="w-16 h-16 text-accent-green mb-4" />
                <h3 className="font-display text-2xl text-white mb-2">MESSAGE SENT!</h3>
                <p className="text-charcoal-300 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary">Send Another</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="card p-6 md:p-8 space-y-5">
                <h2 className="text-white font-bold text-xl mb-2">Send a Message</h2>
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
                <div>
                  <label className="text-white font-semibold text-sm mb-2 block">Subject (optional)</label>
                  <input {...register('subject')} placeholder="What's this about?" className="input-field" />
                </div>
                <div>
                  <label className="text-white font-semibold text-sm mb-2 block">Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-charcoal-500" />
                    <textarea {...register('message')} rows={4} placeholder="Your message..." className="input-field pl-10 resize-none" />
                  </div>
                  {errors.message && <p className="text-accent-orange text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
