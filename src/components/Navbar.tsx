import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Flame } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/hooks/useSettings';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Menu', path: '/menu' },
  { label: 'Branches', path: '/branches' },
  { label: 'Reservations', path: '/reservations' },
  { label: 'Delivery', path: '/delivery' },
  { label: 'Catering', path: '/catering' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Offers', path: '/offers' },
  { label: 'Careers', path: '/careers' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, setIsOpen } = useCart();
  const settings = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'liquid-glass-nav py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt="Kiyaso"
                className="w-10 h-10 rounded-xl object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="relative w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
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

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-brand-500'
                    : 'text-charcoal-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="relative w-10 h-10 rounded-xl liquid-glass liquid-glass-hover flex items-center justify-center transition-all"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/menu')}
              className="hidden sm:inline-flex btn-primary !py-2.5 !px-5 text-sm"
            >
              Order Now
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-xl liquid-glass liquid-glass-hover flex items-center justify-center"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden liquid-glass pt-24 pb-8 overflow-y-auto"
          >
            <nav className="flex flex-col px-6 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center justify-between py-4 px-4 rounded-xl text-lg font-semibold transition-all ${
                      isActive(link.path)
                        ? 'bg-brand-600/20 text-brand-500 border-l-2 border-brand-600'
                        : 'text-charcoal-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <button
                onClick={() => navigate('/menu')}
                className="btn-primary mt-4 w-full"
              >
                Order Now
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
