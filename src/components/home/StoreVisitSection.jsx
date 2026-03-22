import { MapPin, Clock, Phone } from 'lucide-react';

export default function StoreVisitSection({ storeImage, settings }) {
  const heading = settings?.heading || 'Visit Our Store';
  const description = settings?.description || 'Experience our wigs in person. Our expert stylists are ready to help you find your perfect match.';
  const address = settings?.address || '123 Beauty Boulevard, Suite 100\nLos Angeles, CA 90210';
  const hours = settings?.hours || 'Mon - Sat: 10AM - 7PM | Sun: 12PM - 5PM';
  const phone = settings?.phone || '(555) 123-4567';
  const btn1 = settings?.buttonText1 || 'Book Appointment';
  const btn2 = settings?.buttonText2 || 'Get Directions';
  const imgSrc = typeof storeImage === 'string' && storeImage.startsWith('uploads') ? `/${storeImage}` : storeImage;

  const addressLines = address.split('\n');

  return (
    <section id="store" className="home-bg-card py-20 lg:py-28">
      <div className="home-container">
        <div
          className="rounded-3xl p-8 lg:p-12 home-shadow-medium"
          style={{ backgroundColor: 'var(--color-home-primary)' }}
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="rounded-lg overflow-hidden">
              <img
                src={imgSrc}
                alt="Divas Lace Wigs Store"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="text-white">
              <h2 className="text-white mb-6">{heading}</h2>
              <p className="mb-6 text-lg" style={{ color: 'rgba(255,255,255,0.95)' }}>
                {description}
              </p>

              <div className="space-y-4 mb-8" style={{ color: 'rgba(255,255,255,0.95)' }}>
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="mt-1 shrink-0" />
                  <div>
                    {addressLines.map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="shrink-0" />
                  <p>{hours}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="shrink-0" />
                  <p>{phone}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/contact" className="home-btn home-btn-white home-btn-lg">
                  {btn1}
                </a>
                <a href="/contact" className="home-btn home-btn-outline-white home-btn-lg">
                  {btn2}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
