
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  where,
  query,
  getDocs
} from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { toast } from "sonner";
import { dbService } from "./databaseService";

// User role types
export type UserRole = "client" | "supplier" | "planner";

// Verification status types
export type VerificationStatus = "unverified" | "pre-verified" | "onboarding" | "verified" | "rejected";

// Event types for service tags
export const eventTypes = [
  "Wedding", 
  "Debut", 
  "Kiddie Party", 
  "Corporate Events", 
  "Bridal Shower",
  "Baby Shower",
  "Birthday Party",
  "Engagement Party",
  "Anniversary",
  "Graduation",
  "Family Reunion",
  "Holiday Party",
  "Product Launch",
  "Seminar",
  "Conference",
  "Team Building",
  "Awards Ceremony"
];

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  verificationStatus?: VerificationStatus;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  photoURL?: string;
}

// Verification data interfaces
export interface PersonalInfo {
  avatarUrl?: string;
  validIdUrl?: string;
  selfieWithIdUrl?: string;
  birthday?: string;
  address: string;
  alternativePhone?: string;
}

export interface BusinessInfo {
  businessName: string;
  businessAddress: string;
  dtiDocUrl?: string;
  birDocUrl?: string;
  tinNumber?: string;
  businessPermitUrl?: string;
  facebookPageUrl?: string;
  facebookProfileUrl?: string;
  businessPhone: string;
  viberNumber?: string;
  whatsappNumber?: string;
}

export interface ServiceInfo {
  serviceTypes: string[];
}

// Super admin account
const SUPER_ADMIN_EMAIL = "reyaustine123@gmail.com";

// Current user state
let currentUser: User | null = null;

// Google authentication provider
const googleProvider = new GoogleAuthProvider();

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
    
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = userCredential;
    
    // Update profile with display name
    await updateProfile(firebaseUser, {
      displayName: `${firstName} ${lastName}`
    });
    
    // Send verification email
    await sendEmailVerification(firebaseUser);
    
    // Set verification status based on role
    const verificationStatus: VerificationStatus = isAdmin 
      ? "verified" 
      : "unverified";
    
    // Create user document in Firestore
    const newUser: User = {
      id: firebaseUser.uid,
      email,
      firstName,
      lastName,
      role,
      isVerified: isAdmin, // Super admin is automatically verified
      verificationStatus,
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

// Google sign-in (handles both sign-in and sign-up)
export const signInWithGoogle = async (defaultRole: UserRole = "client"): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { user: firebaseUser } = result;
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    
    if (userDoc.exists()) {
      // User exists, perform login
      const userData = userDoc.data() as User;
      
      // Set current user
      currentUser = {
        ...userData,
        id: firebaseUser.uid,
        isVerified: firebaseUser.emailVerified || userData.isVerified || 
                    firebaseUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
      };
      
      // Update last login
      await updateDoc(doc(db, "users", firebaseUser.uid), {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      toast.success(`Welcome back, ${userData.firstName}!`);
      return currentUser;
      
    } else {
      // User doesn't exist, create a new user
      const nameParts = firebaseUser.displayName?.split(' ') || ['User'];
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Check if user is the super admin
      const isAdmin = firebaseUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
      
      // Create user document in Firestore with verification status
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        firstName,
        lastName,
        role: defaultRole,
        isVerified: isAdmin || firebaseUser.emailVerified, 
        verificationStatus: isAdmin ? "verified" : "unverified",
        phoneNumber: firebaseUser.phoneNumber || "",
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
      
      toast.success(`Account created successfully! Please complete your profile.`);
      return newUser;
    }
    
  } catch (error: any) {
    if (error.code !== 'auth/cancelled-popup-request') {
      toast.error(error.message || "Google sign-in failed");
    }
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

// Save user verification data
export const saveUserVerificationData = async (
  userId: string,
  step: string,
  data: any
): Promise<void> => {
  try {
    // Get existing verification document if it exists
    const verificationQuery = query(
      collection(db, "userVerifications"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(verificationQuery);
    let verificationId: string;
    
    if (!querySnapshot.empty) {
      // Update existing verification document
      verificationId = querySnapshot.docs[0].id;
      await updateDoc(doc(db, "userVerifications", verificationId), {
        [step]: data,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new verification document
      verificationId = await dbService.create("userVerifications", {
        userId,
        [step]: data,
        status: "pending"
      });
    }
    
    return;
  } catch (error: any) {
    toast.error(error.message || "Failed to save verification data");
    throw error;
  }
};

// Update user verification status
export const updateUserVerificationStatus = async (
  userId: string,
  status: VerificationStatus
): Promise<void> => {
  try {
    await updateDoc(doc(db, "users", userId), {
      verificationStatus: status,
      updatedAt: serverTimestamp()
    });
    
    // Update the currentUser if it's the same user
    if (currentUser && currentUser.id === userId) {
      currentUser = {
        ...currentUser,
        verificationStatus: status
      };
    }
    
    return;
  } catch (error: any) {
    toast.error(error.message || "Failed to update verification status");
    throw error;
  }
};

// Submit verification for review
export const submitVerificationForReview = async (
  userId: string, 
  userRole: UserRole
): Promise<void> => {
  try {
    // Set verification status based on role
    const status: VerificationStatus = userRole === "client" 
      ? "pre-verified" 
      : "onboarding";
    
    // Update verification status
    await updateUserVerificationStatus(userId, status);
    
    // Send notification to admin (stored in Firestore)
    await dbService.create("adminNotifications", {
      type: "verification_request",
      userId,
      userRole,
      status: "unread",
      message: `New ${userRole} verification request`
    });
    
    return;
  } catch (error: any) {
    toast.error(error.message || "Failed to submit for review");
    throw error;
  }
};

// Get user verification status
export const getUserVerificationStatus = async (userId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (!userDoc.exists()) {
      return "error";
    }
    
    const userData = userDoc.data() as User;
    return userData.verificationStatus || "unverified";
  } catch (error: any) {
    console.error("Error getting verification status:", error);
    return "error";
  }
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
