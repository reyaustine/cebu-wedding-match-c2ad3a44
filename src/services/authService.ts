
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { toast } from "sonner";

// User role types
export type UserRole = "client" | "supplier" | "planner" | "admin";

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  photoURL?: string;
}

// Super admin account
const SUPER_ADMIN_EMAIL = "reyaustine123@gmail.com";

// Current user state
let currentUser: User | null = null;

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  role: UserRole,
  phone?: string
): Promise<User> => {
  try {
    // Check if user is the super admin
    const isAdmin = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    const actualRole = isAdmin ? "admin" : role;
    
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = userCredential;
    
    // Update profile with display name
    await updateProfile(firebaseUser, {
      displayName: `${firstName} ${lastName}`
    });
    
    // Send verification email
    await sendEmailVerification(firebaseUser);
    
    // Create user document in Firestore
    const newUser: User = {
      id: firebaseUser.uid,
      email,
      firstName,
      lastName,
      role: actualRole,
      isVerified: isAdmin, // Super admin is automatically verified
      phoneNumber: phone || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      photoURL: firebaseUser.photoURL || ""
    };
    
    await setDoc(doc(db, "users", firebaseUser.uid), {
      ...newUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update the current user state
    currentUser = newUser;
    
    toast.success(`Registration successful! ${!isAdmin ? 'Please check your email for verification.' : ''}`);
    return newUser;
    
  } catch (error: any) {
    toast.error(error.message || "Registration failed");
    throw error;
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = userCredential;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    
    if (!userDoc.exists()) {
      throw new Error("User record not found");
    }
    
    const userData = userDoc.data() as User;
    
    // Set current user
    currentUser = {
      ...userData,
      id: firebaseUser.uid,
      isVerified: firebaseUser.emailVerified || userData.isVerified || email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
    };
    
    // Update last login
    await updateDoc(doc(db, "users", firebaseUser.uid), {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    toast.success(`Welcome back, ${userData.firstName}!`);
    return currentUser;
    
  } catch (error: any) {
    const errorMessage = 
      error.code === 'auth/invalid-credential' ? 'Invalid email or password' : 
      error.code === 'auth/user-not-found' ? 'User not found' :
      error.code === 'auth/wrong-password' ? 'Invalid password' :
      error.message || 'Login failed';
      
    toast.error(errorMessage);
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    currentUser = null;
    toast.info("You've been logged out");
  } catch (error: any) {
    toast.error(error.message || "Logout failed");
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent! Check your inbox");
  } catch (error: any) {
    toast.error(error.message || "Failed to send reset email");
    throw error;
  }
};

// Get current authenticated user
export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return currentUser?.role === "admin";
};

// Check if user is super admin
export const isSuperAdmin = (email?: string): boolean => {
  const checkEmail = email || currentUser?.email || '';
  return checkEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
};

// Authentication state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          currentUser = {
            ...userData,
            id: firebaseUser.uid,
            isVerified: firebaseUser.emailVerified || 
                        userData.isVerified || 
                        userData.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
          };
        } else {
          currentUser = null;
        }
      } catch (error) {
        currentUser = null;
        console.error("Error fetching user data:", error);
      }
    } else {
      currentUser = null;
    }
    
    callback(currentUser);
  });
};
