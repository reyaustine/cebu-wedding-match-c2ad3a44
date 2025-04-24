import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedStatuses = ["verified"] }: { 
  children: React.ReactNode,
  allowedStatuses?: Array<string>
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const userStatus = user.verificationStatus || "unverified";
  if (!allowedStatuses.includes(userStatus)) {
    if (userStatus === "unverified") {
      return <Navigate to={`/verification/${user.id}`} replace />;
    } else if (userStatus === "onboarding") {
      return <Navigate to="/onboarding-status" replace />;
    }
  }
  
  return <>{children}</>;
};

const StatusRoute = ({ children, requiredStatus }: { 
  children: React.ReactNode,
  requiredStatus: string
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const userStatus = user.verificationStatus || "unverified";
  
  if (userStatus !== requiredStatus) {
    if (userStatus === "verified") {
      return <Navigate to="/dashboard" replace />;
    } else if (userStatus === "unverified") {
      return <Navigate to={`/verification/${user.id}`} replace />;
    } else if (userStatus === "onboarding") {
      return <Navigate to="/onboarding-status" replace />;
    }
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { user } = useAuth();
  const showBottomNav = user && window.location.pathname !== '/';

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suppliers" element={<SupplierDirectory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route 
          path="/verification/:userId" 
          element={
            <StatusRoute requiredStatus="unverified">
              <Verification />
            </StatusRoute>
          } 
        />
        <Route 
          path="/onboarding-status" 
          element={
            <StatusRoute requiredStatus="onboarding">
              <OnboardingStatus />
            </StatusRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bookings" 
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/services" 
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/services/new" 
          element={
            <ProtectedRoute>
              <ServiceForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/services/edit/:packageId" 
          element={
            <ProtectedRoute>
              <ServiceForm />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showBottomNav && <MobileBottomNav />}
      <Toaster />
      <Sonner />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
