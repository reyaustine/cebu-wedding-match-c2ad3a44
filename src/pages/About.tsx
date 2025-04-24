
import { MobileNavBar } from "@/components/layout/MobileNavBar";
import { Link } from "react-router-dom";
import { MobilePage } from "@/components/layout/MobilePage";

const About = () => {
  return (
    <MobilePage title="About Us">
      <section className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-wedding-800">Our Mission</h2>
          <p className="text-gray-700">
            TheWeddingMatch was created to solve a critical problem in the Cebu wedding industry: 
            the lack of trust between clients and wedding suppliers due to growing cases of scams and 
            unprofessional conduct.
          </p>
          <p className="text-gray-700">
            Our mission is to create a safe, transparent, and reliable platform that connects 
            soon-to-be-married couples with genuine, verified wedding professionals.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-wedding-800">
            What Sets Us Apart
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-serif font-medium text-wedding-700 mb-2">
                Rigorous Verification
              </h3>
              <p className="text-gray-600">
                Every supplier undergoes thorough verification including identity checks and business permits.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-serif font-medium text-wedding-700 mb-2">
                Cebu-Focused
              </h3>
              <p className="text-gray-600">
                We specialize in the Cebu wedding market, understanding local customs and venues.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-serif font-medium text-wedding-700 mb-2">
                Secure Booking
              </h3>
              <p className="text-gray-600">
                Our platform provides a transparent booking process with clear communication channels.
              </p>
            </div>
          </div>
        </div>

        <div className="py-6 space-y-4">
          <h2 className="text-2xl font-serif font-bold text-wedding-800 text-center">
            Join Our Community
          </h2>
          <div className="flex flex-col gap-3">
            <Link to="/register" className="wedding-btn text-center">
              Create an Account
            </Link>
            <Link to="/suppliers" className="wedding-btn-outline text-center">
              Browse Suppliers
            </Link>
          </div>
        </div>
      </section>
    </MobilePage>
  );
};

export default About;
