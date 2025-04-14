
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChange, 
  User, 
  loginUser, 
  registerUser, 
  logoutUser, 
  resetPassword, 
  UserRole, 
  signInWithGoogle,
  getUserVerificationStatus
} from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role: UserRole, phone?: string) => Promise<User | null>;
  googleSignIn: (defaultRole?: UserRole) => Promise<User | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkVerificationStatus: (userId: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Handle redirects based on user verification status
  const handleUserRedirection = (user: User) => {
    const verificationStatus = user.verificationStatus || "unverified";
    
    if (verificationStatus === "unverified") {
      navigate(`/verification/${user.id}`);
    } else if (verificationStatus === "onboarding") {
      navigate('/onboarding-status');
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      
      // If user exists, check where they should be redirected
      if (user && window.location.pathname !== `/verification/${user.id}` && 
          window.location.pathname !== '/onboarding-status' && 
          window.location.pathname !== '/dashboard') {
        const verificationStatus = user.verificationStatus || "unverified";
        
        if (verificationStatus === "unverified") {
          navigate(`/verification/${user.id}`);
        } else if (verificationStatus === "onboarding") {
          navigate('/onboarding-status');
        } else if (verificationStatus === "verified") {
          navigate('/dashboard');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      setUser(user);
      handleUserRedirection(user);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (defaultRole: UserRole = "client") => {
    setLoading(true);
    try {
      const user = await signInWithGoogle(defaultRole);
      setUser(user);
      
      // Check verification status
      const verificationStatus = user.verificationStatus || "unverified";
      
      if (verificationStatus === "unverified") {
        navigate(`/verification/${user.id}`);
      } else if (verificationStatus === "onboarding") {
        navigate('/onboarding-status');
      } else {
        navigate('/dashboard');
      }
      
      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role: UserRole,
    phone?: string
  ) => {
    setLoading(true);
    try {
      const user = await registerUser(email, password, firstName, lastName, role, phone);
      setUser(user);
      
      // Redirect to verification page for new users
      navigate(`/verification/${user.id}`);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
      console.error(error);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };
  
  const checkVerificationStatus = async (userId: string) => {
    try {
      return await getUserVerificationStatus(userId);
    } catch (error) {
      console.error('Error checking verification status:', error);
      return 'error';
    }
  };

  const value = {
    user,
    loading,
    login: handleLogin,
    googleSignIn: handleGoogleSignIn,
    register: handleRegister,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    checkVerificationStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
