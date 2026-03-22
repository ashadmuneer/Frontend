# Devi — Home Page UI & Theme Documentation

> A luxury wig boutique e-commerce storefront built with **React 18 + Vite**, styled with **Tailwind CSS 4** and a custom CSS design system.

---

## Table of Contents

1. [Tech Stack Overview](#1-tech-stack-overview)
2. [Design Philosophy](#2-design-philosophy)
3. [Color System & Design Tokens](#3-color-system--design-tokens)
4. [Typography System](#4-typography-system)
5. [Component Architecture](#5-component-architecture)
6. [Layout & Grid System](#6-layout--grid-system)
7. [Button System](#7-button-system)
8. [Input System](#8-input-system)
9. [Shadow & Elevation Hierarchy](#9-shadow--elevation-hierarchy)
10. [Animation & Motion](#10-animation--motion)
11. [Responsive Design Strategy](#11-responsive-design-strategy)
12. [Page Sections Breakdown](#12-page-sections-breakdown)
13. [Dynamic Settings & CMS Integration](#13-dynamic-settings--cms-integration)
14. [SEO & Metadata](#14-seo--metadata)
15. [Dual-Theme Architecture](#15-dual-theme-architecture)
16. [Asset Strategy](#16-asset-strategy)
17. [Accessibility Notes](#17-accessibility-notes)

---

## 1. Tech Stack Overview

| Category            | Technology                              |
| ------------------- | --------------------------------------- |
| Framework           | React 18 + Vite                         |
| Styling             | Tailwind CSS 4 + Custom CSS (no UI lib) |
| Display Fonts       | Playfair Display (serif, 400-700)       |
| Body Fonts          | Poppins + DM Sans (sans-serif)          |
| Icons               | Lucide React                            |
| Routing             | React Router v6                         |
| HTTP                | Axios (interceptors for auth)           |
| Auth                | JWT (localStorage) + React Context      |
| Notifications       | React Hot Toast                         |
| Image Formats       | AVIF (modern, optimized)                |
| Dev Port            | 3000 (proxied to backend at 5000)       |

---

## 2. Design Philosophy

The Devi storefront follows a **"Luxury Boutique"** design language built around four principles:

### 2.1 Visual Identity
- **Purple + Gold** — Primary brand palette communicating luxury, femininity, and premium quality
- **Serif + Sans Pairing** — Playfair Display headings convey elegance; Poppins body text ensures modern readability
- **Generous Whitespace** — Sections breathe with `py-16` to `py-20` padding, creating an unhurried, high-end feel

### 2.2 Interaction Model
- **Subtle Elevation** — Cards and buttons lift on hover (`translateY(-2px/-4px)`) with enhanced shadows
- **Smooth Transitions** — All interactive states transition at `0.3s ease`, never jarring
- **Image Engagement** — Product and category images zoom on hover (`scale 1.05-1.10`), inviting exploration
- **Scroll Awareness** — Header changes style based on scroll position (transparent → solid background)

### 2.3 Content Strategy
- **CMS-Driven** — Every section reads from backend site settings with sensible hardcoded fallbacks
- **Progressive Disclosure** — Hero → Categories → Trust → Products → Custom → Testimonials → Store → Newsletter → Footer

### 2.4 Brand Positioning
- **Color Psychology**: Purple = luxury/femininity, Gold = premium/wealth, Cream = warmth/approachability, Navy = trust/sophistication
- **Overall Vibe**: Classic meets modern — a premium wig boutique that feels both established and contemporary

---

## 3. Color System & Design Tokens

All colors are defined as CSS custom properties inside `@theme {}` in `index.css`.

### 3.1 Home Page Palette (Light Theme)

| Token                       | Value       | Usage                           |
| --------------------------- | ----------- | ------------------------------- |
| `--color-home-bg`           | `#faf8f5`   | Page background (warm off-white)|
| `--color-home-fg`           | `#1a1a2e`   | Primary text (deep navy)        |
| `--color-home-card`         | `#ffffff`   | Card backgrounds                |
| `--color-home-card-fg`      | `#1a1a2e`   | Card text                       |
| `--color-home-primary`      | `#9b59b6`   | Brand purple — CTAs, accents    |
| `--color-home-primary-fg`   | `#ffffff`   | Text on primary                 |
| `--color-home-secondary`    | `#e8d5c4`   | Warm beige — supporting tone    |
| `--color-home-secondary-fg` | `#1a1a2e`   | Text on secondary               |
| `--color-home-muted`        | `#f0ebe5`   | Muted backgrounds               |
| `--color-home-muted-fg`     | `#6b7280`   | Muted / placeholder text        |
| `--color-home-accent`       | `#d4a574`   | Gold accent — badges, highlights|
| `--color-home-accent-fg`    | `#ffffff`   | Text on accent                  |
| `--color-home-border`       | `#e8e0d8`   | Borders (soft sand)             |
| `--color-home-input`        | `#e8e0d8`   | Input borders                   |
| `--color-home-ring`         | `#9b59b6`   | Focus rings                     |

### 3.2 Admin Dashboard Palette (Dark Theme)

| Token                  | Value                        | Usage                  |
| ---------------------- | ---------------------------- | ---------------------- |
| `--color-bg-primary`   | `#0a0a0f`                    | Page background        |
| `--color-bg-secondary` | `#12121a`                    | Sidebar / secondary bg |
| `--color-bg-card`      | `#1a1a25`                    | Card backgrounds       |
| `--color-bg-hover`     | `#22222f`                    | Hover states           |
| `--color-bg-input`     | `#15151f`                    | Input fields           |
| `--color-border`       | `#2a2a3a`                    | All borders            |
| `--color-border-focus` | `#d4a853`                    | Focused input borders  |
| `--color-text-primary` | `#f0ece4`                    | Primary text (cream)   |
| `--color-text-secondary`| `#9a958d`                   | Secondary text (taupe) |
| `--color-text-muted`   | `#6b6560`                    | Muted text             |
| `--color-accent`       | `#d4a853`                    | Gold accent            |
| `--color-accent-hover` | `#e6bc6a`                    | Gold hover             |
| `--color-accent-muted` | `rgba(212, 168, 83, 0.15)`   | Gold tint backgrounds  |
| `--color-success`      | `#4ade80`                    | Success states         |
| `--color-warning`      | `#fbbf24`                    | Warning states         |
| `--color-danger`       | `#f87171`                    | Error / danger states  |
| `--color-info`         | `#60a5fa`                    | Info states            |

---

## 4. Typography System

### 4.1 Font Stack

| Role    | Font Family       | Weights Used  | Source       |
| ------- | ----------------- | ------------- | ------------ |
| Display | Playfair Display  | 400, 500, 600, 700 | Google Fonts |
| Body    | Poppins           | 300, 400, 500, 600 | Google Fonts |
| System  | DM Sans           | 300-700       | Google Fonts |

- **Admin pages**: `DM Sans` (set on `body`)
- **Home page**: `Poppins` (set on `.home-page`)
- **Headings everywhere**: `Playfair Display` (serif)

### 4.2 Type Scale

| Element | Mobile       | Tablet (768px) | Desktop (1024px) | Line Height |
| ------- | ------------ | -------------- | ---------------- | ----------- |
| `h1`    | `2.25rem`    | `3rem`         | `3.75rem`        | `1.2`       |
| `h2`    | `1.875rem`   | `2.25rem`      | —                | `1.2`       |
| `h3`    | `1.25rem`    | `1.5rem`       | —                | `1.2`       |
| Body    | `1rem`       | —              | —                | `1.6`       |
| Small   | `0.875rem`   | —              | —                | —           |
| Badge   | `0.6875rem`  | —              | —                | —           |

### 4.3 Heading Conventions
- All headings: `font-weight: 600`, `margin: 0` (reset), with bottom margin added per level
- `h1` bottom margin: `1.5rem`
- `h2` bottom margin: `1.5rem`
- `h3` bottom margin: `1rem`

---

## 5. Component Architecture

### 5.1 Page Composition (Top to Bottom)

```
┌─────────────────────────────────────┐
│        AnnouncementBar              │  ← Purple banner with promo text
├─────────────────────────────────────┤
│        Header (Sticky)              │  ← Logo + Nav + Icons
├─────────────────────────────────────┤
│        HeroSection                  │  ← Full-width carousel + CTAs
├─────────────────────────────────────┤
│        CategoryGrid                 │  ← 4-column product categories
├─────────────────────────────────────┤
│        TrustSection                 │  ← 4-item benefits grid
├─────────────────────────────────────┤
│        ProductGrid                  │  ← Featured product cards
├─────────────────────────────────────┤
│        CustomWigSection             │  ← 2-column: image + features
├─────────────────────────────────────┤
│        TestimonialsSection          │  ← 3-column review cards
├─────────────────────────────────────┤
│        StoreVisitSection            │  ← Purple gradient + store info
├─────────────────────────────────────┤
│        NewsletterSection            │  ← Email signup form
├─────────────────────────────────────┤
│        Footer                       │  ← Dark navy, links + socials
└─────────────────────────────────────┘
```

### 5.2 Data Flow

```
HomePage.jsx
  ├── useEffect → Promise.allSettled([getPublicProducts(), getSiteSettings()])
  │     ├── products → ProductGrid
  │     └── siteSettings → ALL sections via props
  │
  ├── resolveImageUrl() → Normalizes image URLs (http, relative, data:)
  │
  ├── Fallback data (defaultCategories, defaultTestimonials, fallbackImages)
  │
  └── SEO injection useEffect → document.title, meta tags, OG, GA
```

### 5.3 Props Contract

Every section component accepts a `settings` prop from the CMS with component-specific keys:

| Component           | Settings Prop Path            | Key Config Fields                      |
| ------------------- | ----------------------------- | -------------------------------------- |
| AnnouncementBar     | `settings.announcement`       | `enabled`, `text`, `linkText`, `linkUrl` |
| Header              | `settings.navLinks`           | Array of `{ label, url }` objects      |
| HeroSection         | `settings.hero`               | `slides[]`, each with image/title/CTA  |
| CategoryGrid        | `settings.categorySection`    | `heading`, `categories[]`              |
| TrustSection        | `settings.trustSection`       | Items with `icon`, `title`, `description` |
| ProductGrid         | `settings.productSection`     | `heading`, `showCount`                 |
| CustomWigSection    | `settings.customWigSection`   | `image`, `heading`, `description`, `features[]` |
| TestimonialsSection | `settings.testimonialsSection`| `heading`, `testimonials[]`            |
| StoreVisitSection   | `settings.storeVisitSection`  | `image`, `heading`, address/hours/phone |
| NewsletterSection   | `settings.newsletterSection`  | `heading`, `description`, `buttonText` |
| Footer              | `settings.footer` (implied)   | Brand info, link groups, social URLs   |

---

## 6. Layout & Grid System

### 6.1 Container

```css
.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
```

All content is centered within a `1400px` max-width container with `24px` horizontal gutters.

### 6.2 Grid Patterns

| Pattern              | Mobile  | Small (640px) | Medium (768px) | Large (1024px) |
| -------------------- | ------- | ------------- | -------------- | -------------- |
| Categories           | 2 cols  | 2 cols        | 2 cols         | 4 cols         |
| Trust Items          | 2 cols  | 2 cols        | 2 cols         | 4 cols         |
| Products             | 2 cols  | 2 cols        | 2 cols         | 4 cols         |
| Testimonials         | 1 col   | 1 col         | 2 cols         | 3 cols         |
| Custom Wig           | 1 col   | 1 col         | 2 cols         | 2 cols         |
| Store Visit          | 1 col   | 1 col         | 1 col          | 2 cols         |
| Footer               | 1 col   | 2 cols        | —              | Dynamic cols   |

### 6.3 Section Spacing

- Vertical padding: Typically `py-16` (4rem) to `py-20` (5rem) per section
- Gap between grid items: `gap-6` (1.5rem) to `gap-8` (2rem)
- Section headings to content: `mb-12` (3rem) typical

---

## 7. Button System

All buttons share a base class `.home-btn` with size and variant modifiers.

### 7.1 Base Styles

```css
.home-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  height: 3rem;
  padding: 0.75rem 2rem;
}
```

### 7.2 Size Variants

| Class          | Height   | Padding          | Font Size    | Radius     |
| -------------- | -------- | ---------------- | ------------ | ---------- |
| `.home-btn`    | `3rem`   | `0.75rem 2rem`   | `1rem`       | `0.5rem`   |
| `.home-btn-lg` | `3.5rem` | `0.75rem 2.5rem` | `1.125rem`   | `0.5rem`   |
| `.home-btn-sm` | `2.5rem` | `0.5rem 1rem`    | `0.875rem`   | `0.375rem` |
| `.home-btn-icon`| `3rem`  | `0`              | —            | —          |

### 7.3 Color Variants

| Class                     | Background              | Text Color               | Hover Effect                                 |
| ------------------------- | ----------------------- | ------------------------ | -------------------------------------------- |
| `.home-btn-primary`       | `#9b59b6` (purple)      | `#ffffff`                | Slightly transparent purple + lift + shadow  |
| `.home-btn-gold`          | `#9b59b6` (purple)      | `#ffffff`                | Same as primary (brand-consistent)           |
| `.home-btn-outline`       | Transparent             | `#9b59b6` (purple)       | Fills purple, text turns white               |
| `.home-btn-outline-white` | Transparent             | `#ffffff`                | Fills white, text turns navy                 |
| `.home-btn-outline-hero`  | Transparent             | `#ffffff`                | Fills white, text turns navy                 |
| `.home-btn-white`         | `#ffffff`               | `#9b59b6` (purple)       | Turns gold background                        |
| `.home-btn-ghost`         | Transparent             | `#1a1a2e` (navy)         | Light grey overlay                           |

### 7.4 Focus State
```css
.home-btn:focus-visible {
  outline: 2px solid var(--color-home-ring);  /* purple */
  outline-offset: 2px;
}
```

---

## 8. Input System

```css
.home-input {
  height: 3rem;
  border-radius: 0.5rem;
  border: 2px solid var(--color-home-border);     /* #e8e0d8 */
  background: var(--color-home-card);             /* white */
  padding: 0.5rem 1.25rem;
  font-family: 'Poppins', sans-serif;
  color: var(--color-home-fg);                    /* navy */
}
```

- **Placeholder color**: `--color-home-muted-fg` (`#6b7280`)
- **Focus state**: Border turns purple + `box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.2)`

---

## 9. Shadow & Elevation Hierarchy

Three-tier elevation system:

| Class                 | Box Shadow                        | Usage                    |
| --------------------- | --------------------------------- | ------------------------ |
| `.home-shadow-soft`   | `0 4px 24px rgba(0,0,0,0.06)`    | Default cards, buttons   |
| `.home-shadow-medium` | `0 8px 32px rgba(0,0,0,0.1)`     | Elevated cards, images   |
| `.home-shadow-hover`  | `0 12px 48px rgba(0,0,0,0.15)`   | Hover states, modals     |

### Hover Lift Pattern

```css
.home-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0,0,0,0.15);
}
```

### Luxury Card

```css
.luxury-card {
  background: var(--color-home-card);
  border: 1px solid var(--color-home-border);
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);     /* resting */
}
.luxury-card:hover {
  box-shadow: 0 4px 20px rgba(155,89,182,0.06); /* purple-tinted glow */
}
```

---

## 10. Animation & Motion

### 10.1 Keyframe Animations

| Animation Name      | Motion                          | Duration | Easing   |
| -------------------- | ------------------------------- | -------- | -------- |
| `home-fade-in`       | Y: 30px → 0, opacity 0 → 1    | `0.8s`   | ease-out |
| `home-slide-up`      | Y: 20px → 0, opacity 0 → 1    | `0.6s`   | ease-out |
| `home-slide-left`    | X: -50px → 0, opacity 0 → 1   | `0.8s`   | ease-out |
| `home-slide-right`   | X: 50px → 0, opacity 0 → 1    | `0.8s`   | ease-out |
| `luxury-float`       | Y: 0 → -8px → 0 (oscillation) | `6s`     | ease-in-out, infinite |

### 10.2 Utility Classes

| Class                     | Animation Applied       |
| ------------------------- | ----------------------- |
| `.home-animate-fade-in`   | `home-fade-in`          |
| `.home-animate-slide-up`  | `home-slide-up`         |
| `.home-animate-slide-left`| `home-slide-left`       |
| `.home-animate-slide-right`| `home-slide-right`     |
| `.luxury-float`           | `luxury-float` (infinite) |

### 10.3 Stagger Animation Pattern

```css
.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 60ms; }
.stagger-children > *:nth-child(3) { animation-delay: 120ms; }
.stagger-children > *:nth-child(4) { animation-delay: 180ms; }
.stagger-children > *:nth-child(5) { animation-delay: 240ms; }
.stagger-children > *:nth-child(6) { animation-delay: 300ms; }
```

### 10.4 Interaction Transitions

| Element      | Hover Effect                  | Duration | Easing |
| ------------ | ----------------------------- | -------- | ------ |
| Buttons      | `translateY(-2px)` + shadow ↑ | `0.3s`   | ease   |
| Cards        | `translateY(-4px)` + shadow ↑ | `0.3s`   | ease   |
| Images       | `scale(1.05)` to `scale(1.10)`| `0.5s`   | ease   |
| Nav links    | Color fade + underline grow   | `0.3s`   | ease   |
| Social icons | Purple bg + lift              | `0.3s`   | ease   |

### 10.5 Hero Carousel

- **Auto-rotation**: 5-second interval
- **Image transition**: 1000ms crossfade (opacity 0 → 1)
- **Text entrance**: Slide-left animation on each slide change

---

## 11. Responsive Design Strategy

### 11.1 Approach

**Mobile-first** — base styles target small screens, progressively enhanced at breakpoints.

### 11.2 Breakpoints (Tailwind Defaults)

| Prefix | Min-Width | Primary Use                  |
| ------ | --------- | ---------------------------- |
| (none) | 0px       | Mobile (stacked layouts)     |
| `sm:`  | 640px     | Small tablets (2-col grids)  |
| `md:`  | 768px     | Tablets (show more content)  |
| `lg:`  | 1024px    | Desktop (full nav, 4-col)    |

### 11.3 Key Responsive Patterns

```
Mobile (< 640px)
  ├── Hamburger menu (slide-up overlay)
  ├── 1-2 column grids
  ├── Stacked hero text + buttons
  └── Mobile sticky bottom bar

Tablet (640px – 1023px)
  ├── 2-column grids
  ├── Some nav items visible
  └── Two-column layouts for split sections

Desktop (1024px+)
  ├── Full horizontal navigation
  ├── 3-4 column grids
  ├── Side-by-side hero content
  └── All actions visible in header
```

### 11.4 Visibility Utilities Used

| Class               | Effect                           |
| -------------------- | -------------------------------- |
| `hidden sm:inline`   | Show on tablet and above         |
| `hidden md:flex`     | Show on medium screens and above |
| `lg:hidden`          | Hide on desktop (mobile menu)    |
| `flex flex-col sm:flex-row` | Stack → Row responsive    |

### 11.5 Mobile Sticky Bar

```css
@media (max-width: 1023px) {
  .mobile-sticky-bar {
    position: fixed;
    bottom: 0;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--color-home-border);
    box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  }
}
```

---

## 12. Page Sections Breakdown

### 12.1 AnnouncementBar
- **Background**: Purple (`--color-home-primary`)
- **Text**: White, centered, small font
- **Content**: Promo message + clickable link
- **Behavior**: Dismissible via settings (`enabled` flag)
- **Height**: Compact banner

### 12.2 Header
- **Position**: Sticky (`z-50`)
- **Scroll Logic**:
  - At top: Translucent white with backdrop blur
  - Scrolled: Solid dark card background + bottom shadow
- **Desktop Nav**: 6 links with underline hover animation
- **Mobile Nav**: Hamburger → full-screen slide-up overlay
- **Icons**: Search, Account, Shopping Bag (with count badge)
- **Border**: Purple bottom accent line always visible

### 12.3 HeroSection
- **Layout**: Full-viewport-width image carousel
- **Overlay**: Dark gradient `rgba(31,31,31,0.9) → transparent`
- **Image Count**: 4 default hero images (AVIF)
- **Auto-play**: 5-second rotation
- **Transition**: 1000ms crossfade
- **Content**: Large heading (partially italic) + subtitle + two CTA buttons
- **CTA Left**: Gold/purple button → "Shop Collection"
- **CTA Right**: White outline button → "Book Consultation"

### 12.4 CategoryGrid
- **Heading**: Centered section title
- **Grid**: 4 columns (2 on mobile)
- **Cards**: Image with gradient overlay
- **Hover**:
  - Image zooms to 110% (500ms)
  - Overlay shifts: `rgba(0,0,0,0.8)` → `rgba(155,89,182,0.9)` (purple)
- **Labels**: Category title + "Shop Now" text in gold accent

### 12.5 TrustSection
- **Grid**: 4-item row (2 on mobile)
- **Icons**: Award, Truck, Sparkles, HeartHandshake (Lucide)
- **Icon Style**: Circular purple gradient backgrounds
- **Animation**: Staggered fade-in (100ms cascade delay)
- **Content**: Icon + title + short description per item

### 12.6 ProductGrid
- **Heading**: Centered "Featured Products" (configurable)
- **Grid**: 4 columns (2 on mobile)
- **Card Design**:
  - Top: Category badge (gold background, rounded)
  - Center: Product image with 105% hover zoom
  - Bottom: Product name (2-line clamp) + "View Details" with arrow
- **Hover**: Card lifts `translateY(-4px)` + shadow increases

### 12.7 CustomWigSection
- **Layout**: 2-column split (stacked on mobile)
- **Left Column**: Product image with medium shadow
- **Right Column**:
  - Heading + description paragraph
  - Feature checklist (check icons in purple-tinted circles)
  - Gold CTA button
- **Section Padding**: `py-16` to `py-20`

### 12.8 TestimonialsSection
- **Grid**: 3 columns (2 tablet, 1 mobile)
- **Card Structure**:
  - Gold star rating (5 stars)
  - Italic testimonial quote
  - Author avatar (rounded circle) + name + location
- **Hover**: Card lifts + shadow grows

### 12.9 StoreVisitSection
- **Background**: Purple gradient (brand-defining section)
- **Layout**: 2 columns — image left, content right
- **Content**:
  - White heading on purple
  - Info items with icons: MapPin, Clock, Phone
  - Two CTAs: White filled button + white outline button
- **Contrast**: White text/icons on purple for maximum visibility

### 12.10 NewsletterSection
- **Layout**: Centered, narrow-width
- **Content**: Heading + subtitle + email form
- **Form**: Email input + gold/purple subscribe button
- **Responsive**: Side-by-side on desktop, stacked on mobile

### 12.11 Footer
- **Background**: Dark navy (`--color-home-fg` = `#1a1a2e`)
- **Structure**:
  - Brand column: Logo + description + 4 social icons (Instagram, Facebook, Twitter, YouTube)
  - N link group columns (dynamic from settings)
- **Social Icons**: Hover → purple background + lift
- **Divider**: Gradient line (`transparent → border color → transparent`)
- **Bottom**: Copyright text

---

## 13. Dynamic Settings & CMS Integration

### 13.1 Data Fetching

```js
// HomePage.jsx — parallel fetch on mount
const [productsRes, settingsRes] = await Promise.allSettled([
  getPublicProducts(),
  getSiteSettings(),
]);
```

Both requests fire on component mount via `Promise.allSettled()` — if one fails, the other still loads.

### 13.2 Settings Cache (useSiteSettings Hook)

```
Module-level cache → single network request per session
Prevents redundant API calls when navigating between pages
```

### 13.3 Fallback Strategy

Every section has hardcoded default content:
- **Categories**: 4 default wig categories with local images
- **Testimonials**: 3 default reviews with local avatar images
- **Products**: Fallback image array cycled by index
- **All text**: Default headings, descriptions baked into components

### 13.4 Image URL Resolution

```js
// Handles: absolute URLs, root-relative, data URIs, and bare paths
const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:')) return url;
  return `/${url}`;
};
```

---

## 14. SEO & Metadata

Dynamically injected in `HomePage.jsx` via a cleanup-aware `useEffect`:

| Tag                        | Source                    | Behavior                    |
| -------------------------- | ------------------------- | --------------------------- |
| `<title>`                  | `settings.seo.siteTitle`  | Set on load, restored on unmount |
| `meta[description]`        | `settings.seo.metaDescription` | Update existing tag    |
| `meta[keywords]`           | `settings.seo.metaKeywords` | Create if missing         |
| `og:title`                 | `settings.seo.siteTitle`  | Create if missing           |
| `og:description`           | `settings.seo.metaDescription` | Create if missing      |
| `og:image`                 | `settings.seo.ogImage`    | Converted to absolute URL   |
| `google-site-verification` | `settings.seo.googleVerification` | Create if missing   |
| Google Analytics `<script>`| `settings.seo.googleAnalyticsId` | Validated GA ID format, then injected |

All dynamically created elements are tracked and removed on component unmount.

---

## 15. Dual-Theme Architecture

The application uses **two completely separate design systems** within one CSS file:

```
index.css
  ├── Admin Dashboard (Dark Theme)
  │     ├── Tokens: --color-bg-*, --color-text-*, --color-accent
  │     ├── Base: body { background: #0a0a0f; font: DM Sans }
  │     ├── Components: .glass-card, .status-*
  │     └── Animations: fade-in, slide-in-left
  │
  └── Home Page (Light Theme)
        ├── Tokens: --color-home-*
        ├── Scope: .home-page { background: #faf8f5; font: Poppins }
        ├── Components: .home-btn-*, .luxury-card, .home-input
        └── Animations: home-fade-in, home-slide-*, luxury-float
```

The `.home-page` class wrapping the entire home page overrides `body` styles, creating a completely different visual world from the admin dashboard — same CSS file, no conflicts.

---

## 16. Asset Strategy

### 16.1 Image Formats
- **AVIF** for all hero, banner, and gallery images (best compression, modern browser support)
- **JPG** for avatar/testimonial photos
- **PNG** for category and product fallback images

### 16.2 File Organization

```
src/assets/home/
  ├── hero1.avif, hero2.avif, hero3.avif, hero4.avif  (hero carousel)
  ├── logodivas.avif                                    (brand logo)
  ├── lace-front-wigs.png, full-lace-wigs.png, ...     (category images)
  ├── lace-front-product.png, glueless-full-lace.png   (product fallbacks)
  ├── custom-hair-products.png, who-we-are.png         (section images)
  └── avatar-1.jpg, avatar-2.jpg, avatar-3.jpg         (testimonial avatars)
```

### 16.3 Cloudinary Integration
- Production images served from Cloudinary CDN
- Configured via backend environment variables
- Local fallback images for offline/development use

---

## 17. Accessibility Notes

### Current Implementation
- **Focus visible**: Purple outline on buttons (`:focus-visible`)
- **Semantic HTML**: `<main>`, `<nav>`, `<header>`, `<footer>` used
- **Alt text**: Dynamic from settings or product names
- **Keyboard nav**: Standard tab order, focus rings on interactive elements
- **Font smoothing**: `-webkit-font-smoothing: antialiased`
- **Scrollbar**: Custom styled but functional

### Recommendations for Improvement
- Add `aria-label` to icon-only buttons (search, cart, hamburger)
- Add `aria-live` region for hero carousel slide announcements
- Ensure all images have meaningful `alt` attributes
- Add skip-to-content link at page top
- Test color contrast ratios for muted text on light backgrounds

---

## Quick Reference: CSS Class Cheat Sheet

```
Layout:       .home-page, .home-container
Typography:   h1-h4 (auto-styled in .home-page)
Buttons:      .home-btn + (.home-btn-primary | -gold | -outline | -white | -ghost)
Sizing:       .home-btn-lg, .home-btn-sm, .home-btn-icon
Inputs:       .home-input
Cards:        .luxury-card, .home-bg-card
Shadows:      .home-shadow-soft, .home-shadow-medium, .home-shadow-hover
Hover:        .home-hover-lift
Colors:       .home-text-muted, .home-text-primary-color, .home-text-accent
Backgrounds:  .home-bg-card, .home-bg-muted
Gradients:    .home-gradient-primary, .home-gradient-gold
Animations:   .home-animate-fade-in, -slide-up, -slide-left, -slide-right
Stagger:      .stagger-children (parent class)
Float:        .luxury-float
Divider:      .luxury-divider
Badge:        .luxury-section-badge
Scrollbar:    .luxury-scrollbar
Mobile:       .mobile-sticky-bar
```

---

*Last updated: March 2026 — Devi Luxury Wig Boutique*
