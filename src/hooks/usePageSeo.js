import { useEffect } from 'react';

/**
 * Hook that sets document title and meta tags for a page.
 * Falls back to provided defaults when no settings exist.
 *
 * @param {Object} pageSeo - Per-page SEO from settings (e.g. settings.pageSeo.shop)
 * @param {Object} defaults - Default values { title, description, keywords }
 */
export function usePageSeo(pageSeo, defaults = {}) {
  useEffect(() => {
    const originalTitle = document.title;
    const createdElements = [];

    const title = pageSeo?.title || defaults.title;
    const description = pageSeo?.metaDescription || defaults.description;
    const keywords = pageSeo?.metaKeywords || defaults.keywords;
    const ogImage = pageSeo?.ogImage;

    if (title) document.title = title;

    // Helper
    const ensureMeta = (selector, createFn) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = createFn();
        document.head.appendChild(el);
        createdElements.push(el);
      }
      return el;
    };

    if (description) {
      const el = ensureMeta('meta[name="description"]', () => {
        const m = document.createElement('meta');
        m.name = 'description';
        return m;
      });
      el.setAttribute('content', description);
    }

    if (keywords) {
      const el = ensureMeta('meta[name="keywords"]', () => {
        const m = document.createElement('meta');
        m.name = 'keywords';
        return m;
      });
      el.setAttribute('content', keywords);
    }

    // OG tags
    const setOg = (prop, content) => {
      if (!content) return;
      const el = ensureMeta(`meta[property="${prop}"]`, () => {
        const m = document.createElement('meta');
        m.setAttribute('property', prop);
        return m;
      });
      el.setAttribute('content', content);
    };

    setOg('og:title', title);
    setOg('og:description', description);
    if (ogImage) {
      const url = ogImage.startsWith('http')
        ? ogImage
        : `${window.location.origin}/${ogImage.replace(/^\//, '')}`;
      setOg('og:image', url);
    }

    return () => {
      document.title = originalTitle;
      createdElements.forEach((el) => el.parentNode?.removeChild(el));
    };
  }, [pageSeo, defaults.title, defaults.description, defaults.keywords]);
}
