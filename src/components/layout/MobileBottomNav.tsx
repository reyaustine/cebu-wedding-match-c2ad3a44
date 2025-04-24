
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4 z-40 bottom-safe-area">
      <Link
        to="/dashboard"
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full mobile-btn",
          isActive("/dashboard") ? "text-wedding-500" : "text-gray-500"
        )}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link
        to="/bookings"
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full mobile-btn",
          isActive("/bookings") ? "text-wedding-500" : "text-gray-500"
        )}
      >
        <Calendar size={24} />
        <span className="text-xs mt-1">Bookings</span>
      </Link>
      
      <Link
        to="/messages"
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full mobile-btn",
          isActive("/messages") ? "text-wedding-500" : "text-gray-500"
        )}
      >
        <MessageSquare size={24} />
        <span className="text-xs mt-1">Messages</span>
      </Link>
      
      <Link
        to="/profile"
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full mobile-btn",
          isActive("/profile") ? "text-wedding-500" : "text-gray-500"
        )}
      >
        <User size={24} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
}
