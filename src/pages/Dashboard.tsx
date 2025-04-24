
import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";
import { PlannerDashboard } from "@/components/dashboard/PlannerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserRole } from "@/services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-responsive";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [userRole, setUserRole] = useState<UserRole>("client");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  
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
    } else {
      // Redirect to login if no user is found
      toast.error("Please log in to access the dashboard");
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

  // Only show loading state for the dashboard page, not other pages
  if (loading && location.pathname === "/dashboard") {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderDashboardContent = () => {
    // Only render dashboard content if on the dashboard page
    if (location.pathname !== "/dashboard") {
      return null;
    }

    switch (userRole) {
      case "client":
        return <ClientDashboard />;
      case "supplier":
        return <SupplierDashboard />;
      case "planner":
        return <PlannerDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header with menu button */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-serif font-bold text-wedding-800">
            The<span className="text-wedding-500">Wedding</span>Match
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </header>
      
      <main className="flex-grow flex">
        {/* Sidebar - conditionally shown on mobile with overlay */}
        <div 
          className={`
            fixed md:static 
            inset-y-0 left-0
            z-40 md:z-0
            w-[280px] md:w-auto max-w-[80%] md:max-w-none
            bg-white
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            transition-transform duration-300 ease-in-out
            h-full
            shadow-lg md:shadow-none
            overflow-y-auto
          `}
        >
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
          className="flex-grow w-full p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-3.75rem)] md:min-h-[calc(100vh-4rem)] overflow-y-auto"
          onClick={closeSidebar}
        >
          {renderDashboardContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
