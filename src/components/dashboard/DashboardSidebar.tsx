
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Package,
  Users,
  Settings,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/services/authService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardSidebarProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const DashboardSidebar = ({ userRole, onRoleChange }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Define navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { 
        icon: userRole === "client" ? <Home size={20} /> : <LayoutDashboard size={20} />, 
        label: userRole === "client" ? "Home" : "Dashboard", 
        path: userRole === "client" ? "/" : "/dashboard" 
      },
    ];
    
    if (userRole !== "client") {
      commonItems.push(
        { icon: <MessageSquare size={20} />, label: "Messages", path: "/dashboard/messages" },
        { icon: <Bell size={20} />, label: "Notifications", path: "/dashboard/notifications" }
      );
    }

    const roleSpecificItems = {
      client: [
        { icon: <Calendar size={20} />, label: "My Bookings", path: "/dashboard" },
        { icon: <Search size={20} />, label: "Find Suppliers", path: "/suppliers" },
        { icon: <MessageSquare size={20} />, label: "Messages", path: "/dashboard/messages" },
        { icon: <User size={20} />, label: "My Profile", path: "/dashboard/profile" },
      ],
      supplier: [
        { icon: <Calendar size={20} />, label: "Bookings", path: "/dashboard/bookings" },
        { icon: <Package size={20} />, label: "Packages", path: "/dashboard/packages" },
        { icon: <Users size={20} />, label: "Clients", path: "/dashboard/clients" },
      ],
      planner: [
        { icon: <Calendar size={20} />, label: "Events", path: "/dashboard/events" },
        { icon: <Users size={20} />, label: "Clients", path: "/dashboard/clients" },
        { icon: <Package size={20} />, label: "Suppliers", path: "/dashboard/suppliers" },
      ],
      admin: [
        { icon: <Users size={20} />, label: "Users", path: "/dashboard/users" },
        { icon: <Calendar size={20} />, label: "Bookings", path: "/dashboard/bookings" },
        { icon: <Package size={20} />, label: "Verifications", path: "/dashboard/verifications" },
      ],
    };
    
    const allItems = [...commonItems];
    
    // Add role specific items
    if (roleSpecificItems[userRole]) {
      // Filter out duplicates for client role (since we've moved some to common)
      if (userRole === "client") {
        allItems.push(...roleSpecificItems[userRole].filter(
          item => !commonItems.some(common => common.label === item.label)
        ));
      } else {
        allItems.push(...roleSpecificItems[userRole]);
      }
    }
    
    // Add settings last
    if (userRole !== "client") {
      allItems.push({ icon: <Settings size={20} />, label: "Settings", path: "/dashboard/settings" });
    }

    return allItems;
  };

  const navItems = getNavItems();

  // For demonstration purposes only - role switching
  const roleOptions = [
    { value: "client", label: "Client" },
    { value: "supplier", label: "Supplier" },
    { value: "planner", label: "Wedding Planner" },
    { value: "admin", label: "Admin" },
  ];

  // Check if a path is active
  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Get display name or email from user
  const displayName = user?.email ? (user.email.split('@')[0] || 'User') : 'User';
  const avatarFallback = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col h-full">
      {/* User profile section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{avatarFallback}</AvatarFallback>
            {user?.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
          </Avatar>
          {!collapsed && (
            <div className="flex-grow">
              <p className="font-medium truncate">{displayName}</p>
              <p className="text-xs text-gray-500">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Account
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex-grow p-3 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md 
              ${isActivePath(item.path) 
                ? "bg-wedding-50 text-wedding-700" 
                : "text-gray-700 hover:bg-wedding-50 hover:text-wedding-700"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Demo role switcher - would not be in production */}
      {!isMobile && (
        <div className={`p-4 border-t border-gray-200 ${collapsed ? "hidden" : ""}`}>
          <div className="mb-2 text-xs text-gray-500">Demo: Switch Role</div>
          <div className="grid grid-cols-2 gap-2">
            {roleOptions.map((role) => (
              <Button
                key={role.value}
                variant={userRole === role.value ? "default" : "outline"}
                size="sm"
                className={userRole === role.value ? "bg-wedding-500 hover:bg-wedding-600" : ""}
                onClick={() => onRoleChange(role.value as UserRole)}
              >
                {role.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-700 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2" size={18} />
          {!collapsed && <span>Log Out</span>}
        </Button>
      </div>
      
      {/* Collapse button - hide on mobile */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full shadow-sm hidden md:flex"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      )}
    </div>
  );
};
