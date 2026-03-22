import { useState } from 'react';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePageSeo } from '../hooks/usePageSeo';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Send,
  Loader2,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const wigTypes = [
  'Lace Front Wig',
  'Full Lace Wig',
  'Glueless Wig',
  'Lace Closure Wig',
  'Custom Wig',
  'Other',
];

const businessHours = [
  { day: 'Mon - Wed & Fri', hours: '9:00 am - 4:00 pm PST' },
  { day: 'Thursday', hours: '12:00 pm - 4:00 pm PST' },
  { day: 'Saturday', hours: '12:00 pm - 3:00 pm PST' },
  { day: 'Sunday / Holidays', hours: 'CLOSED' },
];

export default function ContactPage() {
  const { settings } = useSiteSettings();
  usePageSeo(settings?.pageSeo?.contact, {
    title: 'Contact Us | Divas Lace Wigs',
    description: 'Get in touch with our wig specialists for personalized consultations.',
    keywords: 'contact, consultation, wig specialist, customer service',
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    wigType: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Your consultation request has been sent! We\'ll be in touch shortly.');
    setForm({ name: '', email: '', phone: '', wigType: '', message: '' });
    setSubmitting(false);
  };

  return (
    <div className="home-page">
      <AnnouncementBar settings={settings?.announcement} />
      <Header navLinks={settings?.navLinks} />
      <main>
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="home-container">
            <h1 className="contact-hero-title">Connect With Our Specialists</h1>
            <p className="contact-hero-subtitle">
              Experience personalized luxury. Let our experts guide you to the perfect lace wig
              that enhances your natural beauty.
            </p>
          </div>
        </section>

        {/* Main Content: Form + Contact Info */}
        <section className="contact-main">
          <div className="home-container">
            <div className="contact-grid">
              {/* Left - Contact Form */}
              <div className="contact-form-card">
                <h2 className="contact-form-title">Talk to a Lace Wig Specialist</h2>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form-row">
                    <div className="contact-form-field">
                      <label className="contact-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="contact-input"
                      />
                    </div>
                    <div className="contact-form-field">
                      <label className="contact-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="email@example.com"
                        className="contact-input"
                      />
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div className="contact-form-field">
                      <label className="contact-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="702-000-0000"
                        className="contact-input"
                      />
                    </div>
                    <div className="contact-form-field">
                      <label className="contact-label">Wig Type</label>
                      <div className="contact-select-wrapper">
                        <select
                          name="wigType"
                          value={form.wigType}
                          onChange={handleChange}
                          className="contact-select"
                        >
                          <option value="">Select your style</option>
                          {wigTypes.map((wt) => (
                            <option key={wt} value={wt}>{wt}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="contact-select-icon" />
                      </div>
                    </div>
                  </div>

                  <div className="contact-form-field">
                    <label className="contact-label">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements..."
                      rows={5}
                      className="contact-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="contact-submit-btn"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Schedule My Consultation
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right - Contact Info */}
              <div className="contact-info-card">
                <h2 className="contact-info-title">Contact Information</h2>

                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="contact-info-label">OUR STUDIO</span>
                      <span className="contact-info-value">Las Vegas, NV</span>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="contact-info-label">CALL US</span>
                      <a href="tel:7025341197" className="contact-info-value contact-info-link">
                        702-534-1197
                      </a>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="contact-info-label">EMAIL SUPPORT</span>
                      <a href="mailto:divaslacewigs@yahoo.com" className="contact-info-value contact-info-link">
                        divaslacewigs@yahoo.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="contact-hours">
                  <div className="contact-hours-header">
                    <Clock size={18} className="contact-hours-icon" />
                    <h3 className="contact-hours-title">Business Hours</h3>
                  </div>
                  <div className="contact-hours-list">
                    {businessHours.map((bh) => (
                      <div key={bh.day} className="contact-hours-row">
                        <span className="contact-hours-day">{bh.day}</span>
                        <span className={`contact-hours-time ${bh.hours === 'CLOSED' ? 'contact-hours-closed' : ''}`}>
                          {bh.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tagline */}
                <p className="contact-tagline">
                  <Sparkles size={14} />
                  &ldquo;Where beauty meets confidence&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="contact-map-section">
          <div className="home-container">
            <h2 className="contact-map-heading">Visit Our Studio</h2>
            <div className="contact-map-wrapper">
              <iframe
                title="Divas Lace Wigs Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d206253.07100248035!2d-115.3674044!3d36.1249185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80beb782a4f57dd1%3A0x3accd5e6d5b379a3!2sLas%20Vegas%2C%20NV!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings?.footer} footerLinkGroups={settings?.footerLinkGroups} />
    </div>
  );
}
