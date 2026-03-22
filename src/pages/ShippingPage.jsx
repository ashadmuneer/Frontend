import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePageSeo } from '../hooks/usePageSeo';

import deliveryTimeframeImg from '../assets/Delivery timeframe.avif';

const policyItems = [
  {
    title: 'Shipping Overview',
    content: `You will be notified via email when your order ships and provided with a shipment tracking number. Hair products may be shipped via UPS, DHL or USPS. We offer combined shipping when 2 or more hair products are shipped together.`,
  },
  {
    title: 'Shipping Rates',
    content: `$30.00 US orders up to two systems. $45.00 International orders up to two systems. Additional fee for three or more systems — we'll let you know the cost at time of purchase.`,
  },
  {
    title: 'International Orders & Customs',
    content: `International packages may be subject to custom fees and import duties of the shipped to country. All applicable customs and/or duty charges are always the responsibility of the customer. Divas Lace Wigs is unable to determine custom fees in advance. Please contact your local customs office for more information.`,
    warning: `Note: The shipping label for International orders for custom purposes, will show a value of $20.00 to $40.00+ in the Estimated Value field on the invoice. Far less than the cost you paid for the lace wig or hair system. The lesser value avoids you having to pay additional fees that might be charged by customs officials.`,
  },
  {
    title: 'Signature Delivery',
    content: `Signature Delivery is included in the shipping cost above. You or someone answering your door must sign for the package. Signature Delivery protects you and Divas Lace Wigs because a signature shows the package was delivered. Signature Delivery is required for all hair products shipped. If being available when the package is shipped, you can always make arrangements with the carrier.`,
  },
  {
    title: 'Shipping Address',
    content: `Divas Lace Wigs will ship your package to the address you provide since a signature is required to receive the package.`,
  },
  {
    title: 'Manufacture Time & Delivery',
    content: `Weather related delays may interrupt delivery times by UPS, DHL, FedEx or USPS when sent directly by Divas Lace Wigs. US Orders have a 3-day delivery service with a few exceptions. Delivery service for these areas can be 3–5 days (excluding Saturday and Sunday).`,
    image: deliveryTimeframeImg,
    warning: `Note: Shipping time starts from the date the package is shipped from the factory and it is not included in the time it takes to manufacture your hairpiece. The total delivery time for your order is the period of time from when your order is placed with the factory, plus the 3 day shipping, except for certain International orders which can take 3–5 days.`,
  },
  {
    title: 'Packaging',
    content: `Hair systems are packaged and shipped to the customer in the poly bag provided by the shipping/mailing carrier: DHL, UPS, USPS, etc.`,
  },
  {
    title: 'Wrong Addresses',
    content: `Divas Lace Wigs is not responsible for failure of delivery due to the WRONG SHIPPING ADDRESS given when the payment was made or changed via email.`,
  },
  {
    title: 'Returned Items',
    content: `Items undelivered due to an incorrect address may result in additional shipping charges that must be paid by you. Call or email us immediately if the address is incorrect. We will make every attempt to change the address to get the package to you or provide you with instructions to change the address.`,
  },
  {
    title: 'Shipping Notification',
    content: `When your hair product is ready, Divas Lace Wigs will email to you the name of the carrier, tracking number and expected delivery date.`,
  },
];

export default function ShippingPage() {
  const { settings } = useSiteSettings();
  usePageSeo(settings?.pageSeo?.shipping, {
    title: 'Shipping, Manufacturing & Delivery | Divas Lace Wigs',
    description:
      'Learn about Divas Lace Wigs shipping rates, manufacturing times, delivery options, packaging, and international customs information.',
    keywords:
      'shipping, delivery, manufacturing time, lace wig shipping, divas lace wigs, international shipping',
  });

  return (
    <div className="home-page">
      <AnnouncementBar settings={settings?.announcement} />
      <Header navLinks={settings?.navLinks} />

      <main>
        {/* ── Hero ── */}
        <section className="rp-hero">
          <div className="rp-hero-bg" />
          <div className="home-container rp-hero-content">
            <span className="luxury-section-badge rp-hero-badge home-animate-fade-in">
              Shipping
            </span>
            <h1 className="rp-hero-title home-animate-fade-in">
              Shipping, &amp; <em>Delivery</em>
            </h1>
            <p className="rp-hero-subtitle home-animate-slide-up">
              Everything you need to know about how we ship, manufacture, and
              deliver your custom hair products.
            </p>
          </div>
        </section>

        {/* ── Policy Items ── */}
        <section className="rp-items">
          <div className="home-container">
            <div className="rp-items-header">
              <span className="luxury-section-badge">Shipping Details</span>
              <h2 className="about-section-title">
                Shipping &amp; Delivery Information
              </h2>
              <p className="rp-items-subtitle">
                Review each section below for complete shipping, manufacturing,
                and delivery details.
              </p>
            </div>

            <div className="rp-items-list">
              {policyItems.map((item, idx) => (
                <article key={idx} className="rp-card">
                  <div className="rp-card-header">
                    <h3 className="rp-card-title">{item.title}</h3>
                  </div>

                  <div className="rp-card-body">
                    {item.content && <p>{item.content}</p>}

                    {item.paragraphs &&
                      item.paragraphs.map((text, i) => <p key={i}>{text}</p>)}

                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="rp-card-image"
                      />
                    )}

                    {item.warning && (
                      <div className="rp-warning">
                        <p>{item.warning}</p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact CTA ── */}
        <section className="rp-bottom-cta">
          <div className="home-container">
            <div className="rp-bottom-cta-inner">
              <span
                className="luxury-section-badge"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderColor: 'rgba(255,255,255,0.25)',
                  color: 'white',
                }}
              >
                Questions?
              </span>
              <h2 className="rp-bottom-cta-title">
                Have Questions About Shipping?
              </h2>
              <p className="rp-bottom-cta-text">
                Contact us for shipping inquiries, tracking updates, or any
                delivery concerns. We're here to help.
              </p>
              <div className="rp-bottom-cta-actions">
                <a
                  href="mailto:divaslacewigs@yahoo.com"
                  className="home-btn home-btn-white home-btn-lg"
                >
                  Email Us
                </a>
                <a
                  href="/contact"
                  className="home-btn home-btn-outline-white home-btn-lg"
                >
                  Contact Page
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        settings={settings?.footer}
        footerLinkGroups={settings?.footerLinkGroups}
      />
    </div>
  );
}
