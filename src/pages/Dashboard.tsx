
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";
import { PlannerDashboard } from "@/components/dashboard/PlannerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

// This would come from authentication in a real app
type UserRole = "client" | "supplier" | "planner" | "admin";

const Dashboard = () => {
  // For demo purposes, we'll allow role switching
  // In a real app, this would come from auth state
  const [userRole, setUserRole] = useState<UserRole>("client");

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
