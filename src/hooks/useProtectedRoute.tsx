
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UserRole } from '@/services/authService';

interface UseProtectedRouteOptions {
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * Hook for protecting routes based on authentication and role
 */
export const useProtectedRoute = (options: UseProtectedRouteOptions = {}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { requiredRoles = ['client', 'supplier', 'planner', 'admin'], redirectTo = '/login' } = options;

  useEffect(() => {
    // Skip when still loading
    if (loading) return;

    // Check if user exists
    if (!user) {
      toast.error('Please log in to access this page');
      navigate(redirectTo);
      return;
    }

    // Admin users get full access regardless of verification status
    const isAdmin = user.role === 'admin' || user.email === 'reyaustine123@gmail.com';
    
    if (isAdmin) {
      console.log('Admin user detected, granting full access');
      setIsAuthorized(true);
      return;
    }

    // Check if user's status requires redirection (for non-admin users)
    const status = user.verificationStatus;
    if (status === 'unverified') {
      navigate(`/verification/${user.id}`);
      return;
    } else if (status === 'onboarding') {
      navigate('/onboarding-status');
      return;
    }

    // Check role-based access
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.includes(user.role as UserRole);
      if (!hasRequiredRole) {
        toast.error('You do not have permission to access this page');
        navigate('/dashboard');
        return;
      }
    }

    // User is authorized
    setIsAuthorized(true);
  }, [user, loading, navigate, requiredRoles, redirectTo]);

  return { isAuthorized, user, loading };
};
