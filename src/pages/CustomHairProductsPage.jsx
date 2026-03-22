import { useEffect, useRef, useState } from 'react';
import {
  getAdminCustomHairProducts,
  createCustomHairProduct,
  updateCustomHairProduct,
  deleteCustomHairProduct,
} from '../services/api';
import {
  Scissors,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Loader2,
  Eye,
  EyeOff,
  ImagePlus,
  Tag,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

const IMAGE_PLACEMENT_OPTIONS = [
  { value: 'before-title', label: 'Before title' },
  { value: 'after-title', label: 'After title' },
  { value: 'after-content', label: 'After description' },
];

const IMAGE_COLUMN_OPTIONS = [1, 2, 3];
const LABEL_POSITION_OPTIONS = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'center', label: 'Center' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
];

const getProductSectionImages = (product) =>
  (product?.sections || []).flatMap((section) =>
    Array.isArray(section?.images) ? section.images.filter((image) => image?.url) : []
  );

const getProductPreviewImage = (product) => {
  const firstSectionImage = getProductSectionImages(product)[0];
  if (firstSectionImage?.url) return firstSectionImage.url;
  return product?.images?.[0] || '';
};

const createEditableSection = (section = {}) => ({
  title: section.title || '',
  content: section.content || '',
  imagePlacement: section.imagePlacement || 'after-title',
  imageColumns: [1, 2, 3].includes(Number(section.imageColumns)) ? Number(section.imageColumns) : 2,
  existingImages: Array.isArray(section.images)
    ? section.images
        .filter((image) => image?.url)
        .map((image) => ({
          url: image.url,
          alt: image.alt || '',
          label: image.label || '',
          labelPosition: image.labelPosition || 'bottom-center',
          showLabel: Boolean(image.showLabel),
          fit: image.fit || 'contain',
        }))
    : [],
  newImages: [],
});

export default function CustomHairProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAdminCustomHairProducts();
      setProducts(res.data.data || []);
    } catch {
      toast.error('Failed to load custom hair products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Deactivate "${name}"? It will be hidden from the storefront.`)) return;
    try {
      await deleteCustomHairProduct(id);
      toast.success('Product deactivated');
      fetchProducts();
    } catch {
      toast.error('Failed to deactivate product');
    }
  };

  const handleReactivate = async (id) => {
    try {
      const formData = new FormData();
      formData.append('isActive', 'true');
      await updateCustomHairProduct(id, formData);
      toast.success('Product reactivated');
      fetchProducts();
    } catch {
      toast.error('Failed to reactivate product');
    }
  };

  const handleSave = async (data) => {
    try {
      if (editProduct) {
        await updateCustomHairProduct(editProduct._id, data);
        toast.success('Product updated');
      } else {
        await createCustomHairProduct(data);
        toast.success('Product created');
      }
      setShowModal(false);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
      throw err;
    }
  };

  const openCreate = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-text-primary"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Custom Hair Products
          </h1>
          <p className="text-text-secondary mt-1">Manage your custom hair product catalog</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-bg-primary font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search custom hair products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted glass-card">
          <Scissors className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-lg">No custom hair products found</p>
          <button
            onClick={openCreate}
            className="mt-4 text-accent hover:text-accent-hover text-sm font-medium cursor-pointer"
          >
            Create your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
          {filteredProducts.map((product) => (
            <CustomHairCard
              key={product._id}
              product={product}
              onEdit={() => openEdit(product)}
              onDelete={() => handleDelete(product._id, product.name)}
              onReactivate={() => handleReactivate(product._id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CustomHairFormModal
          product={editProduct}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditProduct(null);
          }}
        />
      )}
    </div>
  );
}

