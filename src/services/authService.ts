import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { collection, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export type UserRole = 'client' | 'supplier' | 'planner' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  photoURL?: string;
  verificationStatus?: 'unverified' | 'onboarding' | 'verified';
  businessName?: string;
  createdAt?: Date;
}

// Update user password
export const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('No user is logged in');
  }
  
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  
  try {
    // Reauthenticate user before password update
    await reauthenticateWithCredential(user, credential);
    // Update the password
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Listen for authentication state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as Omit<User, 'id'>;
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          phoneNumber: userData.phoneNumber,
          photoURL: firebaseUser.photoURL,
          verificationStatus: userData.verificationStatus,
          businessName: userData.businessName,
          createdAt: userData.createdAt?.toDate(),
        };
        callback(user);
      } else {
        // User document not found, handle appropriately
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Get user verification status
export const getUserVerificationStatus = async (userId: string): Promise<string> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as User;
      return userData.verificationStatus || 'unverified';
    } else {
      console.warn(`User document not found for user ID: ${userId}`);
      return 'unverified';
    }
  } catch (error) {
    console.error("Error fetching user verification status:", error);
    return 'error';
  }
};

// Sign in with Google
export const signInWithGoogle = async (defaultRole: UserRole = "client"): Promise<User> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user exists in database
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create user document
      const newUser: Omit<User, 'id'> = {
        email: user.email!,
        firstName: user.displayName?.split(' ')[0] || 'New',
        lastName: user.displayName?.split(' ')[1] || 'User',
        role: defaultRole,
        photoURL: user.photoURL,
        verificationStatus: 'unverified',
        createdAt: new Date(),
      };
      await setDoc(doc(db, 'users', user.uid), newUser);
      
      return {
        id: user.uid,
        email: user.email!,
        firstName: user.displayName?.split(' ')[0] || 'New',
        lastName: user.displayName?.split(' ')[1] || 'User',
        role: defaultRole,
        photoURL: user.photoURL,
        verificationStatus: 'unverified',
      };
    } else {
      const userData = userDoc.data() as Omit<User, 'id'>;
      return {
        id: user.uid,
        email: user.email!,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        photoURL: user.photoURL,
        verificationStatus: userData.verificationStatus,
        businessName: userData.businessName,
        createdAt: userData.createdAt?.toDate(),
      };
    }
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Create user document in Firestore
const createUserDocument = async (user: any, firstName: string, lastName: string, role: UserRole, phone?: string) => {
  const newUser: Omit<User, 'id'> = {
    email: user.email!,
    firstName,
    lastName,
    role,
    phoneNumber: phone,
    verificationStatus: 'unverified',
    createdAt: new Date(),
  };
  await setDoc(doc(db, 'users', user.uid), newUser);
  return newUser;
};

// Register user with email and password
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole,
  phone?: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const newUser = await createUserDocument(user, firstName, lastName, role, phone);
    
    return {
      id: user.uid,
      email: user.email!,
      firstName,
      lastName,
      role,
      phoneNumber: phone,
      verificationStatus: 'unverified',
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login user with email and password
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as Omit<User, 'id'>;
      return {
        id: user.uid,
        email: user.email!,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        photoURL: user.photoURL,
        verificationStatus: userData.verificationStatus,
        businessName: userData.businessName,
        createdAt: userData.createdAt?.toDate(),
      };
    } else {
      throw new Error("User document not found");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};
