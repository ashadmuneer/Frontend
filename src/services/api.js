import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================
// AUTH
// ============================================================
export const loginAdmin = (data) => api.post('/admin/login', data);
export const registerAdmin = (data) => api.post('/admin/register', data);
export const getAdminProfile = () => api.get('/admin/me');

// ============================================================
// DASHBOARD
// ============================================================
export const getDashboardStats = () => api.get('/admin/stats');

// ============================================================
// PRODUCTS
// ============================================================
export const getAdminProducts = (params) => api.get('/admin/products', { params });

/**
 * Create product — supports file uploads via FormData.
 * When sending FormData, we must NOT set Content-Type manually;
 * the browser auto-generates the multipart boundary.
 */
export const createProduct = (data) => {
  return api.post('/admin/products', data);
};

/**
 * Update product — supports file uploads via FormData.
 */
export const updateProduct = (id, data) => {
  return api.put(`/admin/products/${id}`, data);
};

export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const getCategories = () => api.get('/admin/categories');

// ============================================================
// ORDERS
// ============================================================
export const getOrders = (params) => api.get('/admin/orders', { params });
export const getOrderById = (id) => api.get(`/admin/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  api.patch(`/admin/orders/${id}/status`, { status });

// ============================================================
// PUBLIC — Products & Orders (no auth required)
// ============================================================
export const getPublicProducts = () => api.get('/products');
export const getPublicProductBySlug = (slug) => api.get(`/products/${slug}`);
export const submitOrder = (data) => api.post('/orders', data);

// ============================================================
// PUBLIC — Blogs (no auth required)
// ============================================================
export const getPublicBlogs = (params) => api.get('/blogs', { params });
export const getPublicBlogBySlug = (slug) => api.get(`/blogs/${slug}`);
export const getBlogCategories = () => api.get('/blogs/categories');
export const toggleBlogLike = (slug, visitorId) =>
  api.post(`/blogs/${slug}/like`, { visitorId });
export const addBlogComment = (slug, data) =>
  api.post(`/blogs/${slug}/comments`, data);

// ============================================================
// ADMIN — Blogs
// ============================================================
export const getAdminBlogs = (params) => api.get('/admin/blogs', { params });
export const createBlog = (data) => api.post('/admin/blogs', data);
export const updateBlog = (id, data) => api.put(`/admin/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/admin/blogs/${id}`);
export const uploadInlineBlogImage = (data) => api.post('/admin/blogs/upload-inline-image', data);
export const getAdminBlogComments = (id) => api.get(`/admin/blogs/${id}/comments`);
export const toggleCommentApproval = (blogId, commentId) =>
  api.patch(`/admin/blogs/${blogId}/comments/${commentId}/approve`);
export const deleteComment = (blogId, commentId) =>
  api.delete(`/admin/blogs/${blogId}/comments/${commentId}`);

// ============================================================
// SITE SETTINGS
// ============================================================
export const getSiteSettings = () => api.get('/settings');
export const updateSiteSettings = (data) => api.put('/settings', data);
export const testEmailConnection = (config) => api.post('/settings/test-email', config);

// ============================================================
// PUBLIC — Custom Hair Products
// ============================================================
export const getPublicCustomHairProducts = () => api.get('/custom-hair-products');
export const getPublicCustomHairProductBySlug = (slug) => api.get(`/custom-hair-products/${slug}`);

// ============================================================
// ADMIN — Custom Hair Products
// ============================================================
export const getAdminCustomHairProducts = () => api.get('/admin/custom-hair-products');
export const createCustomHairProduct = (data) => api.post('/admin/custom-hair-products', data);
export const updateCustomHairProduct = (id, data) => api.put(`/admin/custom-hair-products/${id}`, data);
export const deleteCustomHairProduct = (id) => api.delete(`/admin/custom-hair-products/${id}`);

export default api;
