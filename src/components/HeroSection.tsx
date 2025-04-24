
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-responsive";

export const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-white to-wedding-50/50">
      <div className="container px-6 py-8 flex flex-col items-center text-center">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-4xl font-serif font-bold text-gray-900 leading-tight">
            Find Trusted Wedding Suppliers in{" "}
            <span className="text-wedding-500">Cebu</span>
          </h1>
          
          <p className="text-base text-gray-600">
            Connect with verified wedding professionals for your special day.
          </p>

          <div className="flex flex-col gap-3 w-full pt-4">
            <Link 
              to="/register" 
              className="w-full"
            >
              <Button 
                className="w-full bg-wedding-500 hover:bg-wedding-600 text-base py-6"
              >
                Start Planning
              </Button>
            </Link>
            
            <Link 
              to="/suppliers" 
              className="w-full"
            >
              <Button 
                variant="outline"
                className="w-full border-wedding-500 text-wedding-500 hover:bg-wedding-50 text-base py-6"
              >
                Browse Suppliers
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex flex-col gap-4 text-sm">
            <div className="flex items-center justify-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">100% Verified Suppliers</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Scam-Free Platform</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Cebu City-Focused</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
