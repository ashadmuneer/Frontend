import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  Truck,
  Star,
  Sparkles,
  AlertCircle,
  Package,
  DollarSign,
  Heart,
  ZoomIn,
  Award,
  Clock,
  Gem,
  Scissors,
  Eye,
  ImageIcon,
  CreditCard,
  Lock,
  Palette,
  Crown,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  FileText,
  Gift,
  Percent,
  BadgeCheck,
  Info,
  CircleCheck,
  X,
  Share2,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getPublicProductBySlug, submitOrder } from '../services/api';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import ImageLabelOverlay from '../components/ImageLabelOverlay';

/* ════════════════════════════════════════════════════════════════
   CONFIGURATION — Field grouping for customization cards
   ════════════════════════════════════════════════════════════════ */
const FIELD_GROUPS = [
  {
    key: 'foundation',
    title: 'Wig Foundation',
    icon: Crown,
    keywords: ['quantity', 'lace', 'cap', 'length', 'type', 'size', 'wig'],
  },
  {
    key: 'specs',
    title: 'Hair Specifications',
    icon: Scissors,
    keywords: ['origin', 'density', 'silk', 'hairline', 'texture', 'hair'],
  },
  {
    key: 'color',
    title: 'Color Customization',
    icon: Palette,
    keywords: ['color', 'highlight', 'ombre', 'tone', 'shade', 'root'],
  },
  {
    key: 'finishing',
    title: 'Finishing Touches',
    icon: Sparkles,
    keywords: ['baby', 'elastic', 'part', 'pluck', 'bleach', 'knot', 'band'],
  },
];

function normalizeRichTextHtml(html = '') {
  if (!html) return '';

  const fallback = html
    .replace(/&shy;/gi, '')
    .replace(/[\u00AD\u200B-\u200D\uFEFF]/g, '')
    .replace(/([A-Za-z])\s*\r?\n\s*([A-Za-z])/g, '$1$2')
    .trim();

  if (typeof DOMParser === 'undefined' || typeof NodeFilter === 'undefined') {
    return fallback;
  }

  const doc = new DOMParser().parseFromString(fallback, 'text/html');
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  let currentNode = walker.nextNode();

  while (currentNode) {
    currentNode.textContent = (currentNode.textContent || '')
      .replace(/[\u00AD\u200B-\u200D\uFEFF]/g, '')
      .replace(/([A-Za-z])\s*\r?\n\s*([A-Za-z])/g, '$1$2');
    currentNode = walker.nextNode();
  }

  return doc.body.innerHTML.trim();
}

/**
 * Assign each dropdown field to a group based on label keywords.
 * Fields that don't match any group go into a catch-all "Other" group.
 */
function groupFields(fields) {
  const groups = FIELD_GROUPS.map((g) => ({ ...g, fields: [] }));
  const other = { key: 'other', title: 'Additional Options', icon: Package, fields: [] };

  fields.forEach((field) => {
    const label = field.label.toLowerCase();
    let placed = false;
    for (const group of groups) {
      if (group.keywords.some((kw) => label.includes(kw))) {
        group.fields.push(field);
        placed = true;
        break;
      }
    }
    if (!placed) other.fields.push(field);
  });

  const result = groups.filter((g) => g.fields.length > 0);
  if (other.fields.length > 0) result.push(other);
  return result;
}


