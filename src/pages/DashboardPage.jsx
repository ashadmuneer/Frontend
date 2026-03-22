import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCart,
  Package,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const STATUS_COLORS = {
  pending: '#fbbf24',
  confirmed: '#60a5fa',
  processing: '#a855f7',
  shipped: '#22d3ee',
  delivered: '#4ade80',
  cancelled: '#f87171',
};

export default function DashboardPage() {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  const statusData = stats?.ordersByStatus
    ? Object.entries(stats.ordersByStatus)
        .filter(([, count]) => count > 0)
        .map(([name, value]) => ({ name, value }))
    : [];

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = stats?.monthlyRevenue?.map((m) => ({
    name: `${monthNames[m._id.month]} ${m._id.year}`,
    revenue: m.revenue,
    orders: m.count,
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-text-primary"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Welcome back, {admin?.username}
        </h1>
        <p className="text-text-secondary mt-1">Here&apos;s what&apos;s happening with your store</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`}
          color="text-success"
          bgColor="bg-success/10"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={stats?.totalOrders || 0}
          color="text-info"
          bgColor="bg-info/10"
        />
        <StatCard
          icon={Package}
          label="Active Products"
          value={stats?.totalProducts || 0}
          color="text-accent"
          bgColor="bg-accent/10"
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={stats?.ordersByStatus?.pending || 0}
          color="text-warning"
          bgColor="bg-warning/10"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Monthly Revenue</h2>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="name" tick={{ fill: '#9a958d', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9a958d', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a25',
                    border: '1px solid #2a2a3a',
                    borderRadius: '8px',
                    color: '#f0ece4',
                  }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#d4a853" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-text-muted">
              No revenue data yet
            </div>
          )}
        </div>

        {/* Orders by Status Pie */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Orders by Status</h2>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a25',
                      border: '1px solid #2a2a3a',
                      borderRadius: '8px',
                      color: '#f0ece4',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {statusData.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: STATUS_COLORS[s.name] }}
                      />
                      <span className="text-text-secondary capitalize">{s.name}</span>
                    </div>
                    <span className="text-text-primary font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-text-muted">
              No orders yet
            </div>
          )}
        </div>
      </div>

      {/* Revenue by Product + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Product */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Revenue by Product</h2>
          {stats?.revenueByProduct?.length > 0 ? (
            <div className="space-y-3">
              {stats.revenueByProduct.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-bg-hover/50"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{p._id}</p>
                    <p className="text-xs text-text-muted">{p.count} orders</p>
                  </div>
                  <span className="text-sm font-semibold text-success">${p.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No revenue data yet</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Orders</h2>
          {stats?.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-bg-hover/50"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {order.customer?.name}
                    </p>
                    <p className="text-xs text-text-muted">{order.productName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">
                      ${order.totalPrice?.toFixed(2)}
                    </p>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 status-${order.status}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bgColor }) {
  return (
    <div className="glass-card p-5 hover:border-border-focus/30 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
      </div>
    </div>
  );
}
