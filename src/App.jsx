import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Layout
import Menu from './components/menu'
import Footer from './components/footer'
import ScrollToTop from './components/common/ScrollToTop'
import PageTransition from './components/layout/PageTransition'
import CartProvider from './hooks/CartProvider'

// Home components
import HeroSec from './components/heroSec'
import CoresolMarq from './components/coresolMarq'
import ProductCompare from './components/ProductCompare'
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

// Styles
import './styles/animations.css'

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <CartProvider>
      <ScrollToTop />
      <div>
        <Menu />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <PageTransition>
                <HeroSec />
                <CoresolMarq />
                <ProductCompare />
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
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          </Routes>
        </AnimatePresence>
        {!isAuthPage && <Footer />}
      </div>
    </CartProvider>
  )
}

export default App