/* ════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [selections, setSelections] = useState({});
  const orderFormRef = useRef(null);
  const normalizedDescription = useMemo(
    () => normalizeRichTextHtml(product?.description || ''),
    [product?.description]
  );

  useEffect(() => { fetchProduct(); }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data } = await getPublicProductBySlug(slug);
      setProduct(data.data);
      const defaults = {};
      data.data.fields?.forEach((f) => { defaults[f._id] = ''; });
      setSelections(defaults);
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (fieldId, value) => {
    setSelections((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => { const c = { ...prev }; delete c[fieldId]; return c; });
    }
  };

  /* ── Price calculation ── */
  const priceBreakdown = useMemo(() => {
    if (!product) return { base: 0, adjustments: [], total: 0, quantity: 1 };
    const base = product.basePrice || 0;
    const adjustments = [];

    // Detect quantity from a dropdown whose label contains "quantity" or "qty"
    let quantity = 1;
    product.fields?.forEach((field) => {
      if (field.type !== 'dropdown') return;
      const selected = selections[field._id];
      if (!selected) return;

      // Check if this is the quantity field
      const labelLower = field.label.toLowerCase();
      if (labelLower.includes('quantity') || labelLower.includes('qty')) {
        const parsed = parseInt(selected, 10);
        if (!isNaN(parsed) && parsed > 0) quantity = parsed;
        return; // don't add quantity as a price adjustment
      }

      const opt = field.options?.find((o) => o.label === selected);
      if (opt && opt.priceAdjustment > 0) {
        adjustments.push({ label: field.label, option: opt.label, amount: opt.priceAdjustment });
      }
    });

    const unitPrice = base + adjustments.reduce((sum, a) => sum + a.amount, 0);
    const total = unitPrice * quantity;
    return { base, adjustments, total, quantity, unitPrice };
  }, [product, selections]);

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    product.fields?.forEach((f) => {
      if (f.required && !selections[f._id]?.trim()) {
        newErrors[f._id] = `${f.label} is required`;
      }
    });
    const nameField = product.fields?.find((f) => f.label.toLowerCase() === 'name');
    const emailField = product.fields?.find((f) => f.label.toLowerCase() === 'email');
    if (nameField && !selections[nameField._id]?.trim()) newErrors[nameField._id] = 'Name is required';
    if (emailField && !selections[emailField._id]?.trim()) newErrors[emailField._id] = 'Email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstId = Object.keys(newErrors)[0];
      document.getElementById(`field-${firstId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const selectedOptions = product.fields
      .filter((f) => selections[f._id]?.trim())
      .map((f) => ({ fieldId: f._id, fieldLabel: f.label, selectedValue: selections[f._id] }));

    const getName = (label) => {
      const field = product.fields?.find((f) => f.label.toLowerCase() === label.toLowerCase());
      return field ? selections[field._id] || '' : '';
    };

    const payload = {
      productId: product._id,
      selectedOptions,
      customer: {
        name: getName('name') || 'Customer',
        email: getName('email') || '',
        phone: getName('phone') || '',
        address: getName('address') || '',
      },
      notes: getName('message') || '',
    };

    setSubmitting(true);
    try {
      await submitOrder(payload);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit order.', {
        style: { background: '#fff', color: '#1a1a2e', border: '1px solid #e8e0d8' },
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="home-page">
        <Header />
        <div className="max-w-[1200px] mx-auto px-5 py-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-12 rounded skeleton-pulse" />
            <div className="h-4 w-4 rounded skeleton-pulse" />
            <div className="h-4 w-10 rounded skeleton-pulse" />
            <div className="h-4 w-4 rounded skeleton-pulse" />
            <div className="h-4 w-24 rounded skeleton-pulse" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery skeleton */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl skeleton-pulse" />
              <div className="flex gap-2.5">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-[72px] h-[72px] rounded-lg skeleton-pulse" />
                ))}
              </div>
            </div>
            
            {/* Info skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-24 rounded-full skeleton-pulse" />
              <div className="h-10 w-3/4 rounded skeleton-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded skeleton-pulse" />
                <div className="h-4 w-5/6 rounded skeleton-pulse" />
              </div>
              <div className="h-10 w-32 rounded skeleton-pulse" />
              <div className="flex gap-4 py-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full skeleton-pulse" />
                    <div className="h-3 w-16 rounded skeleton-pulse" />
                  </div>
                ))}
              </div>
              <div className="h-12 w-full rounded-xl skeleton-pulse" />
            </div>
          </div>
        </div>
        <Footer />
        
        <style>{`
          .skeleton-pulse {
            background: linear-gradient(90deg, var(--color-home-muted) 25%, var(--color-home-border) 50%, var(--color-home-muted) 75%);
            background-size: 200% 100%;
            animation: skeleton-shimmer 1.5s infinite;
          }
          @keyframes skeleton-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  /* ── 404 ── */
  if (!product) {
    return (
      <div className="home-page">
        <Header />
        <div className="max-w-md mx-auto text-center py-32 px-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'var(--color-home-muted)' }}>
            <Package size={32} style={{ color: 'var(--color-home-muted-fg)' }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-home-fg)' }}>
            Product Not Found
          </h2>
          <p className="mt-3 mb-8" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shop" className="home-btn home-btn-primary">Browse Products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Success ── */
  if (submitted) {
    return (
      <div className="home-page">
        <Header />
        <div className="max-w-lg mx-auto text-center py-20 px-6 home-animate-fade-in">
          {/* Success animation */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#4ade80' }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', boxShadow: '0 8px 32px rgba(74,222,128,0.3)' }}>
              <Check size={40} className="text-white" strokeWidth={3} />
            </div>
          </div>
          
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-home-fg)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            Order Submitted Successfully!
          </h2>
          
          <p className="text-lg mb-2" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>
            Thank you for your order
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(155,89,182,0.08)' }}>
            <Package size={16} style={{ color: 'var(--color-home-primary)' }} />
            <span className="font-medium" style={{ color: 'var(--color-home-primary)', fontFamily: "'Poppins', sans-serif" }}>
              {product.name}
            </span>
          </div>
          
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif", lineHeight: 1.7 }}>
            We'll review your customizations and reach out via email with the next steps and payment details.
          </p>
          
          {/* What happens next */}
          <div className="luxury-card p-5 mb-8 text-left">
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-home-fg)', fontFamily: "'Poppins', sans-serif" }}>
              What happens next?
            </h4>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Our team reviews your order', time: 'Within 24 hours' },
                { step: '2', text: 'We send a confirmation email', time: 'With payment link' },
                { step: '3', text: 'Your wig begins production', time: 'After payment' },
              ].map(({ step, text, time }) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" 
                    style={{ backgroundColor: 'rgba(155,89,182,0.1)', color: 'var(--color-home-primary)' }}>
                    {step}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-home-fg)', fontFamily: "'Poppins', sans-serif" }}>{text}</p>
                    <p className="text-xs" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/shop" className="home-btn home-btn-outline">
              Continue Shopping
            </Link>
            <Link to="/" className="home-btn home-btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Categorize fields ── */
  const dropdownFields = product.fields?.filter((f) => f.type === 'dropdown') || [];
  const textFields = product.fields?.filter((f) => f.type === 'text' || f.type === 'textarea') || [];
  const fieldGroups = groupFields(dropdownFields);

  /* ── Gallery images with metadata ── */
  const allGalleryImages = [];
  const allGalleryMeta = [];
  if (product.imageUrl) {
    allGalleryImages.push(product.imageUrl);
    allGalleryMeta.push(product.imageMeta || {});
  }
  if (product.galleryUrls?.length > 0) {
    allGalleryImages.push(...product.galleryUrls);
    product.galleryUrls.forEach((_, i) => {
      allGalleryMeta.push(product.galleryMeta?.[i] || {});
    });
  }

  /* ── Count selected options ── */
  const selectedCount = dropdownFields.filter((f) => selections[f._id]).length;

  return (
    <div className="home-page">
      <Header />

      <form onSubmit={handleSubmit}>

        {/* ═══════════════════════════════════════════════════════
            SECTION 1 — HERO
            ═══════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: 'var(--color-home-bg)' }}>
          {/* Breadcrumb */}
          <div className="max-w-[1200px] mx-auto px-5 pt-6 pb-2">
            <nav className="flex items-center gap-1.5 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <Link to="/" className="no-underline transition-colors"
                style={{ color: 'var(--color-home-muted-fg)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-home-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-home-muted-fg)'}>
                Home
              </Link>
              <ChevronRight size={14} style={{ color: 'var(--color-home-border)' }} />
              <Link to="/shop" className="no-underline transition-colors"
                style={{ color: 'var(--color-home-muted-fg)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-home-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-home-muted-fg)'}>
                Shop
              </Link>
              <ChevronRight size={14} style={{ color: 'var(--color-home-border)' }} />
              <span style={{ color: 'var(--color-home-fg)', fontWeight: 500 }}>{product.name}</span>
            </nav>
          </div>

          {/* Banner — Full Width at Top */}
          {product.bannerUrl && (
            <div className="max-w-[1200px] mx-auto px-5 pt-4 pb-2">
              <div className="luxury-card overflow-hidden relative" style={{ borderRadius: '1rem' }}>
                <img
                  src={product.bannerUrl}
                  alt={product.bannerMeta?.alt?.trim() || `${product.name} banner`}
                  className="w-full object-cover"
                  style={{ maxHeight: '400px' }}
                />
                {product.bannerMeta?.showLabel && product.bannerMeta?.label && (
                  <ImageLabelOverlay meta={product.bannerMeta} />
                )}
              </div>
            </div>
          )}

          {/* Hero two-column */}
          <div className="max-w-[1200px] mx-auto px-5 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

              {/* LEFT — Gallery */}
              <div className="home-animate-fade-in" style={{ minWidth: 0 }}>
                <ProductGallery images={allGalleryImages} imagesMeta={allGalleryMeta} productName={product.name} />
              </div>

              {/* RIGHT — Product Info */}
              <div className="home-animate-fade-in" style={{ animationDelay: '0.1s', minWidth: 0, overflow: 'hidden' }}>
                {/* Category badge */}
                {product.category && (
                  <span className="luxury-section-badge mb-4">
                    {product.category}
                  </span>
                )}

                {/* Title */}
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  color: 'var(--color-home-fg)',
                  lineHeight: 1.15,
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.01em',
                }}>
                  {product.name}
                </h1>

                {/* Description */}
                {normalizedDescription && (
                  <div 
                    className="product-description"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      color: 'var(--color-home-muted-fg)',
                      fontSize: '0.9375rem',
                      lineHeight: 1.7,
                      marginBottom: '1.25rem',
                      minWidth: 0,
                    }}
                    dangerouslySetInnerHTML={{ __html: normalizedDescription }}
                  />
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '2rem',
                    color: 'var(--color-home-primary)',
                    fontWeight: 600,
                  }}>
                    ${priceBreakdown.total.toFixed(2)}
                  </span>
                  {priceBreakdown.base > 0 && priceBreakdown.adjustments.length > 0 && (
                    <span className="text-sm" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>
                      Starting at ${priceBreakdown.base.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Quick Trust Badges Row */}
                <div className="flex flex-wrap gap-4 mb-6 py-4" style={{ borderTop: '1px solid var(--color-home-border)', borderBottom: '1px solid var(--color-home-border)' }}>
                  {[
                    { icon: Truck, text: 'Free Shipping', color: '#10b981' },
                    { icon: ShieldCheck, text: '100% Authentic', color: '#8b5cf6' },
                    { icon: Gift, text: 'Easy Returns', color: '#f59e0b' },
                  ].map(({ icon: Icon, text, color }) => (
                    <div key={text} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                        <Icon size={14} style={{ color }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'var(--color-home-fg)', fontFamily: "'Poppins', sans-serif" }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Product Highlights */}
                {product.highlights && product.highlights.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {product.highlights.slice(0, 4).map((highlight, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CircleCheck size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-home-primary)' }} />
                        <span className="text-sm" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA to scroll to form */}
                <button
                  type="button"
                  onClick={() => orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="home-btn home-btn-primary home-btn-lg w-full group"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Sparkles size={18} className="transition-transform group-hover:rotate-12" />
                  Customize & Order
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied!', { style: { background: '#fff', color: '#1a1a2e' } });
                  }}
                  className="w-full mt-3 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--color-home-muted)',
                    color: 'var(--color-home-muted-fg)',
                    fontFamily: "'Poppins', sans-serif",
                    border: '1px solid var(--color-home-border)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-home-border)';
                    e.currentTarget.style.color = 'var(--color-home-fg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-home-muted)';
                    e.currentTarget.style.color = 'var(--color-home-muted-fg)';
                  }}
                >
                  <Share2 size={16} />
                  Share Product
                </button>
              </div>
            </div>
          </div>

        </section>

        {/* Luxury divider between sections */}
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="luxury-divider" />
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2 — CUSTOMIZATION + ORDER SUMMARY
            ═══════════════════════════════════════════════════════ */}
        <section
          ref={orderFormRef}
          className="py-12 lg:py-16"
          style={{ backgroundColor: 'var(--color-home-bg)' }}
        >
          <div className="max-w-[1200px] mx-auto px-5">

            {/* Section header with Progress */}
            <div className="text-center mb-10">
              <span className="luxury-section-badge mb-3">
                <Gem size={12} /> Personalize
              </span>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--color-home-fg)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              }}>
                Customize Your Wig
              </h2>
              <p className="mt-2 max-w-md mx-auto" style={{
                fontFamily: "'Poppins', sans-serif",
                color: 'var(--color-home-muted-fg)',
                fontSize: '0.9375rem',
              }}>
                Select your preferences below to create a wig tailored perfectly to you.
              </p>
              
              {/* Progress Bar */}
              {dropdownFields.length > 0 && (
                <div className="max-w-xs mx-auto mt-6">
                  <div className="flex items-center justify-between text-xs mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span style={{ color: 'var(--color-home-muted-fg)' }}>Completion</span>
                    <span style={{ color: 'var(--color-home-primary)', fontWeight: 600 }}>
                      {selectedCount}/{dropdownFields.length} selected
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-home-muted)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${(selectedCount / dropdownFields.length) * 100}%`,
                        background: selectedCount === dropdownFields.length
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : 'linear-gradient(90deg, #9b59b6, #8b5cf6)',
                      }}
                    />
                  </div>
                  {selectedCount === dropdownFields.length && (
                    <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-medium home-animate-fade-in" style={{ color: '#10b981' }}>
                      <Check size={14} />
                      All options selected!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Two-column: Form groups + Sticky summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEFT — Customization Card Groups (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {fieldGroups.map((group, gi) => (
                  <CustomizationGroup
                    key={group.key}
                    group={group}
                    selections={selections}
                    errors={errors}
                    onSelect={handleSelect}
                    index={gi}
                  />
                ))}

                {/* ── CUSTOMER INFORMATION ── */}
                {textFields.length > 0 && (
                  <CustomerInfoSection
                    fields={textFields}
                    selections={selections}
                    errors={errors}
                    onSelect={handleSelect}
                  />
                )}
              </div>

              {/* RIGHT — Sticky Order Summary (1/3 width) */}
              <div className="lg:col-span-1">
                <OrderSummary
                  priceBreakdown={priceBreakdown}
                  dropdownFields={dropdownFields}
                  selectedCount={selectedCount}
                  submitting={submitting}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Mobile sticky bottom bar ── */}
        <div className="lg:hidden mobile-sticky-bar" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
          padding: '12px 16px 20px',
          borderTop: '1px solid var(--color-home-border)',
        }}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ 
                  backgroundColor: 'rgba(155,89,182,0.1)', 
                  color: 'var(--color-home-primary)',
                  fontFamily: "'Poppins', sans-serif" 
                }}>
                  {selectedCount}/{dropdownFields.length} selected
                </span>
              </div>
              <p className="text-xl font-bold" style={{ color: 'var(--color-home-primary)', fontFamily: "'Playfair Display', serif" }}>
                ${priceBreakdown.total.toFixed(2)}
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="home-btn home-btn-primary flex-1 max-w-[180px] flex items-center justify-center gap-2"
              style={{ fontFamily: "'Poppins', sans-serif", height: '3rem', fontSize: '0.9375rem' }}
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Lock size={16} />
                  Place Order
                </>
              )}
            </button>
          </div>
          
          {/* Trust indicator */}
          <div className="flex items-center justify-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid var(--color-home-border)' }}>
            {[
              { icon: ShieldCheck, text: 'Secure' },
              { icon: Truck, text: 'Free Shipping' },
              { icon: Clock, text: '30-Day Returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>
                <Icon size={12} style={{ color: 'var(--color-home-primary)' }} />
                {text}
              </div>
            ))}
          </div>
        </div>

      </form>

      <Footer />
    </div>
  );
}


/* ════════════════════════════════════════════════════════════════
   PRODUCT GALLERY — image viewer with thumbnails + lightbox
   ════════════════════════════════════════════════════════════════ */
function ProductGallery({ images, imagesMeta, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!zoomed) return;
      if (e.key === 'Escape') setZoomed(false);
      if (e.key === 'ArrowLeft' && images.length > 1) {
        setActiveIndex((p) => (p === 0 ? images.length - 1 : p - 1));
      }
      if (e.key === 'ArrowRight' && images.length > 1) {
        setActiveIndex((p) => (p === images.length - 1 ? 0 : p + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomed, images.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (zoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [zoomed]);

  const handleImageChange = (newIndex) => {
    if (newIndex === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (!images || images.length === 0) {
    return (
      <div className="luxury-card flex items-center justify-center"
        style={{ aspectRatio: '1/1', minHeight: '320px' }}>
        <div className="text-center">
          <ImageIcon size={48} style={{ color: 'var(--color-home-border)' }} />
          <p className="mt-3 text-sm" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>
            No image available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="luxury-card relative overflow-hidden cursor-pointer group"
        style={{ borderRadius: '1rem', aspectRatio: '1/1', backgroundColor: 'var(--color-home-muted)' }}
        onClick={() => setZoomed(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setZoomed(true)}
        aria-label={`View ${productName} in full screen`}
      >
        <img
          src={images[activeIndex]}
          alt={imagesMeta?.[activeIndex]?.alt?.trim() || `${productName} — Image ${activeIndex + 1}`}
          className={`w-full h-full object-contain transition-all duration-500 ${isTransitioning ? 'scale-[1.02] opacity-95' : ''} group-hover:scale-[1.03]`}
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Zoom hint */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-3.5 rounded-full transform scale-90 group-hover:scale-100"
            style={{ backgroundColor: 'rgba(155,89,182,0.85)', backdropFilter: 'blur(8px)' }}>
            <ZoomIn size={22} className="text-white" />
          </div>
        </div>
        
        {/* Navigation arrows for multiple images */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleImageChange(activeIndex === 0 ? images.length - 1 : activeIndex - 1); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleImageChange(activeIndex === images.length - 1 ? 0 : activeIndex + 1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        
        {/* Counter badge */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontFamily: "'Poppins', sans-serif", backdropFilter: 'blur(4px)' }}>
            <ImageIcon size={12} />
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Image label — shown below the image, not overlaid */}
      {imagesMeta?.[activeIndex]?.showLabel && imagesMeta[activeIndex]?.label && (
        <p style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '0.8125rem',
          color: 'var(--color-home-muted-fg)',
          textAlign: 'center',
          padding: '0.25rem 0.5rem',
          lineHeight: 1.5,
        }}>
          {imagesMeta[activeIndex].label}
        </p>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 luxury-scrollbar px-0.5">
          {images.map((img, i) => (
            <button key={i} type="button" onClick={() => handleImageChange(i)}
              className="flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer relative group"
              style={{
                width: '72px', height: '72px',
                border: i === activeIndex ? '2px solid var(--color-home-primary)' : '2px solid var(--color-home-border)',
                opacity: i === activeIndex ? 1 : 0.7,
                transform: i === activeIndex ? 'scale(1.05)' : 'scale(1)',
                boxShadow: i === activeIndex ? '0 4px 12px rgba(155,89,182,0.25)' : 'none',
              }}
              aria-label={`View image ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : 'false'}
            >
              <img src={img} alt={imagesMeta?.[i]?.alt?.trim() || `${productName} thumbnail ${i + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              {i !== activeIndex && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {zoomed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md cursor-pointer home-animate-fade-in"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <img src={images[activeIndex]} alt={productName}
              className="w-full h-full object-contain rounded-xl home-animate-fade-in" style={{ maxHeight: '85vh' }} />
            
            {/* Close button */}
            <button type="button" onClick={() => setZoomed(false)}
              className="absolute -top-12 right-0 md:top-3 md:right-3 p-2.5 rounded-full text-white transition-all duration-200 cursor-pointer hover:bg-white/20"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}
              aria-label="Close lightbox"
            >
              <X size={22} />
            </button>
            
            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute -top-12 left-0 md:top-3 md:left-3 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', fontFamily: "'Poppins', sans-serif", backdropFilter: 'blur(4px)' }}>
                {activeIndex + 1} of {images.length}
              </div>
            )}
            
            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); handleImageChange(activeIndex === 0 ? images.length - 1 : activeIndex - 1); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition-all duration-200 cursor-pointer hover:bg-white/20"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); handleImageChange(activeIndex === images.length - 1 ? 0 : activeIndex + 1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition-all duration-200 cursor-pointer hover:bg-white/20"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            
            {/* Thumbnail strip in lightbox */}
            {images.length > 1 && (
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-xl"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                {images.map((img, i) => (
                  <button key={i} type="button" onClick={() => handleImageChange(i)}
                    className="w-12 h-12 rounded-md overflow-hidden transition-all duration-200"
                    style={{
                      border: i === activeIndex ? '2px solid #fff' : '2px solid transparent',
                      opacity: i === activeIndex ? 1 : 0.6,
                    }}
                  >
                    <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Keyboard hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50 hidden md:flex items-center gap-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 mx-1">ESC</kbd> to close</span>
            {images.length > 1 && (
              <span>• <kbd className="px-1.5 py-0.5 rounded bg-white/10 mx-1">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 mx-1">→</kbd> to navigate</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


/* ════════════════════════════════════════════════════════════════
   CUSTOMIZATION GROUP CARD
   ════════════════════════════════════════════════════════════════ */
function CustomizationGroup({ group, selections, errors, onSelect, index }) {
  const selectedInGroup = group.fields.filter((f) => selections[f._id]).length;
  const Icon = group.icon;
  
  return (
    <div className="luxury-card overflow-hidden home-animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
      {/* Group header with icon and progress */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ 
        background: 'linear-gradient(135deg, rgba(155,89,182,0.03) 0%, rgba(155,89,182,0.08) 100%)',
        borderBottom: '1px solid var(--color-home-border)',
      }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(155,89,182,0.1)' }}>
            <Icon size={18} style={{ color: 'var(--color-home-primary)' }} />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--color-home-fg)',
              margin: 0,
              fontSize: '1.0625rem',
            }}>
              {group.title}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>
              {selectedInGroup} of {group.fields.length} selected
            </p>
          </div>
        </div>
        
        {/* Completion indicator */}
        {selectedInGroup === group.fields.length ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
            <Check size={16} style={{ color: '#10b981' }} />
          </div>
        ) : (
          <div className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ 
            backgroundColor: 'var(--color-home-muted)', 
            color: 'var(--color-home-muted-fg)',
            fontFamily: "'Poppins', sans-serif" 
          }}>
            {selectedInGroup}/{group.fields.length}
          </div>
        )}
      </div>

      {/* Fields — 2 columns on sm+ */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {group.fields.map((field) => (
            <DropdownField
              key={field._id}
              field={field}
              value={selections[field._id] || ''}
              onChange={(val) => onSelect(field._id, val)}
              error={errors[field._id]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════════════════════
   DROPDOWN FIELD — styled native select with enhanced feedback
   ════════════════════════════════════════════════════════════════ */
function DropdownField({ field, value, onChange, error }) {
  const selectedOption = field.options?.find((o) => o.label === value);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div id={`field-${field._id}`} className="group">
      <label className="flex items-center gap-1 text-sm font-medium mb-2"
        style={{ color: 'var(--color-home-fg)', fontFamily: "'Poppins', sans-serif" }}>
        {field.label}
        {field.required && <span style={{ color: '#dc2626' }}>*</span>}
        {value && (
          <Check size={14} className="ml-auto" style={{ color: '#10b981' }} />
        )}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full appearance-none px-4 py-3 pr-10 rounded-xl text-sm cursor-pointer transition-all duration-200"
          style={{
            backgroundColor: value ? 'rgba(155,89,182,0.04)' : 'var(--color-home-muted)',
            border: error 
              ? '2px solid #dc2626' 
              : value 
                ? '2px solid var(--color-home-primary)' 
                : isFocused 
                  ? '2px solid var(--color-home-primary)'
                  : '2px solid transparent',
            fontFamily: "'Poppins', sans-serif",
            color: value ? 'var(--color-home-fg)' : 'var(--color-home-muted-fg)',
            outline: 'none',
            boxShadow: isFocused ? '0 0 0 3px rgba(155,89,182,0.08)' : 'none',
          }}
        >
          <option value="">{`Select ${field.label.toLowerCase()}...`}</option>
          {field.options?.map((opt) => (
            <option key={opt.label} value={opt.label}>
              {opt.label}{opt.priceAdjustment > 0 ? ` (+$${opt.priceAdjustment})` : ''}
            </option>
          ))}
        </select>
        <ChevronDown 
          size={16} 
          className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isFocused ? 'rotate-180' : ''}`}
          style={{ color: value ? 'var(--color-home-primary)' : 'var(--color-home-muted-fg)' }} 
        />
      </div>

      {/* Price tag - enhanced */}
      {selectedOption?.priceAdjustment > 0 && (
        <div className="mt-2 home-animate-fade-in">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: 'rgba(155,89,182,0.08)', color: 'var(--color-home-primary)' }}>
            <DollarSign size={11} /> +${selectedOption.priceAdjustment} added
          </span>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1 text-xs mt-2 home-animate-fade-in" style={{ color: '#dc2626', fontFamily: "'Poppins', sans-serif" }}>
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}


