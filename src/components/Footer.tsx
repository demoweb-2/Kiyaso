import { Link } from 'react-router-dom';
import { Flame, Facebook, Instagram, MessageCircle, MapPin, Phone, Mail, Clock, Youtube, Music } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const settings = useSettings();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const socials = settings?.social_links;
  const socialIcons: { key: string; icon: typeof Facebook; url: string }[] = [];
  if (socials?.facebook) socialIcons.push({ key: 'facebook', icon: Facebook, url: socials.facebook });
  if (socials?.instagram) socialIcons.push({ key: 'instagram', icon: Instagram, url: socials.instagram });
  if (socials?.tiktok) socialIcons.push({ key: 'tiktok', icon: Music, url: socials.tiktok });
  if (socials?.whatsapp) socialIcons.push({ key: 'whatsapp', icon: MessageCircle, url: socials.whatsapp });
  if (socials?.youtube) socialIcons.push({ key: 'youtube', icon: Youtube, url: socials.youtube });

  return (
    <footer className="bg-charcoal-950 border-t border-white/5 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt="Kiyaso"
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              )}
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl text-white tracking-wide">
                  {settings?.restaurant_name?.toUpperCase() || 'KIYASO'}
                </span>
                <span className="text-[10px] text-brand-500 font-semibold uppercase tracking-[0.2em]">
                  {settings?.tagline || 'The Taste'}
                </span>
              </div>
            </Link>
            <p className="text-charcoal-300 text-sm leading-relaxed mb-6 max-w-xs">
              Premium casual dining with bold flavors and fresh ingredients. Two branches serving Akurana and Matale.
            </p>
            <div className="flex gap-3">
              {socialIcons.map(({ key, icon: Icon, url }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-600 hover:border-brand-600 transition-all"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: 'Menu', path: '/menu' },
                { label: 'Reservations', path: '/reservations' },
                { label: 'Delivery', path: '/delivery' },
                { label: 'Catering', path: '/catering' },
                { label: 'Gallery', path: '/gallery' },
                { label: 'Offers', path: '/offers' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-charcoal-300 text-sm hover:text-brand-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                <p className="text-charcoal-300 text-sm">{settings?.address || 'Akurana & Matale, Sri Lanka'}</p>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <a href={`tel:${settings?.phone || '+94812345678'}`} className="text-charcoal-300 text-sm hover:text-brand-500 transition-colors">
                  {settings?.phone || '+94 81 234 5678'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <a href={`mailto:${settings?.email || 'hello@kiyaso.lk'}`} className="text-charcoal-300 text-sm hover:text-brand-500 transition-colors">
                  {settings?.email || 'hello@kiyaso.lk'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                <p className="text-charcoal-300 text-sm">Daily 11:00 AM - 10:00 PM</p>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Newsletter</h4>
            <p className="text-charcoal-300 text-sm mb-4">
              Get exclusive offers and updates delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="input-field"
              />
              <button type="submit" className="btn-primary w-full">
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-charcoal-400 text-sm">
            © {new Date().getFullYear()} {settings?.restaurant_name || 'Kiyaso'} — {settings?.tagline || 'The Taste'}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/about" className="text-charcoal-400 text-sm hover:text-brand-500 transition-colors">
              About
            </Link>
            <Link to="/careers" className="text-charcoal-400 text-sm hover:text-brand-500 transition-colors">
              Careers
            </Link>
            <Link to="/admin" className="text-charcoal-400 text-sm hover:text-brand-500 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
