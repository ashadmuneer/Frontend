import { useState, useEffect } from 'react';
import hero1 from '../../assets/home/hero1.avif';
import hero2 from '../../assets/home/hero2.avif';
import hero3 from '../../assets/home/hero3.avif';
import hero4 from '../../assets/home/hero4.avif';

const defaultHeroImages = [hero1, hero2, hero3, hero4];

export default function HeroSection({ settings }) {
  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = settings?.images?.length > 0
    ? settings.images.map((img) => img.startsWith('http') ? img : `/${img}`)
    : defaultHeroImages;

  const heading = settings?.heading || 'Luxury Lace Wigs\nThat Look Completely\nNatural';
  const subheading = settings?.subheading || 'Premium human hair wigs, custom-made and ready-to-wear.\nDesigned for confidence.';
  const btn1Text = settings?.buttonText1 || 'Shop Lace Wigs';
  const btn1Link = settings?.buttonLink1 || '#shop';
  const btn2Text = settings?.buttonText2 || 'Book Consultation';
  const btn2Link = settings?.buttonLink2 || '/contact';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const headingLines = heading.split('\n');

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Beautiful woman wearing luxury lace wig ${index + 1}`}
            className={`absolute w-full h-full object-cover object-center transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* Dark overlay gradient from left */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(31,31,31,0.9), rgba(31,31,31,0.7), transparent)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl home-animate-slide-left">
          <h1 className="italic leading-tight mb-6" style={{ color: 'white' }}>
            {headingLines.map((line, i) => (
              <span key={i}>
                {i === headingLines.length - 1 ? (
                  <span className="not-italic">{line}</span>
                ) : (
                  <>{line}<br /></>
                )}
              </span>
            ))}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {subheading.split('\n').map((line, i) => (
              <span key={i}>{line}{i < subheading.split('\n').length - 1 && <br />}</span>
            ))}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={btn1Link} className="home-btn home-btn-gold home-btn-lg">
              {btn1Text}
            </a>
            <a href={btn2Link} className="home-btn home-btn-outline-hero home-btn-lg">
              {btn2Text}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
