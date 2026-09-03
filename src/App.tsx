import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ScrollToTop from '@/components/ScrollToTop';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Menu = lazy(() => import('@/pages/Menu'));
const FoodDetails = lazy(() => import('@/pages/FoodDetails'));
const Branches = lazy(() => import('@/pages/Branches'));
const Reservations = lazy(() => import('@/pages/Reservations'));
const Delivery = lazy(() => import('@/pages/Delivery'));
const Catering = lazy(() => import('@/pages/Catering'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Offers = lazy(() => import('@/pages/Offers'));
const Careers = lazy(() => import('@/pages/Careers'));
const Contact = lazy(() => import('@/pages/Contact'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'));
const OrderTracking = lazy(() => import('@/pages/OrderTracking'));
const Admin = lazy(() => import('@/pages/Admin'));

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const } },
};

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-brand-600 animate-spin" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:slug" element={<FoodDetails />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/catering" element={<Catering />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/track-order/:orderNumber" element={<OrderTracking />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-charcoal-950">
        <AnimatedRoutes />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/Kiyaso">
      <CartProvider>
        <ToastProvider>
          <ScrollToTop />
          <AppShell />
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
