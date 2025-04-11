
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-bold text-wedding-800">
              The<span className="text-wedding-500">Wedding</span>Match
            </h1>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-wedding-500 transition-colors">
            Home
          </Link>
          <Link to="/suppliers" className="text-sm font-medium hover:text-wedding-500 transition-colors">
            Find Suppliers
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-wedding-500 transition-colors">
            About Us
          </Link>
          <Link to="/login" className="wedding-btn-outline">
            Login
          </Link>
          <Link to="/register" className="wedding-btn">
            Register
          </Link>
        </nav>
        
        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-10 w-10 rounded-full"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-30 animate-fade-in">
          <nav className="flex flex-col p-6 space-y-4">
            <Link 
              to="/" 
              className="text-lg font-medium p-2 hover:bg-wedding-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/suppliers" 
              className="text-lg font-medium p-2 hover:bg-wedding-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Suppliers
            </Link>
            <Link 
              to="/about" 
              className="text-lg font-medium p-2 hover:bg-wedding-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <div className="pt-4 flex flex-col space-y-3">
              <Link 
                to="/login" 
                className="wedding-btn-outline text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="wedding-btn text-center" 
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
