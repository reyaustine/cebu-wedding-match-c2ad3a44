
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="bg-wedding-50 py-16">
          <div className="container px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-wedding-800 mb-4">
              About TheWeddingMatch
            </h1>
            <div className="w-24 h-1 bg-gold-400 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Building trust and connection between couples and wedding professionals in Cebu.
            </p>
          </div>
        </div>

        <section className="py-16">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-serif font-bold text-wedding-800 mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                TheWeddingMatch was created to solve a critical problem in the Cebu wedding industry: 
                the lack of trust between clients and wedding suppliers due to growing cases of scams and 
                unprofessional conduct.
              </p>
              <p className="text-gray-700 mb-6">
                Our mission is to create a safe, transparent, and reliable platform that connects 
                soon-to-be-married couples with genuine, verified wedding professionals. We believe that 
                your wedding journey should be filled with joy and excitement, not worry and doubt.
              </p>
              <p className="text-gray-700">
                Through our comprehensive verification process, secure booking system, and dedication to 
                quality service, we are building the most trusted wedding community in Cebu City.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-serif font-bold text-wedding-800 mb-6">
                What Sets Us Apart
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 border border-gray-100 rounded-lg shadow-sm">
                  <h3 className="text-xl font-serif font-medium text-wedding-700 mb-3">
                    Rigorous Verification
                  </h3>
                  <p className="text-gray-600">
                    Every supplier on our platform undergoes a thorough verification process, including 
                    identity checks, business permits, and credential validation.
                  </p>
                </div>
                
                <div className="p-6 border border-gray-100 rounded-lg shadow-sm">
                  <h3 className="text-xl font-serif font-medium text-wedding-700 mb-3">
                    Cebu-Focused
                  </h3>
                  <p className="text-gray-600">
                    We specialize in the Cebu wedding market, understanding local customs, venues, and 
                    supplier relationships to better serve our community.
                  </p>
                </div>
                
                <div className="p-6 border border-gray-100 rounded-lg shadow-sm">
                  <h3 className="text-xl font-serif font-medium text-wedding-700 mb-3">
                    Secure Booking System
                  </h3>
                  <p className="text-gray-600">
                    Our platform provides a transparent booking process with clear statuses and communication 
                    channels between clients and suppliers.
                  </p>
                </div>
                
                <div className="p-6 border border-gray-100 rounded-lg shadow-sm">
                  <h3 className="text-xl font-serif font-medium text-wedding-700 mb-3">
                    Active Moderation
                  </h3>
                  <p className="text-gray-600">
                    Our admin team actively monitors the platform, resolves disputes, and ensures all 
                    participants adhere to our community guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 text-center">
            <h2 className="text-2xl font-serif font-bold text-wedding-800 mb-6">
              Join Our Community Today
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-8">
              Whether you're planning your dream wedding or offering professional wedding services, 
              TheWeddingMatch provides the trusted platform you need to connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="wedding-btn px-8 py-3">
                Create an Account
              </Link>
              <Link to="/suppliers" className="wedding-btn-outline px-8 py-3">
                Browse Suppliers
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
