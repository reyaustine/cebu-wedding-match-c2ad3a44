
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronRight,
  Search,
  User,
  UserCircle2,
  Users,
  Store,
  HeartHandshake,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface DashboardSidebarProps {
  userRole: string;
  onRoleChange?: (role: string) => void;
}

export const DashboardSidebar = ({ userRole, onRoleChange }: DashboardSidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isSuperAdmin = user?.email === "reyaustine123@gmail.com";
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getNavItemClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      isActive 
        ? "bg-wedding-100 text-wedding-800" 
        : "hover:bg-gray-100"
    }`;
  };

  // NavItem component for cleaner code
  const NavItem = ({ 
    icon: Icon, 
    label, 
    to, 
    count 
  }: { 
    icon: any; 
    label: string; 
    to: string;
    count?: number;
  }) => (
    <li>
      <Link to={to} className={getNavItemClass(to)}>
        <Icon size={20} />
        <span>{label}</span>
        {count !== undefined && count > 0 && (
          <span className="ml-auto bg-wedding-500 text-white text-xs px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </Link>
    </li>
  );

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You've been logged out");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <aside className="w-full h-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || ""} alt={user?.firstName || "User"} />
            <AvatarFallback>
              {user?.firstName ? getInitials(`${user.firstName} ${user.lastName}`) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
            </p>
            <p className="text-xs text-gray-500 capitalize truncate">
              {userRole}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 overflow-y-auto">
        <ul className="space-y-1">
          {/* Common Navigation Items */}
          <NavItem icon={Home} label="Dashboard" to="/dashboard" />
          
          {/* Role-specific Navigation Items */}
          {userRole === "client" && (
            <>
              <NavItem icon={Search} label="Find Suppliers" to="/suppliers" />
              <NavItem icon={Calendar} label="My Bookings" to="/bookings" />
              <NavItem icon={MessageSquare} label="Messages" to="/messages" count={3} />
              <NavItem icon={UserCircle2} label="My Profile" to="/profile" />
            </>
          )}
          
          {userRole === "supplier" && (
            <>
              <NavItem icon={Calendar} label="Bookings" to="/bookings" />
              <NavItem icon={MessageSquare} label="Messages" to="/messages" count={5} />
              <NavItem icon={Store} label="My Services" to="/services" />
              <NavItem icon={UserCircle2} label="Business Profile" to="/profile" />
            </>
          )}
          
          {userRole === "planner" && (
            <>
              <NavItem icon={Calendar} label="Bookings" to="/bookings" />
              <NavItem icon={MessageSquare} label="Messages" to="/messages" />
              <NavItem icon={HeartHandshake} label="My Services" to="/services" />
              <NavItem icon={UserCircle2} label="Business Profile" to="/profile" />
            </>
          )}
          
          {userRole === "admin" && (
            <>
              <NavItem icon={Users} label="User Management" to="/users" />
              <NavItem icon={Bell} label="Verifications" to="/verifications" count={2} />
              <NavItem icon={Store} label="Suppliers" to="/suppliers-management" />
              <NavItem icon={MessageSquare} label="Support Chats" to="/messages" count={4} />
              <NavItem icon={Settings} label="Settings" to="/settings" />
            </>
          )}
        </ul>

        {/* Role Switcher - Only for super admin */}
        {isSuperAdmin && onRoleChange && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 mb-2">Demo: Switch Role</p>
            <div className="space-y-1">
              {["client", "supplier", "planner", "admin"].map((role) => (
                <button
                  key={role}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg ${
                    userRole === role
                      ? "bg-wedding-100 text-wedding-800"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => onRoleChange(role)}
                >
                  <span className="capitalize">{role}</span>
                  {userRole === role && <ChevronRight size={16} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start gap-3 hover:bg-gray-100 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Log out</span>
        </Button>
      </div>
    </aside>
  );
};
