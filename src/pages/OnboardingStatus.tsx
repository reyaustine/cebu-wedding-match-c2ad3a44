
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { OnboardingStatus as StatusDisplay } from "@/components/verification/OnboardingStatus";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const OnboardingStatus = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string>("");
  
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      toast.error("Please log in to view your onboarding status");
      navigate("/login");
      return;
    }
    
    const status = user.verificationStatus;
    
    if (status === "verified") {
      toast.success("Your account is already verified!");
      navigate("/dashboard");
    } else if (status === "unverified") {
      navigate(`/verification/${user.id}`);
    } else {
      setUserRole(user.role);
    }
  }, [user, loading, navigate]);
  
  if (loading || !userRole) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
            <p className="mt-4 text-gray-600">Loading status...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow py-12 flex items-center">
        <div className="container px-4">
          <StatusDisplay userRole={userRole} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OnboardingStatus;
