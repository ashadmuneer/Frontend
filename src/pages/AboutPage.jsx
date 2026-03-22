import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePageSeo } from '../hooks/usePageSeo';
import {
  Heart,
  Award,
  Users,
  Sparkles,
  Phone,
  Mail,
  Clock,
  MapPin,
  Star,
  Scissors,
  Crown,
  ShieldCheck,
} from 'lucide-react';

import storeImg from '../assets/home/store-interior.jpg';
import whoWeAreImg from '../assets/home/who-we-are.png';
import consultationImg from '../assets/home/custom-wig-consultation.jpg';

const values = [
  {
    icon: Crown,
    title: 'Premium Quality',
    description: 'Only the finest Virgin Remy human hair — no tangling, matting, or shedding.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: "We aren't happy unless you're happy. Every customer gets service with a smile.",
  },
  {
    icon: ShieldCheck,
    title: 'Licensed & Trusted',
    description: 'Licensed business (NV #G50-08744) serving customers Nationwide and International since 2008.',
  },
  {
    icon: Scissors,
    title: 'Handcrafted Artistry',
    description: 'Every wig is hand-tied to a lace base for a totally natural, undetectable look.',
  },
];

const products = [
  'Full Lace Wigs',
  'Lace Front Wigs',
  'Glueless Lace Wigs',
  'Custom Wigs',
  '360 Frontals',
  'Toppers & Closures',
  'Hair Extensions',
  'Hair Systems',
];

const hairTypes = [
  'Indian Remy',
  'Brazilian Remy',
  'Malaysian Remy',
  'Mongolian Remy',
  'Chinese Remy',
  'Virgin Remy',
];

