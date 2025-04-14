
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VerificationStep } from "./VerificationStep";
import { ServiceInfo, eventTypes } from "@/services/authService";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ServiceInfoFormProps {
  userId: string;
  onNext: (data: ServiceInfo) => void;
  onBack: () => void;
  initialData?: ServiceInfo;
}

export const ServiceInfoForm = ({ userId, onNext, onBack, initialData }: ServiceInfoFormProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialData?.serviceTypes || []
  );
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      onNext({ serviceTypes: selectedServices });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <VerificationStep
      title="Services Offered"
      description="Select the types of events you can service"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-sm font-medium mb-3">Event Types</p>
          
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((service) => (
              <Badge
                key={service}
                variant={selectedServices.includes(service) ? "default" : "outline"}
                className={`cursor-pointer text-sm py-2 px-4 ${
                  selectedServices.includes(service) 
                    ? "bg-wedding-600 hover:bg-wedding-700" 
                    : "hover:bg-muted hover:text-muted-foreground"
                }`}
                onClick={() => toggleService(service)}
              >
                {service}
              </Badge>
            ))}
          </div>
          
          {selectedServices.length === 0 && (
            <p className="text-destructive text-sm mt-2">
              Please select at least one service type
            </p>
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
            disabled={isLoading || selectedServices.length === 0}
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
