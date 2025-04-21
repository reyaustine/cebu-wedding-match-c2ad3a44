
import { useState, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { ClientProfile } from '@/components/profile/ClientProfile';
import { SupplierProfile } from '@/components/profile/SupplierProfile';
import { PlannerProfile } from '@/components/profile/PlannerProfile';
import { AdminProfile } from '@/components/profile/AdminProfile';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, isAuthorized, loading } = useProtectedRoute();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
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
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-serif font-bold text-wedding-900 mb-6">My Profile</h1>
          {renderProfileComponent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
