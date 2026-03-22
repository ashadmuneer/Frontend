import { useState } from 'react';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePageSeo } from '../hooks/usePageSeo';
import { ChevronDown } from 'lucide-react';

const faqCategories = [
  {
    id: 'basics',
    label: 'Lace Wig Basics',
    color: '#9b59b6',
    questions: [
      {
        q: 'What is a lace wig?',
        a: `Lace Wigs or "Cranial Prosthesis" (the medical term) contain lace throughout or around the entire base, making it possible to wear your wig in a ponytail, which creates a realistic and natural-looking hairline around the entire unit. Lace Front Wigs only have lace in the front, creating a realistic and natural-looking hairline around the front and sides, but the base of the wig may show in a ponytail.

Our Full Lace Wigs, Front Lace Wigs (no wefts), No Glue / Glueless Lace Wigs and U-Part Lace Wigs are hair systems crafted with the illusion of hair growing directly from your scalp. Lace wigs can be parted all throughout the hair system — the illusion of hair growing from your scalp exists in all areas of the wig.

Lace wigs are the most realistic type of wig available on the market today. They are worn by many celebrities because they are so real-looking that it stuns fans when they appear in public with a full head of hair.

For anyone enduring hair loss due to illness, chemotherapy, radiation, or for no apparent reason — a front lace wig can add realistic-looking hair to the head. This type of wig can look and feel like real hair when it is of high quality and applied correctly.`,
      },
      {
        q: 'What is the difference between a full lace, front lace, and a no glue lace wig?',
        a: `Full Lace Wig — Has lace all around and is attached with adhesives. A full lace wig can be worn up in a high ponytail or up-do.

Lace Front Wig — Only has lace in the front and does not have lace around the back. It has adjustable straps and cannot be worn in a high ponytail.

No Glue / Glueless Lace Wig — The front hairline is made of full stretch lace, which keeps the cap securely attached without using adhesives.

All three types can be parted anywhere they have lace and offer a completely natural look.`,
      },
      {
        q: 'Can the wig be parted anywhere?',
        a: 'Yes! Our Full Lace and No Glue wigs are Freestyle and can be parted anywhere. That means you can part it in any direction and it will appear natural. Front lace wigs are only invisible in the front — if worn in an up-do, the base at the back may show.',
      },
      {
        q: 'Can I wear the hair in high ponytails and up hairstyles?',
        a: 'Our Full Lace Wigs, Front Lace (no wefts) and most No Glue Lace Wigs can be worn in high ponytails and up-dos. Visit the Full Lace Wigs Cap Styles or No Glue Lace Wigs pages for detailed cap information.',
      },
      {
        q: 'I have lost all my hair. Can I still wear a lace wig?',
        a: 'Definitely! Whether you have experienced hair loss due to chemotherapy, alopecia, trichotillomania, body dysmorphia, burns, or any other reason, we can help you. Please contact us directly and we will walk you through the best options available for your situation.',
      },
    ],
  },
  {
    id: 'hair-quality',
    label: 'Hair Quality & Styling',
    color: '#d4a574',
    questions: [
      {
        q: 'What is Remy hair?',
        a: `Our 100% Remy hair and Virgin Remy hair is cuticle-intact or cut hair — the highest quality human hair you can find on the market. Our Lace Wigs, Frontals, Crown Closures, Weaving and Bulk Hair are manufactured with the best Remy hair available.

Our Virgin hair is in the most natural and purest state, free from chemical processing of any kind.

We offer the following hairlines: Natural, Widow's Peak (1 and 2), Pre-plucked, 4C, and Baby Hair.`,
      },
      {
        q: 'Can I straighten and curl my lace wig hair?',
        a: 'YES! Remy hair can be styled just like your own natural hair. You can dye it, set it, blow dry it, hot curl it, flat iron it, and more. Our hair is 100% Indian Remy and will style exactly like natural hair. Note: only Virgin hair (unprocessed) can be permed.',
      },
      {
        q: 'Can I use a curling iron on my lace wig?',
        a: 'Yes! All of our items (lace wigs, lace frontals, and crown closures) are 100% human hair. You can use all your normal styling tools — crimps, curling irons, flat irons, hot rollers, etc. — to achieve various hairstyles. Please remember that excessive heat may damage the natural cuticle over time, just as it would your own natural hair.',
      },
      {
        q: 'Can I color or highlight my 100% Remy Hair?',
        a: 'We strongly recommend that you do not color our standard Remy hair, since it has already been processed. Coloring may result in over-processing or damage, and we are not responsible for damage caused during this process. If you wish to color, we strongly suggest choosing our Virgin Remy hair, which is free from any prior processing.',
      },
      {
        q: 'Which lace is better — French or Swiss?',
        a: `It really is a matter of personal preference.

Swiss Lace — Finer, more fragile, and blends better with the skin for a less visible, more seamless appearance.

French Lace — Slightly thicker and more durable.

We generally recommend that first-time buyers choose French lace, since they are less experienced with wig application and removal and are more likely to accidentally damage a Swiss lace cap. With experience, you may feel more comfortable with Swiss lace. Both lace types can be tinted in different shades of brown to complement a variety of complexions.`,
      },
    ],
  },
  {
    id: 'products',
    label: 'Products & Parts',
    color: '#5b8dee',
    questions: [
      {
        q: 'What is a lace frontal?',
        a: 'A lace frontal is the front part of a lace wig, which gives the appearance of an invisible hairline. Lace frontals can be used with weaves, as a hair restoration unit, or to repair your current lace wig. You can wear it with your natural hair or any hair extension.',
      },
      {
        q: 'How do you apply a lace wig or frontal?',
        a: 'Both are applied using an adhesive glue or tape, which you need to purchase separately — we do not carry adhesive products. Do not put the adhesive on your own hair, as it will cause damage.',
      },
      {
        q: 'What is a crown closure?',
        a: 'A crown closure is used to cover balding or thinning hair at the top of the head. It can be used to cover the center of weft, strand or bonded extensions, or other weaving and extension methods to give them a more natural look. Our lace crown closures give the illusion of a natural finish in the crown area.',
      },
      {
        q: 'How is a crown closure attached?',
        a: 'Crown Closures can be glued if no hair is in the area, sewn in using weaving thread, or attached with clips.',
      },
    ],
  },
  {
    id: 'care',
    label: 'Care & Cleaning',
    color: '#22c55e',
    questions: [
      {
        q: 'Will I receive instructions for caring for my unit?',
        a: 'Yes! Each unit purchase comes with a Hair Care and Instructions guide to help you maintain your lace wig properly.',
      },
      {
        q: 'How often should I remove my lace wig for cleaning?',
        a: 'If worn every day, we recommend washing your wig once every 10–14 days.',
      },
      {
        q: 'How do I shampoo my lace wig or frontal while using extended wear bonding methods?',
        a: 'Generally speaking, use lukewarm water and a moisturizing shampoo and conditioner formulated for human hair wigs. Divas Lace Wigs provides all customers with a hair care guide with each purchase.',
      },
      {
        q: 'Adhesive remover left an oily film — what do I do?',
        a: 'Use lace release or alcohol to remove the residue, which may leave an oily film. To remove the oily film, simply rinse or wash the unit. This is important because new adhesive will not bond properly to oil-based residue.',
      },
      {
        q: 'I removed my lace wig and there is sticky residue in the lace.',
        a: 'Spray adhesive remover or an equivalent oil-based solvent onto the sticky lace and wait for it to break down the residue. Depending on the type of adhesive, this could take 20 seconds to 20 minutes. Next, carefully wipe away the sticky residue with a lint-free cloth.',
      },
      {
        q: 'I have glue in my hair. How do I remove it?',
        a: 'Spray some adhesive remover or equivalent oil-based solvent where needed. Wait a few minutes. Using a fine-tooth comb, gently comb and wipe away the residue.',
      },
    ],
  },
  {
    id: 'adhesives',
    label: 'Adhesives & Durability',
    color: '#ef4444',
    questions: [
      {
        q: 'Can adhesives damage my hairline?',
        a: 'Yes, adhesives can damage your hairline if not properly applied or maintained. We recommend applying liquid adhesives just below the hairline to limit contact with your natural hairline. Over time, adhesives break down and have been known to cause thinning. To reduce damage, remove and reapply adhesives on a regular schedule. When removing your wig, always allow sufficient time for the lace release to fully separate the wig from your hairline — DO NOT rush the process.',
      },
      {
        q: 'Will adhesives affect my hairline over time?',
        a: 'Adhesives will break down over time and have been known to cause thinning. Divas Lace Wigs recommends removing and reapplying adhesives on a regular basis. When removing your system, always allow sufficient time for the lace release to fully separate the wig. As a general guide, the longer the unit remains without reapplication, the higher the likelihood of damage occurring.',
      },
      {
        q: 'How long does a lace wig unit last?',
        a: 'Our full lace wigs typically last 6 months to 1 year, though they may thin around the perimeter from repeated adhesive application and solvent removal. Our no-glue / glueless lace wigs can last 6 months to 1 year or longer, since no adhesives or solvents are used. Factors that affect longevity include: styling method, products used, glue type, and your removal process.',
      },
    ],
  },
  {
    id: 'production',
    label: 'Timelines & Custom Orders',
    color: '#f59e0b',
    questions: [
      {
        q: 'How long will the hair in my lace wig, cranial prosthesis, frontal, or crown closure last?',
        a: 'Hair can last for many months depending on your usage and upkeep. Proper care, gentle styling, and regular maintenance will significantly extend the life of your unit.',
      },
      {
        q: 'Why does it take 4–5 weeks to make my full or front lace wig or cranial prosthesis?',
        a: 'Each lace wig is measured and shaped to fit each client\'s head based on their measurements and selection of color, texture, density and length. Each Remy hair strand is individually hand-tied to the lace. For a quality product, the 4–5 week timeframe is required. For customers in a hurry, we also sell in-stock full lace and glueless lace wigs, which can be delivered in as little as 3 days. We can also semi-customize stock lace wigs.',
      },
      {
        q: 'Why does it take 4 weeks to make my lace frontal or crown closure?',
        a: 'Each lace frontal or crown closure is measured and shaped for each client\'s head based on their measurements and selection of color, texture, density and length. Each Remy hair strand is hand-tied to the lace. For a quality product, the 4-week timeframe is required.',
      },
    ],
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
      <button className="faq-question" onClick={onToggle} aria-expanded={isOpen}>
        <span>{question}</span>
        <span className="faq-chevron-wrapper">
          <ChevronDown size={16} className="faq-chevron" />
        </span>
      </button>
      <div className="faq-answer-wrapper">
        <div className="faq-answer">
          <div className="faq-answer-inner">
            {answer.split('\n').map((line, i) =>
              line.trim() === '' ? null : (
                <p key={i}>{line}</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const { settings } = useSiteSettings();
  usePageSeo(settings?.pageSeo?.faq, {
    title: 'FAQ | Divas Lace Wigs',
    description:
      'Find answers to frequently asked questions about lace wigs, Remy hair, care instructions, adhesives, and more.',
    keywords: 'faq, lace wig questions, remy hair, wig care, adhesives, lace frontal',
  });

  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState('basics');

  const toggle = (categoryId, index) => {
    const key = `${categoryId}-${index}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeData = faqCategories.find((c) => c.id === activeCategory);

  return (
    <div className="home-page">
      <AnnouncementBar settings={settings?.announcement} />
      <Header navLinks={settings?.navLinks} />

      <main>
        {/* ── Hero ── */}
        <section className="faq-hero">
          <div className="faq-hero-bg" />
          <div className="home-container faq-hero-content">
            <span className="luxury-section-badge faq-hero-badge home-animate-fade-in">
              Help Center
            </span>
            <h1 className="faq-hero-title home-animate-fade-in">
              Frequently Asked <em>Questions</em>
            </h1>
            <p className="faq-hero-subtitle home-animate-slide-up">
              Everything you need to know about our lace wigs, hair quality, care instructions,
              and more. Can&apos;t find your answer?{' '}
              <a href="/contact" className="faq-hero-link">Reach out</a> — we&apos;re here to help.
            </p>
            <div className="faq-hero-stats home-animate-slide-up">
              <div className="faq-stat">
                <span className="faq-stat-number">30+</span>
                <span className="faq-stat-label">Questions Answered</span>
              </div>
              <div className="faq-stat-divider" />
              <div className="faq-stat">
                <span className="faq-stat-number">6</span>
                <span className="faq-stat-label">Topic Categories</span>
              </div>
              <div className="faq-stat-divider" />
              <div className="faq-stat">
                <span className="faq-stat-number">17+</span>
                <span className="faq-stat-label">Years of Expertise</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main FAQ Area ── */}
        <section className="faq-main">
          <div className="home-container">
            <div className="faq-layout">

              {/* Sidebar Navigation */}
              <aside className="faq-sidebar">
                <p className="faq-sidebar-label">Browse Topics</p>
                <nav className="faq-nav">
                  {faqCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`faq-nav-btn ${activeCategory === cat.id ? 'faq-nav-btn-active' : ''}`}
                      style={activeCategory === cat.id ? { '--cat-color': cat.color } : {}}
                    >
                      <span className="faq-nav-label">{cat.label}</span>
                      <span className="faq-nav-count">
                        {cat.questions.length}
                      </span>
                    </button>
                  ))}
                </nav>

                {/* Contact CTA */}
                <div className="faq-sidebar-cta">
                  <p className="faq-sidebar-cta-title">Still have questions?</p>
                  <p className="faq-sidebar-cta-text">Our specialists are happy to help.</p>
                  <a href="tel:17025341197" className="faq-sidebar-cta-btn">
                    1-702-534-1197
                  </a>
                  <a href="mailto:divaslacewigs@yahoo.com" className="faq-sidebar-cta-btn faq-sidebar-cta-btn-outline">
                    Email Us
                  </a>
                </div>
              </aside>

              {/* FAQ Panel */}
              <div className="faq-panel">
                {activeData && (
                  <>
                    <div
                      className="faq-panel-header"
                      style={{
                        '--faq-panel-color': activeData.color,
                        '--faq-panel-color-soft': `${activeData.color}20`,
                      }}
                    >
                      <div>
                        <h2 className="faq-panel-title">{activeData.label}</h2>
                        <p className="faq-panel-count">
                          {activeData.questions.length} questions
                        </p>
                      </div>
                    </div>

                    <div className="faq-list">
                      {activeData.questions.map((item, i) => (
                        <FAQItem
                          key={i}
                          question={item.q}
                          answer={item.a}
                          isOpen={!!openItems[`${activeData.id}-${i}`]}
                          onToggle={() => toggle(activeData.id, i)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── All Categories Overview ── */}
        <section className="faq-overview">
          <div className="home-container">
            <div className="faq-overview-header">
              <span className="luxury-section-badge">
                Quick Reference
              </span>
              <h2 className="about-section-title">Browse All Topics</h2>
              <p className="faq-overview-subtitle">
                Jump to any category below to find answers to your questions.
              </p>
            </div>
            <div className="faq-overview-grid stagger-children">
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`faq-overview-card luxury-card ${activeCategory === cat.id ? 'faq-overview-card-active' : ''}`}
                  style={{ '--cat-color': cat.color }}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    document.querySelector('.faq-main')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <h3 className="faq-overview-title">{cat.label}</h3>
                  <p className="faq-overview-count">{cat.questions.length} questions</p>
                  <span className="faq-overview-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="faq-bottom-cta">
          <div className="home-container">
            <div className="faq-bottom-cta-inner">
              <span className="luxury-section-badge" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}>
                We&apos;re Here to Help
              </span>
              <h2 className="faq-bottom-cta-title">Didn&apos;t Find Your Answer?</h2>
              <p className="faq-bottom-cta-text">
                Our lace wig specialists are available by appointment and ready to answer any
                questions you may have — by phone, email, Skype or in person.
              </p>
              <div className="faq-bottom-cta-actions">
                <a href="/contact" className="home-btn home-btn-white home-btn-lg">
                  Schedule a Consultation
                </a>
                <a href="tel:17025341197" className="home-btn home-btn-outline-white home-btn-lg">
                  1-702-534-1197
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings?.footer} footerLinkGroups={settings?.footerLinkGroups} />
    </div>
  );
}
