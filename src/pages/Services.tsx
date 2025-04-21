
import { useEffect, useState } from 'react';
import { ServicePackageList } from '@/components/services/ServicePackageList';
import { Footer } from '@/components/Footer';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Loader2 } from 'lucide-react';

const Services = () => {
  const { isAuthorized, loading } = useProtectedRoute({ 
    requiredRoles: ['supplier']
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // The hook will handle redirection
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-6 bg-gray-50">
        <ServicePackageList />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
