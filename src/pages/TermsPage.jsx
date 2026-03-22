import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePageSeo } from '../hooks/usePageSeo';

import deliveryTimeframeImg from '../assets/Delivery timeframe.avif';

const policyItems = [
  {
    title: 'All Sales Are Final',
    content: `Before making a purchase, we ask that you contact us FIRST with any questions you may have.`,
    extra: `Due to health concerns and the uniqueness of CUSTOM LACE WIGS, LACE FRONTALS, CROWN CLOSURES, WEAVING, BULK, and EYEBROWS, these products are non-returnable. ALL SALES ARE FINAL, NO REFUNDS WILL BE ISSUED. NO EXCEPTIONS.`,
    paragraphs: [
      `If you are having a problem with your product you just received, you MUST notify us within 48 hours of receipt via Email describing your issue. We will respond to your email within 48 hours. If you call us, you MUST follow up your phone call or voice message with an Email describing your issue. In order to resolve your issue, All CUSTOM HAIR REPLACEMENT SYSTEMS MUST BE SUBMITTED TO DIVAS LACE WIGS FOR EVALUATION. DO NOT RETURN packages without contacting us first for Return Instructions as we will not be held responsible for loss or stolen packages.`,
      `When Divas Lace Wigs receives your hair replacement system, we will evaluate it for the issues you described. If we find the issues you described, we will return it to the factory to correct at no cost to you. If we do not find the issues described, we will let you know and any options you may have to address your issues. We will also email to you the results of our evaluation. At that time you can let us know via email what you would like to do. If you choose not to have us correct the unit, we will return the product to you. You will be responsible for paying the cost to return the unit since there was nothing wrong with the unit. For US orders, the cost is $12.00 and International orders will be charged based on the country the product is being returned.`,
    ],
    warning: `ALL SALES ARE FINAL. No Exchanges and No Returns for custom orders. Repair or Remake Only. No Exceptions! Exchanges and Returns allowed for Stock Lace Wigs only. Refer to Stock Lace Wigs Terms and Conditions for details.`,
  },
  {
    title: 'License and Site Access',
    content: `Divas Lace Wigs grants you a limited license to access this site, to purchase the products and use the services offered through this site for personal use only. This license does not permit the following, all of which are strictly prohibited without the prior written consent of Divas Lace Wigs: downloading (other than page caching), modifying, reproducing, duplicating, copying, or any derivative use of this site or its contents; any collection or use of any product listings, descriptions, or prices; any use of data mining, robots, or similar data gathering and extraction devices; using or framing any trademark, logo, or other proprietary information (including images, text, page layout, or form) of Divas Lace Wigs; using meta tags or any other "hidden text" utilizing Divas Lace Wigs name or trademarks; or any exploitation of this site or its contents for any commercial purpose.`,
    extra: `All users of this site agree that access to and use of this site is subject to the following terms and conditions and other applicable law.`,
  },
  {
    title: 'Terms and Conditions',
    content: `These terms and conditions are applicable to you upon your accessing the site and/or completing the registration or shopping process. These terms and conditions, or any part of them, may be terminated by Divas Lace Wigs without notice at any time, for any reason. The provisions relating to Copyrights, Trademark, Disclaimer, Limitation of Liability, Indemnification and Miscellaneous, shall survive any termination.`,
    paragraphs: [
      `Divas Lace Wigs reserves the right to review all orders at which point we may accept or decline any order for any reason, regardless of any confirmation receipt sent to the customer. All orders must be reviewed for pre-approval and acceptance.`,
      `Please understand by submitting an order, you agree to Divas Lace Wigs Terms of Conditions and Company Policies. You will NOT be able to proceed with an order without agreeing to the terms and conditions of this Site.`,
      `All purchases are required to be payable in U.S. Funds. All prices, specifications, and availability of products are subject to change without notice. You are responsible for paying all fees associated with buying products from Divas Lace Wigs including, the cost of shipping.`,
    ],
  },
  {
    title: 'Consumer Responsibilities',
    content: `You agree to provide true, accurate, current and complete information about yourself as requested by Divas Lace Wigs when you place an order. If you provide any information that is untrue, inaccurate, not current or incomplete, Divas Lace Wigs has reasonable grounds to suspect that such information is untrue, inaccurate, not current or incomplete. We have the right to suspend or terminate your purchase, unless the issue is or can be resolved. In the event you violate conditions of the Terms and Conditions or violate any state or federal law, no refund of any fees collected or other remedies will be given.`,
    warning: `BY USING THIS SITE, YOU AGREE TO THE TERMS OF THE AGREEMENT. IF YOU DO NOT AGREE TO THE TERMS OF THE AGREEMENT, YOU MAY NOT USE THIS SITE.`,
  },
  {
    title: 'Communication',
    content: `We communicate with customers on a regular basis to provide requested services and in regards to issues relating to their order. We reply via email or phone, in accordance with the customer's wishes. We realize that communication is an important part of customer service and we will do our best to respond to your emails or phone calls within 24 hours, but it can range up to 48 hours or 72 hours if over the weekend.`,
  },
  {
    title: 'Product Descriptions',
    content: `Divas Lace Wigs sells CUSTOM LACE WIGS, LACE FRONTALS, CROWN CLOSURES, WEAVING, and BULK, EYEBROWS. We also sell STOCK NO GLUE AND FULL LACE WIGS and HAIR CARE PRODUCTS (tapes, adhesives, solvents, brushes, etc.).`,
    extra: `Divas Lace Wigs attempts to be as accurate as possible in describing products. However, we do not warranty that product descriptions or other content on this site are accurate, complete, reliable, current, or error-free.`,
    warning: `Note: Custom Lace Wigs, Lace Frontals, Crown Closures, Weaving, Bulk, Eyebrows and hair care products will be referred to as "Product(s)" henceforth.`,
  },
  {
    title: 'Wholesale Pricing',
    content: `All Divas Lace Wigs products are priced at WHOLESALE. We will do everything to keep our prices competitive with our competition (priced at retail) so you will feel confident doing business with us, and that you are getting the product for THE best price. With regards to typographical errors or errors in pricing, we reserve the right to refuse to sell a product to a customer at a price on our site that may be priced wrong.`,
  },
  {
    title: 'Guarantee',
    content: `We do not guarantee hair systems made with Bleached Knots everywhere.`,
    paragraphs: [
      `Divas Lace Wigs guarantees the hair quality of its products for 1 month (30 days) after receipt. This guarantee may be extended depending on the circumstances of the issue. In the rare event that you receive a product that is different from your specifications, there is a flaw in the manufacturing of the product, you are experiencing excessive tangling, matting, or shedding (expect normal shedding), we will repair or replace (depending on the issue) at NO cost to you.`,
      `This guarantee is only valid if the hair has not been altered in any way, except for hair cutting, styling, washing and conditioning. This guarantee is VOID if glues, tapes, chemicals, dyes, excessive heat or other harmful actions has caused damage to the hair.`,
    ],
    warning: `If you are having a problem with your product, Divas Lace Wigs recommends that you DO NOT try to alter or correct the problem yourself, call us first. We are here to help! Refer to our Lace Wig Guarantee Policy for additional details.`,
  },
  {
    title: 'Returns',
    content: ``,
    subsections: [
      {
        subtitle: '9.1 Unauthorized Returns',
        text: `Divas Lace Wigs does not accept unauthorized returns. DO NOT SEND UNAUTHORIZED RETURNS. Merchandise sent to us without our approval will not be accepted. Packages MUST have a Return Authorization Code. Contact us to discuss your issues before mailing your package to us. At this time we may be able to remedy the problem without returning the unit to us. To return the hair replacement system, you need to get the Return Authorization Code. DO NOT MAIL PACKAGE TO US WITHOUT AN AUTHORIZATION CODE. Divas Lace Wigs will not accept unauthorized returns.`,
      },
      {
        subtitle: '9.2 Authorized Returns',
        text: `Divas Lace Wigs requires that any product being returned MUST BE UNALTERED. The PRODUCT MUST BE RETURNED to us within 5 business days of receiving approval from us to return the product. If you cut or change the lace, add products or chemicals, cut the hair, dye the hair, style, comb, wash, condition or alter any part of the Product, we will not honor a re-make. We reserve the right to refuse a re-make if our return policy and conditions are not met. All products returned are photographed or videotaped upon receipt to confirm the contents and the condition of the returned items. We suggest you do the same for your records.`,
      },
    ],
    paragraphs: [
      `All returns will be evaluated for any issues reported by the customer. If the hair replacement system needs an adjustment, it will be repaired at no cost to you. Divas Lace Wigs will pay the cost of mailing the product back to you.`,
      `If it meets the specifications of your order, your order was made correctly, but you want changes — we will let you know if the hair replacement system can be repaired. However, if it can be repaired, we will let you know the cost to repair if applicable. If you decide not to get the repairs, you will be responsible for paying the cost to return the unit since there was nothing wrong with the unit. For US orders, the cost is about $12.00 and International orders will be charged based on the country the product is being returned.`,
    ],
    warning: `We recommend that our customers use a signature delivery service and insure their package for the full purchase price as we will not be responsible for lost, damaged or delayed packages. It is the customer's responsibility to properly package the product for shipping.`,
  },
  {
    title: 'Cancellations / Changes',
    subsections: [
      {
        subtitle: '10.1 Custom Orders',
        text: `Production of CUSTOM ORDERS typically begins within 24 hours of confirmation and payment. Once your order is sent to production, we may or may not be able to cancel or change the order. If you want to cancel your order or make changes to your order, you must notify us IMMEDIATELY by e-mail or phone. Orders cannot be cancelled once production has begun. If the order is not in production, we will cancel the order or make the necessary changes. Cancelled orders will incur a $10.00 cancellation fee.`,
      },
      {
        subtitle: '10.2 Stock Lace Wigs',
        text: `Stock lace wigs are ordered within 24 hours of confirmation and payment. Once your wig is ordered, we may or may not be able to cancel or change the order. If you want to cancel your order or make changes to your order, you must notify us IMMEDIATELY by e-mail or phone. Orders cannot be cancelled once it has shipped. Cancelled orders will incur a 5% PayPal cancellation fee and the balance will be sent back to you. Refer to Stock Lace Wigs Return and Exchange Policy for additional details.`,
      },
      {
        subtitle: '10.3 Accessories',
        text: `We no longer stock accessories.`,
      },
      {
        subtitle: '10.4 Cancellations',
        text: `Any cancelled order will incur a $5.00 PayPal cancellation fee.`,
      },
    ],
  },
  {
    title: 'Layaway Terms',
    content: `Divas Lace Wigs offers a Layaway Plan (payment) to its customers to help reduce the cost. All Layaway Plans require a 50% down payment of the total invoice, plus the layaway plan fee. The down payment and layaway fee must be paid before your lace wig is ordered.`,
    extra: `Layaway balance due payments must be paid for in full before the product is shipped to you. Divas Lace Wigs will email an invoice to you prior to shipping. The invoice must be paid within 5-days of receipt of the invoice. If the invoice remains unpaid, Divas Lace Wigs will email you again.`,
    warning: `NOTE: Layaways are considered unclaimed, if the balance remains unpaid for 120 days from the first notification requesting the Final payment. On the 121st day, the order will be cancelled. No refunds or store credit will be issued. Refer to Layaway Terms and Conditions for details.`,
  },
  {
    title: 'Hair Color / Texture Matching Service',
    content: `Divas Lace Wigs offers a FREE Hair Texture / Color Matching Service for products purchased from us. Hair texture or hair color images are received from the customer via an email attachment. Since hair texture matching involves a digital image, our manufacturer will make every effort to duplicate the hair texture or color. We cannot guarantee an exact match will be duplicated exactly like the image, but it will be similar. We offer 18 different hair textures from which you can choose. We recommend the customer choose a hair texture or color on our site. Textures and hair color samples received via mail or courier, will be analyzed. Customer's who request us to ship their sample to the factory, will incur an additional fee of $30.00. Items shipped to the factory take 3 weeks.`,
  },
  {
    title: 'Bleached Knots',
    content: `Divas Lace Wigs Guarantees the hair quality in our hair systems. Our hair systems are made with Single Bleached Knots in the front / Double Bleached Knots everywhere else, unless another option was specified. We have discovered that this method prolongs the life of the hair system.`,
    paragraphs: [
      `If Bleaching the Knots in the entire hair system is chosen, it lessens the life of the hair system. Bleaching the entire hair system can cause excessive matting, tangling and/or shedding. Divas Lace Wigs does not Guarantee the hair quality in hair systems made with all Bleached Knots. Choosing Bleached Knots for the entire hair system, voids the Divas Lace Wigs 30 Day Guarantee against matting, tangling, and/or shedding. Repairs will only be made at the customer's expense.`,
      `Bleached Knots can be single or double knots. Bleached knots make the lace wig knots less detectable. The knots won't be clear or totally invisible. Knots are most visible on darker colored units such as Black, Off Black or Dark Brown hair colors. We use bleached knots on the front hairline and double knots everywhere else for dark hair colors. Bleached knots are not necessary for hair of lighter colors, especially colors in the blonde family because the knots are hard to see without the bleaching.`,
    ],
  },
  {
    title: 'Lace Wig Repair Service',
    content: `Divas Lace Wigs offers repair services on any lace wig or frontal to restore it from tangling, matting, rips, tears, hair loss up 120% (included in the price), curl or wave texture, etc. We use 100% Indian Remy hair to increase the density. If the wig hair is different than Indian Remy, the customer can choose Virgin Indian Remy or 100% Remy or Virgin Brazilian, Chinese, Malaysian, or Mongolian human hair for an additional fee.`,
    extra: `Repair costs vary depending on the length and hair type. All lace wigs MUST be thoroughly cleaned. If adhesives were used, the unit must be free of adhesives: glue or tape, or product residue. In addition to the cost to repair the lace wig, a return shipping fee charge will apply. Repairs may take up to 8 weeks after the package is shipped to the factory.`,
    warning: `Divas Lace Wigs sends packages to the factory once a month at the end of the month. However, if you want your wig sent to the factory immediately, the cost is $75.00 for International Priority via the USPS.`,
  },
  {
    title: 'Membership Discounts and Sales Discounts',
    content: `Divas Lace Wigs offers several different types of discounts. Only 1 discount may be used per order and cannot be combined with other discounts. Discounts can only be applied against the price of a product advertised and cannot be used for shipping charges or accessories. Discounts are valid for in-store, online, and phone orders. We cannot be responsible for discount codes that are expired, lost, forgotten or never delivered due to email problems. Fraudulent, misused or expired coupon codes will not be honored.`,
  },
  {
    title: 'Referral Fee Discounts',
    content: `Multiple Referral Fee discounts may be combined, but cannot be combined with other discounts. Referral coupons can only be applied against the price of a hair product and cannot be used for shipping charges or accessories. Referral discounts are valid for all orders. We cannot be responsible for discount codes that are expired, lost, forgotten or never delivered due to email problems. Fraudulent, misused or expired discount codes will not be honored.`,
  },
  {
    title: 'Store Credit',
    content: `A Store credit is good for 1 year from date of issue.`,
  },
  {
    title: 'Store Sales',
    content: `All store sales items are nonrefundable, no exchanges, and no returns. All sales are final. NO exceptions.`,
  },
  {
    title: 'Memberships',
    content: `We email our members will regularly receive information on products, services, special deals, and a newsletter. Out of respect for the privacy of our users we present the option to not receive these types of communications. Please see the Unsubscribe sections.`,
  },
  {
    title: 'Refer a Friend',
    content: `If a Member/user elects to use our Referral Service for informing a friend about our Site, we ask them for the friend's name and email address. Divas Lace Wigs will email the friend on behalf of the referring Member/user and cc: the referring Member/user. Divas Lace Wigs stores this information for the sole purpose of sending the referral email and information on products, services, special deals, and a newsletter. The referral may unsubscribe at any time.`,
  },
  {
    title: 'Rush Orders',
    content: `$50.00 for each hair system. Rush is not available for Eyebrows and Hair Extensions.`,
  },
  {
    title: 'Manufacturing, Delivery, and Rush Time',
    content: `We try very hard to meet production deadlines. However, occasionally delays may occur at the factory (China). These delays are unintentional and can result when wig making at the factory is backed up, a unit does not pass the final inspection or during holidays when the factory is closed. If your unit is delayed because of one of these exceptions, Divas Lace Wigs cannot issue a refund because the order has already been started.`,
    image: deliveryTimeframeImg,
    warning: `Note: Custom orders are estimated times. On rare occasions, the estimated time may be impacted due to the amount of orders being processed by the factory. If this happens, we will continue to monitor your order and let you know when your order will be received.`,
  },
];

