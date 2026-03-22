import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Crown,
  Settings,
  Scissors,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/custom-hair-products', icon: Scissors, label: 'Custom Hair' },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/blogs', icon: FileText, label: 'Blog Posts' },
  { to: '/settings', icon: Settings, label: 'Site Settings' },
];

export default function Sidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/qws/login');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-bg-secondary border-r border-border flex flex-col z-50 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border gap-3">
        <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
          <Crown className="w-5 h-5 text-accent" />
        </div>
        {!collapsed && (
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Devi Admin
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-3 border-t border-border space-y-2">
        {!collapsed && admin && (
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-text-primary truncate">{admin.username}</p>
            <p className="text-xs text-text-muted truncate">{admin.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-danger/80 hover:text-danger hover:bg-danger/10 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-bg-card border border-border rounded-full flex items-center justify-center hover:bg-bg-hover transition-colors cursor-pointer"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-text-secondary" />
        )}
      </button>
    </aside>
  );
}
