import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/home/logodivas.avif';

const defaultFooterLinkGroups = [
  {
    title: 'Shop',
    links: [
      { label: 'Lace Front Wigs', href: '/shop?search=Lace+Front' },
      { label: 'Full Lace Wigs', href: '/shop?search=Full+Lace' },
      { label: 'Closures & Frontals', href: '/shop?search=Closure' },
      { label: 'Hair Bundles', href: '/shop?search=Bundles' },
      { label: 'Accessories', href: '/shop?search=Accessories' },
      { label: 'Custom Hair Products', href: '/custom-hair' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns & Exchanges', href: '/return-policy' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Size Guide', href: '#' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/about' },
      { label: 'Blog', href: '/blog' },
    ],
  },
];

export default function Footer({ settings, footerLinkGroups: dynamicGroups }) {
  const brandDescription = settings?.brandDescription || 'Luxury human hair wigs, crafted for women who demand the best.';
  const copyright = settings?.copyright || '© 2026 Divas Lace Wigs. All rights reserved. | Proudly Powered by Quntum Web Solutions';
  const social = settings?.socialLinks || {};
  const linkGroups = dynamicGroups?.length > 0 ? dynamicGroups : defaultFooterLinkGroups;

  const socialLinks = [
    { icon: Instagram, href: social.instagram || '#', label: 'Instagram' },
    { icon: Facebook, href: social.facebook || '#', label: 'Facebook' },
    { icon: Youtube, href: social.youtube || '#', label: 'YouTube' },
    { icon: Twitter, href: social.twitter || '#', label: 'Twitter' },
  ];

  // Determine grid columns: brand + N link groups
  const gridCols = linkGroups.length + 1;
  const gridClass = gridCols <= 2
    ? 'grid sm:grid-cols-2 gap-12 mb-12'
    : gridCols <= 3
    ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12'
    : 'grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12';

  return (
    <footer className="py-16" style={{ backgroundColor: 'var(--color-home-fg)', color: 'white' }}>
      <div className="home-container">
        <div className={gridClass}>
          {/* Brand */}
          <div>
            <a
              href="/"
              className="flex items-center gap-2 mb-4 no-underline"
            >
              <img
                src={logoImg}
                alt="Divas Lace Wigs"
                className="rounded-full object-cover"
                style={{ width: '46px', height: '46px' }}
              />
              <span
                className="text-2xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-home-primary)' }}
              >
                Divas Lace Wigs
              </span>
            </a>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {brandDescription}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all no-underline"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-home-primary)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Footer Link Groups */}
          {linkGroups.map((group, gi) => (
            <div key={gi}>
              <h4
                className="text-lg mb-4"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-home-primary)' }}
              >
                {group.title}
              </h4>
              <ul className="space-y-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(group.links || []).map((link, li) => {
                  const isInternal = link.href?.startsWith('/');
                  const Tag = isInternal ? Link : 'a';
                  const linkProps = isInternal ? { to: link.href } : { href: link.href || '#' };
                  return (
                    <li key={li}>
                      <Tag
                        {...linkProps}
                        className="text-sm transition-colors no-underline"
                        style={{ color: 'rgba(255,255,255,0.8)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-home-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                      >
                        {link.label}
                      </Tag>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
