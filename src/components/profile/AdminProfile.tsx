
import { useAuth } from "@/contexts/AuthContext";

export const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-wedding-900">Admin Profile</h1>
        <p className="text-gray-600">View and manage your admin profile</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium mb-4">Coming Soon</h2>
        <p>The admin profile management interface is under development. Check back soon for updates!</p>
      </div>
    </div>
  );
};
