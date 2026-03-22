import { useState, useEffect } from 'react';
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from '../services/api';
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  ChevronDown,
  Loader2,
  Eye,
  EyeOff,
  Filter,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProductFormModal from '../components/ProductFormModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filterCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterCategory) params.category = filterCategory;
      const res = await getAdminProducts(params);
      setProducts(res.data.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data || []);
    } catch {
      // silent
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Deactivate "${name}"? It will be hidden from the storefront.`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deactivated');
      fetchProducts();
    } catch {
      toast.error('Failed to deactivate product');
    }
  };

  const handleReactivate = async (id) => {
    try {
      await updateProduct(id, { isActive: true });
      toast.success('Product reactivated');
      fetchProducts();
    } catch {
      toast.error('Failed to reactivate product');
    }
  };

  const handleSave = async (data) => {
    try {
      if (editProduct) {
        await updateProduct(editProduct._id, data);
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      setShowModal(false);
      setEditProduct(null);
      fetchProducts();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
      throw err; // Let modal handle loading state
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
    return (
      p.name.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-text-primary"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Products
          </h1>
          <p className="text-text-secondary mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-bg-primary font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm appearance-none cursor-pointer focus:outline-none focus:border-border-focus transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted glass-card">
          <Package className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-lg">No products found</p>
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
            <ProductCard
              key={product._id}
              product={product}
              onEdit={() => openEdit(product)}
              onDelete={() => handleDelete(product._id, product.name)}
              onReactivate={() => handleReactivate(product._id)}
            />
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {showModal && (
        <ProductFormModal
          product={editProduct}
          categories={categories}
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

function ProductCard({ product, onEdit, onDelete, onReactivate }) {
  return (
    <div
      className={`glass-card p-5 hover:border-border-focus/30 transition-all duration-200 ${
        !product.isActive ? 'opacity-60' : ''
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-text-primary truncate">{product.name}</h3>
          <p className="text-xs text-text-muted">{product.slug}</p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          {!product.isActive ? (
            <button
              onClick={onReactivate}
              className="p-1.5 rounded-lg hover:bg-success/10 text-text-muted hover:text-success transition-colors cursor-pointer"
              title="Reactivate"
            >
              <Eye className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors cursor-pointer"
              title="Deactivate"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-accent/10 text-text-muted hover:text-accent transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
          {product.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl font-bold text-accent">${product.basePrice}</span>
        {product.category && (
          <span className="flex items-center gap-1 text-xs text-text-muted bg-bg-hover px-2 py-1 rounded-full">
            <Tag className="w-3 h-3" />
            {product.category}
          </span>
        )}
      </div>

      {/* Fields summary */}
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span>{product.fields?.length || 0} custom fields</span>
        <span>•</span>
        <span className={product.isActive ? 'text-success' : 'text-danger'}>
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
}
