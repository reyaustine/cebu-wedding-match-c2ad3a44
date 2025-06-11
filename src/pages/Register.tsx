
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
      
      // The auth context handles success messaging and navigation
      // Only handle the case where registration returns null (error case)
      if (!user) {
        // Error was already handled in auth context, just stop loading
        console.log("Registration failed - user is null");
      }
    } catch (error: any) {
      // This is a fallback in case the auth context doesn't catch the error
      console.error("Registration error in component:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExistingAccountRedirect = () => {
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button 
          onClick={handleBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-medium text-gray-900">
          Create Account
        </h1>
        <div className="w-8" /> {/* Spacer for center alignment */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md md:max-w-6xl mx-auto p-4 pb-8">
          {currentStep === 1 ? (
            <div className="space-y-6 md:space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <p className="text-gray-600 text-sm md:text-base">
                  Join TheWeddingMatch to connect with trusted wedding professionals in Cebu
                </p>
              </div>
              
              <div className="py-4 md:py-8">
                <h3 className="text-lg md:text-2xl font-serif font-medium mb-6 md:mb-8 text-center">Select Your Role</h3>
                <RoleSelection onRoleSelect={handleRoleSelect} />
              </div>
              
              <div className="flex flex-col items-center mt-8 md:mt-12 space-y-6 max-w-md mx-auto">
                <Button 
                  className="w-full h-12 rounded-xl bg-wedding-500 hover:bg-wedding-600 text-white"
                  onClick={handleContinue}
                >
                  Continue with Email
                </Button>
                
                <div className="relative w-full">
                  <Separator />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2 text-xs text-gray-500">
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
            <div className="space-y-6 max-w-md mx-auto">
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
                    className="w-full h-12 mt-6 rounded-xl bg-wedding-500 hover:bg-wedding-600 text-white"
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
              
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-wedding-600 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
