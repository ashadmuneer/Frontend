import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePageSeo } from '../hooks/usePageSeo';


const policyItems = [
  {
    id: 1,
    title: 'Return and Exchange Policy',
    content: `Returns or exchanges must be made within 7 days from the date of receipt. We do not offer refunds, only an exchange or store credit. If a higher priced hair product is chosen, the customer pays the difference. This amount must be paid before the hairpiece can be re-ordered or another payment arrangement is made. If a lower priced product is chosen, no refund will be issued, only a store credit. A 15% Re-Stocking fee applies.`,
    extra: `If you receive your lace wig and there is a problem, please call or email us IMMEDIATELY within 24 hours upon receiving your wig. DO NOT ALTER the wig in any way. The wig must be returned in its brand new condition within 7 days. The following terms and conditions described below apply. A 15% Re-Stocking fee will apply. No EXCEPTIONS!`,
    warning: `Due to sanitary reasons, we will not accept returns or give exchanges for wigs that have been worn, styled, cut of lace or hair, products applied such as glue or hair products, etc.`,
  },
  {
    id: 2,
    title: 'Terms and Conditions for Exchange',
    content: `The wig must be in the original condition as it was sent to you. All packaging, including wig caps, wig bag, wig label or tag, etc. must be returned with the unit. If the wig has been altered in any way, we cannot accept an exchange! NO EXCEPTIONS!`,
    doNotList: [
      'Attempt to correct the problem yourself before contacting us',
      'Put any chemicals on the Unit',
      'Perm the Unit',
      'Dye the Unit',
      'WASH OR CONDITION the Unit',
      'WEAR the Unit',
      'Cut, Tear or Rip the Lace',
      'Put Glue on the Unit',
      'Style or Cut the Hair of the Unit',
      'Put products on the Unit',
    ],
    extra: `Units that are damaged by the customer will not be accepted under our Return/Exchange Policy and will be returned to the customer at their expense. We reserve the right to refuse an exchange if the terms in our Return/Exchange Policy are not met.`,
  },
  {
    id: 3,
    title: 'Authorized Returns',
    content: `No wig will be accepted without authorization from Divas Lace Wigs. Returns or exchanges must be made within 7 days from the date of receipt. Divas Lace Wigs requires that any wig being returned MUST BE UNALTERED. The WIG MUST BE RETURNED IN THE ORIGINAL PACKAGING to us within 3 business days of receiving approval from us to return the hairpiece.`,
    extra: `If you cut or change the lace, cut the hair, apply color, style, comb, wash, or alter any part of the HAIRPIECE, we will not honor our Return and Exchange Policy. We reserve the right to refuse an exchange if our return policy and conditions are not met. All wigs returned are photographed or videotaped upon receipt to confirm the contents and the condition of the returned items. We suggest you do the same for your records.`,
    warning: `We strongly recommend that customers insure their package for the full purchase price as we will not be responsible for lost, damaged or delayed packages. It is the customer's responsibility to properly package the wig. If the returned wig is not in compliance with our Return and Exchange Policy, it will be returned to the customer at the customer's expense.`,
  },
  {
    id: 4,
    title: 'Unauthorized Returns',
    content: `DO NOT SEND UNAUTHORIZED RETURNS. Merchandise sent to us without our approval will not be accepted. We assume no responsibility for unauthorized returns or items sent to the incorrect address.`,
  },
  {
    id: 5,
    title: 'Restocking Fee',
    content: `There is a $25.00 Re-stocking Fee for all units being returned or exchanged unless you received the wrong wig. Otherwise, we CANNOT waive the $25.00 Re-Stocking fee under any circumstance. No refunds will be issued. Exchange or Store credit only. The shipping fee is not refundable.`,
  },
  {
    id: 6,
    title: 'Return Shipping Fee',
    content: `Any shipping charges will be the responsibility of the customer.`,
  },
  {
    id: 7,
    title: 'Cancellations',
    content: `Stock lace wigs are ordered within 24 hours of confirmation and payment. Once your wig is ordered, we may or may not be able to cancel or change the order. If you want to cancel your order or make changes to your order, you must notify us IMMEDIATELY by e-mail or phone. Orders cannot be cancelled once it has shipped.`,
    extra: `Cancelled orders will incur a 5% PayPal cancellation fee and the balance will be sent back to you. If we are unable to cancel the order, the unit is in route to you. Follow all Return and Exchange policies above to return a stock lace wig.`,
  },
  {
    id: 8,
    title: 'General',
    content: `The policies described in the Terms and Conditions govern the entire site and works in conjunction with the policies described in the Stock Lace Wigs Return Policy and Exchange and Layaway Plan Policy. Stock Lace Wigs Return and Exchange and Layaway Plan govern its respective product.`,
    extra: `Divas Lace Wigs may revise these conditions of use at any time by updating this Condition of Use statement. You should visit Divas Lace Wigs from time to time to review the current conditions because they are binding on you.`,
  },
  {
    id: 9,
    title: 'Semi-Custom Stock Lace Wigs — All Sales Are Final',
    content: `No Refunds. No Returns. No Exchanges. Once altered, semi-custom units are treated like custom lace wigs. Semi-custom options are available for full lace or glueless lace wigs.`,
    featureList: [
      'Reduce or increase the cap size',
      'Add highlights',
      'Add or reduce density',
      'Add clips or combs',
    ],
    extra: `3-7 Day Semi-Custom Options: These adjustments take from 3 days up to 10 days to complete, plus 3 days to ship the lace wig to you.`,
  },
  {
    id: 10,
    title: 'In Store Stock Lace Wigs Clearance Sale',
    content: `Clearance Sale prices only apply to wigs sold in our boutique and is limited to US residents only. No International Sales. Clearance Sale prices do not apply to lace wigs that must be ordered from the factory.`,
    warning: `All sales are final for in store stock clearance units. No returns. No refunds. No exchanges. No store credits. No Exceptions.`,
  },
  {
    id: 11,
    title: 'Lace Wig Inspected',
    content: `Before a lace wig is mailed to you, it is inspected. If you experience a problem after you receive your lace wig, please call or email us IMMEDIATELY within 24 hours upon receiving your wig.`,
  },
];

