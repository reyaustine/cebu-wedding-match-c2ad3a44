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
  getUserVerificationStatus,
  updateUserPassword
} from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { errorHandler } from '@/services/errorHandlingService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role: UserRole, phone?: string) => Promise<User | null>;
  googleSignIn: (defaultRole?: UserRole) => Promise<User | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkVerificationStatus: (userId: string) => Promise<string>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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
      toast.success("Successfully signed in!");
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = "Failed to sign in";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        default:
          errorMessage = error.message || "Failed to sign in";
      }
      
      toast.error(errorMessage);
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
      
      toast.success("Successfully signed in with Google!");
      return user;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code !== 'auth/cancelled-popup-request') {
        toast.error(error.message || "Google sign-in failed");
      }
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
      
      toast.success("Account created successfully! Please verify your account.");
      // Redirect to verification page for new users
      navigate(`/verification/${user.id}`);
      return user;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = "Failed to create account";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists. Try signing in instead.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please use at least 8 characters.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled. Please contact support.";
          break;
        default:
          errorMessage = error.message || "Failed to create account. Please try again.";
      }
      
      toast.error(errorMessage);
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
  
  const handleUpdatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await updateUserPassword(currentPassword, newPassword);
      toast.success("Password updated successfully");
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
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
    updatePassword: handleUpdatePassword
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

}