export default function AboutPage() {
  const { settings } = useSiteSettings();
  usePageSeo(settings?.pageSeo?.about, {
    title: 'About Us | Divas Lace Wigs',
    description:
      'Learn about Divas Lace Wigs — premium quality Virgin Remy human hair wigs, toppers, and toupees since 2008.',
    keywords: 'about, divas lace wigs, luxury wigs, human hair, las vegas',
  });

  return (
    <div className="home-page">
      <AnnouncementBar settings={settings?.announcement} />
      <Header navLinks={settings?.navLinks} />

      <main>
        {/* ── Hero Section ── */}
        <section className="about-hero">
          <div className="about-hero-overlay" />
          <div className="home-container about-hero-content">
            <span className="luxury-section-badge home-animate-fade-in">
              <Sparkles size={12} /> Our Story
            </span>
            <h1 className="about-hero-title home-animate-fade-in">
              Where Beauty Meets <em>Confidence</em>
            </h1>
            <p className="about-hero-subtitle home-animate-slide-up">
              Specializing in Premium Quality Virgin Remy Human Hair Wigs, Toppers, and Toupees
              — serving women, men and children since 2008.
            </p>
            <div className="about-hero-tags home-animate-slide-up">
              <span className="about-tag">Petite Caps</span>
              <span className="about-tag">Small Caps</span>
              <span className="about-tag">Medium Caps</span>
              <span className="about-tag">Large Caps</span>
            </div>
          </div>
        </section>

        {/* ── Mission Statement ── */}
        <section className="about-mission">
          <div className="home-container">
            <div className="about-mission-inner">
              <div className="about-mission-icon">
                <Star size={28} />
              </div>
              <blockquote className="about-mission-quote">
                We believe the key to wearing a lace wig is to achieve a{' '}
                <strong>natural and undetectable look!</strong>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ── Our Story Section ── */}
        <section className="about-story">
          <div className="home-container">
            <div className="about-story-grid">
              <div className="about-story-image-wrapper home-animate-slide-left">
                <img src={whoWeAreImg} alt="Divas Lace Wigs founders" className="about-story-image" />
                <div className="about-story-badge">
                  <span className="about-story-badge-number">17+</span>
                  <span className="about-story-badge-label">Years of Excellence</span>
                </div>
              </div>

              <div className="about-story-content home-animate-slide-right">
                <span className="luxury-section-badge">
                  <Award size={12} /> Est. 2008
                </span>
                <h2 className="about-section-title">Our Story</h2>
                <p>
                  Divas Lace Wigs is a privately owned business that originally opened its doors in
                  Canyon Country, CA in 2008. We moved to and opened our business in Las Vegas,
                  Nevada in 2013, license #G50-08744. We have dedicated our business to serving women,
                  men and children Nationwide and International.
                </p>
                <p>
                  We are located in the exciting and energetic city of Las Vegas (30 miles North of the
                  Strip). When it comes to their hair, hair quality and beauty, we provide the BEST!
                </p>
                <p>
                  We provide premium quality human hair wigs and hair systems to women, men and children
                  who are living with hair loss or those just wanting a hair style change. Our human hair
                  has no tangling, matting or shedding, if proper care and maintenance is followed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values Grid ── */}
        <section className="about-values">
          <div className="home-container">
            <div className="about-values-header">
              <span className="luxury-section-badge">
                <Heart size={12} /> What We Stand For
              </span>
              <h2 className="about-section-title">Our Values</h2>
              <p className="about-values-subtitle">
                Every wig we create reflects our commitment to excellence, authenticity, and your
                confidence.
              </p>
            </div>
            <div className="about-values-grid stagger-children">
              {values.map((val) => (
                <div key={val.title} className="about-value-card luxury-card home-hover-lift">
                  <div className="about-value-icon">
                    <val.icon size={24} />
                  </div>
                  <h3 className="about-value-title">{val.title}</h3>
                  <p className="about-value-desc">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Craftsmanship Section ── */}
        <section className="about-craft">
          <div className="home-container">
            <div className="about-craft-grid">
              <div className="about-craft-content home-animate-slide-left">
                <span className="luxury-section-badge">
                  <Scissors size={12} /> Craftsmanship
                </span>
                <h2 className="about-section-title">Handcrafted With Love</h2>
                <p>
                  All of our wigs and hair systems are hand made using the finest lace, premium
                  quality Remy or Virgin Remy human hair. All hair is hand-tied to a lace base,
                  which gives the appearance the hair is growing naturally from the scalp.
                </p>
                <p>
                  The lace blends beautifully and seamlessly with your skin. Our wigs and hair
                  systems are totally natural looking in appearance. No one can tell it isn&apos;t
                  your own hair, unless you tell them!
                </p>

                <div className="about-craft-lists">
                  <div className="about-craft-list">
                    <h4 className="about-craft-list-title">Products We Offer</h4>
                    <ul className="about-craft-items">
                      {products.map((p) => (
                        <li key={p}>
                          <Sparkles size={12} /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="about-craft-list">
                    <h4 className="about-craft-list-title">Hair Types</h4>
                    <ul className="about-craft-items">
                      {hairTypes.map((h) => (
                        <li key={h}>
                          <Sparkles size={12} /> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="about-craft-image-wrapper home-animate-slide-right">
                <img
                  src={consultationImg}
                  alt="Wig craftsmanship and consultation"
                  className="about-craft-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Customer Commitment ── */}
        <section className="about-commitment">
          <div className="home-container">
            <div className="about-commitment-inner">
              <div className="about-commitment-content">
                <span className="luxury-section-badge" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}>
                  <Users size={12} /> Our Promise
                </span>
                <h2 className="about-commitment-title">We Are Here to Help!</h2>
                <p className="about-commitment-text">
                  At Divas Lace Wigs, we value the relationship we have with our customers and we
                  work hard to make sure they get the product ordered and service with a smile; every
                  time! We aren&apos;t happy unless you&apos;re happy. We want to be your one-stop
                  shopping resource for all your human hair needs.
                </p>
                <p className="about-commitment-text">
                  Our full lace wigs, lace front wigs, glueless lace wigs and hair systems are an
                  excellent choice if you are living with hair loss, looking to cover a problem area
                  or just want to add a little style to your own hair.
                </p>
                <p className="about-commitment-text">
                  Give us a call or email us if you have questions. Appointments are required for
                  In Person or Skype consultations. We also offer a Mobile Service to local residents,
                  where we come to you.
                </p>
              </div>
              <div className="about-commitment-image-wrapper">
                <img src={storeImg} alt="Divas Lace Wigs store" className="about-commitment-image" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact Info Bar ── */}
        <section className="about-contact">
          <div className="home-container">
            <h2 className="about-section-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              Get In Touch
            </h2>
            <p className="about-contact-subtitle">
              By Appointment Only — We&apos;re ready to help you find your perfect look.
            </p>

            <div className="about-contact-grid">
              <div className="about-contact-card luxury-card home-hover-lift">
                <div className="about-contact-icon">
                  <Clock size={22} />
                </div>
                <div className="about-contact-body">
                  <h3>Business Hours</h3>
                  <div className="about-hours-list">
                    <div className="about-hours-row">
                      <span>Mon, Tue, Wed, Fri</span>
                      <span>9 AM – 4 PM PST</span>
                    </div>
                    <div className="about-hours-row">
                      <span>Thursday</span>
                      <span>12 PM – 4 PM PST</span>
                    </div>
                    <div className="about-hours-row">
                      <span>Saturday</span>
                      <span>12 PM – 3 PM PST</span>
                    </div>
                    <div className="about-hours-row about-hours-closed">
                      <span>Sunday &amp; Holidays</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-contact-card luxury-card home-hover-lift">
                <div className="about-contact-icon">
                  <Phone size={22} />
                </div>
                <div className="about-contact-body">
                  <h3>Call Us</h3>
                  <a href="tel:17025341197" className="about-contact-link">1-702-534-1197</a>
                  <p className="about-contact-note">By appointment only</p>
                </div>
              </div>

              <div className="about-contact-card luxury-card home-hover-lift">
                <div className="about-contact-icon">
                  <Mail size={22} />
                </div>
                <div className="about-contact-body">
                  <h3>Email Us</h3>
                  <a href="mailto:divaslacewigs@yahoo.com" className="about-contact-link">
                    divaslacewigs@yahoo.com
                  </a>
                  <p className="about-contact-note">We respond within 24 hours</p>
                </div>
              </div>

              <div className="about-contact-card luxury-card home-hover-lift">
                <div className="about-contact-icon">
                  <MapPin size={22} />
                </div>
                <div className="about-contact-body">
                  <h3>Visit Us</h3>
                  <p className="about-contact-note" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    Las Vegas, NV
                  </p>
                  <p className="about-contact-note">30 miles North of the Strip</p>
                </div>
              </div>
            </div>

            <div className="about-cta-row">
              <a href="/contact" className="home-btn home-btn-primary home-btn-lg">
                Schedule Now
              </a>
              <a href="/shop" className="home-btn home-btn-outline home-btn-lg">
                Shop Collection
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings?.footer} footerLinkGroups={settings?.footerLinkGroups} />
    </div>
  );
}