export default function ReturnPolicyPage() {
  const { settings } = useSiteSettings();
  usePageSeo(settings?.pageSeo?.returnPolicy, {
    title: 'Return & Exchange Policy | Divas Lace Wigs',
    description:
      'Read our stock lace wigs return and exchange policy. Learn about authorized returns, restocking fees, cancellations, and semi-custom wig policies.',
    keywords:
      'return policy, exchange policy, lace wig returns, restocking fee, divas lace wigs',
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
              Policy Center
            </span>
            <h1 className="rp-hero-title home-animate-fade-in">
              Return &amp; Exchange <em>Policy</em>
            </h1>
            <p className="rp-hero-subtitle home-animate-slide-up">
              Please read carefully before placing an order. All users of
              this site agree that access to and use of this site is subject to
              these Terms and Conditions.
            </p>
          </div>
        </section>

        {/* ── Important Notice ── */}
        <section className="rp-notice">
          <div className="home-container">
            <div className="rp-notice-card home-animate-slide-up">
              <div className="rp-notice-body">
                <h2 className="rp-notice-title">Important Notice</h2>
                <p>
                  The Divas Lace Wigs website is subject to your compliance
                  with the terms and conditions located on our site. By using
                  the Site, you agree to be bound by the terms and conditions.
                  We may modify this agreement at any time, and such
                  modifications shall be effective immediately upon posting.
                </p>
                <p className="rp-notice-highlight">
                  The Stock Lace Wigs Terms and Conditions do not supersede
                  our Store Terms and Conditions, but works in conjunction
                  with this policy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Policy Items ── */}
        <section className="rp-items">
          <div className="home-container">
            <div className="rp-items-header">
              <span className="luxury-section-badge">
                Full Policy Details
              </span>
              <h2 className="about-section-title">
                Stock Lace Wigs Return &amp; Exchange Policy
              </h2>
              <p className="rp-items-subtitle">
                Review each section below for complete terms regarding returns,
                exchanges, cancellations, and clearance sales.
              </p>
            </div>

            <div className="rp-items-list">
              {policyItems.map((item) => {
                return (
                  <article key={item.id} className="rp-card">
                    <div className="rp-card-header">
                      <h3 className="rp-card-title">{item.title}</h3>
                    </div>

                    <div className="rp-card-body">
                      <p>{item.content}</p>

                      {item.extra && <p>{item.extra}</p>}

                      {item.doNotList && (
                        <div className="rp-donot-block">
                          <p className="rp-donot-label">
                            This includes, but is not limited to:
                          </p>
                          <ul className="rp-donot-list">
                            {item.doNotList.map((text, i) => (
                              <li key={i}>
                                <span>DO NOT {text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.featureList && (
                        <ul className="rp-feature-list">
                          {item.featureList.map((text, i) => (
                            <li key={i}>

                              <span>{text}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.warning && (
                        <div className="rp-warning">
                          <p>{item.warning}</p>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
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
                Have Questions About Our Policy?
              </h2>
              <p className="rp-bottom-cta-text">
                Please contact us if you have any questions regarding this
                agreement. Our team is ready to assist you.
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
