import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  X,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { getPublicProducts } from '../services/api';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import ImageLabelOverlay from '../components/ImageLabelOverlay';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePageSeo } from '../hooks/usePageSeo';

export default function ProductCatalogPage() {
  const { settings } = useSiteSettings();
  usePageSeo(settings?.pageSeo?.shop, {
    title: 'Shop | Divas Lace Wigs',
    description: 'Browse our premium collection of luxury lace wigs and hair products.',
    keywords: 'lace wigs, luxury wigs, hair products, shop',
  });

  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync category and search from URL params when they change
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const q = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearch(q);
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const { data } = await getPublicProducts();
      setProducts(data.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Get the starting price (min price from the length/base-price dropdown)
  const getStartingPrice = (product) => {
    const lengthField = product.fields?.find(
      (f) =>
        f.type === 'dropdown' &&
        f.options?.length > 0 &&
        f.options.some((o) => o.priceAdjustment > 0)
    );
    if (lengthField) {
      const prices = lengthField.options
        .map((o) => o.priceAdjustment)
        .filter((p) => p > 0);
      if (prices.length > 0) return Math.min(...prices);
    }
    return product.basePrice || 0;
  };

  // Count configurable fields
  const getFieldCount = (product) =>
    product.fields?.filter((f) => f.type === 'dropdown').length || 0;

  return (
    <div className="home-page">
      <Header navLinks={settings?.navLinks} />

      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #2d1b3d 0%, #1a0a2e 40%, #0f0520 100%)',
          minHeight: '340px',
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--color-home-primary)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-15 blur-3xl"
          style={{ background: 'var(--color-home-accent)' }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'var(--color-home-secondary)' }}
        />

        <div className="home-container relative z-10 py-20 lg:py-28 text-center">
          <div className="home-animate-fade-in">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                background: 'rgba(155, 89, 182, 0.2)',
                border: '1px solid rgba(155, 89, 182, 0.3)',
                color: 'var(--color-home-secondary)',
              }}
            >
              <Sparkles size={14} />
              Premium Collection
            </div>
            <h1
              className="text-white mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                lineHeight: 1.1,
              }}
            >
              Our <span style={{ color: 'var(--color-home-accent)' }}>Products</span>
            </h1>
            <p
              className="text-lg max-w-xl mx-auto mb-8"
              style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Poppins', sans-serif" }}
            >
              Explore our curated collection of luxury wigs and hair products,
              each fully customizable to your exact specifications.
            </p>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontFamily: "'Poppins', sans-serif",
                  backdropFilter: 'blur(10px)',
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = 'rgba(155, 89, 182, 0.5)')
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = 'rgba(255,255,255,0.12)')
                }
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <section
        className="sticky top-[73px] z-30"
        style={{
          background: 'rgba(250, 248, 245, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-home-border)',
        }}
      >
        <div className="home-container py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('')}
                className="home-btn home-btn-sm whitespace-nowrap transition-all"
                style={
                  !selectedCategory
                    ? {
                        backgroundColor: 'var(--color-home-primary)',
                        color: 'white',
                      }
                    : {
                        backgroundColor: 'transparent',
                        color: 'var(--color-home-fg)',
                        border: '1.5px solid var(--color-home-border)',
                      }
                }
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat ? '' : cat)
                  }
                  className="home-btn home-btn-sm whitespace-nowrap transition-all"
                  style={
                    selectedCategory === cat
                      ? {
                          backgroundColor: 'var(--color-home-primary)',
                          color: 'white',
                        }
                      : {
                          backgroundColor: 'transparent',
                          color: 'var(--color-home-fg)',
                          border: '1.5px solid var(--color-home-border)',
                        }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}
              >
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid ─────────────────────────────────────── */}
      <section className="py-16 lg:py-20" style={{ backgroundColor: 'var(--color-home-bg)' }}>
        <div className="home-container">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: 'var(--color-home-primary)' }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'var(--color-home-muted)' }}
              >
                <Search size={28} style={{ color: 'var(--color-home-muted-fg)' }} />
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--color-home-fg)',
                }}
              >
                No products found
              </h3>
              <p className="home-text-muted mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                }}
                className="home-btn home-btn-outline mt-6"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  startingPrice={getStartingPrice(product)}
                  fieldCount={getFieldCount(product)}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer settings={settings?.footer} footerLinkGroups={settings?.footerLinkGroups} />
    </div>
  );
}

