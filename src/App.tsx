import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ScrollToTop from '@/components/ScrollToTop';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Menu from '@/pages/Menu';
import FoodDetails from '@/pages/FoodDetails';
import Branches from '@/pages/Branches';
import Reservations from '@/pages/Reservations';
import Delivery from '@/pages/Delivery';
import Catering from '@/pages/Catering';
import Gallery from '@/pages/Gallery';
import Offers from '@/pages/Offers';
import Careers from '@/pages/Careers';
import Contact from '@/pages/Contact';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Admin from '@/pages/Admin';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const } },
};

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
          <Route path="/admin" element={<Admin />} />
        </Routes>
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
        <ScrollToTop />
        <AppShell />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
