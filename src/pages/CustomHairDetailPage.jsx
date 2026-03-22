import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import ImageLabelOverlay from '../components/ImageLabelOverlay';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { getPublicCustomHairProductBySlug } from '../services/api';
import { Phone, Mail, ChevronLeft, ChevronRight, X, ArrowLeft, Loader2 } from 'lucide-react';

const getSectionImages = (product) =>
  (product?.sections || []).flatMap((section, sectionIndex) =>
    Array.isArray(section?.images)
      ? section.images
          .filter((image) => image?.url)
          .map((image, imageIndex) => ({
            url: image.url,
            alt: image.alt || '',
            label: image.label || '',
            labelPosition: image.labelPosition || 'bottom-center',
            showLabel: Boolean(image.showLabel),
            fit: image.fit || 'contain',
            sectionIndex,
            imageIndex,
            sectionTitle: section.title || product?.name || 'Section',
          }))
      : []
  );

const getSectionImageStartIndex = (sections, sectionIndex) =>
  sections.slice(0, sectionIndex).reduce((total, section) => total + (section.images?.filter((image) => image?.url).length || 0), 0);

export default function CustomHairDetailPage() {
  const { slug } = useParams();
  const { settings } = useSiteSettings();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getPublicCustomHairProductBySlug(slug);
        setProduct(res.data.data || null);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Divas Lace Wigs`;
    }
    return () => {
      document.title = 'Divas Lace Wigs';
    };
  }, [product]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxIdx(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const sectionImages = useMemo(() => getSectionImages(product), [product]);

  const navigateLightbox = (dir) => {
    if (sectionImages.length === 0) return;
    setLightboxIdx((prev) => (prev + dir + sectionImages.length) % sectionImages.length);
  };

  if (loading) {
    return (
      <div className="home-page">
        <AnnouncementBar settings={settings?.announcement} />
        <Header navLinks={settings?.navLinks} />
        <main>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8rem 0', background: 'var(--color-home-bg)' }}>
            <Loader2 size={36} className="animate-spin" style={{ color: 'var(--color-home-primary)' }} />
          </div>
        </main>
        <Footer settings={settings?.footer} footerLinkGroups={settings?.footerLinkGroups} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="home-page">
        <AnnouncementBar settings={settings?.announcement} />
        <Header navLinks={settings?.navLinks} />
        <main>
          <section className="chp-hero">
            <div className="home-container" style={{ textAlign: 'center' }}>
              <h1 className="chp-hero-title">Product Not Found</h1>
              <p className="chp-hero-subtitle">The custom hair product you are looking for does not exist.</p>
              <Link to="/custom-hair" className="chp-back-link" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                <ArrowLeft size={18} /> Back to Custom Hair Products
              </Link>
            </div>
          </section>
        </main>
        <Footer settings={settings?.footer} footerLinkGroups={settings?.footerLinkGroups} />
      </div>
    );
  }

  const renderSectionImages = (section, sectionIndex) => {
    const sectionImagesForBlock = Array.isArray(section.images)
      ? section.images.filter((image) => image?.url)
      : [];

    if (sectionImagesForBlock.length === 0) return null;

    const startIndex = getSectionImageStartIndex(product.sections || [], sectionIndex);

    return (
      <div className="chp-section-media" style={{ '--chp-section-columns': section.imageColumns || 2 }}>
        {sectionImagesForBlock.map((image, imageIndex) => (
          <button
            key={`${sectionIndex}-${imageIndex}`}
            type="button"
            className="chp-section-media-item"
            onClick={() => setLightboxIdx(startIndex + imageIndex)}
          >
            <img
              src={image.url}
              alt={image.alt || `${section.title || product.name} image ${imageIndex + 1}`}
              className="chp-section-media-img"
              style={{ objectFit: image.fit || 'contain' }}
            />
            <ImageLabelOverlay meta={image} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="home-page">
      <AnnouncementBar settings={settings?.announcement} />
      <Header navLinks={settings?.navLinks} />
      <main>
        <section className="chp-detail-breadcrumb">
          <div className="home-container">
            <Link to="/custom-hair" className="chp-back-link">
              <ArrowLeft size={18} />
              <span>Back to Custom Hair Products</span>
            </Link>
          </div>
        </section>

        <section className="chp-detail-section">
          <div className="home-container">
            <div className="chp-detail-top chp-detail-top--content-only">
              <div className="chp-detail-content chp-detail-content--full chp-detail-intro-card">
                <div className="chp-detail-kicker-row">
                  <span className="chp-detail-kicker">Custom Hair Product</span>
                </div>
                <h1 className="chp-detail-name">{product.name}</h1>
                <p className="chp-detail-desc">{product.description}</p>

                <p className="chp-product-cta">Call or email us to schedule a FREE Consultation.</p>

                <div className="chp-contact-btns">
                  {product.contactPhone && (
                    <a
                      href={`tel:${product.contactPhone.replace(/[^+\d]/g, '')}`}
                      className="chp-contact-btn chp-contact-btn--call"
                    >
                      <Phone size={16} />
                      <span>{product.contactPhone}</span>
                    </a>
                  )}
                  {product.contactEmail && (
                    <a
                      href={`mailto:${product.contactEmail}?subject=Inquiry about ${encodeURIComponent(product.name)}`}
                      className="chp-contact-btn chp-contact-btn--email"
                    >
                      <Mail size={16} />
                      <span>{product.contactEmail}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {product.detailText && (
              <div className="chp-detail-body">
                {product.detailText.split('\n\n').map((para, pi) => (
                  <p key={pi}>{para}</p>
                ))}
              </div>
            )}

            {product.sections?.length > 0 && (
              <div className="chp-detail-sections">
                {product.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="chp-section-item">
                    {section.imagePlacement === 'before-title' && renderSectionImages(section, sectionIndex)}

                    {section.title && <h2 className="chp-section-title">{section.title}</h2>}

                    {section.imagePlacement !== 'before-title' && section.imagePlacement !== 'after-content' && renderSectionImages(section, sectionIndex)}

                    {section.content && (
                      <div className="chp-section-content">
                        {section.content.split('\n\n').map((para, paraIndex) => (
                          <p key={paraIndex}>{para}</p>
                        ))}
                      </div>
                    )}

                    {section.imagePlacement === 'after-content' && renderSectionImages(section, sectionIndex)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {lightboxIdx !== null && sectionImages.length > 0 && (
        <div className="chp-lightbox" onClick={() => setLightboxIdx(null)}>
          <button className="chp-lightbox-close" onClick={() => setLightboxIdx(null)} type="button">
            <X size={24} />
          </button>
          <div className="chp-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            {sectionImages.length > 1 && (
              <button
                className="chp-lightbox-nav chp-lightbox-nav--prev"
                onClick={() => navigateLightbox(-1)}
                type="button"
              >
                <ChevronLeft size={28} />
              </button>
            )}
            <img
              src={sectionImages[lightboxIdx].url}
              alt={sectionImages[lightboxIdx].alt || `${sectionImages[lightboxIdx].sectionTitle} image ${lightboxIdx + 1}`}
              className="chp-lightbox-img"
            />
            {sectionImages.length > 1 && (
              <button
                className="chp-lightbox-nav chp-lightbox-nav--next"
                onClick={() => navigateLightbox(1)}
                type="button"
              >
                <ChevronRight size={28} />
              </button>
            )}
            <div className="chp-lightbox-counter">
              {lightboxIdx + 1} / {sectionImages.length}
            </div>
          </div>
        </div>
      )}

      <Footer settings={settings?.footer} footerLinkGroups={settings?.footerLinkGroups} />
    </div>
  );
}
