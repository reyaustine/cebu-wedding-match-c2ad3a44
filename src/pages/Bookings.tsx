
import { useState, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { ClientBookings } from '@/components/bookings/ClientBookings';
import { SupplierBookings } from '@/components/bookings/SupplierBookings'; 
import { PlannerBookings } from '@/components/bookings/PlannerBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const Bookings = () => {
  const { user, isAuthorized, loading } = useProtectedRoute();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </main>
        <Footer />
      </div>
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
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-serif font-bold text-wedding-900 mb-6">My Bookings</h1>
          {renderBookingsComponent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bookings;
