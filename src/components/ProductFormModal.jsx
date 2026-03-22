import { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Save,
  ListFilter,
  Type,
  AlignLeft,
  Upload,
  Image,
  ImagePlus,
  Eye,
  EyeOff,
  Tag,
}  from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const FIELD_TYPES = [
  { value: 'dropdown', label: 'Dropdown', icon: ListFilter },
  { value: 'text', label: 'Text Input', icon: Type },
  { value: 'textarea', label: 'Textarea', icon: AlignLeft },
];

const LABEL_POSITIONS = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'center', label: 'Center' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
];

const defaultMeta = () => ({ alt: '', label: '', labelPosition: 'bottom-center', showLabel: false });

const defaultField = () => ({
  _tempId: Date.now() + Math.random(),
  label: '',
  type: 'dropdown',
  required: false,
  placeholder: '',
  options: [{ label: '', priceAdjustment: 0 }],
});

const defaultOption = () => ({ label: '', priceAdjustment: 0 });

export default function ProductFormModal({ product, categories, onSave, onClose }) {
  const isEdit = !!product;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    category: '',
    basePrice: 0,
    imageUrl: '',
    fields: [],
  });
  const [expandedField, setExpandedField] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  // ── Image state ──
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState('');
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState([]);

  // ── Image metadata state ──
  const [imageMeta, setImageMeta] = useState(defaultMeta());
  const [bannerMeta, setBannerMeta] = useState(defaultMeta());
  const [existingGalleryMeta, setExistingGalleryMeta] = useState([]);
  const [newGalleryMeta, setNewGalleryMeta] = useState([]);

  const productImageRef = useRef(null);
  const bannerImageRef = useRef(null);
  const galleryImageRef = useRef(null);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      // Revoke blob URLs on unmount
      if (productImagePreview?.startsWith('blob:')) URL.revokeObjectURL(productImagePreview);
      if (bannerImagePreview?.startsWith('blob:')) URL.revokeObjectURL(bannerImagePreview);
      galleryPreviews.forEach((url) => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        category: product.category || '',
        basePrice: product.basePrice || 0,
        imageUrl: product.imageUrl || '',
        fields: product.fields?.map((f) => ({
          ...f,
          _tempId: f._id || Date.now() + Math.random(),
          options: f.options?.map((o) => ({ ...o })) || [],
        })) || [],
      });
      if (product.imageUrl) setProductImagePreview(product.imageUrl);
      if (product.bannerUrl) setBannerImagePreview(product.bannerUrl);
      if (product.galleryUrls?.length > 0) {
        setExistingGalleryUrls([...product.galleryUrls]);
      }
      // Load existing image metadata
      if (product.imageMeta) setImageMeta({ ...defaultMeta(), ...product.imageMeta });
      if (product.bannerMeta) setBannerMeta({ ...defaultMeta(), ...product.bannerMeta });
      if (product.galleryMeta?.length > 0) {
        setExistingGalleryMeta(product.galleryMeta.map((m) => ({ ...defaultMeta(), ...m })));
      } else if (product.galleryUrls?.length > 0) {
        setExistingGalleryMeta(product.galleryUrls.map(() => defaultMeta()));
      }
    }
  }, [product]);

  const handleNameChange = (name) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  // ── Image handlers ──
  const handleImageSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'product') {
      // Revoke old blob URL if exists
      if (productImagePreview?.startsWith('blob:')) URL.revokeObjectURL(productImagePreview);
      setProductImageFile(file);
      setProductImagePreview(url);
      setImageMeta(defaultMeta()); // Reset meta when new file selected
    } else if (type === 'banner') {
      // Revoke old blob URL if exists
      if (bannerImagePreview?.startsWith('blob:')) URL.revokeObjectURL(bannerImagePreview);
      setBannerImageFile(file);
      setBannerImagePreview(url);
      setBannerMeta(defaultMeta()); // Reset meta when new file selected
    }
  };

  const handleGallerySelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    setNewGalleryMeta((prev) => [...prev, ...files.map(() => defaultMeta())]);
  };

  const removeGalleryNew = (index) => {
    // Revoke blob URL to free memory
    const urlToRemove = galleryPreviews[index];
    if (urlToRemove?.startsWith('blob:')) URL.revokeObjectURL(urlToRemove);
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryMeta((prev) => prev.filter((_, i) => i !== index));
  };

  const removeGalleryExisting = (index) => {
    setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index));
    setExistingGalleryMeta((prev) => prev.filter((_, i) => i !== index));
  };

  const removeProductImage = () => {
    // Revoke blob URL to free memory
    if (productImagePreview?.startsWith('blob:')) URL.revokeObjectURL(productImagePreview);
    setProductImageFile(null);
    setProductImagePreview('');
    setImageMeta(defaultMeta());
  };

  const removeBannerImage = () => {
    // Revoke blob URL to free memory
    if (bannerImagePreview?.startsWith('blob:')) URL.revokeObjectURL(bannerImagePreview);
    setBannerImageFile(null);
    setBannerImagePreview('');
    setBannerMeta(defaultMeta());
  };

  const updateField = (index, updates) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((f, i) => (i === index ? { ...f, ...updates } : f)),
    }));
  };

  const addField = () => {
    const newField = defaultField();
    setForm((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
    setExpandedField(form.fields.length);
  };

  const removeField = (index) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
    if (expandedField === index) setExpandedField(null);
  };

  const duplicateField = (index) => {
    const original = form.fields[index];
    const copy = {
      ...original,
      _tempId: Date.now() + Math.random(),
      label: `${original.label} (copy)`,
      options: original.options?.map((o) => ({ ...o })) || [],
    };
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields.slice(0, index + 1), copy, ...prev.fields.slice(index + 1)],
    }));
    setExpandedField(index + 1);
  };

  const moveField = (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= form.fields.length) return;
    const newFields = [...form.fields];
    [newFields[fromIndex], newFields[toIndex]] = [newFields[toIndex], newFields[fromIndex]];
    setForm((prev) => ({ ...prev, fields: newFields }));
    setExpandedField(toIndex);
  };

  const addOption = (fieldIndex) => {
    const newFields = [...form.fields];
    newFields[fieldIndex].options = [...(newFields[fieldIndex].options || []), defaultOption()];
    setForm((prev) => ({ ...prev, fields: newFields }));
  };

  const updateOption = (fieldIndex, optIndex, updates) => {
    const newFields = [...form.fields];
    newFields[fieldIndex].options = newFields[fieldIndex].options.map((o, i) =>
      i === optIndex ? { ...o, ...updates } : o
    );
    setForm((prev) => ({ ...prev, fields: newFields }));
  };

  const removeOption = (fieldIndex, optIndex) => {
    const newFields = [...form.fields];
    newFields[fieldIndex].options = newFields[fieldIndex].options.filter((_, i) => i !== optIndex);
    setForm((prev) => ({ ...prev, fields: newFields }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) return;

    const effectiveCategory = showNewCategory ? newCategory.trim() || 'Uncategorized' : form.category || 'Uncategorized';

    const cleanedFields = form.fields.map((f) => {
      const field = {
        label: f.label,
        type: f.type,
        required: f.required,
        placeholder: f.placeholder,
      };
      if (f.type === 'dropdown') {
        field.options = f.options
          .filter((o) => o.label.trim())
          .map((o) => ({
            label: o.label.trim(),
            priceAdjustment: Number(o.priceAdjustment) || 0,
          }));
      } else {
        field.options = [];
      }
      if (f._id) field._id = f._id;
      return field;
    }).filter((f) => f.label.trim());

    // Build FormData for multipart upload
    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('slug', form.slug.trim());
    // Clean empty HTML content from rich text editor
    const cleanDescription = form.description?.replace(/<p><br><\/p>/g, '').trim() || '';
    formData.append('description', cleanDescription);
    formData.append('category', effectiveCategory);
    formData.append('basePrice', Number(form.basePrice) || 0);
    formData.append('fields', JSON.stringify(cleanedFields));

    // Product image
    if (productImageFile) {
      formData.append('productImage', productImageFile);
    } else if (!productImagePreview && isEdit) {
      formData.append('removeProductImage', 'true');
    } else if (!productImageFile && form.imageUrl && !productImagePreview.startsWith('blob:')) {
      formData.append('imageUrl', form.imageUrl);
    }

    // Banner image
    if (bannerImageFile) {
      formData.append('bannerImage', bannerImageFile);
    } else if (!bannerImagePreview && isEdit) {
      formData.append('removeBannerImage', 'true');
    }

    // Gallery images
    galleryFiles.forEach((file) => {
      formData.append('galleryImages', file);
    });
    formData.append('existingGalleryUrls', JSON.stringify(existingGalleryUrls));

    // Image metadata
    formData.append('imageMeta', JSON.stringify(imageMeta));
    formData.append('bannerMeta', JSON.stringify(bannerMeta));
    formData.append('galleryMeta', JSON.stringify([...existingGalleryMeta, ...newGalleryMeta]));

    setSaving(true);
    try {
      await onSave(formData);
    } catch {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8">
      <div className="glass-card w-full max-w-3xl m-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2
            className="text-xl font-bold text-text-primary"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {isEdit ? 'Edit Product' : 'Create Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Custom Wig"
                required
                className="w-full px-3.5 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Slug *
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="custom-wig"
                required
                className="w-full px-3.5 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Description
            </label>
            <RichTextEditor
              value={form.description}
              onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
              placeholder="Product description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Base Price ($) *
              </label>
              <input
                type="number"
                value={form.basePrice}
                onChange={(e) => setForm((prev) => ({ ...prev, basePrice: e.target.value }))}
                min="0"
                step="0.01"
                required
                className="w-full px-3.5 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Category
              </label>
              {showNewCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category..."
                    className="flex-1 px-3.5 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategory('');
                    }}
                    className="px-2 text-text-muted hover:text-text-primary cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm appearance-none cursor-pointer focus:outline-none focus:border-border-focus transition-colors"
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    className="px-2.5 py-2 bg-bg-input border border-border rounded-lg text-text-muted hover:text-accent hover:border-accent/30 transition-colors cursor-pointer"
                    title="New category"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================
              IMAGE UPLOADS
              ============================================================ */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              Product Images
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Upload product image, banner, and gallery photos. Supported: JPEG, PNG, WebP, GIF (max 10MB each).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Image */}
              <div>
                <ImageUploadBox
                  label="Product Image"
                  sublabel="Main product photo (square or portrait)"
                  preview={productImagePreview}
                  onSelect={() => productImageRef.current?.click()}
                  onRemove={removeProductImage}
                  icon={<Image className="w-6 h-6" />}
                />
                {productImagePreview && (
                  <ImageMetaControls meta={imageMeta} onChange={setImageMeta} />
                )}
              </div>
              <input
                ref={productImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageSelect(e, 'product')}
              />

              {/* Banner Image */}
              <div>
                <ImageUploadBox
                  label="Banner Image"
                  sublabel="Wide banner for product page header"
                  preview={bannerImagePreview}
                  onSelect={() => bannerImageRef.current?.click()}
                  onRemove={removeBannerImage}
                  icon={<Eye className="w-6 h-6" />}
                />
                {bannerImagePreview && (
                  <ImageMetaControls meta={bannerMeta} onChange={setBannerMeta} />
                )}
              </div>
              <input
                ref={bannerImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageSelect(e, 'banner')}
              />
            </div>

            {/* Gallery Images */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    Gallery Images
                  </label>
                  <p className="text-xs text-text-muted">
                    Up to 10 images for the product gallery
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => galleryImageRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-accent/15 text-accent rounded-lg text-sm font-medium hover:bg-accent/25 transition-colors cursor-pointer"
                >
                  <ImagePlus className="w-4 h-4" />
                  Add Photos
                </button>
                <input
                  ref={galleryImageRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGallerySelect}
                />
              </div>

              {(existingGalleryUrls.length > 0 || galleryPreviews.length > 0) ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  {existingGalleryUrls.map((url, i) => (
                    <div key={`existing-${i}`} className="space-y-2">
                      <div className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                        <img
                          src={url}
                          alt={`Gallery ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryExisting(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <ImageMetaControls
                        meta={existingGalleryMeta[i] || defaultMeta()}
                        onChange={(m) => setExistingGalleryMeta((prev) => {
                          const updated = [...prev];
                          while (updated.length <= i) updated.push(defaultMeta());
                          updated[i] = m;
                          return updated;
                        })}
                        compact
                      />
                    </div>
                  ))}
                  {galleryPreviews.map((url, i) => (
                    <div key={`new-${i}`} className="space-y-2">
                      <div className="relative group aspect-square rounded-lg overflow-hidden border border-accent/30">
                        <img
                          src={url}
                          alt={`New ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent/80 text-white">
                          NEW
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGalleryNew(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <ImageMetaControls
                        meta={newGalleryMeta[i] || defaultMeta()}
                        onChange={(m) => setNewGalleryMeta((prev) => {
                          const updated = [...prev];
                          while (updated.length <= i) updated.push(defaultMeta());
                          updated[i] = m;
                          return updated;
                        })}
                        compact
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="border border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-accent/40 transition-colors"
                  onClick={() => galleryImageRef.current?.click()}
                >
                  <ImagePlus className="w-8 h-8 mx-auto mb-2 text-text-muted opacity-50" />
                  <p className="text-sm text-text-muted">Click to add gallery images</p>
                  <p className="text-xs text-text-muted mt-1">Multiple images supported</p>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================
              CUSTOM ORDER FORM BUILDER
              ============================================================ */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Custom Order Form Fields
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Build the custom order form customers will fill out. Dropdown options can have price adjustments.
                </p>
              </div>
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-1.5 px-3 py-2 bg-accent/15 text-accent rounded-lg text-sm font-medium hover:bg-accent/25 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>

            {form.fields.length === 0 ? (
              <div className="text-center py-10 text-text-muted border border-dashed border-border rounded-xl">
                <ListFilter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No custom fields yet</p>
                <p className="text-xs mt-1">Click &quot;Add Field&quot; to build your order form</p>
              </div>
            ) : (
              <div className="space-y-3">
                {form.fields.map((field, fieldIndex) => (
                  <FieldBuilder
                    key={field._tempId || field._id || fieldIndex}
                    field={field}
                    index={fieldIndex}
                    totalFields={form.fields.length}
                    expanded={expandedField === fieldIndex}
                    onToggle={() =>
                      setExpandedField(expandedField === fieldIndex ? null : fieldIndex)
                    }
                    onUpdate={(updates) => updateField(fieldIndex, updates)}
                    onRemove={() => removeField(fieldIndex)}
                    onDuplicate={() => duplicateField(fieldIndex)}
                    onMove={(dir) => moveField(fieldIndex, dir)}
                    onAddOption={() => addOption(fieldIndex)}
                    onUpdateOption={(optIdx, updates) => updateOption(fieldIndex, optIdx, updates)}
                    onRemoveOption={(optIdx) => removeOption(fieldIndex, optIdx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {form.fields.length > 0 && (
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-text-secondary mb-3">Form Preview</h3>
              <div className="p-4 rounded-xl bg-bg-hover/50 border border-border/50 space-y-4">
                {form.fields
                  .filter((f) => f.label.trim())
                  .map((field, i) => (
                    <div key={i}>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        {field.label}
                        {field.required && <span className="text-danger ml-1">*</span>}
                      </label>
                      {field.type === 'dropdown' ? (
                        <select
                          disabled
                          className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-muted text-sm"
                        >
                          <option>{field.placeholder || 'Select an option...'}</option>
                          {field.options
                            ?.filter((o) => o.label.trim())
                            .map((o, j) => (
                              <option key={j}>
                                {o.label} {o.priceAdjustment ? `(+$${o.priceAdjustment})` : ''}
                              </option>
                            ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          disabled
                          placeholder={field.placeholder}
                          rows={2}
                          className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-muted text-sm resize-none"
                        />
                      ) : (
                        <input
                          disabled
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-muted text-sm"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-text-secondary hover:text-text-primary text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-bg-primary font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   IMAGE UPLOAD BOX
   ════════════════════════════════════════════════════════════ */
function ImageUploadBox({ label, sublabel, preview, onSelect, onRemove, icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">
        {label}
      </label>
      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border border-border aspect-video bg-bg-input">
          <img
            src={preview}
            alt={label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onSelect}
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
              title="Change image"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="p-2 rounded-lg bg-red-500/60 text-white hover:bg-red-500/80 transition-colors cursor-pointer"
              title="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-accent/40 transition-colors aspect-video flex flex-col items-center justify-center"
          onClick={onSelect}
        >
          <div className="text-text-muted opacity-50 mb-2">
            {icon}
          </div>
          <p className="text-sm text-text-muted">{sublabel}</p>
          <p className="text-xs text-text-muted mt-1">Click to upload</p>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   IMAGE META CONTROLS — label, position, visibility
   ════════════════════════════════════════════════════════════ */
function ImageMetaControls({ meta, onChange, compact }) {
  const update = (key, value) => onChange({ ...meta, [key]: value });

  return (
    <div className={`mt-2 p-2.5 rounded-lg border border-border/50 bg-bg-hover/30 space-y-2 ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center gap-2">
        <Image className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
        <input
          type="text"
          value={meta.alt || ''}
          onChange={(e) => update('alt', e.target.value)}
          placeholder="Alt text for accessibility..."
          className={`flex-1 px-2 py-1 bg-bg-input border border-border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors ${compact ? 'text-xs' : 'text-sm'}`}
        />
      </div>
      <div className="flex items-center gap-2">
        <Tag className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
        <input
          type="text"
          value={meta.label || ''}
          onChange={(e) => update('label', e.target.value)}
          placeholder="Image label..."
          className={`flex-1 px-2 py-1 bg-bg-input border border-border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors ${compact ? 'text-xs' : 'text-sm'}`}
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[120px]">
          <select
            value={meta.labelPosition || 'bottom-center'}
            onChange={(e) => update('labelPosition', e.target.value)}
            className={`w-full px-2 py-1 bg-bg-input border border-border rounded text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-border-focus transition-colors ${compact ? 'text-xs' : 'text-sm'}`}
          >
            {LABEL_POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none" />
        </div>
        <button
          type="button"
          onClick={() => update('showLabel', !meta.showLabel)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            meta.showLabel
              ? 'bg-accent/15 text-accent border border-accent/30'
              : 'bg-bg-input text-text-muted border border-border hover:border-border-focus'
          }`}
          title={meta.showLabel ? 'Label visible on storefront' : 'Label hidden on storefront'}
        >
          {meta.showLabel ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {meta.showLabel ? 'Visible' : 'Hidden'}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FIELD BUILDER
   ════════════════════════════════════════════════════════════ */
function FieldBuilder({
  field,
  index,
  totalFields,
  expanded,
  onToggle,
  onUpdate,
  onRemove,
  onDuplicate,
  onMove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}) {
  const FieldIcon = FIELD_TYPES.find((t) => t.value === field.type)?.icon || ListFilter;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-bg-card/50">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-bg-hover/50 transition-colors"
        onClick={onToggle}
      >
        <GripVertical className="w-4 h-4 text-text-muted" />
        <FieldIcon className="w-4 h-4 text-accent" />
        <span className="flex-1 text-sm font-medium text-text-primary truncate">
          {field.label || 'Untitled Field'}
        </span>
        <span className="text-xs text-text-muted capitalize px-2 py-0.5 rounded bg-bg-hover">
          {field.type}
        </span>
        {field.required && (
          <span className="text-xs text-danger font-medium">Required</span>
        )}
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border/50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Field Label</label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="e.g. Hair Length"
                className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Field Type</label>
              <div className="relative">
                <select
                  value={field.type}
                  onChange={(e) => onUpdate({ type: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-sm appearance-none cursor-pointer focus:outline-none focus:border-border-focus transition-colors"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Placeholder</label>
              <input
                type="text"
                value={field.placeholder}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Placeholder text..."
                className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="w-4 h-4 rounded border-border accent-accent cursor-pointer"
                />
                <span className="text-sm text-text-secondary">Required field</span>
              </label>
            </div>
          </div>

          {field.type === 'dropdown' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-text-muted">
                  Options ({field.options?.length || 0})
                </label>
                <button
                  type="button"
                  onClick={onAddOption}
                  className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Option
                </button>
              </div>
              <div className="space-y-2">
                {field.options?.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => onUpdateOption(optIndex, { label: e.target.value })}
                      placeholder="Option label"
                      className="flex-1 px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
                    />
                    <div className="relative w-28">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                        +$
                      </span>
                      <input
                        type="number"
                        value={opt.priceAdjustment}
                        onChange={(e) =>
                          onUpdateOption(optIndex, {
                            priceAdjustment: Number(e.target.value) || 0,
                          })
                        }
                        step="0.01"
                        className="w-full pl-8 pr-2 py-2 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-border-focus transition-colors"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveOption(optIndex)}
                      className="p-1.5 rounded hover:bg-danger/10 text-text-muted hover:text-danger transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onMove(-1)}
                disabled={index === 0}
                className="p-1.5 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default"
                title="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onMove(1)}
                disabled={index === totalFields - 1}
                className="p-1.5 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default"
                title="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onDuplicate}
                className="p-1.5 rounded hover:bg-info/10 text-text-muted hover:text-info transition-colors cursor-pointer"
                title="Duplicate"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Field
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
