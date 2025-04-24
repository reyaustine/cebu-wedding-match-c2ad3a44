
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </Button>
          
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-bold">
              <span className="text-wedding-500">Wedding</span>Match
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
          
          {user ? (
            <Link to="/dashboard" className="wedding-btn">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="wedding-btn-outline">
                Login
              </Link>
              <Link to="/register" className="wedding-btn">
                Register
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full"
          >
            <Search size={20} />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col p-4 space-y-3 bg-white">
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
            
            {user ? (
              <Link 
                to="/dashboard" 
                className="wedding-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <div className="space-y-2 pt-2">
                <Link 
                  to="/login" 
                  className="wedding-btn-outline block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="wedding-btn block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

