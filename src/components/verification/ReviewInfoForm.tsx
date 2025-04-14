
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VerificationStep } from "./VerificationStep";
import { PersonalInfo, BusinessInfo, ServiceInfo, UserRole } from "@/services/authService";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReviewInfoFormProps {
  userId: string;
  userRole: UserRole;
  personalInfo: PersonalInfo;
  businessInfo?: BusinessInfo;
  serviceInfo?: ServiceInfo;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

export const ReviewInfoForm = ({ 
  userId, 
  userRole, 
  personalInfo, 
  businessInfo, 
  serviceInfo,
  onSubmit,
  onBack 
}: ReviewInfoFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not provided";
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <VerificationStep
      title="Review Your Information"
      description="Please review all your information before submitting"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Note</AlertTitle>
          <AlertDescription>
            {userRole === "client" 
              ? "After submission, your account will be marked as pre-verified and will be reviewed by our team."
              : "Verification process will take 24-48 hours. Our team will review your information and may contact you for additional details."}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-3">Personal Information</h3>
            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-3">
                <span className="text-muted-foreground">Address</span>
                <span className="col-span-2">{personalInfo.address}</span>
              </div>
              
              <div className="grid grid-cols-3">
                <span className="text-muted-foreground">Date of Birth</span>
                <span className="col-span-2">{formatDate(personalInfo.birthday)}</span>
              </div>
              
              {(userRole === "supplier" || userRole === "planner") && (
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Alternative Phone</span>
                  <span className="col-span-2">{personalInfo.alternativePhone || "Not provided"}</span>
                </div>
              )}
              
              <div className="grid grid-cols-3">
                <span className="text-muted-foreground">Documents</span>
                <div className="col-span-2 space-y-1">
                  <div className="flex items-center gap-1">
                    {personalInfo.avatarUrl ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span>Profile Photo</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {personalInfo.validIdUrl ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span>Valid ID</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {personalInfo.selfieWithIdUrl ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span>Selfie with Valid ID</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Business Information Section - Only for suppliers and planners */}
          {(userRole === "supplier" || userRole === "planner") && businessInfo && (
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-3">Business Information</h3>
              <div className="grid gap-3 text-sm">
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Business Name</span>
                  <span className="col-span-2">{businessInfo.businessName}</span>
                </div>
                
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Business Address</span>
                  <span className="col-span-2">{businessInfo.businessAddress}</span>
                </div>
                
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">TIN Number</span>
                  <span className="col-span-2">{businessInfo.tinNumber || "Not provided"}</span>
                </div>
                
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Contact Numbers</span>
                  <div className="col-span-2 space-y-1">
                    <div>Business Phone: {businessInfo.businessPhone}</div>
                    {businessInfo.viberNumber && <div>Viber: {businessInfo.viberNumber}</div>}
                    {businessInfo.whatsappNumber && <div>WhatsApp: {businessInfo.whatsappNumber}</div>}
                  </div>
                </div>
                
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Social Links</span>
                  <div className="col-span-2 space-y-1">
                    <div>Facebook Page: {businessInfo.facebookPageUrl}</div>
                    <div>Facebook Profile: {businessInfo.facebookProfileUrl}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground">Documents</span>
                  <div className="col-span-2 space-y-1">
                    <div className="flex items-center gap-1">
                      {businessInfo.dtiDocUrl ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <span>DTI Registration</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {businessInfo.birDocUrl ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <span>BIR Certificate (Optional)</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {businessInfo.businessPermitUrl ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <span>Business Permit (Optional)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Service Information Section - Only for suppliers and planners */}
          {(userRole === "supplier" || userRole === "planner") && serviceInfo && (
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-3">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {serviceInfo.serviceTypes.map((service) => (
                  <div 
                    key={service}
                    className="bg-wedding-100 text-wedding-800 px-2 py-1 rounded text-sm"
                  >
                    {service}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
            className="w-full sm:w-1/2"
          >
            Back
          </Button>
          
          <Button 
            type="submit" 
            className="w-full sm:w-1/2 wedding-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit for Verification"
            )}
          </Button>
        </div>
      </form>
    </VerificationStep>
  );
};
