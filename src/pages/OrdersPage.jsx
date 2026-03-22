import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getOrders, getOrderById, updateOrderStatus } from '../services/api';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  X,
  ChevronDown,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await getOrders(params);
      setOrders(res.data.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (id) => {
    setDetailLoading(true);
    setShowDetail(true);
    try {
      const res = await getOrderById(id);
      setSelectedOrder(res.data.data);
    } catch {
      toast.error('Failed to load order details');
      setShowDetail(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      order.customer?.name?.toLowerCase().includes(term) ||
      order.customer?.email?.toLowerCase().includes(term) ||
      order.productName?.toLowerCase().includes(term) ||
      order._id?.toLowerCase().includes(term)
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
            Orders
          </h1>
          <p className="text-text-secondary mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <ShoppingCart className="w-4 h-4" />
          <span>{orders.length} total</span>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search orders by customer, product, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm appearance-none cursor-pointer focus:outline-none focus:border-border-focus transition-colors"
          >
            <option value="">All Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <ShoppingCart className="w-10 h-10 mb-3 opacity-50" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">
                    Product
                  </th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">
                    Total
                  </th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">
                    Date
                  </th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-bg-hover/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {order.customer?.name}
                        </p>
                        <p className="text-xs text-text-muted">{order.customer?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {order.productName}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-text-primary">
                      ${order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusDropdown
                        currentStatus={order.status}
                        onChange={(s) => handleStatusChange(order._id, s)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewOrder(order._id)}
                        className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-accent transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetail && (
        <OrderDetailModal
          order={selectedOrder}
          loading={detailLoading}
          onClose={() => {
            setShowDetail(false);
            setSelectedOrder(null);
          }}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

function StatusDropdown({ currentStatus, onChange }) {
  return (
    <div className="relative inline-block">
      <select
        value={currentStatus}
        onChange={(e) => onChange(e.target.value)}
        className={`text-xs font-medium px-3 py-1.5 rounded-full appearance-none cursor-pointer border-0 focus:outline-none status-${currentStatus}`}
        style={{ paddingRight: '1.5rem' }}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="bg-bg-card text-text-primary">
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

function OrderDetailModal({ order, loading, onClose, onStatusChange }) {
  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="glass-card w-full max-w-2xl animate-fade-in relative" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        ) : order ? (
          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Order ID" value={order._id} />
              <InfoItem label="Product" value={order.productName} />
              <InfoItem label="Base Price" value={`$${order.basePrice?.toFixed(2)}`} />
              <InfoItem label="Total Price" value={`$${order.totalPrice?.toFixed(2)}`} highlight />
              <InfoItem label="Date" value={new Date(order.createdAt).toLocaleString()} />
              <div>
                <p className="text-xs text-text-muted mb-1">Status</p>
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order._id, e.target.value)}
                  className={`text-sm font-medium px-3 py-1.5 rounded-full appearance-none cursor-pointer border-0 focus:outline-none status-${order.status}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-bg-card text-text-primary">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Customer</h3>
              <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-bg-hover/50">
                <InfoItem label="Name" value={order.customer?.name} />
                <InfoItem label="Email" value={order.customer?.email} />
                <InfoItem label="Phone" value={order.customer?.phone || '—'} />
                <InfoItem label="Address" value={order.customer?.address || '—'} />
              </div>
            </div>

            {/* Selected Options */}
            {order.selectedOptions?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Selected Options
                </h3>
                <div className="space-y-2">
                  {order.selectedOptions.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-bg-hover/50"
                    >
                      <div>
                        <p className="text-sm text-text-primary">{opt.fieldLabel}</p>
                        <p className="text-xs text-text-muted capitalize">{opt.fieldType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-text-primary">{opt.selectedValue}</p>
                        {opt.priceAdjustment > 0 && (
                          <p className="text-xs text-success">+${opt.priceAdjustment.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-2">Notes</h3>
                <p className="text-sm text-text-secondary p-3 rounded-lg bg-bg-hover/50">
                  {order.notes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-6 text-danger">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to load order</span>
          </div>
        )}
      </div>
      </div>
    </div>,
    document.body
  );
}

function InfoItem({ label, value, highlight }) {
  return (
    <div>
      <p className="text-xs text-text-muted mb-0.5">{label}</p>
      <p
        className={`text-sm ${
          highlight ? 'font-bold text-accent' : 'text-text-primary'
        } break-all`}
      >
        {value}
      </p>
    </div>
  );
}
