import { useState, useEffect, useRef } from 'react';
import { getSiteSettings, updateSiteSettings, testEmailConnection } from '../services/api';
import {
  Settings,
  Globe,
  Image,
  Type,
  Save,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search as SearchIcon,
  BarChart3,
  Layout,
  MessageSquare,
  MapPin,
  Mail,
  ShieldCheck,
  Star,
  Sparkles,
  FileText,
  Navigation,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Send,
  Eye,
  EyeOff,
  Zap,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const SECTION_TABS = [
  { id: 'seo', label: 'Global SEO', icon: Globe },
  { id: 'pageSeo', label: 'Page SEO', icon: FileText },
  { id: 'navigation', label: 'Navigation', icon: Navigation },
  { id: 'announcement', label: 'Announcement', icon: MessageSquare },
  { id: 'hero', label: 'Hero Section', icon: Image },
  { id: 'categories', label: 'Categories', icon: Layout },
  { id: 'trust', label: 'Trust Section', icon: ShieldCheck },
  { id: 'products', label: 'Products Grid', icon: BarChart3 },
  { id: 'customWig', label: 'Custom Wig', icon: Sparkles },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'storeVisit', label: 'Store Visit', icon: MapPin },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'footer', label: 'Footer', icon: Type },
  { id: 'email', label: 'Email', icon: Send },
  { id: 'mailTemplates', label: 'Mail Templates', icon: FileText },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('seo');
  const [heroImageFiles, setHeroImageFiles] = useState([]);
  const [customWigImageFile, setCustomWigImageFile] = useState(null);
  const [storeVisitImageFile, setStoreVisitImageFile] = useState(null);
  const [ogImageFile, setOgImageFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getSiteSettings();
      setSettings(res.data.data);
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      // Append JSON data
      formData.append('data', JSON.stringify(settings));

      // Append file uploads
      if (heroImageFiles.length > 0) {
        heroImageFiles.forEach((file) => formData.append('heroImages', file));
      }
      if (ogImageFile) formData.append('ogImage', ogImageFile);
      if (customWigImageFile) formData.append('customWigImage', customWigImageFile);
      if (storeVisitImageFile) formData.append('storeVisitImage', storeVisitImageFile);

      await updateSiteSettings(formData);
      toast.success('Settings saved successfully!');

      // Reset file states
      setHeroImageFiles([]);
      setCustomWigImageFile(null);
      setStoreVisitImageFile(null);
      setOgImageFile(null);

      // Refresh
      fetchSettings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateNestedField = (section, subsection, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section]?.[subsection],
          [field]: value,
        },
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-20 text-text-muted">
        Failed to load settings. Please refresh.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-text-primary"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Site Settings
          </h1>
          <p className="text-text-secondary mt-1">
            Manage SEO, home page content, and site configuration
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-bg-primary font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="glass-card p-1.5 flex flex-wrap gap-1">
        {SECTION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-accent/15 text-accent'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-card p-6">
        {activeTab === 'seo' && (
          <SeoSection settings={settings} updateField={updateField} ogImageFile={ogImageFile} setOgImageFile={setOgImageFile} />
        )}
        {activeTab === 'pageSeo' && (
          <PageSeoSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === 'navigation' && (
          <NavigationSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === 'announcement' && (
          <AnnouncementSection settings={settings} updateField={updateField} />
        )}
        {activeTab === 'hero' && (
          <HeroSectionEditor
            settings={settings}
            updateField={updateField}
            heroImageFiles={heroImageFiles}
            setHeroImageFiles={setHeroImageFiles}
          />
        )}
        {activeTab === 'categories' && (
          <CategorySection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === 'trust' && (
          <TrustSectionEditor settings={settings} setSettings={setSettings} />
        )}
        {activeTab === 'products' && (
          <ProductSectionEditor settings={settings} updateField={updateField} />
        )}
        {activeTab === 'customWig' && (
          <CustomWigSectionEditor
            settings={settings}
            updateField={updateField}
            setSettings={setSettings}
            customWigImageFile={customWigImageFile}
            setCustomWigImageFile={setCustomWigImageFile}
          />
        )}
        {activeTab === 'testimonials' && (
          <TestimonialsSectionEditor settings={settings} setSettings={setSettings} />
        )}
        {activeTab === 'storeVisit' && (
          <StoreVisitSectionEditor
            settings={settings}
            updateField={updateField}
            storeVisitImageFile={storeVisitImageFile}
            setStoreVisitImageFile={setStoreVisitImageFile}
          />
        )}
        {activeTab === 'newsletter' && (
          <NewsletterSectionEditor settings={settings} updateField={updateField} />
        )}
        {activeTab === 'footer' && (
          <FooterSectionEditor settings={settings} updateField={updateField} updateNestedField={updateNestedField} />
        )}
        {activeTab === 'email' && (
          <EmailSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === 'mailTemplates' && (
          <MailTemplatesSection settings={settings} setSettings={setSettings} />
        )}
      </div>
    </div>
  );
}

/* ─── INPUT COMPONENTS ─────────────────────────────────── */

function InputField({ label, value, onChange, placeholder, type = 'text', hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
      />
      {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, rows = 3, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors resize-none"
      />
      {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  );
}

function ToggleField({ label, checked, onChange, hint }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        {hint && <p className="text-xs text-text-muted mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
          checked ? 'bg-accent' : 'bg-border'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );
}

function ImageUpload({ label, currentImage, onFileSelect, hint }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // Revoke old blob URL when preview changes or component unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      onFileSelect(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const imgSrc = preview || (currentImage ? (currentImage.startsWith('http') ? currentImage : `/${currentImage}`) : null);

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-border-focus transition-colors flex items-center justify-center min-h-[120px] overflow-hidden"
      >
        {imgSrc ? (
          <img src={imgSrc} alt="Preview" className="max-h-[160px] object-contain rounded" />
        ) : (
          <div className="text-center text-text-muted">
            <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click to upload</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      </div>
      {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h3>
      {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
    </div>
  );
}

/* ─── SEO SECTION ──────────────────────────────────────── */

function SeoSection({ settings, updateField, ogImageFile, setOgImageFile }) {
  const seo = settings.seo || {};
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Search Engine Optimization"
        description="Configure meta tags, keywords, and analytics tracking for better search visibility."
      />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Site Title"
          value={seo.siteTitle}
          onChange={(v) => updateField('seo', 'siteTitle', v)}
          placeholder="Divas Lace Wigs"
          hint="Appears in browser tabs and search results"
        />
        <InputField
          label="Google Analytics ID"
          value={seo.googleAnalyticsId}
          onChange={(v) => updateField('seo', 'googleAnalyticsId', v)}
          placeholder="G-XXXXXXXXXX"
          hint="e.g., G-ABCDEF1234"
        />
      </div>
      <TextareaField
        label="Meta Description"
        value={seo.metaDescription}
        onChange={(v) => updateField('seo', 'metaDescription', v)}
        placeholder="A short description of your website..."
        hint="Recommended: 150-160 characters. Shown in search results below the title."
        rows={3}
      />
      <TextareaField
        label="Meta Keywords"
        value={seo.metaKeywords}
        onChange={(v) => updateField('seo', 'metaKeywords', v)}
        placeholder="lace wigs, human hair wigs, custom wigs..."
        hint="Comma-separated keywords. While not heavily used by Google, can help other search engines."
        rows={2}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Google Site Verification"
          value={seo.googleVerification}
          onChange={(v) => updateField('seo', 'googleVerification', v)}
          placeholder="verification-code"
          hint="Google Search Console verification meta tag content"
        />
        <ImageUpload
          label="OG Image (Social Sharing)"
          currentImage={seo.ogImage}
          onFileSelect={setOgImageFile}
          hint="Shown when your site is shared on social media (1200×630px recommended)"
        />
      </div>
    </div>
  );
}

/* ─── ANNOUNCEMENT SECTION ─────────────────────────────── */

function AnnouncementSection({ settings, updateField }) {
  const ann = settings.announcement || {};
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Announcement Bar"
        description="The banner displayed at the very top of your homepage."
      />
      <ToggleField
        label="Enable Announcement Bar"
        checked={ann.enabled}
        onChange={(v) => updateField('announcement', 'enabled', v)}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Announcement Text"
          value={ann.text}
          onChange={(v) => updateField('announcement', 'text', v)}
          placeholder="✨ Free Shipping on Orders Over $150"
        />
        <InputField
          label="Link Text"
          value={ann.linkText}
          onChange={(v) => updateField('announcement', 'linkText', v)}
          placeholder="Book a Custom Wig Consultation"
        />
      </div>
      <InputField
        label="Link URL"
        value={ann.linkUrl}
        onChange={(v) => updateField('announcement', 'linkUrl', v)}
        placeholder="#custom"
      />
    </div>
  );
}

/* ─── HERO SECTION ─────────────────────────────────────── */

function HeroSectionEditor({ settings, updateField, heroImageFiles, setHeroImageFiles }) {
  const hero = settings.hero || {};
  const inputRef = useRef(null);
  const [heroPreviewUrls, setHeroPreviewUrls] = useState([]);

  // Create/revoke blob URLs for new hero image files
  useEffect(() => {
    const urls = heroImageFiles.map((f) => URL.createObjectURL(f));
    setHeroPreviewUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [heroImageFiles]);

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    setHeroImageFiles((prev) => [...prev, ...files]);
  };

  const existingImages = hero.images || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Hero Section"
        description="The main banner area with background image slider, heading, and call-to-action buttons."
      />
      <TextareaField
        label="Heading"
        value={hero.heading}
        onChange={(v) => updateField('hero', 'heading', v)}
        placeholder="Luxury Lace Wigs..."
        hint="Use line breaks to split into multiple lines"
        rows={3}
      />
      <TextareaField
        label="Subheading"
        value={hero.subheading}
        onChange={(v) => updateField('hero', 'subheading', v)}
        placeholder="Premium human hair wigs..."
        rows={2}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Button 1 Text"
          value={hero.buttonText1}
          onChange={(v) => updateField('hero', 'buttonText1', v)}
        />
        <InputField
          label="Button 1 Link"
          value={hero.buttonLink1}
          onChange={(v) => updateField('hero', 'buttonLink1', v)}
        />
        <InputField
          label="Button 2 Text"
          value={hero.buttonText2}
          onChange={(v) => updateField('hero', 'buttonText2', v)}
        />
        <InputField
          label="Button 2 Link"
          value={hero.buttonLink2}
          onChange={(v) => updateField('hero', 'buttonLink2', v)}
        />
      </div>

      {/* Hero Images */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-3">Hero Slider Images</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {existingImages.map((img, i) => (
            <div key={i} className="relative aspect-[16/10] rounded-lg overflow-hidden border border-border">
              <img
                src={img.startsWith('http') ? img : `/${img}`}
                alt={`Hero ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  const updated = existingImages.filter((_, idx) => idx !== i);
                  updateField('hero', 'images', updated);
                }}
                className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          {heroImageFiles.map((file, i) => (
            <div key={`new-${i}`} className="relative aspect-[16/10] rounded-lg overflow-hidden border border-accent/40">
              <img
                src={heroPreviewUrls[i]}
                alt={`New ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1.5 left-1.5 text-[10px] bg-accent px-1.5 py-0.5 rounded text-bg-primary font-medium">New</span>
              <button
                onClick={() => setHeroImageFiles((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => inputRef.current?.click()}
            className="aspect-[16/10] rounded-lg border-2 border-dashed border-border hover:border-accent/40 flex flex-col items-center justify-center text-text-muted hover:text-accent transition-colors cursor-pointer"
          >
            <Plus className="w-6 h-6 mb-1" />
            <span className="text-xs">Add Image</span>
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleAddImages} className="hidden" />
      </div>
    </div>
  );
}

/* ─── CATEGORY SECTION ─────────────────────────────────── */

function CategorySection({ settings, setSettings }) {
  const cats = settings.categorySection || { heading: 'Shop by Category', categories: [] };

  const updateHeading = (v) => {
    setSettings((prev) => ({
      ...prev,
      categorySection: { ...prev.categorySection, heading: v },
    }));
  };

  const updateCategory = (index, field, value) => {
    setSettings((prev) => {
      const updated = [...(prev.categorySection?.categories || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, categorySection: { ...prev.categorySection, categories: updated } };
    });
  };

  const addCategory = () => {
    setSettings((prev) => ({
      ...prev,
      categorySection: {
        ...prev.categorySection,
        categories: [...(prev.categorySection?.categories || []), { title: '', image: '', link: '' }],
      },
    }));
  };

  const removeCategory = (index) => {
    setSettings((prev) => ({
      ...prev,
      categorySection: {
        ...prev.categorySection,
        categories: prev.categorySection.categories.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Category Grid" description="The 'Shop by Category' section with category cards." />
      <InputField label="Section Heading" value={cats.heading} onChange={updateHeading} />

      <div className="space-y-4">
        {(cats.categories || []).map((cat, i) => (
          <div key={i} className="p-4 rounded-lg bg-bg-hover/50 border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">Category {i + 1}</span>
              <button onClick={() => removeCategory(i)} className="p-1.5 text-danger/70 hover:text-danger cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <InputField label="Title" value={cat.title} onChange={(v) => updateCategory(i, 'title', v)} />
              <InputField label="Link" value={cat.link} onChange={(v) => updateCategory(i, 'link', v)} placeholder="/shop?search=..." />
              <InputField label="Image URL" value={cat.image} onChange={(v) => updateCategory(i, 'image', v)} placeholder="Image URL or path" />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCategory}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Add Category
      </button>
    </div>
  );
}

/* ─── TRUST SECTION ────────────────────────────────────── */

function TrustSectionEditor({ settings, setSettings }) {
  const trust = settings.trustSection || { items: [] };

  const updateItem = (index, field, value) => {
    setSettings((prev) => {
      const updated = [...(prev.trustSection?.items || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, trustSection: { ...prev.trustSection, items: updated } };
    });
  };

  const addItem = () => {
    setSettings((prev) => ({
      ...prev,
      trustSection: {
        ...prev.trustSection,
        items: [...(prev.trustSection?.items || []), { icon: 'Award', title: '', description: '' }],
      },
    }));
  };

  const removeItem = (index) => {
    setSettings((prev) => ({
      ...prev,
      trustSection: {
        ...prev.trustSection,
        items: prev.trustSection.items.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Trust Section" description="Trust badges showing your key selling points." />

      <div className="space-y-4">
        {(trust.items || []).map((item, i) => (
          <div key={i} className="p-4 rounded-lg bg-bg-hover/50 border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">Trust Item {i + 1}</span>
              <button onClick={() => removeItem(i)} className="p-1.5 text-danger/70 hover:text-danger cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <InputField label="Icon Name" value={item.icon} onChange={(v) => updateItem(i, 'icon', v)} hint="e.g. Award, Truck, Sparkles, HeartHandshake" />
              <InputField label="Title" value={item.title} onChange={(v) => updateItem(i, 'title', v)} />
              <InputField label="Description" value={item.description} onChange={(v) => updateItem(i, 'description', v)} />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Add Trust Item
      </button>
    </div>
  );
}

/* ─── PRODUCT GRID SECTION ─────────────────────────────── */

function ProductSectionEditor({ settings, updateField }) {
  const ps = settings.productSection || {};
  return (
    <div className="space-y-6">
      <SectionHeader title="Product Grid" description="The featured products section on the homepage." />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Section Heading"
          value={ps.heading}
          onChange={(v) => updateField('productSection', 'heading', v)}
        />
        <InputField
          label="Number of Products to Show"
          type="number"
          value={ps.showCount}
          onChange={(v) => updateField('productSection', 'showCount', parseInt(v) || 4)}
          hint="How many products to display from your catalog"
        />
      </div>
    </div>
  );
}

/* ─── CUSTOM WIG SECTION ───────────────────────────────── */

function CustomWigSectionEditor({ settings, updateField, setSettings, customWigImageFile, setCustomWigImageFile }) {
  const cw = settings.customWigSection || {};

  const updateFeature = (index, value) => {
    setSettings((prev) => {
      const features = [...(prev.customWigSection?.features || [])];
      features[index] = value;
      return { ...prev, customWigSection: { ...prev.customWigSection, features } };
    });
  };

  const addFeature = () => {
    setSettings((prev) => ({
      ...prev,
      customWigSection: {
        ...prev.customWigSection,
        features: [...(prev.customWigSection?.features || []), ''],
      },
    }));
  };

  const removeFeature = (index) => {
    setSettings((prev) => ({
      ...prev,
      customWigSection: {
        ...prev.customWigSection,
        features: prev.customWigSection.features.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Custom Wig Section" description="The section promoting custom wig orders." />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Heading"
          value={cw.heading}
          onChange={(v) => updateField('customWigSection', 'heading', v)}
        />
        <InputField
          label="Button Text"
          value={cw.buttonText}
          onChange={(v) => updateField('customWigSection', 'buttonText', v)}
        />
      </div>
      <TextareaField
        label="Description"
        value={cw.description}
        onChange={(v) => updateField('customWigSection', 'description', v)}
        rows={3}
      />
      <ImageUpload
        label="Section Image"
        currentImage={cw.image}
        onFileSelect={setCustomWigImageFile}
      />

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-3">Feature Checklist</label>
        <div className="space-y-2">
          {(cw.features || []).map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(i, e.target.value)}
                className="flex-1 px-4 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
                placeholder="Feature description..."
              />
              <button onClick={() => removeFeature(i)} className="p-2 text-danger/70 hover:text-danger cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addFeature}
          className="flex items-center gap-2 mt-3 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>
    </div>
  );
}

/* ─── TESTIMONIALS SECTION ─────────────────────────────── */

function TestimonialsSectionEditor({ settings, setSettings }) {
  const ts = settings.testimonialsSection || { heading: '', testimonials: [] };

  const updateHeading = (v) => {
    setSettings((prev) => ({
      ...prev,
      testimonialsSection: { ...prev.testimonialsSection, heading: v },
    }));
  };

  const updateTestimonial = (index, field, value) => {
    setSettings((prev) => {
      const updated = [...(prev.testimonialsSection?.testimonials || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, testimonialsSection: { ...prev.testimonialsSection, testimonials: updated } };
    });
  };

  const addTestimonial = () => {
    setSettings((prev) => ({
      ...prev,
      testimonialsSection: {
        ...prev.testimonialsSection,
        testimonials: [
          ...(prev.testimonialsSection?.testimonials || []),
          { text: '', author: '', location: '', rating: 5, avatar: '' },
        ],
      },
    }));
  };

  const removeTestimonial = (index) => {
    setSettings((prev) => ({
      ...prev,
      testimonialsSection: {
        ...prev.testimonialsSection,
        testimonials: prev.testimonialsSection.testimonials.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Testimonials" description="Customer reviews displayed on the homepage." />
      <InputField label="Section Heading" value={ts.heading} onChange={updateHeading} />

      <div className="space-y-4">
        {(ts.testimonials || []).map((t, i) => (
          <div key={i} className="p-4 rounded-lg bg-bg-hover/50 border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">Testimonial {i + 1}</span>
              <button onClick={() => removeTestimonial(i)} className="p-1.5 text-danger/70 hover:text-danger cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <TextareaField
              label="Review Text"
              value={t.text}
              onChange={(v) => updateTestimonial(i, 'text', v)}
              rows={2}
            />
            <div className="grid md:grid-cols-3 gap-3">
              <InputField label="Author Name" value={t.author} onChange={(v) => updateTestimonial(i, 'author', v)} />
              <InputField label="Location" value={t.location} onChange={(v) => updateTestimonial(i, 'location', v)} />
              <InputField label="Rating (1-5)" type="number" value={t.rating} onChange={(v) => updateTestimonial(i, 'rating', parseInt(v) || 5)} />
            </div>
            <InputField label="Avatar URL" value={t.avatar} onChange={(v) => updateTestimonial(i, 'avatar', v)} hint="URL to avatar image" />
          </div>
        ))}
      </div>

      <button
        onClick={addTestimonial}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Add Testimonial
      </button>
    </div>
  );
}

/* ─── STORE VISIT SECTION ──────────────────────────────── */

function StoreVisitSectionEditor({ settings, updateField, storeVisitImageFile, setStoreVisitImageFile }) {
  const sv = settings.storeVisitSection || {};
  return (
    <div className="space-y-6">
      <SectionHeader title="Store Visit Section" description="The 'Visit Our Store' section with address, hours, and contact info." />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="Heading" value={sv.heading} onChange={(v) => updateField('storeVisitSection', 'heading', v)} />
        <InputField label="Phone" value={sv.phone} onChange={(v) => updateField('storeVisitSection', 'phone', v)} />
      </div>
      <TextareaField
        label="Description"
        value={sv.description}
        onChange={(v) => updateField('storeVisitSection', 'description', v)}
        rows={2}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <TextareaField label="Address" value={sv.address} onChange={(v) => updateField('storeVisitSection', 'address', v)} rows={2} />
        <InputField label="Hours" value={sv.hours} onChange={(v) => updateField('storeVisitSection', 'hours', v)} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="Button 1 Text" value={sv.buttonText1} onChange={(v) => updateField('storeVisitSection', 'buttonText1', v)} />
        <InputField label="Button 2 Text" value={sv.buttonText2} onChange={(v) => updateField('storeVisitSection', 'buttonText2', v)} />
      </div>
      <ImageUpload
        label="Store Image"
        currentImage={sv.image}
        onFileSelect={setStoreVisitImageFile}
      />
    </div>
  );
}

/* ─── NEWSLETTER SECTION ───────────────────────────────── */

function NewsletterSectionEditor({ settings, updateField }) {
  const nl = settings.newsletterSection || {};
  return (
    <div className="space-y-6">
      <SectionHeader title="Newsletter Section" description="The email signup section on the homepage." />
      <InputField label="Heading" value={nl.heading} onChange={(v) => updateField('newsletterSection', 'heading', v)} />
      <TextareaField label="Description" value={nl.description} onChange={(v) => updateField('newsletterSection', 'description', v)} rows={2} />
      <InputField label="Button Text" value={nl.buttonText} onChange={(v) => updateField('newsletterSection', 'buttonText', v)} />
    </div>
  );
}

/* ─── FOOTER SECTION ───────────────────────────────────── */

function FooterSectionEditor({ settings, updateField, updateNestedField }) {
  const ft = settings.footer || {};
  return (
    <div className="space-y-6">
      <SectionHeader title="Footer" description="Footer content including branding, copyright, and social links." />
      <TextareaField
        label="Brand Description"
        value={ft.brandDescription}
        onChange={(v) => updateField('footer', 'brandDescription', v)}
        rows={2}
      />
      <InputField
        label="Copyright Text"
        value={ft.copyright}
        onChange={(v) => updateField('footer', 'copyright', v)}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Instagram URL"
          value={ft.socialLinks?.instagram}
          onChange={(v) => updateNestedField('footer', 'socialLinks', 'instagram', v)}
          placeholder="https://instagram.com/..."
        />
        <InputField
          label="Facebook URL"
          value={ft.socialLinks?.facebook}
          onChange={(v) => updateNestedField('footer', 'socialLinks', 'facebook', v)}
          placeholder="https://facebook.com/..."
        />
        <InputField
          label="YouTube URL"
          value={ft.socialLinks?.youtube}
          onChange={(v) => updateNestedField('footer', 'socialLinks', 'youtube', v)}
          placeholder="https://youtube.com/..."
        />
        <InputField
          label="Twitter / X URL"
          value={ft.socialLinks?.twitter}
          onChange={(v) => updateNestedField('footer', 'socialLinks', 'twitter', v)}
          placeholder="https://twitter.com/..."
        />
      </div>
    </div>
  );
}

/* ─── PAGE SEO SECTION ─────────────────────────────────── */

const PAGE_SEO_PAGES = [
  { key: 'shop', label: 'Shop / Catalog', path: '/shop' },
  { key: 'blog', label: 'Blog', path: '/blog' },
  { key: 'contact', label: 'Contact Us', path: '/contact' },
];

function PageSeoSection({ settings, setSettings }) {
  const pageSeo = settings.pageSeo || {};
  const [expandedPage, setExpandedPage] = useState(PAGE_SEO_PAGES[0].key);

  const updatePageSeo = (pageKey, field, value) => {
    setSettings((prev) => ({
      ...prev,
      pageSeo: {
        ...prev.pageSeo,
        [pageKey]: {
          ...prev.pageSeo?.[pageKey],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Per-Page SEO"
        description="Set unique title, meta description, and keywords for each page. Homepage SEO is managed in the Global SEO tab."
      />

      <div className="space-y-3">
        {PAGE_SEO_PAGES.map((page) => {
          const seo = pageSeo[page.key] || {};
          const isOpen = expandedPage === page.key;

          return (
            <div key={page.key} className="rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setExpandedPage(isOpen ? null : page.key)}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-bg-hover/30 hover:bg-bg-hover/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-accent" />
                  <span className="font-medium text-text-primary">{page.label}</span>
                  <span className="text-xs text-text-muted bg-bg-input px-2 py-0.5 rounded">{page.path}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
              </button>

              {isOpen && (
                <div className="p-5 space-y-4 border-t border-border/50">
                  <InputField
                    label="Page Title"
                    value={seo.title}
                    onChange={(v) => updatePageSeo(page.key, 'title', v)}
                    placeholder={`${page.label} | Divas Lace Wigs`}
                    hint="Appears in browser tab and search results"
                  />
                  <TextareaField
                    label="Meta Description"
                    value={seo.metaDescription}
                    onChange={(v) => updatePageSeo(page.key, 'metaDescription', v)}
                    placeholder="Describe this page in 150-160 characters..."
                    rows={2}
                    hint="Shown below the title in search engine results"
                  />
                  <InputField
                    label="Meta Keywords"
                    value={seo.metaKeywords}
                    onChange={(v) => updatePageSeo(page.key, 'metaKeywords', v)}
                    placeholder="keyword1, keyword2, keyword3..."
                    hint="Comma-separated keywords for this page"
                  />
                  <InputField
                    label="OG Image URL"
                    value={seo.ogImage}
                    onChange={(v) => updatePageSeo(page.key, 'ogImage', v)}
                    placeholder="https://... or uploads/settings/..."
                    hint="Social sharing image for this page (1200×630px recommended)"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── NAVIGATION SECTION ───────────────────────────────── */

const defaultNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Stock Products', href: '/shop?category=Stock+Product' },
  { label: 'Custom Wigs', href: '/shop?category=Custom+Wigs' },
  { label: 'Custom Hair Products', href: '#custom-hair' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

const defaultFooterGroups = [
  {
    title: 'Shop',
    links: [
      { label: 'Lace Front Wigs', href: '/shop?search=Lace+Front' },
      { label: 'Full Lace Wigs', href: '/shop?search=Full+Lace' },
      { label: 'Closures & Frontals', href: '/shop?search=Closure' },
      { label: 'Hair Bundles', href: '/shop?search=Bundles' },
      { label: 'Accessories', href: '/shop?search=Accessories' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '#' },
      { label: 'Returns & Exchanges', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Size Guide', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Our Story', href: '#' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '#' },
    ],
  },
];

function NavigationSection({ settings, setSettings }) {
  const navLinks = settings.navLinks?.length > 0 ? settings.navLinks : defaultNavLinks;
  const footerGroups = settings.footerLinkGroups?.length > 0 ? settings.footerLinkGroups : defaultFooterGroups;

  // ─── NAVBAR ───
  const updateNavLink = (index, field, value) => {
    setSettings((prev) => {
      const links = [...(prev.navLinks?.length > 0 ? prev.navLinks : defaultNavLinks)];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, navLinks: links };
    });
  };

  const addNavLink = () => {
    setSettings((prev) => ({
      ...prev,
      navLinks: [...(prev.navLinks?.length > 0 ? prev.navLinks : defaultNavLinks), { label: '', href: '/', order: 99 }],
    }));
  };

  const removeNavLink = (index) => {
    setSettings((prev) => ({
      ...prev,
      navLinks: (prev.navLinks?.length > 0 ? prev.navLinks : defaultNavLinks).filter((_, i) => i !== index),
    }));
  };

  const moveNavLink = (index, direction) => {
    setSettings((prev) => {
      const links = [...(prev.navLinks?.length > 0 ? prev.navLinks : defaultNavLinks)];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= links.length) return prev;
      [links[index], links[newIndex]] = [links[newIndex], links[index]];
      return { ...prev, navLinks: links };
    });
  };

  // ─── FOOTER GROUPS ───
  const updateGroupTitle = (gi, value) => {
    setSettings((prev) => {
      const groups = [...(prev.footerLinkGroups?.length > 0 ? prev.footerLinkGroups : defaultFooterGroups)];
      groups[gi] = { ...groups[gi], title: value };
      return { ...prev, footerLinkGroups: groups };
    });
  };

  const updateGroupLink = (gi, li, field, value) => {
    setSettings((prev) => {
      const groups = JSON.parse(JSON.stringify(prev.footerLinkGroups?.length > 0 ? prev.footerLinkGroups : defaultFooterGroups));
      groups[gi].links[li] = { ...groups[gi].links[li], [field]: value };
      return { ...prev, footerLinkGroups: groups };
    });
  };

  const addGroupLink = (gi) => {
    setSettings((prev) => {
      const groups = JSON.parse(JSON.stringify(prev.footerLinkGroups?.length > 0 ? prev.footerLinkGroups : defaultFooterGroups));
      groups[gi].links.push({ label: '', href: '#' });
      return { ...prev, footerLinkGroups: groups };
    });
  };

  const removeGroupLink = (gi, li) => {
    setSettings((prev) => {
      const groups = JSON.parse(JSON.stringify(prev.footerLinkGroups?.length > 0 ? prev.footerLinkGroups : defaultFooterGroups));
      groups[gi].links = groups[gi].links.filter((_, i) => i !== li);
      return { ...prev, footerLinkGroups: groups };
    });
  };

  const addFooterGroup = () => {
    setSettings((prev) => ({
      ...prev,
      footerLinkGroups: [
        ...(prev.footerLinkGroups?.length > 0 ? prev.footerLinkGroups : defaultFooterGroups),
        { title: 'New Group', links: [{ label: '', href: '#' }] },
      ],
    }));
  };

  const removeFooterGroup = (gi) => {
    setSettings((prev) => ({
      ...prev,
      footerLinkGroups: (prev.footerLinkGroups?.length > 0 ? prev.footerLinkGroups : defaultFooterGroups).filter((_, i) => i !== gi),
    }));
  };

  return (
    <div className="space-y-8">
      {/* ─── HEADER NAV LINKS ─── */}
      <div className="space-y-5">
        <SectionHeader
          title="Header Navigation"
          description="Links displayed in the main navigation bar. Drag to reorder."
        />

        <div className="space-y-2">
          {navLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-bg-hover/30 border border-border/50">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveNavLink(i, -1)}
                  disabled={i === 0}
                  className="p-0.5 text-text-muted hover:text-accent disabled:opacity-30 cursor-pointer disabled:cursor-default"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveNavLink(i, 1)}
                  disabled={i === navLinks.length - 1}
                  className="p-0.5 text-text-muted hover:text-accent disabled:opacity-30 cursor-pointer disabled:cursor-default"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={link.label || ''}
                onChange={(e) => updateNavLink(i, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1 px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus"
              />
              <input
                type="text"
                value={link.href || ''}
                onChange={(e) => updateNavLink(i, 'href', e.target.value)}
                placeholder="/path or URL"
                className="flex-1 px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus"
              />
              <button onClick={() => removeNavLink(i)} className="p-2 text-danger/70 hover:text-danger cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addNavLink}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Nav Link
        </button>
      </div>

      <div className="border-t border-border/50" />

      {/* ─── FOOTER LINK GROUPS ─── */}
      <div className="space-y-5">
        <SectionHeader
          title="Footer Link Groups"
          description="Organize footer links into groups (e.g., Shop, Support, Company). These replace the hardcoded footer columns."
        />

        <div className="space-y-6">
          {footerGroups.map((group, gi) => (
            <div key={gi} className="p-5 rounded-lg bg-bg-hover/30 border border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={group.title || ''}
                  onChange={(e) => updateGroupTitle(gi, e.target.value)}
                  placeholder="Group Title"
                  className="px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary font-medium text-sm focus:outline-none focus:border-border-focus"
                />
                <button onClick={() => removeFooterGroup(gi)} className="p-1.5 text-danger/70 hover:text-danger cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 pl-2">
                {(group.links || []).map((link, li) => (
                  <div key={li} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => updateGroupLink(gi, li, 'label', e.target.value)}
                      placeholder="Link label"
                      className="flex-1 px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus"
                    />
                    <input
                      type="text"
                      value={link.href || ''}
                      onChange={(e) => updateGroupLink(gi, li, 'href', e.target.value)}
                      placeholder="/path or URL"
                      className="flex-1 px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus"
                    />
                    <button onClick={() => removeGroupLink(gi, li)} className="p-2 text-danger/70 hover:text-danger cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addGroupLink(gi)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addFooterGroup}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Footer Group
        </button>
      </div>
    </div>
  );
}

/* ─── EMAIL CONFIGURATION SECTION ──────────────────────── */

const SMTP_PRESETS = [
  { label: 'Yahoo Mail', host: 'smtp.mail.yahoo.com', port: 465, secure: true },
  { label: 'Gmail', host: 'smtp.gmail.com', port: 465, secure: true },
  { label: 'Outlook / Hotmail', host: 'smtp-mail.outlook.com', port: 587, secure: false },
  { label: 'Custom', host: '', port: 465, secure: true },
];

function EmailSection({ settings, setSettings }) {
  const [showPassword, setShowPassword] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const cfg = settings?.emailConfig || {};

  const update = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      emailConfig: { ...prev.emailConfig, [key]: value },
    }));
  };

  const applyPreset = (preset) => {
    setSettings((prev) => ({
      ...prev,
      emailConfig: {
        ...prev.emailConfig,
        smtpHost: preset.host,
        smtpPort: preset.port,
        smtpSecure: preset.secure,
      },
    }));
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!cfg.smtpUser || !cfg.smtpPass) {
      toast.error('Please fill in SMTP username and password first');
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const { data } = await testEmailConnection({
        smtpHost: cfg.smtpHost,
        smtpPort: cfg.smtpPort,
        smtpSecure: cfg.smtpSecure,
        smtpUser: cfg.smtpUser,
        smtpPass: cfg.smtpPass,
      });
      setTestResult(data);
      if (data.success) {
        toast.success('SMTP connection test passed!');
      } else {
        toast.error(data.message || 'Connection failed');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Connection test failed';
      setTestResult({ success: false, message: msg });
      toast.error(msg);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Enable / Disable */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary/50 border border-border">
        <div>
          <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Email Notifications
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            When enabled, order confirmations and status updates will be sent via email.
          </p>
        </div>
        <button
          onClick={() => update('enabled', !cfg.enabled)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
            cfg.enabled ? 'bg-accent' : 'bg-border'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              cfg.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* SMTP Presets */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">Quick Setup — Email Provider</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SMTP_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className={`px-3 py-2 text-sm rounded-lg border transition-all cursor-pointer ${
                cfg.smtpHost === preset.host
                  ? 'border-accent bg-accent/10 text-accent font-medium'
                  : 'border-border text-text-secondary hover:border-accent/40 hover:bg-accent/5'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* SMTP Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">SMTP Host</label>
          <input
            type="text"
            value={cfg.smtpHost || ''}
            onChange={(e) => update('smtpHost', e.target.value)}
            placeholder="smtp.mail.yahoo.com"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-text-primary text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Port</label>
            <input
              type="number"
              value={cfg.smtpPort || 465}
              onChange={(e) => update('smtpPort', Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-text-primary text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Secure (SSL)</label>
            <button
              onClick={() => update('smtpSecure', !cfg.smtpSecure)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                cfg.smtpSecure
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-surface-secondary/50 border-border text-text-secondary'
              }`}
            >
              {cfg.smtpSecure ? 'Yes (SSL/TLS)' : 'No (STARTTLS)'}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">SMTP Username / Email</label>
          <input
            type="email"
            value={cfg.smtpUser || ''}
            onChange={(e) => update('smtpUser', e.target.value)}
            placeholder="divaslacewigs@yahoo.com"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-text-primary text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">SMTP Password / App Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={cfg.smtpPass || ''}
              onChange={(e) => update('smtpPass', e.target.value)}
              placeholder="Enter app-specific password"
              className="w-full px-4 py-2.5 pr-12 rounded-xl bg-surface-secondary/50 border border-border text-text-primary text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-text-secondary mt-1.5">
            For Yahoo/Gmail, use an <span className="font-medium text-accent">App Password</span>, not your regular password.
          </p>
        </div>
      </div>

      {/* From / Admin Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">From Name</label>
          <input
            type="text"
            value={cfg.fromName || ''}
            onChange={(e) => update('fromName', e.target.value)}
            placeholder="Divas Lace Wigs"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-text-primary text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">From Email</label>
          <input
            type="email"
            value={cfg.fromEmail || ''}
            onChange={(e) => update('fromEmail', e.target.value)}
            placeholder="divaslacewigs@yahoo.com"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-text-primary text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Admin Notification Email</label>
          <input
            type="email"
            value={cfg.adminEmail || ''}
            onChange={(e) => update('adminEmail', e.target.value)}
            placeholder="divaslacewigs@yahoo.com"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-text-primary text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
          />
          <p className="text-xs text-text-secondary mt-1.5">
            New order notifications will be sent to this address.
          </p>
        </div>
      </div>

      {/* Test Connection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-surface-secondary/30 border border-border">
        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          {testing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
        {testResult && (
          <div className={`flex items-center gap-2 text-sm font-medium ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
            {testResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {testResult.success ? 'Connection successful!' : testResult.message}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
        <h4 className="text-sm font-semibold text-indigo-300 mb-2">📧 How Email Notifications Work</h4>
        <ul className="text-xs text-text-secondary space-y-1.5 leading-relaxed">
          <li>• When a customer places an order → admin gets notified + customer gets a confirmation email.</li>
          <li>• When you change an order's status → the customer receives a status update email.</li>
          <li>• For Yahoo Mail, generate an App Password at: <span className="text-accent">Account Security → Generate app password</span></li>
          <li>• For Gmail, enable 2FA and create an App Password in Google Account settings.</li>
          <li>• All email settings are saved when you click the "Save Changes" button at the top.</li>
        </ul>
      </div>
    </div>
  );
}

/* ─── MAIL TEMPLATES SECTION ───────────────────────────── */

const TEMPLATE_SECTIONS = [
  {
    key: 'newOrderAdmin',
    title: '🛒 New Order — Admin Notification',
    description: 'Sent to the admin email when a new order is placed.',
    fields: [
      { key: 'subject', label: 'Email Subject', type: 'input' },
      { key: 'heading', label: 'Heading', type: 'input' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
    ],
  },
  {
    key: 'orderConfirmation',
    title: '💜 Order Confirmation — Customer',
    description: 'Sent to the customer after they place an order.',
    fields: [
      { key: 'subject', label: 'Email Subject', type: 'input' },
      { key: 'heading', label: 'Heading', type: 'input' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
      { key: 'footerNote', label: 'Footer Note', type: 'textarea' },
    ],
  },
  {
    key: 'statusPending',
    title: '⏳ Status: Pending',
    description: 'Sent when order status changes to Pending.',
    fields: [
      { key: 'subject', label: 'Email Subject', type: 'input' },
      { key: 'heading', label: 'Heading', type: 'input' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
      { key: 'statusMessage', label: 'Status Message', type: 'textarea' },
    ],
  },
  {
    key: 'statusConfirmed',
    title: '✅ Status: Confirmed',
    description: 'Sent when order status changes to Confirmed.',
    fields: [
      { key: 'subject', label: 'Email Subject', type: 'input' },
      { key: 'heading', label: 'Heading', type: 'input' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
      { key: 'statusMessage', label: 'Status Message', type: 'textarea' },
    ],
  },
  {
    key: 'statusProcessing',
    title: '⚙️ Status: Processing',
    description: 'Sent when order status changes to Processing.',
    fields: [
      { key: 'subject', label: 'Email Subject', type: 'input' },
      { key: 'heading', label: 'Heading', type: 'input' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
      { key: 'statusMessage', label: 'Status Message', type: 'textarea' },
    ],
  },
  {
    key: 'statusShipped',
    title: '📦 Status: Shipped',
    description: 'Sent when order status changes to Shipped.',
    fields: [
      { key: 'subject', label: 'Email Subject', type: 'input' },
      { key: 'heading', label: 'Heading', type: 'input' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
      { key: 'statusMessage', label: 'Status Message', type: 'textarea' },
    ],
  },
  {
    key: 'statusDelivered',
    title: '🎉 Status: Delivered',
    description: 'Sent when order status changes to Delivered.',
    fields: [
      { key: 'subject', label: 'Email Subject', type: 'input' },
      { key: 'heading', label: 'Heading', type: 'input' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
      { key: 'statusMessage', label: 'Status Message', type: 'textarea' },
    ],
  },
  {
    key: 'statusCancelled',
    title: '❌ Status: Cancelled',
    description: 'Sent when order status changes to Cancelled.',
    fields: [
      { key: 'subject', label: 'Email Subject', type: 'input' },
      { key: 'heading', label: 'Heading', type: 'input' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
      { key: 'statusMessage', label: 'Status Message', type: 'textarea' },
    ],
  },
];

const AVAILABLE_VARIABLES = [
  { var: '{{customerName}}', desc: 'Customer full name' },
  { var: '{{customerEmail}}', desc: 'Customer email address' },
  { var: '{{customerPhone}}', desc: 'Customer phone number' },
  { var: '{{customerAddress}}', desc: 'Customer address' },
  { var: '{{orderId}}', desc: 'Order ID (last 8 chars)' },
  { var: '{{productName}}', desc: 'Product name' },
  { var: '{{totalPrice}}', desc: 'Total price (formatted)' },
  { var: '{{basePrice}}', desc: 'Base price (formatted)' },
  { var: '{{orderDate}}', desc: 'Order date (formatted)' },
  { var: '{{notes}}', desc: 'Customer order notes' },
  { var: '{{statusLabel}}', desc: 'Current status label (status templates only)' },
];

function MailTemplatesSection({ settings, setSettings }) {
  const [expandedSections, setExpandedSections] = useState({});
  const [showVariableRef, setShowVariableRef] = useState(false);

  const templates = settings.emailTemplates || {};

  const updateTemplate = (templateKey, field, value) => {
    setSettings((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        [templateKey]: {
          ...prev.emailTemplates?.[templateKey],
          [field]: value,
        },
      },
    }));
  };

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    const all = {};
    TEMPLATE_SECTIONS.forEach((s) => (all[s.key] = true));
    setExpandedSections(all);
  };

  const collapseAll = () => setExpandedSections({});

  const resetTemplate = (templateKey) => {
    setSettings((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        [templateKey]: {},
      },
    }));
    toast.success('Template reset to defaults — save to apply.');
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Email Templates</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            Customize the text content sent in each email scenario. Leave blank to use defaults.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-text-secondary hover:border-accent/40 hover:text-accent transition-all cursor-pointer"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-text-secondary hover:border-accent/40 hover:text-accent transition-all cursor-pointer"
          >
            Collapse All
          </button>
          <button
            onClick={() => setShowVariableRef(!showVariableRef)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
              showVariableRef
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-text-secondary hover:border-accent/40 hover:text-accent'
            }`}
          >
            {showVariableRef ? 'Hide' : 'Show'} Variables
          </button>
        </div>
      </div>

      {/* Variable Reference Panel */}
      {showVariableRef && (
        <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
          <h4 className="text-sm font-semibold text-indigo-300 mb-3">📝 Available Template Variables</h4>
          <p className="text-xs text-text-secondary mb-3">
            Use these placeholders in any template field. They will be replaced with actual order data when the email is sent.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {AVAILABLE_VARIABLES.map((v) => (
              <div
                key={v.var}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-secondary/50 border border-border"
              >
                <code className="text-xs font-mono text-accent whitespace-nowrap">{v.var}</code>
                <span className="text-xs text-text-secondary">{v.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Accordions */}
      <div className="space-y-3">
        {TEMPLATE_SECTIONS.map((section) => {
          const isExpanded = expandedSections[section.key];
          const tmpl = templates[section.key] || {};
          const hasCustomValues = section.fields.some((f) => tmpl[f.key]?.trim());

          return (
            <div
              key={section.key}
              className={`rounded-xl border transition-all ${
                isExpanded ? 'border-accent/30 bg-surface-secondary/20' : 'border-border hover:border-accent/20'
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{section.title}</span>
                  {hasCustomValues && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                      Customized
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-4 border-t border-border/50 pt-4">
                  <p className="text-xs text-text-secondary">{section.description}</p>

                  {section.fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={tmpl[field.key] || ''}
                          onChange={(e) => updateTemplate(section.key, field.key, e.target.value)}
                          placeholder={`Leave blank to use default ${field.label.toLowerCase()}`}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-text-primary text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-y min-h-[80px]"
                        />
                      ) : (
                        <input
                          type="text"
                          value={tmpl[field.key] || ''}
                          onChange={(e) => updateTemplate(section.key, field.key, e.target.value)}
                          placeholder={`Leave blank to use default ${field.label.toLowerCase()}`}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-text-primary text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        />
                      )}
                    </div>
                  ))}

                  {/* Reset to defaults button */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => resetTemplate(section.key)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Reset to Default
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <h4 className="text-sm font-semibold text-amber-300 mb-2">💡 Tips</h4>
        <ul className="text-xs text-text-secondary space-y-1.5 leading-relaxed">
          <li>• Leave any field blank to keep its default value.</li>
          <li>• Use <code className="text-accent text-[11px]">{'{{variableName}}'}</code> to insert dynamic order data.</li>
          <li>• The visual design (colours, layout, branding) stays consistent — you only customise the text content.</li>
          <li>• Click <span className="font-medium text-text-primary">Reset to Default</span> on any template to revert it, then save.</li>
          <li>• Changes apply after clicking the <span className="font-medium text-accent">Save Changes</span> button at the top.</li>
        </ul>
      </div>
    </div>
  );
}