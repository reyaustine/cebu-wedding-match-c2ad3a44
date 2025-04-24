
import { useState, useEffect } from 'react';
import { ClientBookings } from '@/components/bookings/ClientBookings';
import { SupplierBookings } from '@/components/bookings/SupplierBookings'; 
import { PlannerBookings } from '@/components/bookings/PlannerBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { MobileLayout } from '@/components/layout/MobileLayout';

const Bookings = () => {
  const { user, isAuthorized, loading } = useProtectedRoute();
  
  if (loading) {
    return (
      <MobileLayout isLoading={true} loadingText="Loading bookings...">
        <></>
      </MobileLayout>
    );
  }
  
  if (!isAuthorized || !user) {
    return null; // The hook will handle redirection
  }

  const renderBookingsComponent = () => {
    switch (user.role) {
      case 'client':
        return <ClientBookings />;
      case 'supplier':
        return <SupplierBookings />;
      case 'planner':
        return <PlannerBookings />;
      default:
        return <div className="py-10 text-center">Invalid user role</div>;
    }
  };

  return (
    <MobileLayout title="My Bookings">
      <div className="container mx-auto max-w-6xl">
        {renderBookingsComponent()}
      </div>
    </MobileLayout>
  );
};

export default Bookings;
