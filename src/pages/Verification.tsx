import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  PersonalInfo, 
  BusinessInfo, 
  ServiceInfo, 
  saveUserVerificationData, 
  submitVerificationForReview, 
  UserRole 
} from "@/services/authService";
import { PersonalInfoForm } from "@/components/verification/PersonalInfoForm";
import { BusinessInfoForm } from "@/components/verification/BusinessInfoForm";
import { ServiceInfoForm } from "@/components/verification/ServiceInfoForm";
import { ReviewInfoForm } from "@/components/verification/ReviewInfoForm";
import { toast } from "sonner";
import { dbService } from "@/services/databaseService";
import { where } from "firebase/firestore";

interface VerificationData {
  personalInfo?: PersonalInfo;
  businessInfo?: BusinessInfo;
  serviceInfo?: ServiceInfo;
  userId: string;
  status: string;
}

const Verification = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user, loading, checkVerificationStatus } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [userRole, setUserRole] = useState<UserRole>("client");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkUser = async () => {
      if (!userId) {
        toast.error("User ID is required");
        navigate("/login");
        return;
      }
      
      try {
        const userData = await dbService.getById("users", userId);
        
        if (!userData) {
          toast.error("User not found");
          navigate("/login");
          return;
        }
        
        const status = await checkVerificationStatus(userId);
        
        if (status === "verified") {
          toast.success("Your account is already verified!");
          navigate("/dashboard");
          return;
        } else if (status === "onboarding") {
          navigate("/onboarding-status");
          return;
        }
        
        setUserRole((userData as { role: UserRole }).role);
        
        try {
          const verifications = await dbService.query<VerificationData>(
            "userVerifications",
            where("userId", "==", userId)
          );
          
          if (verifications && verifications.length > 0) {
            const data = verifications[0];
            if (data.personalInfo) setPersonalInfo(data.personalInfo);
            if (data.businessInfo) setBusinessInfo(data.businessInfo);
            if (data.serviceInfo) setServiceInfo(data.serviceInfo);
          }
        } catch (error) {
          console.error("Error fetching verification data:", error);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        toast.error("Error loading user data");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
  }, [userId, navigate, checkVerificationStatus]);
  
  const handlePersonalInfoSave = async (data: PersonalInfo) => {
    try {
      if (!userId) return;
      
      await saveUserVerificationData(userId, "personalInfo", data);
      setPersonalInfo(data);
      
      if (userRole === "client") {
        setCurrentStep(2);
      } else {
        setCurrentStep(2);
      }
      
      toast.success("Personal information saved");
    } catch (error) {
      toast.error("Error saving personal information");
      console.error(error);
    }
  };
  
  const handleBusinessInfoSave = async (data: BusinessInfo) => {
    try {
      if (!userId) return;
      
      await saveUserVerificationData(userId, "businessInfo", data);
      setBusinessInfo(data);
      setCurrentStep(3);
      
      toast.success("Business information saved");
    } catch (error) {
      toast.error("Error saving business information");
      console.error(error);
    }
  };
  
  const handleServiceInfoSave = async (data: ServiceInfo) => {
    try {
      if (!userId) return;
      
      await saveUserVerificationData(userId, "serviceInfo", data);
      setServiceInfo(data);
      setCurrentStep(4);
      
      toast.success("Service information saved");
    } catch (error) {
      toast.error("Error saving service information");
      console.error(error);
    }
  };
  
  const handleSubmitVerification = async () => {
    try {
      if (!userId) return;
      
      await submitVerificationForReview(userId, userRole);
      
      toast.success("Verification submitted successfully!");
      
      if (userRole === "client") {
        navigate("/dashboard");
      } else {
        navigate("/onboarding-status");
      }
    } catch (error) {
      toast.error("Error submitting verification");
      console.error(error);
    }
  };
  
  const renderStepContent = () => {
    if (!userId) return null;
    
    if (userRole === "client") {
      switch (currentStep) {
        case 1:
          return (
            <PersonalInfoForm 
              userId={userId}
              userRole={userRole}
              onNext={handlePersonalInfoSave}
              initialData={personalInfo || undefined}
            />
          );
        case 2:
          return personalInfo ? (
            <ReviewInfoForm 
              userId={userId}
              userRole={userRole}
              personalInfo={personalInfo}
              onSubmit={handleSubmitVerification}
              onBack={() => setCurrentStep(1)}
            />
          ) : null;
        default:
          return null;
      }
    } else {
      switch (currentStep) {
        case 1:
          return (
            <PersonalInfoForm 
              userId={userId}
              userRole={userRole}
              onNext={handlePersonalInfoSave}
              initialData={personalInfo || undefined}
            />
          );
        case 2:
          return (
            <BusinessInfoForm 
              userId={userId}
              onNext={handleBusinessInfoSave}
              onBack={() => setCurrentStep(1)}
              initialData={businessInfo || undefined}
            />
          );
        case 3:
          return (
            <ServiceInfoForm 
              userId={userId}
              onNext={handleServiceInfoSave}
              onBack={() => setCurrentStep(2)}
              initialData={serviceInfo || undefined}
            />
          );
        case 4:
          return personalInfo && businessInfo && serviceInfo ? (
            <ReviewInfoForm 
              userId={userId}
              userRole={userRole}
              personalInfo={personalInfo}
              businessInfo={businessInfo}
              serviceInfo={serviceInfo}
              onSubmit={handleSubmitVerification}
              onBack={() => setCurrentStep(3)}
            />
          ) : null;
        default:
          return null;
      }
    }
  };
  
  const renderStepIndicator = () => {
    const totalSteps = userRole === "client" ? 2 : 4;
    
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[...Array(totalSteps)].map((_, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            
            return (
              <div key={`step-${stepNumber}`} className="flex items-center">
                {index > 0 && (
                  <div 
                    className={`h-1 w-6 mx-1 ${
                      isCompleted ? "bg-wedding-600" : "bg-gray-200"
                    }`}
                  />
                )}
                
                <div 
                  className={`rounded-full flex items-center justify-center h-8 w-8 text-sm font-medium ${
                    isActive 
                      ? "bg-wedding-600 text-white"
                      : isCompleted
                        ? "bg-wedding-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
            <p className="mt-4 text-gray-600">Loading verification process...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-12">
        <div className="container px-4 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-serif font-bold text-wedding-800">
              Account Verification
            </h1>
            <p className="text-muted-foreground mt-2">
              {userRole === "client" 
                ? "Verify your account to start using TheWeddingMatch" 
                : "Complete your verification to join our network of trusted wedding professionals"}
            </p>
          </div>
          
          {renderStepIndicator()}
          {renderStepContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Verification;
