import { Check } from 'lucide-react';

const defaultFeatures = [
  'Choose your hair type, color, and length',
  'Select custom cap size and lace type',
  'Professional styling consultations',
  'Perfect fit guarantee',
];

export default function CustomWigSection({ image, settings }) {
  const heading = settings?.heading || 'Create Your Perfect Custom Wig';
  const description = settings?.description || 'Work with our expert stylists to design a wig that\'s uniquely yours. From hair type to cap construction, every detail is tailored to your preferences.';
  const features = settings?.features?.length > 0 ? settings.features : defaultFeatures;
  const buttonText = settings?.buttonText || 'Start Your Custom Order';
  const imgSrc = typeof image === 'string' && image.startsWith('uploads') ? `/${image}` : image;

  return (
    <section id="custom" className="home-bg-card py-20 lg:py-28">
      <div className="home-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="rounded-lg overflow-hidden home-shadow-medium aspect-square">
            <img
              src={imgSrc}
              alt="Custom wig consultation"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Content */}
          <div>
            <h2 style={{ color: 'var(--color-home-fg)' }}>
              {heading}
            </h2>
            <p className="home-text-muted mb-6">
              {description}
            </p>

            <ul className="space-y-4 mb-8" style={{ listStyle: 'none', padding: 0 }}>
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(155, 89, 182, 0.2)' }}
                  >
                    <Check size={14} style={{ color: 'var(--color-home-primary)' }} />
                  </span>
                  <span style={{ color: 'var(--color-home-fg)' }}>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="home-btn home-btn-gold home-btn-lg">
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
