
import { Shield, CheckCircle, AlertTriangle, Award } from "lucide-react";
import { VerifiedBadge } from "./VerifiedBadge";

export const TrustSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wedding-900">Why Trust TheWeddingMatch?</h2>
          <div className="w-24 h-1 bg-gold-400 mx-auto mt-4"></div>
          <p className="mt-6 text-gray-700 max-w-2xl mx-auto">
            In an industry where trust matters above all else, we've built a platform that puts verification 
            and credibility at its core.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-wedding-50 p-6 rounded-lg border border-wedding-100">
            <div className="flex items-center mb-4">
              <Shield className="h-10 w-10 text-wedding-600 mr-4" />
              <h3 className="text-xl font-serif font-semibold">Admin-Verified Suppliers</h3>
            </div>
            <p className="text-gray-700">
              Every supplier with a <span className="inline-flex items-center"><VerifiedBadge size="sm" /> badge</span> has 
              undergone our thorough verification process, including business permits, DTI registration, and identity checks.
            </p>
          </div>
          
          <div className="bg-wedding-50 p-6 rounded-lg border border-wedding-100">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-10 w-10 text-wedding-600 mr-4" />
              <h3 className="text-xl font-serif font-semibold">Scam Protection</h3>
            </div>
            <p className="text-gray-700">
              Our platform actively monitors and removes fraudulent accounts. All transactions and communications are 
              recorded to ensure accountability.
            </p>
          </div>
          
          <div className="bg-wedding-50 p-6 rounded-lg border border-wedding-100">
            <div className="flex items-center mb-4">
              <Award className="h-10 w-10 text-wedding-600 mr-4" />
              <h3 className="text-xl font-serif font-semibold">Client-Verified Reviews</h3>
            </div>
            <p className="text-gray-700">
              Reviews can only be left by clients who have completed bookings, ensuring authentic feedback about 
              your wedding experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
