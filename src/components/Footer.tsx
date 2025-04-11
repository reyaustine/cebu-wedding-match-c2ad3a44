
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-wedding-950 text-white">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold">TheWeddingMatch</h3>
            <p className="text-gray-300 text-sm">
              Connecting clients with trusted wedding suppliers in Cebu since 2025.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-300 hover:text-wedding-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-wedding-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-wedding-300 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gold-400 mb-4">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/suppliers" className="text-gray-300 hover:text-white transition-colors">
                  Find Suppliers
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Safety Tips
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gold-400 mb-4">For Suppliers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                  Join As Supplier
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Verification Process
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Supplier Guidelines
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gold-400 mb-4">Help & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2025 TheWeddingMatch. All rights reserved. Serving Cebu City, Philippines.</p>
        </div>
      </div>
    </footer>
  );
};
