import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  CheckCircle,
  Settings,
  LogOut,
  Zap,
  ClipboardList,
  BarChart3,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/problems', icon: FileText, label: 'Problem Statements' },
  { href: '/admin/pending', icon: ClipboardList, label: 'Pending Review' },
  { href: '/admin/organizations', icon: Users, label: 'Organizations' },
  { href: '/admin/audit', icon: Shield, label: 'Audit Logs' },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 panel-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <span className="font-display text-lg font-bold text-sidebar-foreground">DevUp</span>
            <span className="block text-xs text-sidebar-foreground/60">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-medium text-sidebar-foreground">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">{user?.name || 'Admin'}</p>
              <p className="text-xs text-sidebar-foreground/60">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
