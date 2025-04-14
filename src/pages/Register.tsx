
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { RoleSelection } from "@/components/RoleSelection";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
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
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif font-bold text-wedding-800">
                Create Your Account
              </CardTitle>
              <CardDescription>
                Join TheWeddingMatch to connect with trusted wedding professionals in Cebu
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 1 ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-center">Select Your Role</h3>
                  <RoleSelection onRoleSelect={handleRoleSelect} />
                  
                  <div className="flex flex-col items-center mt-8 space-y-6 max-w-sm mx-auto">
                    <Button 
                      className="wedding-btn w-full"
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
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="First name" 
                                  {...field} 
                                  disabled={isSubmitting} 
                                />
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
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Last name" 
                                  {...field} 
                                  disabled={isSubmitting} 
                                />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="your@email.com" 
                                {...field} 
                                disabled={isSubmitting} 
                              />
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
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+63" 
                                {...field} 
                                disabled={isSubmitting} 
                              />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                {...field} 
                                disabled={isSubmitting} 
                              />
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
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                {...field} 
                                disabled={isSubmitting} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          className="wedding-btn w-full"
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
                      </div>
                    </form>
                  </Form>
                  
                  <div className="text-center text-sm pt-4">
                    <p>
                      Already have an account?{" "}
                      <Link to="/login" className="text-wedding-600 hover:underline font-medium">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
