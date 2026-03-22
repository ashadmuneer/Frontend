import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePageSeo } from '../hooks/usePageSeo';
import { getPublicCustomHairProducts } from '../services/api';
import { ArrowRight, Loader2 } from 'lucide-react';

const getProductPreviewImage = (product) => {
  const firstSectionImage = (product?.sections || []).flatMap((section) =>
    Array.isArray(section?.images) ? section.images.filter((image) => image?.url) : []
  )[0];

  return firstSectionImage?.url || product?.images?.[0] || '';
};

export default function CustomHairPage() {
  const { settings } = useSiteSettings();
  usePageSeo(settings?.pageSeo?.customHair, {
    title: 'Custom Hair Products | Divas Lace Wigs',
    description: 'Explore our premium custom hair products — toppers, closures, extensions, frontals and more.',
    keywords: 'custom hair, toppers, closures, toupees, lace frontals, hair extensions',
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getPublicCustomHairProducts();
        setProducts(res.data.data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      <AnnouncementBar settings={settings?.announcement} />
      <Header navLinks={settings?.navLinks} />
      <main>
        {/* Hero */}
        <section className="chp-hero">
          <div className="home-container">
            <h1 className="chp-hero-title">Custom Hair Products</h1>
            <p className="chp-hero-subtitle">
              Explore our collection of premium custom hair solutions — handcrafted pieces tailored
              to your unique needs and style preferences.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="chp-section">
          <div className="home-container">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-home-primary)' }} />
              </div>
            ) : products.length === 0 ? (
              <p className="chp-empty">No custom hair products available at the moment.</p>
            ) : (
              <div className="chp-catalog-grid">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/custom-hair/${product.slug}`}
                    className="chp-catalog-card"
                  >
                    <div className="chp-catalog-card-img">
                      {getProductPreviewImage(product) ? (
                        <>
                          <img src={getProductPreviewImage(product)} alt={product.name} />
                        </>
                      ) : (
                        <div className="chp-catalog-card-placeholder">
                          <span>No Image</span>
                        </div>
                      )}
                      <div className="chp-catalog-card-overlay">
                        <span className="chp-catalog-card-view">
                          View Details <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                    <div className="chp-catalog-card-body">
                      <h3 className="chp-catalog-card-name">{product.name}</h3>
                      <p className="chp-catalog-card-desc">{product.description ? product.description.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : ''}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings?.footer} footerLinkGroups={settings?.footerLinkGroups} />
    </div>
  );
}
