import { useState, useEffect } from 'react';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import HeroSection from '../components/home/HeroSection';
import CategoryGrid from '../components/home/CategoryGrid';
import TrustSection from '../components/home/TrustSection';
import ProductGrid from '../components/home/ProductGrid';
import CustomWigSection from '../components/home/CustomWigSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import StoreVisitSection from '../components/home/StoreVisitSection';
import NewsletterSection from '../components/home/NewsletterSection';
import Footer from '../components/home/Footer';
import { getPublicProducts, getSiteSettings } from '../services/api';

// Import fallback images
import customWigImage from '../assets/home/custom-hair-products.png';
import storeImage from '../assets/home/who-we-are.png';

// Category images (fallbacks)
import laceFrontCategory from '../assets/home/lace-front-wigs.png';
import fullLaceCategory from '../assets/home/full-lace-wigs.png';
import gluelessCategory from '../assets/home/glueless-lace-wigs.png';
import closureCategory from '../assets/home/lace-closure-wigs.png';

// Product images (fallbacks)
import laceFrontProduct from '../assets/home/lace-front-product.png';
import gluelessFullLace from '../assets/home/glueless-full-lace.png';
import clearanceDeals from '../assets/home/clearance-deals.png';
import customHairProduct from '../assets/home/custom-hair-products.png';

const fallbackImages = [laceFrontProduct, gluelessFullLace, clearanceDeals, customHairProduct];

// Avatar images (fallbacks)
import avatar1 from '../assets/home/avatar-1.jpg';
import avatar2 from '../assets/home/avatar-2.jpg';
import avatar3 from '../assets/home/avatar-3.jpg';

const defaultCategories = [
  { id: 'lace-front', title: 'Lace Front Wigs', image: laceFrontCategory, link: '/shop?search=Lace+Front' },
  { id: 'full-lace', title: 'Full Lace Wigs', image: fullLaceCategory, link: '/shop?search=Full+Lace' },
  { id: 'glueless', title: 'Glueless Lace Wigs', image: gluelessCategory, link: '/shop?search=Glueless' },
  { id: 'closures', title: 'Lace Closure Wigs', image: closureCategory, link: '/shop?search=Closure' },
];