/* ── Product Card ──────────────────────────────────────────── */
function ProductCard({ product, startingPrice, fieldCount, index }) {
  const [hovered, setHovered] = useState(false);

  // Deterministic gradient backgrounds based on product index
  const gradients = [
    'linear-gradient(145deg, #f3e8ff 0%, #e9d5f5 30%, #f5e6d3 100%)',
    'linear-gradient(145deg, #fce4ec 0%, #f8bbd0 30%, #e1bee7 100%)',
    'linear-gradient(145deg, #e8eaf6 0%, #d1c4e9 30%, #f3e5f5 100%)',
    'linear-gradient(145deg, #fff3e0 0%, #ffe0b2 30%, #ffccbc 100%)',
    'linear-gradient(145deg, #fbe9e7 0%, #ffccbc 30%, #d7ccc8 100%)',
    'linear-gradient(145deg, #f3e5f5 0%, #e1bee7 30%, #c5cae9 100%)',
  ];

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group block rounded-xl overflow-hidden no-underline home-hover-lift"
      style={{
        backgroundColor: 'var(--color-home-card)',
        border: '1px solid var(--color-home-border)',
        animationDelay: `${index * 60}ms`,
        animation: 'home-slide-up 0.5s ease-out both',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image / Gradient placeholder */}
      <div className="relative h-64 overflow-hidden">
        {product.imageUrl ? (
          <>
            <img
              src={product.imageUrl}
              alt={product.imageMeta?.alt?.trim() || product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110"
            style={{ background: gradients[index % gradients.length] }}
          >
            <span
              className="text-5xl font-bold opacity-20"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <span
            className="absolute top-3 left-3 text-[11px] font-semibold px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: 'rgba(155, 89, 182, 0.9)',
              color: 'white',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {product.category}
          </span>
        )}

        {/* Customizable badge */}
        {fieldCount > 0 && (
          <span
            className="absolute top-3 right-3 text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1"
            style={{
              backgroundColor: 'rgba(184, 134, 11, 0.9)',
              color: 'white',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <Sparkles size={11} />
            {fieldCount} Options
          </span>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{
            background: hovered
              ? 'rgba(155, 89, 182, 0.15)'
              : 'transparent',
          }}
        >
          <div
            className="transition-all duration-300 flex items-center gap-2 font-medium text-sm px-5 py-2.5 rounded-full"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(12px)',
              backgroundColor: 'white',
              color: 'var(--color-home-primary)',
              fontFamily: "'Poppins', sans-serif",
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            Customize & Order <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="text-base font-semibold mb-1.5 line-clamp-2 transition-colors"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: hovered ? 'var(--color-home-primary)' : 'var(--color-home-fg)',
          }}
        >
          {product.name}
        </h3>

        {product.description && (
          <p
            className="text-sm line-clamp-2 mb-3"
            style={{
              color: 'var(--color-home-muted-fg)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {product.description.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div>
            {startingPrice > 0 ? (
              <>
                <span
                  className="text-xs"
                  style={{ color: 'var(--color-home-muted-fg)', fontFamily: "'Poppins', sans-serif" }}
                >
                  Starting at
                </span>
                <p
                  className="text-xl font-bold -mt-0.5"
                  style={{ color: 'var(--color-home-primary)', fontFamily: "'Poppins', sans-serif" }}
                >
                  ${startingPrice}
                </p>
              </>
            ) : (
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--color-home-accent)', fontFamily: "'Poppins', sans-serif" }}
              >
                Custom Pricing
              </span>
            )}
          </div>

          <span
            className="flex items-center gap-1 text-sm font-medium transition-all duration-300"
            style={{
              color: 'var(--color-home-primary)',
              fontFamily: "'Poppins', sans-serif",
              opacity: hovered ? 1 : 0.6,
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
            }}
          >
            Order <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
