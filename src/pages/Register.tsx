
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { RoleSelection } from "@/components/RoleSelection";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ChevronLeft, Mail, Lock, User } from "lucide-react";
import { UserRole } from "@/services/authService";
import { Separator } from "@/components/ui/separator";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { MobilePage } from "@/components/layout/MobilePage";

// Form validation schema
const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    }
  });

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role as UserRole);
  };
  
  const handleContinue = () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue");
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      const user = await register(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        selectedRole,
        data.phone
      );
      
      if (user) {
        // Redirect to verification page
        navigate(`/verification/${user.id}`);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MobilePage 
      title={currentStep === 1 ? "Create Account" : "Complete Profile"}
      backButton={true}
      fullHeight
    >
      <div className="flex flex-col h-full pt-4">
        {currentStep === 1 ? (
          <div className="space-y-6 px-2">
            <p className="text-gray-600 text-center">
              Join TheWeddingMatch to connect with trusted wedding professionals in Cebu
            </p>
            
            <div className="py-4">
              <h3 className="text-lg font-medium mb-6">Select Your Role</h3>
              <RoleSelection onRoleSelect={handleRoleSelect} />
            </div>
            
            <div className="flex flex-col items-center mt-8 space-y-6">
              <Button 
                className="w-full h-12 rounded-xl bg-wedding-500 hover:bg-wedding-600 text-white"
                onClick={handleContinue}
              >
                Continue with Email
              </Button>
              
              <div className="relative w-full">
                <Separator />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                  OR
                </span>
              </div>
              
              <GoogleSignInButton 
                defaultRole={selectedRole} 
                mode="signup"
                className="h-12 rounded-xl"
              />
            </div>
          </div>
        ) : (
          <div className="px-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="First name" 
                              className="h-12 pl-10 rounded-xl"
                              {...field} 
                              disabled={isSubmitting} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Last name" 
                              className="h-12 pl-10 rounded-xl"
                              {...field} 
                              disabled={isSubmitting} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input 
                            type="email" 
                            placeholder="Email" 
                            className="h-12 pl-10 rounded-xl"
                            {...field} 
                            disabled={isSubmitting} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 h-5 w-5 text-gray-400 flex items-center justify-center text-sm">
                            📱
                          </span>
                          <Input 
                            type="tel" 
                            placeholder="Phone Number" 
                            className="h-12 pl-10 rounded-xl"
                            {...field} 
                            disabled={isSubmitting} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input 
                            type="password" 
                            placeholder="Password (min. 8 characters)"
                            className="h-12 pl-10 rounded-xl"
                            {...field} 
                            disabled={isSubmitting} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input 
                            type="password" 
                            placeholder="Confirm Password"
                            className="h-12 pl-10 rounded-xl"
                            {...field} 
                            disabled={isSubmitting} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full h-12 mt-4 rounded-xl bg-wedding-500 hover:bg-wedding-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 mb-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-wedding-600 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </MobilePage>
  );
};

export default Register;
