
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronLeft, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MobileNavBarProps {
  backButton?: boolean;
  title?: string;
  action?: React.ReactNode;
}

export function MobileNavBar({ backButton, title, action }: MobileNavBarProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === "/";
  const hasBackButton = backButton || (!isHomePage && location.pathname !== "/dashboard");
  
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
      <header className="fixed top-0 left-0 right-0 z-40 bg-white h-14 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          {hasBackButton ? (
            <button 
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full"
            >
              <ChevronLeft size={26} className="text-gray-700" />
            </button>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          )}
          
          {title ? (
            <h1 className="ml-2 text-lg font-medium text-gray-900 line-clamp-1">{title}</h1>
          ) : (
            <h1 className="ml-2 text-lg font-medium text-gray-900">
              <span className="text-wedding-500">Wedding</span>Match
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {action || (
            <>
              <button className="w-10 h-10 flex items-center justify-center rounded-full">
                <Search size={22} className="text-gray-700" />
              </button>
              {user && (
                <button className="w-10 h-10 flex items-center justify-center rounded-full relative">
                  <Bell size={22} className="text-gray-700" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-wedding-500 rounded-full"></span>
                </button>
              )}
            </>
          )}
        </div>
      </header>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-14 px-4 flex items-center justify-between">
            <h1 className="text-lg font-medium text-gray-900">Menu</h1>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full"
            >
              <X size={24} className="text-gray-700" />
            </button>
          </div>
          
          <nav className="px-4 py-6">
            <ul className="space-y-6">
              <li>
                <Link 
                  to="/" 
                  className="block text-lg font-medium text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/suppliers" 
                  className="block text-lg font-medium text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  Find Suppliers
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="block text-lg font-medium text-gray-900"
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
                      className="block text-lg font-medium text-gray-900"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button 
                      className="block text-lg font-medium text-gray-900"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="block text-lg font-medium text-gray-900"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="block text-lg font-medium text-gray-900"
                      onClick={() => setMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
      
      {/* Spacer for fixed header */}
      <div className="h-14"></div>
    </>
  );
}
