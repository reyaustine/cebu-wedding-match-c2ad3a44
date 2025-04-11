
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { RoleSelection } from "@/components/RoleSelection";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const handleContinue = () => {
    setCurrentStep(2);
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
                  <RoleSelection />
                  <div className="flex justify-center mt-8">
                    <Button 
                      className="wedding-btn px-8"
                      onClick={handleContinue}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <form className="space-y-4 max-w-md mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                        <Input id="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                      <Input id="phone" type="tel" placeholder="+63" required />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">Password</label>
                      <Input id="password" type="password" required />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                      <Input id="confirmPassword" type="password" required />
                    </div>
                    
                    <div className="pt-2">
                      <Button type="submit" className="wedding-btn w-full">Create Account</Button>
                    </div>
                  </form>
                  
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
