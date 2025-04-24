
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-responsive";

export const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-white to-wedding-50/50 px-4">
      <div className="max-w-md mx-auto space-y-6 text-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight">
          Find Trusted Wedding Suppliers in{" "}
          <span className="text-wedding-500">Cebu</span>
        </h1>
        
        <p className="text-base text-gray-600 mb-6">
          Connect with verified wedding professionals for your special day.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <Link to="/register" className="w-full">
            <Button 
              className="w-full bg-wedding-500 hover:bg-wedding-600 text-base py-6"
            >
              Start Planning
            </Button>
          </Link>
          
          <Link to="/suppliers" className="w-full">
            <Button 
              variant="outline"
              className="w-full border-wedding-500 text-wedding-500 hover:bg-wedding-50 text-base py-6"
            >
              Browse Suppliers
            </Button>
          </Link>

          <Link to="/login" className="w-full mt-2">
            <Button 
              variant="ghost"
              className="w-full text-gray-600 hover:bg-gray-100 text-base"
            >
              Already have an account? Login
            </Button>
          </Link>
        </div>

        <div className="pt-6 flex flex-col gap-3 text-sm">
          {[
            "100% Verified Suppliers",
            "Scam-Free Platform", 
            "Cebu City-Focused"
          ].map((feature, index) => (
            <div key={index} className="flex items-center justify-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
