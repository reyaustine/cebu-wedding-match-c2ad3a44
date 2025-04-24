
import { useState } from 'react';
import { ClientProfile } from '@/components/profile/ClientProfile';
import { SupplierProfile } from '@/components/profile/SupplierProfile';
import { PlannerProfile } from '@/components/profile/PlannerProfile';
import { AdminProfile } from '@/components/profile/AdminProfile';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { MobilePage } from '@/components/layout/MobilePage';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user, isAuthorized, loading } = useProtectedRoute();
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate a refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };
  
  if (loading || !isAuthorized || !user) {
    return (
      <MobilePage isLoading loadingText="Loading your profile...">
        <></>
      </MobilePage>
    );
  }

  const renderProfileComponent = () => {
    switch (user.role) {
      case 'client':
        return <ClientProfile />;
      case 'supplier':
        return <SupplierProfile />;
      case 'planner':
        return <PlannerProfile />;
      case 'admin':
        return <AdminProfile />;
      default:
        return <div className="py-10 text-center">Invalid user role</div>;
    }
  };

  return (
    <MobilePage 
      title="My Profile" 
      refreshable
      onRefresh={handleRefresh}
      isLoading={refreshing}
      loadingText="Refreshing profile..."
      rightAction={
        <Button size="icon" variant="ghost" className="rounded-full">
          <Settings size={20} />
        </Button>
      }
    >
      <div className="pb-6">
        {renderProfileComponent()}
      </div>
    </MobilePage>
  );
};

export default Profile;
