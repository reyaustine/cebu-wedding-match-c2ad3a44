
import { CheckCircle, Clock, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface OnboardingStatusProps {
  userRole: string;
}

export const OnboardingStatus = ({ userRole }: OnboardingStatusProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-serif font-bold text-wedding-800">
          Verification in Progress
        </CardTitle>
        <CardDescription>
          We're reviewing your information
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="bg-wedding-50 rounded-full p-5">
          <Clock className="h-12 w-12 text-wedding-600" />
        </div>
        
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium">
            Your {userRole === "supplier" ? "supplier" : "wedding planner"} account is being verified
          </h3>
          
          <p className="text-muted-foreground">
            Our team is reviewing your submitted information. This process typically takes 24-48 hours.
          </p>
          
          <div className="bg-wedding-50 p-4 rounded-md border border-wedding-100">
            <p className="text-sm">
              <span className="font-medium">What's next?</span> Once verified, 
              you'll receive an email notification and can start using our platform.
            </p>
          </div>
        </div>
        
        <div className="space-y-3 w-full">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Personal information received</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Business information received</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Services information received</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <span>Verification in progress</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="mt-4 flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout Now
        </Button>
      </CardContent>
    </Card>
  );
};