function CustomHairCard({ product, onEdit, onDelete, onReactivate }) {
  const thumb = getProductPreviewImage(product);
  const sectionImageCount = getProductSectionImages(product).length;

  return (
    <div
      className={`glass-card p-0 overflow-hidden hover:border-border-focus/30 transition-all duration-200 ${
        !product.isActive ? 'opacity-60' : ''
      }`}
    >
      <div className="h-40 bg-bg-hover relative">
        {thumb ? (
          <img src={thumb} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <Scissors className="w-8 h-8 opacity-40" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          {!product.isActive ? (
            <button
              onClick={onReactivate}
              className="p-1.5 rounded-lg bg-bg-primary/70 hover:bg-success/20 text-text-muted hover:text-success transition-colors cursor-pointer"
              title="Reactivate"
            >
              <Eye className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg bg-bg-primary/70 hover:bg-danger/20 text-text-muted hover:text-danger transition-colors cursor-pointer"
              title="Deactivate"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg bg-bg-primary/70 hover:bg-accent/20 text-text-muted hover:text-accent transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-text-primary truncate">{product.name}</h3>
        <p className="text-xs text-text-muted mb-2">{product.slug}</p>
        {product.description && (
          <p className="text-sm text-text-secondary line-clamp-2 mb-3">{product.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>{sectionImageCount} section images</span>
          <span>•</span>
          <span>{product.sections?.length || 0} sections</span>
          <span>•</span>
          <span>Order: {product.sortOrder}</span>
          <span>•</span>
          <span className={product.isActive ? 'text-success' : 'text-danger'}>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}

function CustomHairFormModal({ product, onSave, onClose }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    detailText: product?.detailText || '',
    contactPhone: product?.contactPhone || '',
    contactEmail: product?.contactEmail || '',
    sortOrder: product?.sortOrder || 0,
  });
  const [sections, setSections] = useState(
    product?.sections?.length > 0 ? product.sections.map(createEditableSection) : []
  );
  const previewsRef = useRef([]);

  useEffect(() => {
    previewsRef.current = sections.flatMap((section) =>
      section.newImages.map((image) => image.preview).filter(Boolean)
    );
  }, [sections]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleNameChange = (val) => {
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: product ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  const updateSection = (sectionIndex, updater) => {
    setSections((prev) =>
      prev.map((section, index) => {
        if (index !== sectionIndex) return section;
        return typeof updater === 'function' ? updater(section) : { ...section, ...updater };
      })
    );
  };

  const addSection = () => {
    setSections((prev) => [...prev, createEditableSection()]);
  };

  const removeSection = (sectionIndex) => {
    setSections((prev) => {
      prev[sectionIndex]?.newImages?.forEach((image) => {
        if (image.preview) URL.revokeObjectURL(image.preview);
      });
      return prev.filter((_, index) => index !== sectionIndex);
    });
  };

  const handleSectionImageChange = (sectionIndex, event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const incoming = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      alt: '',
      label: '',
      labelPosition: 'bottom-center',
      showLabel: false,
      fit: 'contain',
    }));

    updateSection(sectionIndex, (section) => ({
      ...section,
      newImages: [...section.newImages, ...incoming],
    }));

    event.target.value = '';
  };

  const removeExistingSectionImage = (sectionIndex, imageIndex) => {
    updateSection(sectionIndex, (section) => ({
      ...section,
      existingImages: section.existingImages.filter((_, index) => index !== imageIndex),
    }));
  };

  const removeNewSectionImage = (sectionIndex, imageIndex) => {
    updateSection(sectionIndex, (section) => {
      const target = section.newImages[imageIndex];
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return {
        ...section,
        newImages: section.newImages.filter((_, index) => index !== imageIndex),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('slug', form.slug);
      formData.append('description', form.description);
      formData.append('detailText', form.detailText);
      formData.append('contactPhone', form.contactPhone);
      formData.append('contactEmail', form.contactEmail);
      formData.append('sortOrder', form.sortOrder);

      const normalizedSections = [];
      const newSectionImageMap = [];

      sections.forEach((section) => {
        const normalizedSection = {
          title: section.title.trim(),
          content: section.content,
          imagePlacement: section.imagePlacement,
          imageColumns: Number(section.imageColumns) || 2,
          images: section.existingImages
            .filter((image) => image.url)
            .map((image) => ({
              url: image.url,
              alt: image.alt?.trim() || '',
              label: image.label?.trim() || '',
              labelPosition: image.labelPosition || 'bottom-center',
              showLabel: Boolean(image.showLabel),
              fit: image.fit === 'cover' ? 'cover' : 'contain',
            })),
        };

        const hasContent = normalizedSection.title || normalizedSection.content.trim() || normalizedSection.images.length > 0 || section.newImages.length > 0;
        if (!hasContent) return;

        const sectionIndex = normalizedSections.length;
        normalizedSections.push(normalizedSection);

        section.newImages.forEach((image) => {
          formData.append('sectionImages', image.file);
          newSectionImageMap.push({
            sectionIndex,
            alt: image.alt?.trim() || '',
            label: image.label?.trim() || '',
            labelPosition: image.labelPosition || 'bottom-center',
            showLabel: Boolean(image.showLabel),
            fit: image.fit === 'cover' ? 'cover' : 'contain',
          });
        });
      });

      formData.append('sections', JSON.stringify(normalizedSections));
      formData.append('newSectionImageMap', JSON.stringify(newSectionImageMap));

      await onSave(formData);
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-bg-card border border-border rounded-2xl shadow-2xl animate-fade-in mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2
            className="text-xl font-bold text-text-primary"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product ? 'Edit' : 'Create'} Custom Hair Product
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
                placeholder="e.g. Hairline Topper"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Slug *
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
                placeholder="e.g. hairline-topper"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Short Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
              placeholder="Brief description shown in cards..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Detail Text
            </label>
            <textarea
              value={form.detailText}
              onChange={(e) => setForm({ ...form, detailText: e.target.value })}
              rows={4}
              className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors resize-y"
              placeholder="Intro text shown above the sections..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
                placeholder="info@divaslacewigs.com"
              />
            </div>
          </div>

          <div className="w-32">
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Sort Order
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-text-secondary">
                Content Sections
              </label>
              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Section
              </button>
            </div>

            {sections.length === 0 && (
              <p className="text-xs text-text-muted py-2">
                No sections yet. Each section can have its own title, description, multiple images, placement, and column layout.
              </p>
            )}

            <div className="space-y-4">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="p-4 bg-bg-hover/50 border border-border rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
                      placeholder="Section title"
                      className="flex-1 px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors cursor-pointer"
                      title="Remove section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(sectionIndex, { content: e.target.value })}
                    rows={4}
                    placeholder="Section description..."
                    className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors resize-y"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">Image placement</label>
                      <select
                        value={section.imagePlacement}
                        onChange={(e) => updateSection(sectionIndex, { imagePlacement: e.target.value })}
                        className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
                      >
                        {IMAGE_PLACEMENT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">Image columns</label>
                      <select
                        value={section.imageColumns}
                        onChange={(e) => updateSection(sectionIndex, { imageColumns: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
                      >
                        {IMAGE_COLUMN_OPTIONS.map((columns) => (
                          <option key={columns} value={columns}>{columns} column{columns > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Section Images</p>
                        <p className="text-xs text-text-muted">Add one or more images for this section.</p>
                      </div>
                      <label className="inline-flex items-center gap-2 px-3 py-2 bg-bg-input border border-border rounded-lg text-text-secondary text-sm hover:border-border-focus transition-colors cursor-pointer">
                        <ImagePlus className="w-4 h-4" />
                        Add Images
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(event) => handleSectionImageChange(sectionIndex, event)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {(section.existingImages.length > 0 || section.newImages.length > 0) ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {section.existingImages.map((image, imageIndex) => (
                          <div key={`existing-${imageIndex}`} className="space-y-2 rounded-xl border border-border/70 p-2 bg-bg-card/60">
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                              <img src={image.url} alt={image.alt || ''} className="w-full h-full bg-white/70" style={{ objectFit: image.fit || 'contain' }} />
                              <button
                                type="button"
                                onClick={() => removeExistingSectionImage(sectionIndex, imageIndex)}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={image.alt || ''}
                              onChange={(e) => {
                                const alt = e.target.value;
                                updateSection(sectionIndex, (currentSection) => ({
                                  ...currentSection,
                                  existingImages: currentSection.existingImages.map((currentImage, index) =>
                                    index === imageIndex ? { ...currentImage, alt } : currentImage
                                  ),
                                }));
                              }}
                              placeholder="Alt text"
                              className="w-full px-2.5 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-border-focus transition-colors"
                            />
                            <CustomHairSectionImageControls
                              image={image}
                              onChange={(updates) => {
                                updateSection(sectionIndex, (currentSection) => ({
                                  ...currentSection,
                                  existingImages: currentSection.existingImages.map((currentImage, index) =>
                                    index === imageIndex ? { ...currentImage, ...updates } : currentImage
                                  ),
                                }));
                              }}
                            />
                          </div>
                        ))}

                        {section.newImages.map((image, imageIndex) => (
                          <div key={`new-${imageIndex}`} className="space-y-2 rounded-xl border border-accent/30 p-2 bg-bg-card/60">
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-accent/30 group">
                              <img src={image.preview} alt={image.alt || ''} className="w-full h-full bg-white/70" style={{ objectFit: image.fit || 'contain' }} />
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent/80 text-white">
                                NEW
                              </div>
                              <button
                                type="button"
                                onClick={() => removeNewSectionImage(sectionIndex, imageIndex)}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={image.alt || ''}
                              onChange={(e) => {
                                const alt = e.target.value;
                                updateSection(sectionIndex, (currentSection) => ({
                                  ...currentSection,
                                  newImages: currentSection.newImages.map((currentImage, index) =>
                                    index === imageIndex ? { ...currentImage, alt } : currentImage
                                  ),
                                }));
                              }}
                              placeholder="Alt text"
                              className="w-full px-2.5 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-border-focus transition-colors"
                            />
                            <CustomHairSectionImageControls
                              image={image}
                              onChange={(updates) => {
                                updateSection(sectionIndex, (currentSection) => ({
                                  ...currentSection,
                                  newImages: currentSection.newImages.map((currentImage, index) =>
                                    index === imageIndex ? { ...currentImage, ...updates } : currentImage
                                  ),
                                }));
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-text-muted">
                        No images in this section yet.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.name || !form.slug}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-bg-primary font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {product ? 'Update' : 'Create'} Product
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomHairSectionImageControls({ image, onChange }) {
  return (
    <div className="space-y-2 rounded-lg border border-border/60 bg-bg-hover/40 p-2.5">
      <div className="flex items-center gap-1.5">
        <Tag className="h-3 w-3 text-text-muted" />
        <input
          type="text"
          value={image.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Image heading"
          className="w-full px-2.5 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-border-focus transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="relative">
          <select
            value={image.labelPosition || 'bottom-center'}
            onChange={(e) => onChange({ labelPosition: e.target.value })}
            className="w-full appearance-none rounded-lg border border-border bg-bg-input px-2.5 py-2 pr-8 text-xs text-text-primary focus:outline-none focus:border-border-focus transition-colors"
          >
            {LABEL_POSITION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" />
        </div>

        <div className="relative">
          <select
            value={image.fit || 'contain'}
            onChange={(e) => onChange({ fit: e.target.value })}
            className="w-full appearance-none rounded-lg border border-border bg-bg-input px-2.5 py-2 pr-8 text-xs text-text-primary focus:outline-none focus:border-border-focus transition-colors"
          >
            <option value="contain">Fit image</option>
            <option value="cover">Fill image</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange({ showLabel: !image.showLabel })}
        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
          image.showLabel
            ? 'border-accent/30 bg-accent/15 text-accent'
            : 'border-border bg-bg-input text-text-muted hover:border-border-focus'
        }`}
      >
        {image.showLabel ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        {image.showLabel ? 'Heading On' : 'Heading Off'}
      </button>
    </div>
  );
}
