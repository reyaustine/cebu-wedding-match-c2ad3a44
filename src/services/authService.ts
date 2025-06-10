
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
import { collection, doc, getDoc, setDoc, serverTimestamp, Timestamp, query, where, getDocs } from "firebase/firestore";

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

// Verification types
export interface PersonalInfo {
  address: string;
  birthday?: string;
  alternativePhone?: string;
  avatarUrl?: string;
  validIdUrl?: string;
  selfieWithIdUrl?: string;
}

export interface BusinessInfo {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  tinNumber?: string;
  dtiDocUrl?: string;
  birDocUrl?: string;
  businessPermitUrl?: string;
  facebookPageUrl?: string;
  facebookProfileUrl?: string;
  viberNumber?: string;
  whatsappNumber?: string;
}

export interface ServiceInfo {
  serviceTypes: string[];
}

// Event types for service selection
export const eventTypes = [
  "Wedding",
  "Engagement",
  "Birthday",
  "Corporate",
  "Anniversary",
  "Debut",
  "Baby Shower",
  "Graduation",
  "Reunion",
  "Holiday",
  "Other"
];

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
      const userDoc = await getDoc(doc(db, 'v1/core/users', firebaseUser.uid));
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
          createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData.createdAt,
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
    const userDocRef = doc(db, 'v1/core/users', userId);
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
    const userDoc = await getDoc(doc(db, 'v1/core/users', user.uid));
    
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
      await setDoc(doc(db, 'v1/core/users', user.uid), newUser);
      
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
        createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData.createdAt,
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
  await setDoc(doc(db, 'v1/core/users', user.uid), newUser);
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
    const userDoc = await getDoc(doc(db, 'v1/core/users', user.uid));
    
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
        createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData.createdAt,
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

// Get existing verification data by userId
export const getVerificationData = async (userId: string) => {
  try {
    console.log("Getting verification data for user:", userId);
    
    const verificationsRef = collection(db, 'v1/core/userVerifications');
    const q = query(verificationsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      console.log("Found verification data:", data);
      return {
        id: querySnapshot.docs[0].id,
        ...data
      };
    }
    
    console.log("No verification data found");
    return null;
  } catch (error) {
    console.error('Error getting verification data:', error);
    throw error;
  }
};

// Save user verification data
export const saveUserVerificationData = async (
  userId: string, 
  dataType: 'personalInfo' | 'businessInfo' | 'serviceInfo', 
  data: PersonalInfo | BusinessInfo | ServiceInfo
) => {
  try {
    console.log(`Saving ${dataType} for user:`, userId, data);
    
    // Query existing verification data using the correct collection path
    const verificationsRef = collection(db, 'v1/core/userVerifications');
    const q = query(verificationsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    let docRef;
    let existingData = {};
    
    if (!querySnapshot.empty) {
      // Update existing document
      docRef = querySnapshot.docs[0].ref;
      existingData = querySnapshot.docs[0].data();
      console.log("Found existing verification data, updating...");
    } else {
      // Create new document
      docRef = doc(collection(db, 'v1/core/userVerifications'));
      console.log("Creating new verification document...");
    }
    
    // Merge new data with existing data
    const updatedData = {
      ...existingData,
      userId,
      [dataType]: data,
      updatedAt: new Date(),
      status: 'draft'
    };
    
    // Add createdAt only for new documents
    if (querySnapshot.empty) {
      updatedData.createdAt = new Date();
    }
    
    await setDoc(docRef, updatedData);
    console.log(`Successfully saved ${dataType} to Firestore`);
    
    return true;
  } catch (error) {
    console.error('Error saving verification data:', error);
    throw error;
  }
};

// Submit verification for review
export const submitVerificationForReview = async (userId: string, userRole: UserRole) => {
  try {
    console.log("Submitting verification for review:", userId);
    
    // Update user verification status to 'onboarding'
    await setDoc(
      doc(db, 'v1/core/users', userId),
      { verificationStatus: 'onboarding' },
      { merge: true }
    );
    
    // Update verification data status to 'submitted'
    const verificationsRef = collection(db, 'v1/core/userVerifications');
    const q = query(verificationsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await setDoc(
        docRef,
        {
          status: 'submitted',
          submittedAt: new Date()
        },
        { merge: true }
      );
      console.log("Verification status updated to submitted");
    }
    
    return true;
  } catch (error) {
    console.error('Error submitting verification for review:', error);
    throw error;
  }
};
