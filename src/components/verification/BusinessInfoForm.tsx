import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VerificationStep } from "./VerificationStep";
import { FileUpload } from "./FileUpload";
import { BusinessInfo } from "@/services/authService";
import { Loader2 } from "lucide-react";
import { formatUrl } from "@/lib/utils";

interface BusinessInfoFormProps {
  userId: string;
  onNext: (data: BusinessInfo) => void;
  onBack: () => void;
  initialData?: BusinessInfo;
}

export const BusinessInfoForm = ({ userId, onNext, onBack, initialData }: BusinessInfoFormProps) => {
  const [formData, setFormData] = useState<BusinessInfo>(initialData || {
    businessName: "",
    businessAddress: "",
    businessPhone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileUpload = (fileType: keyof BusinessInfo, url: string) => {
    setFormData(prev => ({ ...prev, [fileType]: url }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formattedData = {
        ...formData,
        facebookPageUrl: formatUrl(formData.facebookPageUrl),
        facebookProfileUrl: formatUrl(formData.facebookProfileUrl)
      };
      
      onNext(formattedData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <VerificationStep
      title="Business Information"
      description="Please provide your business details for verification"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input 
              id="businessName" 
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Your Business Name"
              required
            />
          </div>
          
          {/* Business Address */}
          <div className="space-y-2">
            <Label htmlFor="businessAddress">Business Address</Label>
            <Textarea 
              id="businessAddress" 
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Enter your complete business address"
              required
            />
          </div>
          
          {/* DTI Documents */}
          <FileUpload 
            label="DTI Registration Document"
            userId={userId}
            fileType="dtiDoc"
            onFileUploaded={(url) => handleFileUpload("dtiDocUrl", url)}
            existingUrl={formData.dtiDocUrl}
          />
          
          {/* BIR Certificate */}
          <FileUpload 
            label="BIR Certificate (Optional)"
            userId={userId}
            fileType="birDoc"
            onFileUploaded={(url) => handleFileUpload("birDocUrl", url)}
            existingUrl={formData.birDocUrl}
          />
          
          {/* TIN Number */}
          <div className="space-y-2">
            <Label htmlFor="tinNumber">TIN Number</Label>
            <Input 
              id="tinNumber" 
              name="tinNumber"
              value={formData.tinNumber || ""}
              onChange={handleChange}
              placeholder="000-000-000-000"
            />
          </div>
          
          {/* Business Permit */}
          <FileUpload 
            label="Business Permit (Optional)"
            userId={userId}
            fileType="businessPermit"
            onFileUploaded={(url) => handleFileUpload("businessPermitUrl", url)}
            existingUrl={formData.businessPermitUrl}
          />
          
          {/* Facebook Page Link */}
          <div className="space-y-2">
            <Label htmlFor="facebookPageUrl">Facebook Page Link</Label>
            <Input 
              id="facebookPageUrl" 
              name="facebookPageUrl"
              type="text"
              value={formData.facebookPageUrl || ""}
              onChange={handleChange}
              placeholder="facebook.com/yourbusiness"
              required
            />
          </div>
          
          {/* Facebook Profile Link */}
          <div className="space-y-2">
            <Label htmlFor="facebookProfileUrl">Facebook Profile Link (Preferably not locked)</Label>
            <Input 
              id="facebookProfileUrl" 
              name="facebookProfileUrl"
              type="text"
              value={formData.facebookProfileUrl || ""}
              onChange={handleChange}
              placeholder="facebook.com/yourname"
              required
            />
          </div>
          
          {/* Business Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="businessPhone">Business Phone Number</Label>
            <Input 
              id="businessPhone" 
              name="businessPhone"
              type="tel"
              value={formData.businessPhone}
              onChange={handleChange}
              placeholder="+63"
              required
            />
          </div>
          
          {/* Viber Number */}
          <div className="space-y-2">
            <Label htmlFor="viberNumber">Business Viber Number (Optional)</Label>
            <Input 
              id="viberNumber" 
              name="viberNumber"
              type="tel"
              value={formData.viberNumber || ""}
              onChange={handleChange}
              placeholder="+63"
            />
          </div>
          
          {/* WhatsApp Number */}
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">Business WhatsApp Number (Optional)</Label>
            <Input 
              id="whatsappNumber" 
              name="whatsappNumber"
              type="tel"
              value={formData.whatsappNumber || ""}
              onChange={handleChange}
              placeholder="+63"
            />
          </div>
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
            disabled={isLoading || !formData.businessName || !formData.businessAddress || !formData.businessPhone}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </form>
    </VerificationStep>
  );
};
