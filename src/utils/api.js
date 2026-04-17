import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('techorbit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.url?.includes('/admin/')) {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, { token: !!token, body: config.data });
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('techorbit_token');
      localStorage.removeItem('techorbit_user');
    }
    if (error.config?.url?.includes('/admin/')) {
      console.error(`[API ERROR] ${error.config.method?.toUpperCase()} ${error.config.url}`, 
        { status: error.response?.status, message: error.response?.data?.message });
    }
    return Promise.reject(error);
  }
);

// Normalize _id → id on product objects
function normalizeProduct(p) {
  if (p && p._id && !p.id) return { ...p, id: p._id };
  return p;
}

// ─── Products ────────────────────────────────────────
export const fetchProducts = (params) =>
  api.get('/products', { params }).then((res) => {
    if (res.data.products) res.data.products = res.data.products.map(normalizeProduct);
    return res;
  });
export const fetchProductById = (id) =>
  api.get(`/products/${id}`).then((res) => {
    if (res.data.product) res.data.product = normalizeProduct(res.data.product);
    return res;
  });
export const fetchRelatedProducts = (id) =>
  api.get(`/products/${id}/related`).then((res) => {
    if (res.data.products) res.data.products = res.data.products.map(normalizeProduct);
    return res;
  });
export const fetchCategories = () => api.get('/products/categories');

// ─── Auth ────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const verifyEmailOtp = (data) => api.post('/auth/verify-email-otp', data);
export const resendEmailOtp = (data) => api.post('/auth/resend-email-otp', data);
export const requestPasswordResetOtp = (data) => api.post('/auth/forgot-password/request-otp', data);
export const verifyPasswordResetOtp = (data) => api.post('/auth/forgot-password/verify-otp', data);
export const resetPasswordWithOtp = (data) => api.post('/auth/forgot-password/reset', data);
export const requestAdminPasswordResetOtp = (data) => api.post('/auth/admin/forgot-password/request-otp', data);
export const verifyAdminPasswordResetOtp = (data) => api.post('/auth/admin/forgot-password/verify-otp', data);
export const resetAdminPasswordWithOtp = (data) => api.post('/auth/admin/forgot-password/reset', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);

// ─── Orders ──────────────────────────────────────────
export const createOrder = (data) => api.post('/orders', data);
export const fetchMyOrders = () => api.get('/orders');
export const fetchOrderById = (id) => api.get(`/orders/${id}`);

// ─── Reviews / Testimonials ─────────────────────────
export const fetchTestimonials = () => api.get('/reviews/testimonials');
export const fetchReviews = (params) => api.get('/reviews', { params });
export const submitReview = (data) => api.post('/reviews', data);

// ─── Coupons ─────────────────────────────────────────
export const validateCoupon = (data) => api.post('/coupons/validate', data);
export const fetchCoupons = () => api.get('/coupons');

// ─── Contact ─────────────────────────────────────────
export const submitContactForm = (data) => api.post('/contact', data);

// ─── Admin ───────────────────────────────────────────
export const fetchAdminStats = () => api.get('/admin/stats');

// Admin — Users
export const fetchAllUsers = (params) => api.get('/admin/users', { params });
export const fetchUserById = (id) => api.get(`/admin/users/${id}`);
export const toggleUserActive = (id) => api.patch(`/admin/users/${id}/toggle-active`);
export const updateUserRole = (id, role) => api.patch(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Admin — Orders
export const fetchAllOrders = (params) => api.get('/admin/orders', { params });
export const updateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/status`, { status });
export const downloadMonthlyReport = ({ year, month, format }) =>
  api.get('/admin/reports/monthly/export', {
    params: { year, month, format },
    responseType: 'blob',
  });

// Admin — Products (reuse existing endpoints)
export const adminCreateProduct = (data) => {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  return api.post('/products', data, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
};
export const adminUpdateProduct = (id, data) => {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  return api.put(`/products/${id}`, data, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
};
export const adminDeleteProduct = (id) => api.delete(`/products/${id}`);

// Admin — Coupons
export const adminCreateCoupon = (data) => api.post('/admin/coupons', data);
export const adminUpdateCoupon = (id, data) => api.put(`/admin/coupons/${id}`, data);
export const adminDeleteCoupon = (id) => api.delete(`/admin/coupons/${id}`);

// Admin — Reviews
export const adminDeleteReview = (id) => api.delete(`/admin/reviews/${id}`);

// Admin — Contacts
export const fetchContactMessages = () => api.get('/admin/contacts');
export const markContactRead = (id) => api.patch(`/admin/contacts/${id}/read`);
export const deleteContactMessage = (id) => api.delete(`/admin/contacts/${id}`);

// ─── Comparisons ─────────────────────────────────────
export const fetchComparisons = () => api.get('/comparisons');
export const adminCreateComparison = (data) => api.post('/comparisons', data);
export const adminUpdateComparison = (id, data) => api.put(`/comparisons/${id}`, data);
export const adminDeleteComparison = (id) => api.delete(`/comparisons/${id}`);

// ─── Carousel ─────────────────────────────────────
export const fetchCarouselItems = () => api.get('/carousel');
export const adminCreateCarouselItem = (data) => api.post('/carousel', data);
export const adminUpdateCarouselItem = (id, data) => api.put(`/carousel/${id}`, data);
export const adminDeleteCarouselItem = (id) => api.delete(`/carousel/${id}`);

export default api;
