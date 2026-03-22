import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoryGrid({ categories, heading }) {
  return (
    <section id="shop" className="py-20 lg:py-28">
      <div className="home-container">
        <div className="text-center mb-12">
          <h2>{heading || 'Shop by Category'}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative rounded-lg overflow-hidden h-[340px] home-shadow-soft home-hover-lift cursor-pointer block"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to top, rgba(155,89,182,0.9), transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {category.title}
                </h3>
                <span
                  className="inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2"
                  style={{ color: 'var(--color-home-accent)' }}
                >
                  Shop Now <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
