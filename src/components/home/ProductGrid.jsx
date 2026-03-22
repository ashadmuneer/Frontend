import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ProductGrid({ products, heading }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="home-container">
        <div className="text-center mb-12">
          <h2>{heading || 'Our Products'}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/shop/${product.slug}`}
              className="group rounded-lg overflow-hidden home-shadow-soft home-hover-lift home-bg-card no-underline block"
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden">
                {product.category && (
                  <span
                    className="absolute top-4 left-4 z-10 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-home-accent)', color: 'var(--color-home-accent-fg)' }}
                  >
                    {product.category}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.alt || product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="p-5">
                <h4 className="font-medium text-lg mb-3 line-clamp-2" style={{ color: 'var(--color-home-fg)', fontFamily: "'Poppins', sans-serif" }}>
                  {product.name}
                </h4>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                  style={{ color: 'var(--color-home-primary)' }}
                >
                  View Details <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
