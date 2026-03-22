import { Sparkles, Award, Truck, HeartHandshake } from 'lucide-react';

const defaultTrustItems = [
  {
    icon: 'Award',
    title: '100% Human Hair',
    description: 'Premium quality virgin hair',
  },
  {
    icon: 'Truck',
    title: 'Free Express Shipping',
    description: 'On orders over $150',
  },
  {
    icon: 'Sparkles',
    title: 'Natural Hairline Technology',
    description: 'Undetectable, realistic hairlines',
  },
  {
    icon: 'HeartHandshake',
    title: 'In-Store & Online Support',
    description: 'Expert guidance every step of the way',
  },
];

const iconMap = { Award, Truck, Sparkles, HeartHandshake };

export default function TrustSection({ settings }) {
  const items = settings?.items?.length > 0 ? settings.items : defaultTrustItems;

  return (
    <section className="py-16 home-bg-card">
      <div className="home-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Award;
            return (
              <div
                key={index}
                className="text-center p-6 home-animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 home-gradient-primary"
                >
                  <IconComponent className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-home-fg)' }}>
                  {item.title}
                </h3>
                <p className="text-sm home-text-muted">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