const defaultTestimonials = [
  {
    id: '1',
    text: "I've tried many wigs before, but nothing compares to the quality from Divas. The lace is completely invisible and the hair feels so natural. I get compliments every day!",
    author: 'Jasmine Williams',
    location: 'Los Angeles, CA',
    rating: 5,
    avatar: avatar1,
  },
  {
    id: '2',
    text: "The custom wig experience was amazing. The team really listened to what I wanted and created the perfect piece. Worth every penny!",
    author: 'Nicole Brown',
    location: 'Atlanta, GA',
    rating: 5,
    avatar: avatar2,
  },
  {
    id: '3',
    text: "Fast shipping and the wig looked exactly like the photos. The hairline is so natural that even my friends couldn't tell it was a wig!",
    author: 'Destiny Johnson',
    location: 'Houston, TX',
    rating: 5,
    avatar: avatar3,
  },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch products and settings in parallel
      const [productsRes, settingsRes] = await Promise.allSettled([
        getPublicProducts(),
        getSiteSettings(),
      ]);

      // Products
      if (productsRes.status === 'fulfilled') {
        const all = productsRes.value.data.data || [];
        const showCount = settingsRes.status === 'fulfilled'
          ? settingsRes.value.data.data?.productSection?.showCount || 4
          : 4;
        const mapped = all.slice(0, showCount).map((p, i) => ({
          id: p._id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          image: p.imageUrl || (p.galleryUrls && p.galleryUrls[0]) || p.bannerUrl || fallbackImages[i % fallbackImages.length],
          alt: p.imageMeta?.alt?.trim() || p.galleryMeta?.[0]?.alt?.trim() || p.bannerMeta?.alt?.trim() || p.name,
        }));
        setProducts(mapped);
      }

      // Settings
      if (settingsRes.status === 'fulfilled') {
        setSiteSettings(settingsRes.value.data.data);
      }
    };

    fetchData();
  }, []);

  // Derive data from settings or use defaults
  const s = siteSettings;

  const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:')) return url;
    return `/${url}`;
  };

  const categories = s?.categorySection?.categories?.length > 0
    ? s.categorySection.categories.map((c, i) => ({
        id: `cat-${i}`,
        title: c.title,
        image: resolveImageUrl(c.image) || defaultCategories[i]?.image || laceFrontCategory,
        link: c.link,
      }))
    : defaultCategories;

  const testimonials = s?.testimonialsSection?.testimonials?.length > 0
    ? s.testimonialsSection.testimonials.map((t, i) => ({
        id: String(i + 1),
        text: t.text,
        author: t.author,
        location: t.location,
        rating: t.rating || 5,
        avatar: resolveImageUrl(t.avatar) || [avatar1, avatar2, avatar3][i % 3],
      }))
    : defaultTestimonials;

  // Update document title and meta from settings
  useEffect(() => {
    if (!s?.seo) return;

    const originalTitle = document.title;
    const createdElements = []; // track elements we create for cleanup

    if (s.seo.siteTitle) document.title = s.seo.siteTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && s.seo.metaDescription) metaDesc.setAttribute('content', s.seo.metaDescription);

    // Helper: find or create a meta tag, track for cleanup
    const ensureMeta = (selector, createFn) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = createFn();
        document.head.appendChild(el);
        createdElements.push(el);
      }
      return el;
    };

    // Meta keywords
    if (s.seo.metaKeywords) {
      const mk = ensureMeta('meta[name="keywords"]', () => {
        const m = document.createElement('meta');
        m.name = 'keywords';
        return m;
      });
      mk.content = s.seo.metaKeywords;
    }

    // OG tags
    const setOg = (property, content) => {
      if (!content) return;
      const og = ensureMeta(`meta[property="${property}"]`, () => {
        const m = document.createElement('meta');
        m.setAttribute('property', property);
        return m;
      });
      og.setAttribute('content', content);
    };
    setOg('og:title', s.seo.siteTitle);
    setOg('og:description', s.seo.metaDescription);
    if (s.seo.ogImage) {
      // OG images must be absolute URLs for social crawlers
      const ogUrl = s.seo.ogImage.startsWith('http')
        ? s.seo.ogImage
        : `${window.location.origin}/${s.seo.ogImage.replace(/^\//, '')}`;
      setOg('og:image', ogUrl);
    }

    // Google verification
    if (s.seo.googleVerification) {
      const gv = ensureMeta('meta[name="google-site-verification"]', () => {
        const m = document.createElement('meta');
        m.name = 'google-site-verification';
        return m;
      });
      gv.content = s.seo.googleVerification;
    }

    // Google Analytics — validate ID format before injecting scripts
    const gaId = s.seo.googleAnalyticsId;
    if (gaId && /^(G|UA|AW|DC)-[A-Za-z0-9-]+$/.test(gaId) && !document.querySelector('script[src*="googletagmanager"]')) {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script1);
      createdElements.push(script1);
      const script2 = document.createElement('script');
      script2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
      document.head.appendChild(script2);
      createdElements.push(script2);
    }

    // Cleanup on unmount: remove elements we created, restore title
    return () => {
      document.title = originalTitle;
      createdElements.forEach((el) => el.parentNode?.removeChild(el));
    };
  }, [s]);

  return (
    <div className="home-page">
      <AnnouncementBar settings={s?.announcement} />
      <Header navLinks={s?.navLinks} />
      <main>
        <HeroSection settings={s?.hero} />
        <CategoryGrid
          categories={categories}
          heading={s?.categorySection?.heading}
        />
        <TrustSection settings={s?.trustSection} />
        <ProductGrid
          products={products}
          heading={s?.productSection?.heading}
        />
        <CustomWigSection
          image={s?.customWigSection?.image || customWigImage}
          settings={s?.customWigSection}
        />
        <TestimonialsSection
          testimonials={testimonials}
          heading={s?.testimonialsSection?.heading}
        />
        <StoreVisitSection
          storeImage={s?.storeVisitSection?.image || storeImage}
          settings={s?.storeVisitSection}
        />
        <NewsletterSection settings={s?.newsletterSection} />
      </main>
      <Footer settings={s?.footer} footerLinkGroups={s?.footerLinkGroups} />
    </div>
  );
}
