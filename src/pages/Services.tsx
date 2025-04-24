
import { useEffect } from 'react';
import { ServicePackageList } from '@/components/services/ServicePackageList';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { MobilePage } from '@/components/layout/MobilePage';

const Services = () => {
  const { isAuthorized, loading } = useProtectedRoute({ 
    requiredRoles: ['supplier']
  });

  if (loading || !isAuthorized) {
    return (
      <MobilePage 
        title="Services"
        backButton={true}
        isLoading={loading}
        loadingText="Loading..."
      >
        <></>
      </MobilePage>
    );
  }

  return (
    <MobilePage 
      title="Services"
      backButton={true}
    >
      <div className="pb-6">
        <ServicePackageList />
      </div>
    </MobilePage>
  );
};

export default Services;
