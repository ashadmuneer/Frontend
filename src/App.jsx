import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import BlogsPage from './pages/BlogsPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import TermsPage from './pages/TermsPage';
import ShippingPage from './pages/ShippingPage';
import SettingsPage from './pages/SettingsPage';
import CustomHairPage from './pages/CustomHairPage';
import CustomHairDetailPage from './pages/CustomHairDetailPage';
import CustomHairProductsPage from './pages/CustomHairProductsPage';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a25',
            color: '#e5e5e5',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#d4a853', secondary: '#0a0a0f' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0a0a0f' } },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductCatalogPage />} />
        <Route path="/shop/:slug" element={<ProductDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/return-policy" element={<ReturnPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/custom-hair" element={<CustomHairPage />} />
        <Route path="/custom-hair/:slug" element={<CustomHairDetailPage />} />
        <Route path="/qws/login" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/qws/login" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/custom-hair-products" element={<CustomHairProductsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
