import { useState, useEffect } from "react";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";
import { PlannerDashboard } from "@/components/dashboard/PlannerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserRole } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { MobilePage } from "@/components/layout/MobilePage";

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (loading) return;
    
    if (user) {
      const status = user.verificationStatus;
      if (status === "unverified") {
        navigate(`/verification/${user.id}`);
        return;
      } else if (status === "onboarding") {
        navigate("/onboarding-status");
        return;
      }
    } else {
      toast.error("Please log in to access the dashboard");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  if (loading) {
    return (
      <MobilePage isLoading loadingText="Loading your dashboard...">
        <></>
      </MobilePage>
    );
  }

  if (!user) return null;

  const renderDashboardContent = () => {
    switch (user.role) {
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
    <MobilePage 
      title={`Welcome, ${user?.firstName || 'User'}`}
      subtitle={`${user?.role || 'user'} dashboard`}
      refreshable
      onRefresh={handleRefresh}
      isLoading={refreshing}
      loadingText="Refreshing..."
      fullWidth
    >
      <div className="pb-6">
        {renderDashboardContent()}
      </div>
    </MobilePage>
  );
};

export default Dashboard;
