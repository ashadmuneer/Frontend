import { Star } from 'lucide-react';

export default function TestimonialsSection({ testimonials, heading }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="home-container">
        <div className="text-center mb-12">
          <h2>{heading || 'What Our Queens Say'}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-8 rounded-lg home-shadow-soft home-hover-lift home-bg-card"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4" style={{ color: 'var(--color-home-accent)' }}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>

              {/* Text */}
              <p className="home-text-muted italic leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-home-fg)' }}>
                    {testimonial.author}
                  </p>
                  <p className="text-sm home-text-muted">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
