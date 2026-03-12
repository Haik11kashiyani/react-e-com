import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Layout
import Menu from './components/menu'
import Footer from './components/footer'
import ScrollToTop from './components/common/ScrollToTop'
import PageTransition from './components/layout/PageTransition'
import CartProvider from './hooks/CartProvider'
import ThemeProvider from './hooks/ThemeProvider'

// Home components
import HeroSec from './components/heroSec'
import CoresolMarq from './components/coresolMarq'
import CategoryShowcase from './components/CategoryShowcase'
import FeaturedProducts from './components/FeaturedProducts'
import Testimonials from './components/Testimonials'
import BrandFeatures from './components/BrandFeatures'

// Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import ForgotPassword from './pages/ForgotPassword'

// Styles
import './styles/animations.css'

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  return (
    <ThemeProvider>
    <CartProvider>
      <ScrollToTop />
      <div>
        <Menu />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <PageTransition>
                <HeroSec />
                <CategoryShowcase />
                <CoresolMarq />
                <FeaturedProducts />
                <Testimonials />
                <BrandFeatures />
              </PageTransition>
            } />
            <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
            <Route path="/products/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
            <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
            <Route path="/terms-conditions" element={<PageTransition><TermsConditions /></PageTransition>} />
          </Routes>
        </AnimatePresence>
        {!isAuthPage && <Footer />}
      </div>
    </CartProvider>
    </ThemeProvider>
  )
}

export default App