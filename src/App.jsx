import React, { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Layout
import Menu from './components/menu'
import Footer from './components/footer'
import ScrollToTop from './components/common/ScrollToTop'
import PageTransition from './components/layout/PageTransition'
import CartProvider from './hooks/CartProvider'
import ThemeProvider from './hooks/ThemeProvider'
import AuthProvider from './hooks/AuthProvider'

// Route Guards
import AdminRoute from './components/common/AdminRoute'

// Skeleton Loaders for Suspense fallbacks
import { SkeletonPage } from './components/common/SkeletonLoader'
import { SkeletonProductsGrid, SkeletonProductDetail, SkeletonCart, SkeletonWishlist, SkeletonProfile } from './components/common/UserSkeleton'

// Home components (kept eagerly loaded for fast LCP)
import HeroSec from './components/heroSec'
import CoresolMarq from './components/coresolMarq'
import CategoryShowcase from './components/CategoryShowcase'
import FeaturedProducts from './components/FeaturedProducts'
import Testimonials from './components/Testimonials'
import BrandFeatures from './components/BrandFeatures'

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Profile = lazy(() => import('./pages/Profile'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsConditions = lazy(() => import('./pages/TermsConditions'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))

// Lazy-loaded admin
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'))
const AdminProducts = lazy(() => import('./admin/pages/AdminProducts'))
const AdminOrders = lazy(() => import('./admin/pages/AdminOrders'))
const AdminUsers = lazy(() => import('./admin/pages/AdminUsers'))
const AdminCoupons = lazy(() => import('./admin/pages/AdminCoupons'))
const AdminReviews = lazy(() => import('./admin/pages/AdminReviews'))
const AdminContacts = lazy(() => import('./admin/pages/AdminContacts'))

// Styles
import './styles/animations.css'

// Suspense wrappers – generic and page-specific
const SuspenseWrap = ({ children, fallback }) => (
  <Suspense fallback={fallback || <SkeletonPage />}>
    {children}
  </Suspense>
)

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <ThemeProvider>
    <AuthProvider>
    <CartProvider>
      <ScrollToTop />
      <div>
        {/* Hide user menu/footer on admin pages */}
        {!isAdminPage && <Menu />}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* ─── Home ──────────────── */}
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

            {/* ─── User Pages ────────── */}
            <Route path="/products" element={<PageTransition><SuspenseWrap fallback={<SkeletonProductsGrid />}><Products /></SuspenseWrap></PageTransition>} />
            <Route path="/products/:id" element={<PageTransition><SuspenseWrap fallback={<SkeletonProductDetail />}><ProductDetail /></SuspenseWrap></PageTransition>} />
            <Route path="/about" element={<PageTransition><SuspenseWrap><About /></SuspenseWrap></PageTransition>} />
            <Route path="/contact" element={<PageTransition><SuspenseWrap><Contact /></SuspenseWrap></PageTransition>} />
            <Route path="/cart" element={<PageTransition><SuspenseWrap fallback={<SkeletonCart />}><Cart /></SuspenseWrap></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><SuspenseWrap><Checkout /></SuspenseWrap></PageTransition>} />
            <Route path="/wishlist" element={<PageTransition><SuspenseWrap fallback={<SkeletonWishlist />}><Wishlist /></SuspenseWrap></PageTransition>} />
            <Route path="/profile" element={<PageTransition><SuspenseWrap fallback={<SkeletonProfile />}><Profile /></SuspenseWrap></PageTransition>} />
            <Route path="/login" element={<PageTransition><SuspenseWrap><Login /></SuspenseWrap></PageTransition>} />
            <Route path="/signup" element={<PageTransition><SuspenseWrap><Signup /></SuspenseWrap></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><SuspenseWrap><ForgotPassword /></SuspenseWrap></PageTransition>} />
            <Route path="/privacy-policy" element={<PageTransition><SuspenseWrap><PrivacyPolicy /></SuspenseWrap></PageTransition>} />
            <Route path="/terms-conditions" element={<PageTransition><SuspenseWrap><TermsConditions /></SuspenseWrap></PageTransition>} />

            {/* ─── Admin Panel ────────── */}
            <Route path="/admin" element={
              <AdminRoute>
                <SuspenseWrap>
                  <AdminLayout />
                </SuspenseWrap>
              </AdminRoute>
            }>
              <Route index element={<SuspenseWrap><AdminDashboard /></SuspenseWrap>} />
              <Route path="products" element={<SuspenseWrap><AdminProducts /></SuspenseWrap>} />
              <Route path="orders" element={<SuspenseWrap><AdminOrders /></SuspenseWrap>} />
              <Route path="users" element={<SuspenseWrap><AdminUsers /></SuspenseWrap>} />
              <Route path="coupons" element={<SuspenseWrap><AdminCoupons /></SuspenseWrap>} />
              <Route path="reviews" element={<SuspenseWrap><AdminReviews /></SuspenseWrap>} />
              <Route path="contacts" element={<SuspenseWrap><AdminContacts /></SuspenseWrap>} />
            </Route>
          </Routes>
        </AnimatePresence>
        {!isAuthPage && !isAdminPage && <Footer />}
      </div>
    </CartProvider>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App