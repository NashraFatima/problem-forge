import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/navigation/AdminSidebar";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 z-40">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-64 border-r border-sidebar-border"
        >
          <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center h-16 px-4 bg-background/80 backdrop-blur-md border-b border-border">
          <SheetTrigger asChild onClick={() => setIsSidebarOpen(true)}>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <span className="ml-2 font-display font-bold text-lg">
            Admin Console
          </span>
        </header>

        <motion.main
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
