
import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { UserRole } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ServicePackageList } from "@/components/services/ServicePackageList";

const Services = () => {
  const [userRole, setUserRole] = useState<UserRole>("supplier");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  
  // Check if user is logged in and set role
  useEffect(() => {
    if (loading) return;
    
    if (user) {
      setUserRole(user.role as UserRole);
      
      // Check if user should be on verification or onboarding page
      const status = user.verificationStatus;
      if (status === "unverified") {
        navigate(`/verification/${user.id}`);
        return;
      } else if (status === "onboarding") {
        navigate("/onboarding-status");
        return;
      }

      // If not supplier or planner, redirect to dashboard
      if (user.role !== 'supplier' && user.role !== 'planner') {
        toast.error("You don't have access to this page");
        navigate("/dashboard");
        return;
      }
    } else {
      // Redirect to login if no user is found
      toast.error("Please log in to access your services");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking on main content (mobile only)
  const closeSidebar = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Handle role change from sidebar (converting string to UserRole)
  const handleRoleChange = (role: string) => {
    setUserRole(role as UserRole);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header with menu button */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-xl font-serif font-bold text-wedding-800">
            The<span className="text-wedding-500">Wedding</span>Match
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </header>
      
      <main className="flex-grow flex">
        {/* Sidebar - conditionally shown on mobile */}
        <div className={`
          ${sidebarOpen ? 'block' : 'hidden'} 
          md:block
          fixed md:relative 
          inset-0 md:inset-auto
          z-40 md:z-auto
          w-[80%] md:w-auto
          bg-white
          h-full
          transition-all 
          duration-300
        `}>
          <DashboardSidebar userRole={userRole} onRoleChange={handleRoleChange} />
        </div>
        
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={closeSidebar}
          ></div>
        )}
        
        {/* Main content area */}
        <div 
          className="flex-grow p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-4rem)] w-full overflow-y-auto"
          onClick={closeSidebar}
        >
          <ServicePackageList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
