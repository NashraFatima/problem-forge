import { Outlet, Navigate } from 'react-router-dom';
import { OrgSidebar } from '@/components/navigation/OrgSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export function OrgLayout() {
  const { role, isAuthenticated } = useAuth();

  // In production, this would properly check auth
  // For demo, we allow access to show the layout

  return (
    <div className="min-h-screen bg-background">
      <OrgSidebar />
      <motion.main
        className="ml-64 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
