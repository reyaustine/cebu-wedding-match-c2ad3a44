
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VerificationStep } from "./VerificationStep";
import { FileUpload } from "./FileUpload";
import { PersonalInfo, UserRole } from "@/services/authService";
import { Loader2, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface PersonalInfoFormProps {
  userId: string;
  userRole: UserRole;
  onNext: (data: PersonalInfo) => void;
  initialData?: PersonalInfo;
}

export const PersonalInfoForm = ({ userId, userRole, onNext, initialData }: PersonalInfoFormProps) => {
  const [formData, setFormData] = useState<PersonalInfo>(initialData || {
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    initialData?.birthday ? new Date(initialData.birthday) : undefined
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileUpload = (fileType: keyof PersonalInfo, url: string) => {
    setFormData(prev => ({ ...prev, [fileType]: url }));
  };
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const dataWithDate = date 
        ? { ...formData, birthday: date.toISOString() } 
        : formData;
        
      onNext(dataWithDate);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <VerificationStep
      title="Personal Information"
      description="Please provide your personal details for verification"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <FileUpload 
            label="Profile Photo"
            userId={userId}
            fileType="avatar"
            onFileUploaded={(url) => handleFileUpload("avatarUrl", url)}
            existingUrl={formData.avatarUrl}
          />
          
          <FileUpload 
            label="Valid ID (Government-issued)"
            userId={userId}
            fileType="validId"
            onFileUploaded={(url) => handleFileUpload("validIdUrl", url)}
            existingUrl={formData.validIdUrl}
          />
          
          <FileUpload 
            label="Selfie with Valid ID"
            userId={userId}
            fileType="selfieWithId"
            onFileUploaded={(url) => handleFileUpload("selfieWithIdUrl", url)}
            existingUrl={formData.selfieWithIdUrl}
          />
          
          <div className="space-y-2">
            <Label htmlFor="birthday">Birthday</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                  fromYear={1940}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Home Address</Label>
            <Textarea 
              id="address" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete home address"
              required
            />
          </div>
          
          {(userRole === "supplier" || userRole === "planner") && (
            <div className="space-y-2">
              <Label htmlFor="alternativePhone">Alternative Phone Number (Optional)</Label>
              <Input 
                id="alternativePhone" 
                name="alternativePhone"
                type="tel"
                value={formData.alternativePhone || ""}
                onChange={handleChange}
                placeholder="+63"
              />
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full wedding-btn"
          disabled={isLoading || !formData.address || !formData.validIdUrl || !formData.selfieWithIdUrl}
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
      </form>
    </VerificationStep>
  );
};
