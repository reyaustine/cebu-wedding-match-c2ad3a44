import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  PersonalInfo, 
  BusinessInfo, 
  ServiceInfo, 
  saveUserVerificationData, 
  submitVerificationForReview, 
  UserRole,
  getVerificationData
} from "@/services/authService";
import { PersonalInfoForm } from "@/components/verification/PersonalInfoForm";
import { BusinessInfoForm } from "@/components/verification/BusinessInfoForm";
import { ServiceInfoForm } from "@/components/verification/ServiceInfoForm";
import { ReviewInfoForm } from "@/components/verification/ReviewInfoForm";
import { VerificationContainer } from "@/components/verification/VerificationContainer";
import { toast } from "sonner";
import { dbService } from "@/services/databaseService";

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
    const initializeVerification = async () => {
      if (!userId) {
        toast.error("User ID is required");
        navigate("/login");
        return;
      }
      
      try {
        console.log("Initializing verification for user:", userId);
        
        // First check if user exists in our database
        const userData = await dbService.get("users", userId);
        
        if (!userData) {
          console.error("User not found in database:", userId);
          toast.error("User not found. Please log in again.");
          navigate("/login");
          return;
        }
        
        console.log("Found user data:", userData);
        setUserRole((userData as { role: UserRole }).role);
        
        // Check verification status
        const status = await checkVerificationStatus(userId);
        console.log("Verification status:", status);
        
        if (status === "verified") {
          toast.success("Your account is already verified!");
          navigate("/dashboard");
          return;
        } else if (status === "onboarding") {
          navigate("/onboarding-status");
          return;
        }
        
        // Load existing verification data using the new function
        try {
          const verificationData = await getVerificationData(userId);
          
          if (verificationData) {
            console.log("Found existing verification data:", verificationData);
            
            if (verificationData.personalInfo) {
              setPersonalInfo(verificationData.personalInfo);
              console.log("Loaded personal info:", verificationData.personalInfo);
            }
            if (verificationData.businessInfo) {
              setBusinessInfo(verificationData.businessInfo);
              console.log("Loaded business info:", verificationData.businessInfo);
            }
            if (verificationData.serviceInfo) {
              setServiceInfo(verificationData.serviceInfo);
              console.log("Loaded service info:", verificationData.serviceInfo);
            }
            
            // Determine the current step based on completed data
            const role = (userData as { role: UserRole }).role;
            if (role === "client") {
              if (verificationData.personalInfo) {
                setCurrentStep(2); // Go to review step
              }
            } else {
              if (verificationData.serviceInfo) {
                setCurrentStep(4); // Go to review step
              } else if (verificationData.businessInfo) {
                setCurrentStep(3); // Go to service info step
              } else if (verificationData.personalInfo) {
                setCurrentStep(2); // Go to business info step
              }
            }
          } else {
            console.log("No existing verification data found");
          }
        } catch (error) {
          console.error("Error fetching verification data:", error);
        }
      } catch (error) {
        console.error("Error initializing verification:", error);
        toast.error("Error loading verification data");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeVerification();
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
  
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
            <p className="mt-4 text-gray-600">Loading verification process...</p>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <VerificationContainer
      userId={userId || ""}
      userRole={userRole}
      currentStep={currentStep}
      personalInfo={personalInfo}
      businessInfo={businessInfo}
      serviceInfo={serviceInfo}
      onPersonalInfoSave={handlePersonalInfoSave}
      onBusinessInfoSave={handleBusinessInfoSave}
      onServiceInfoSave={handleServiceInfoSave}
      onSubmitVerification={handleSubmitVerification}
      onChangeStep={setCurrentStep}
    >
      {renderStepContent()}
    </VerificationContainer>
  );
};

export default Verification;
