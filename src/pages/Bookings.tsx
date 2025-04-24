
import { useState } from 'react';
import { ClientBookings } from '@/components/bookings/ClientBookings';
import { SupplierBookings } from '@/components/bookings/SupplierBookings'; 
import { PlannerBookings } from '@/components/bookings/PlannerBookings';
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { MobilePage } from '@/components/layout/MobilePage';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Bookings = () => {
  const { user } = useAuth();
  const { isAuthorized, loading } = useProtectedRoute();
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate a refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };
  
  if (loading || !isAuthorized || !user) {
    return (
      <MobilePage isLoading loadingText="Loading bookings...">
        <></>
      </MobilePage>
    );
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

  // Only show add button for clients
  const rightAction = user.role === 'client' ? (
    <Button size="icon" variant="ghost" className="rounded-full">
      <Plus size={20} />
    </Button>
  ) : undefined;

  return (
    <MobilePage 
      title="My Bookings" 
      refreshable
      onRefresh={handleRefresh}
      isLoading={refreshing}
      loadingText="Refreshing bookings..."
      rightAction={rightAction}
    >
      <div className="pb-6">
        {renderBookingsComponent()}
      </div>
    </MobilePage>
  );
};

export default Bookings;
