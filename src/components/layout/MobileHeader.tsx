
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronLeft, Search, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === "/";
  const showBackButton = !isHomePage && location.pathname !== "/dashboard";
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMenuOpen(false);
  };
  
  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white h-14 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          {showBackButton ? (
            <button 
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-gray-100"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          )}
          
          <Link to="/" className="ml-2">
            <h1 className="text-lg font-serif font-bold text-gray-900">
              <span className="text-wedding-500">Wedding</span>Match
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Search size={20} className="text-gray-700" />
          </button>
          {user && (
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 relative">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-wedding-500 rounded-full"></span>
            </button>
          )}
        </div>
      </header>
      
      {/* Spacer for fixed header */}
      <div className="h-14"></div>
      
      {/* Full Screen Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-14 px-4 flex items-center justify-between border-b">
            <h1 className="text-lg font-medium text-gray-900">Menu</h1>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X size={24} className="text-gray-700" />
            </button>
          </div>
          
          <nav className="px-4 py-6">
            <ul className="space-y-6">
              <li>
                <Link 
                  to="/" 
                  className="block text-lg font-medium text-gray-900 py-3"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/suppliers" 
                  className="block text-lg font-medium text-gray-900 py-3"
                  onClick={() => setMenuOpen(false)}
                >
                  Find Suppliers
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="block text-lg font-medium text-gray-900 py-3"
                  onClick={() => setMenuOpen(false)}
                >
                  About Us
                </Link>
              </li>
              
              {user ? (
                <>
                  <li>
                    <Link 
                      to="/dashboard" 
                      className="block text-lg font-medium text-gray-900 py-3"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="pt-6 border-t">
                    <button 
                      className="block text-lg font-medium text-red-600 py-3"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <div className="pt-6 border-t space-y-4">
                  <Link 
                    to="/login" 
                    className="block w-full text-center py-3 px-4 border border-wedding-500 text-wedding-500 rounded-lg font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full text-center py-3 px-4 bg-wedding-500 text-white rounded-lg font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
