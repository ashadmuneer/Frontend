import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import logoImg from '../../assets/home/logodivas.avif';

const defaultNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Stock Products', href: '/shop?category=Stock+Product' },
  { label: 'Custom Wigs', href: '/shop?category=Custom+Wigs' },
  { label: 'Custom Hair Products', href: '/custom-hair' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Header({ navLinks: dynamicNavLinks }) {
  const navLinks = dynamicNavLinks?.length > 0 ? dynamicNavLinks : defaultNavLinks;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = 2;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'home-bg-card home-shadow-soft'
          : 'backdrop-blur-md'
      }`}
      style={{
        ...(!isScrolled ? { backgroundColor: 'rgba(255,255,255,0.95)' } : {}),
        borderBottom: '2px solid var(--color-home-primary)',
      }}
    >
      <div className="home-container">
        <nav className="flex items-center justify-between py-4">
          {/* Logo – Left */}
          <Link
            to="/"
            className="flex items-center gap-2 no-underline shrink-0"
          >
            <img
              src={logoImg}
              alt="Divas Lace Wigs"
              className="rounded-full object-cover"
              style={{ width: '46px', height: '46px' }}
            />
            <span
              className="text-2xl font-bold hidden sm:inline"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-home-primary)' }}
            >
              Divas Lace Wigs
            </span>
          </Link>

          {/* Right Side – Nav + Actions */}
          <div className="flex items-center gap-7">
            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isInternal = link.href.startsWith('/');
                const Tag = isInternal ? Link : 'a';
                const props = isInternal ? { to: link.href } : { href: link.href };
                return (
                  <li key={link.label}>
                    <Tag
                      {...props}
                      className="relative font-medium text-[14.5px] transition-colors group no-underline whitespace-nowrap"
                      style={{ color: 'var(--color-home-fg)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-home-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-home-fg)'}
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
                    </Tag>
                  </li>
                );
              })}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-5">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg transition-colors cursor-pointer"
                style={{ color: 'var(--color-home-fg)', background: 'none', border: 'none' }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-6 home-animate-slide-up">
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isInternal = link.href.startsWith('/');
                const Tag = isInternal ? Link : 'a';
                const props = isInternal ? { to: link.href } : { href: link.href };
                return (
                  <li key={link.label}>
                    <Tag
                      {...props}
                      className="block py-2 font-medium transition-colors no-underline"
                      style={{ color: 'var(--color-home-fg)' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Tag>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