export default function TermsPage() {
  const { settings } = useSiteSettings();
  usePageSeo(settings?.pageSeo?.terms, {
    title: 'Store Terms & Conditions | Divas Lace Wigs',
    description:
      'Read the Divas Lace Wigs store terms and conditions including sales policy, returns, cancellations, layaway, guarantees, and more.',
    keywords:
      'terms and conditions, store policy, lace wig terms, divas lace wigs, custom wig policy',
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
              Legal
            </span>
            <h1 className="rp-hero-title home-animate-fade-in">
              Store Terms &amp; <em>Conditions</em>
            </h1>
            <p className="rp-hero-subtitle home-animate-slide-up">
              Please read the following terms and conditions of use carefully
              before using or placing an order on our site.
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
                  The Divas Lace Wigs website is subject to your compliance with
                  the terms and conditions located on our site. By using the
                  Site, you agree to be bound by the terms and conditions. We may
                  modify this agreement at any time, and such modifications shall
                  be effective immediately upon posting.
                </p>
                <p className="rp-notice-highlight">
                  All users of this site agree that access to and use of this
                  site includes the guidelines established in the Stock Lace Wigs
                  Return and Layaway Program Terms and Conditions.
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
                Terms &amp; Conditions Details
              </span>
              <h2 className="about-section-title">
                Store Terms &amp; Conditions
              </h2>
              <p className="rp-items-subtitle">
                Review each section below for complete terms regarding purchases,
                returns, guarantees, and store policies.
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
                    {item.extra && <p>{item.extra}</p>}

                    {item.paragraphs &&
                      item.paragraphs.map((text, i) => <p key={i}>{text}</p>)}

                    {item.subsections &&
                      item.subsections.map((sub, i) => (
                        <div key={i} className="rp-subsection">
                          <h4 className="rp-subsection-title">
                            {sub.subtitle}
                          </h4>
                          <p>{sub.text}</p>
                        </div>
                      ))}

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
                Have Questions About Our Terms?
              </h2>
              <p className="rp-bottom-cta-text">
                Please contact us if you have any questions regarding these terms
                and conditions. Our team is ready to assist you.
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
