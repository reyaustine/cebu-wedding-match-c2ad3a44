
import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";
import { PlannerDashboard } from "@/components/dashboard/PlannerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserRole } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  // For demo purposes, we'll allow role switching
  // In a real app, this would come from auth state
  const [userRole, setUserRole] = useState<UserRole>("client");
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Check if user is logged in and set role
  useEffect(() => {
    if (loading) return;
    
    if (user) {
      setUserRole(user.role);
    } else {
      // Redirect to login if no user is found
      toast.error("Please log in to access the dashboard");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
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
      <NavBar />
      <main className="flex-grow flex">
        <DashboardSidebar userRole={userRole} onRoleChange={setUserRole} />
        <div className="flex-grow p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
          {renderDashboardContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
