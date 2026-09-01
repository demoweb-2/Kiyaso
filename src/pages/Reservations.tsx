import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, CheckCircle, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { fetchBranches, createReservation } from '@/lib/data';
import type { Branch } from '@/types';

const schema = z.object({
  branch_id: z.string().min(1, 'Please select a branch'),
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  guests: z.coerce.number().min(1, 'At least 1 guest').max(20, 'Max 20 guests'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  special_requests: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const timeSlots = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

export default function Reservations() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchBranches().then(setBranches);
  }, []);

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await createReservation({
        branch_id: data.branch_id,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        guests: data.guests,
        date: data.date,
        time: data.time,
        special_requests: data.special_requests || null,
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (submitted) {
    return (
      <div className="pt-32 pb-20 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center card p-12">
          <div className="w-20 h-20 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent-green" />
          </div>
          <h2 className="font-display text-3xl text-white mb-3">RESERVATION RECEIVED!</h2>
          <p className="text-charcoal-300 mb-8">We've received your reservation request. Our team will confirm your booking shortly via phone.</p>
          <button onClick={() => setSubmitted(false)} className="btn-primary">Make Another Reservation</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label mb-3 justify-center">Book a Table</span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-4">
              MAKE A <span className="text-brand-600">RESERVATION</span>
            </h1>
            <p className="text-charcoal-400 max-w-xl mx-auto">Reserve your table at either of our branches. We'll confirm your booking shortly.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 md:p-8 space-y-5">
            {error && <div className="p-4 bg-accent-orange/10 border border-accent-orange/30 rounded-xl text-accent-orange text-sm">{error}</div>}

            {/* Branch */}
            <div>
              <label className="text-white font-semibold text-sm mb-2 block">Branch</label>
              <select {...register('branch_id')} className="input-field cursor-pointer">
                <option value="">Select a branch</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              {errors.branch_id && <p className="text-accent-orange text-xs mt-1">{errors.branch_id.message}</p>}
            </div>

            {/* Name + Phone */}
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

            {/* Email */}
            <div>
              <label className="text-white font-semibold text-sm mb-2 block">Email (optional)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                <input {...register('email')} placeholder="you@email.com" className="input-field pl-10" />
              </div>
              {errors.email && <p className="text-accent-orange text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Guests + Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-white font-semibold text-sm mb-2 block">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                  <input type="number" {...register('guests')} defaultValue={2} min={1} max={20} className="input-field pl-10" />
                </div>
                {errors.guests && <p className="text-accent-orange text-xs mt-1">{errors.guests.message}</p>}
              </div>
              <div>
                <label className="text-white font-semibold text-sm mb-2 block">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                  <input type="date" {...register('date')} min={today} className="input-field pl-10" />
                </div>
                {errors.date && <p className="text-accent-orange text-xs mt-1">{errors.date.message}</p>}
              </div>
              <div>
                <label className="text-white font-semibold text-sm mb-2 block">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                  <select {...register('time')} className="input-field pl-10 cursor-pointer">
                    <option value="">Select</option>
                    {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {errors.time && <p className="text-accent-orange text-xs mt-1">{errors.time.message}</p>}
              </div>
            </div>

            {/* Special requests */}
            <div>
              <label className="text-white font-semibold text-sm mb-2 block">Special Requests (optional)</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-charcoal-500" />
                <textarea {...register('special_requests')} rows={3} placeholder="Any special requirements..." className="input-field pl-10 resize-none" />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
              {isSubmitting ? 'Submitting...' : 'Request Reservation'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
