import { useState } from 'react';

export default function NewsletterSection({ settings }) {
  const [email, setEmail] = useState('');
  const heading = settings?.heading || 'Join the Divas Club';
  const description = settings?.description || 'Get exclusive offers, styling tips, and be the first to know about new arrivals.';
  const buttonText = settings?.buttonText || 'Subscribe';

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-16">
      <div className="home-container">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="mb-4">{heading}</h2>
          <p className="home-text-muted mb-8">
            {description}
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="home-input flex-1"
              required
            />
            <button type="submit" className="home-btn home-btn-gold">
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
