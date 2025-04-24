
import { useState, useEffect } from 'react';
import { ClientProfile } from '@/components/profile/ClientProfile';
import { SupplierProfile } from '@/components/profile/SupplierProfile';
import { PlannerProfile } from '@/components/profile/PlannerProfile';
import { AdminProfile } from '@/components/profile/AdminProfile';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Loader2 } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';

const Profile = () => {
  const { user, isAuthorized, loading } = useProtectedRoute();
  
  if (loading) {
    return (
      <MobileLayout isLoading={true} loadingText="Loading your profile...">
        <></>
      </MobileLayout>
    );
  }
  
  if (!isAuthorized || !user) {
    return null; // The hook will handle redirection
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
    <MobileLayout title="My Profile">
      <div className="container mx-auto max-w-4xl">
        {renderProfileComponent()}
      </div>
    </MobileLayout>
  );
};

export default Profile;
