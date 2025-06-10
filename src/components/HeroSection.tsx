
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="px-4 py-8 min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-wedding-50/30">
      <div className="max-w-sm mx-auto space-y-8 text-center">
        {/* Hero Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-serif font-bold text-gray-900 leading-tight">
            Find Trusted Wedding Suppliers in{" "}
            <span className="text-wedding-500">Cebu</span>
          </h1>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            Connect with verified wedding professionals for your special day
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link to="/register" className="block">
            <Button className="w-full h-12 rounded-xl bg-wedding-500 hover:bg-wedding-600 text-white font-medium text-base shadow-sm">
              Start Planning
            </Button>
          </Link>
          
          <Link to="/suppliers" className="block">
            <Button 
              variant="outline"
              className="w-full h-12 rounded-xl border-wedding-500 text-wedding-500 hover:bg-wedding-50 font-medium text-base"
            >
              Browse Suppliers
            </Button>
          </Link>

          <Link to="/login" className="block mt-4">
            <Button 
              variant="ghost"
              className="w-full h-10 text-gray-600 hover:bg-gray-50 text-sm"
            >
              Already have an account? Login
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="pt-8 space-y-4">
          {[
            "100% Verified Suppliers",
            "Scam-Free Platform", 
            "Cebu City-Focused"
          ].map((feature, index) => (
            <div key={index} className="flex items-center justify-center gap-3">
              <div className="bg-green-100 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
