
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Calendar, MessageSquare, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileTabBar() {
  const location = useLocation();
  
  const tabs = [
    {
      path: "/dashboard",
      label: "Home",
      icon: Home
    },
    {
      path: "/bookings",
      label: "Bookings",
      icon: Calendar
    },
    {
      path: "/messages",
      label: "Messages",
      icon: MessageSquare
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 pb-safe">
      <div className="grid grid-cols-4">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center py-2 relative transition-colors",
                isActive ? "text-wedding-500" : "text-gray-500"
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 w-10 h-1 -translate-x-1/2 bg-wedding-500 rounded-b-full" />
              )}
              <tab.icon size={20} className={cn(
                "transition-transform",
                isActive ? "scale-110" : ""
              )} />
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