/* ════════════════════════════════════════════════════════════════
   CUSTOMER INFORMATION SECTION
   ════════════════════════════════════════════════════════════════ */
function CustomerInfoSection({ fields, selections, errors, onSelect }) {
  const messageField = fields.find((f) => f.type === 'textarea' || f.label.toLowerCase().includes('message'));
  const initialsField = fields.find((f) => f.label.toLowerCase().includes('initial') || f.label.toLowerCase().includes('terms'));
  const nameField = fields.find((f) => f.label.toLowerCase() === 'name');
  const phoneField = fields.find((f) => f.label.toLowerCase().includes('phone'));
  const emailField = fields.find((f) => f.label.toLowerCase().includes('email'));
  const addressField = fields.find((f) => f.label.toLowerCase().includes('address'));

  const leftFields = [messageField, initialsField].filter(Boolean);
  const rightFields = [nameField, phoneField, emailField].filter(Boolean);
  const categorized = new Set([...leftFields, ...rightFields, addressField].filter(Boolean).map((f) => f._id));
  const otherFields = fields.filter((f) => !categorized.has(f._id));
  
  // Count filled fields
  const allFields = [...leftFields, ...rightFields, addressField, ...otherFields].filter(Boolean);
  const filledCount = allFields.filter(f => selections[f._id]?.trim()).length;

  const iconMap = {
    name: User,
    phone: Phone,
    email: Mail,
    address: MapPin,
    message: MessageSquare,
    initial: FileText,
    terms: FileText,
  };

  const getIcon = (label) => {
    const lower = label.toLowerCase();
    for (const [key, Icon] of Object.entries(iconMap)) {
      if (lower.includes(key)) return Icon;
    }
    return FileText;
  };

  const renderField = (field) => {
    const FieldIcon = getIcon(field.label);
    const isTextarea = field.type === 'textarea' || field.label.toLowerCase().includes('message');
    const isEmail = field.label.toLowerCase().includes('email');
    const isPhone = field.label.toLowerCase().includes('phone');
    const hasValue = selections[field._id]?.trim();

    return (
      <div key={field._id} id={`field-${field._id}`} className="group">
        <label className="flex items-center gap-1.5 text-sm font-medium mb-2"
          style={{ color: 'var(--color-home-fg)', fontFamily: "'Poppins', sans-serif" }}>
          <FieldIcon size={14} style={{ color: hasValue ? 'var(--color-home-primary)' : 'var(--color-home-muted-fg)' }} />
          {field.label}
          {field.required && <span style={{ color: '#dc2626' }}>*</span>}
          {hasValue && (
            <Check size={14} className="ml-auto" style={{ color: '#10b981' }} />
          )}
        </label>
        {isTextarea ? (
          <textarea
            value={selections[field._id] || ''}
            onChange={(e) => onSelect(field._id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            rows={4}
            className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 luxury-scrollbar"
            style={{
              backgroundColor: hasValue ? 'rgba(155,89,182,0.04)' : 'var(--color-home-muted)',
              border: errors[field._id] ? '2px solid #dc2626' : hasValue ? '2px solid var(--color-home-primary)' : '2px solid transparent',
              fontFamily: "'Poppins', sans-serif",
              color: 'var(--color-home-fg)',
              outline: 'none',
              resize: 'vertical',
              minHeight: '100px',
            }}
            onFocus={(e) => {
              if (!errors[field._id]) {
                e.currentTarget.style.borderColor = 'var(--color-home-primary)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(155,89,182,0.08)';
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors[field._id] ? '#dc2626' : hasValue ? 'var(--color-home-primary)' : 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        ) : (
          <input
            type={isEmail ? 'email' : isPhone ? 'tel' : 'text'}
            value={selections[field._id] || ''}
            onChange={(e) => onSelect(field._id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200"
            style={{
              backgroundColor: hasValue ? 'rgba(155,89,182,0.04)' : 'var(--color-home-muted)',
              border: errors[field._id] ? '2px solid #dc2626' : hasValue ? '2px solid var(--color-home-primary)' : '2px solid transparent',
              fontFamily: "'Poppins', sans-serif",
              color: 'var(--color-home-fg)',
              outline: 'none',
              height: '2.875rem',
            }}
            onFocus={(e) => {
              if (!errors[field._id]) {
                e.currentTarget.style.borderColor = 'var(--color-home-primary)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(155,89,182,0.08)';
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors[field._id] ? '#dc2626' : hasValue ? 'var(--color-home-primary)' : 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        )}
        {errors[field._id] && (
          <p className="flex items-center gap-1 text-xs mt-2 home-animate-fade-in" style={{ color: '#dc2626', fontFamily: "'Poppins', sans-serif" }}>
            <AlertCircle size={12} /> {errors[field._id]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="luxury-card overflow-hidden home-animate-slide-up">
      {/* Header with icon */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ 
        background: 'linear-gradient(135deg, rgba(155,89,182,0.03) 0%, rgba(155,89,182,0.08) 100%)',
        borderBottom: '1px solid var(--color-home-border)',
      }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(155,89,182,0.1)' }}>
            <User size={18} style={{ color: 'var(--color-home-primary)' }} />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--color-home-fg)',
              margin: 0,
              fontSize: '1.0625rem',
            }}>
              Customer Information
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>
              {filledCount} of {allFields.length} filled
            </p>
          </div>
        </div>
        
        {/* Completion indicator */}
        {filledCount === allFields.length && allFields.length > 0 ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
            <Check size={16} style={{ color: '#10b981' }} />
          </div>
        ) : allFields.length > 0 && (
          <div className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ 
            backgroundColor: 'var(--color-home-muted)', 
            color: 'var(--color-home-muted-fg)',
            fontFamily: "'Poppins', sans-serif" 
          }}>
            {filledCount}/{allFields.length}
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Two-column layout */}
        {(leftFields.length > 0 || rightFields.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="space-y-4">
              {leftFields.map(renderField)}
            </div>
          <div className="space-y-4">
            {rightFields.map(renderField)}
          </div>
        </div>
      )}

      {/* Address — full width */}
      {addressField && (
        <div className="mb-5">
          {renderField(addressField)}
        </div>
      )}

      {/* Other uncategorized text fields */}
      {otherFields.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherFields.map(renderField)}
        </div>
      )}
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════════════════════
   ORDER SUMMARY — sticky sidebar on desktop, hidden on mobile
   (mobile uses the sticky bottom bar instead)
   ════════════════════════════════════════════════════════════════ */
function OrderSummary({ priceBreakdown, dropdownFields, selectedCount, submitting }) {
  const completionPercent = dropdownFields.length > 0 
    ? Math.round((selectedCount / dropdownFields.length) * 100) 
    : 0;
    
  return (
    <div className="hidden lg:block">
      <div className="sticky top-[100px]">
        <div className="luxury-card overflow-hidden">

          {/* Header with gradient */}
          <div className="px-6 py-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #9b59b6 0%, #7d3c98 100%)' }}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(50%, -50%)' }} />
            <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(-50%, 50%)' }} />
            
            <div className="relative">
              <h3 className="text-white flex items-center gap-2" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.125rem',
                margin: 0,
              }}>
                <DollarSign size={18} />
                Order Summary
              </h3>
              
              {/* Progress indicator */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{selectedCount} of {dropdownFields.length} options</span>
                  <span className="font-semibold" style={{ color: '#fff' }}>{completionPercent}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${completionPercent}%`,
                      backgroundColor: completionPercent === 100 ? '#4ade80' : '#fff',
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Base price */}
            {priceBreakdown.base > 0 && (
              <div className="flex justify-between text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <span style={{ color: 'var(--color-home-muted-fg)' }}>Base Price</span>
                <span style={{ color: 'var(--color-home-fg)', fontWeight: 500 }}>${priceBreakdown.base.toFixed(2)}</span>
              </div>
            )}

            {/* Adjustments */}
            {priceBreakdown.adjustments.length > 0 && (
              <div className="space-y-2.5 pt-3" style={{ borderTop: '1px solid var(--color-home-border)' }}>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>
                  Customizations
                </p>
                {priceBreakdown.adjustments.map((adj, i) => (
                  <div key={i} className="flex justify-between text-sm home-animate-fade-in" style={{ fontFamily: "'Poppins', sans-serif", animationDelay: `${i * 50}ms` }}>
                    <span className="flex-1 pr-2 truncate" style={{ color: 'var(--color-home-muted-fg)' }}
                      title={`${adj.label}: ${adj.option}`}>
                      {adj.label}
                    </span>
                    <span className="font-medium whitespace-nowrap" style={{ color: 'var(--color-home-primary)' }}>
                      +${adj.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Prompt when nothing selected */}
            {priceBreakdown.adjustments.length === 0 && priceBreakdown.base === 0 && (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--color-home-muted)' }}>
                  <Sparkles size={20} style={{ color: 'var(--color-home-muted-fg)' }} />
                </div>
                <p className="text-xs" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>
                  Select options above to see pricing
                </p>
              </div>
            )}

            {/* Quantity row */}
            {priceBreakdown.quantity > 1 && (
              <div className="flex justify-between text-sm pt-3" style={{ borderTop: '1px solid var(--color-home-border)', fontFamily: "'Poppins', sans-serif" }}>
                <span style={{ color: 'var(--color-home-muted-fg)' }}>
                  Qty {priceBreakdown.quantity} × ${priceBreakdown.unitPrice.toFixed(2)}
                </span>
                <span style={{ color: 'var(--color-home-fg)', fontWeight: 500 }}>
                  ${priceBreakdown.total.toFixed(2)}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-end pt-4" style={{ borderTop: '2px solid var(--color-home-border)' }}>
              <div>
                <span className="text-xs" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>
                  Estimated Total
                </span>
              </div>
              <span className="text-2xl font-bold" style={{ color: 'var(--color-home-primary)', fontFamily: "'Playfair Display', serif" }}>
                ${priceBreakdown.total.toFixed(2)}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="home-btn home-btn-primary home-btn-lg w-full mt-2 group"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={16} className="transition-transform group-hover:scale-110" />
                  Place Order — ${priceBreakdown.total.toFixed(2)}
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="pt-5 space-y-3" style={{ borderTop: '1px solid var(--color-home-border)' }}>
              <p className="text-xs font-medium text-center uppercase tracking-wider" style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}>
                Why Choose Us
              </p>
              {[
                { icon: ShieldCheck, text: 'Secure & encrypted checkout', color: '#8b5cf6' },
                { icon: Truck, text: 'Free tracked shipping', color: '#10b981' },
                { icon: Clock, text: '30-day satisfaction guarantee', color: '#f59e0b' },
                { icon: Award, text: '100% authentic quality', color: '#ec4899' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-3 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}10` }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <span style={{ color: 'var(--color-home-muted-fg)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
