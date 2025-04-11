
import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

type UserRole = "client" | "supplier" | "planner" | "admin";

interface DashboardSidebarProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const DashboardSidebar = ({ userRole, onRoleChange }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  // Define navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
      { icon: <MessageSquare size={20} />, label: "Messages", path: "/dashboard/messages" },
      { icon: <Bell size={20} />, label: "Notifications", path: "/dashboard/notifications" },
      { icon: <Settings size={20} />, label: "Settings", path: "/dashboard/settings" },
    ];

    const roleSpecificItems = {
      client: [
        { icon: <Calendar size={20} />, label: "My Bookings", path: "/dashboard/bookings" },
        { icon: <Users size={20} />, label: "Favorites", path: "/dashboard/favorites" },
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

    return [...commonItems, ...roleSpecificItems[userRole]];
  };

  const navItems = getNavItems();

  // For demonstration purposes only - role switching
  const roleOptions = [
    { value: "client", label: "Client" },
    { value: "supplier", label: "Supplier" },
    { value: "planner", label: "Wedding Planner" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full shadow-sm"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </Button>

      <div className="p-4 border-b border-gray-200 flex items-center justify-center">
        {collapsed ? (
          <h1 className="text-2xl font-serif font-bold text-wedding-800">TW</h1>
        ) : (
          <Link to="/" className="block">
            <h1 className="text-xl font-serif font-bold text-wedding-800">
              The<span className="text-wedding-500">Wedding</span>Match
            </h1>
          </Link>
        )}
      </div>

      <div className="flex-grow p-3 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center px-3 py-2 rounded-md hover:bg-wedding-50 text-gray-700 hover:text-wedding-700"
            >
              <span className="mr-3">{item.icon}</span>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Demo role switcher - would not be in production */}
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

      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-red-600">
          <LogOut className="mr-2" size={18} />
          {!collapsed && <span>Log Out</span>}
        </Button>
      </div>
    </div>
  );
};
