
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  QueryConstraint,
  DocumentData,
  DocumentReference,
  Query,
  DocumentSnapshot,
  serverTimestamp,
  Timestamp,
  WhereFilterOp,
  QuerySnapshot,
  enableNetwork,
  disableNetwork,
  enableIndexedDbPersistence
} from "firebase/firestore";
import { errorHandler } from "./errorHandlingService";
import { toast } from "sonner";

// Enable offline persistence for better mobile experience
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore persistence enabled");
    })
    .catch((err) => {
      console.error("Failed to enable Firestore persistence:", err);
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn("Multiple tabs open, persistence only enabled in one tab.");
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        console.warn("Current browser doesn't support persistence.");
      }
    });
} catch (err) {
  console.error("Error configuring persistence:", err);
}

/**
 * Database service for Firestore operations with mobile-optimized features
 */
export const dbService = {
  /**
   * Add a document to a collection
   */
  add: async <T extends DocumentData>(collectionName: string, data: T): Promise<string> => {
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date()
      });
      return docRef.id;
    } catch (error) {
      errorHandler.handle(error, { 
        customMessage: `Failed to add document to ${collectionName}` 
      });
      throw error;
    }
  },

  /**
   * Alias for add (for compatibility)
   */
  create: async <T extends DocumentData>(collectionName: string, data: T): Promise<string> => {
    return dbService.add(collectionName, data);
  },

  /**
   * Set a document with a specific ID
   */
  set: async <T extends DocumentData>(collectionName: string, id: string, data: T): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: data.updatedAt || new Date()
      }, { merge: true });
    } catch (error) {
      errorHandler.handle(error, { 
        customMessage: `Failed to set document in ${collectionName}` 
      });
      throw error;
    }
  },

  /**
   * Get a document by ID
   */
  get: async <T = DocumentData>(collectionName: string, id: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as T;
        return {
          ...data,
          id: docSnap.id
        };
      } else {
        return null;
      }
    } catch (error) {
      errorHandler.handle(error, { 
        customMessage: `Failed to fetch document from ${collectionName}` 
      });
      throw error;
    }
  },

  /**
   * Alias for get (for compatibility)
   */
  getById: async <T = DocumentData>(collectionName: string, id: string): Promise<T | null> => {
    return dbService.get(collectionName, id);
  },

  /**
   * Update a document by ID
   */
  update: async <T extends DocumentData>(collectionName: string, id: string, data: Partial<T>): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      errorHandler.handle(error, { 
        customMessage: `Failed to update document in ${collectionName}` 
      });
      throw error;
    }
  },

  /**
   * Delete a document by ID
   */
  delete: async (collectionName: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      errorHandler.handle(error, { 
        customMessage: `Failed to delete document from ${collectionName}` 
      });
      throw error;
    }
  },

  /**
   * Query documents in a collection
   */
  query: async <T = DocumentData>
    (collectionPath: string, ...queryConstraints: QueryConstraint[]): Promise<T[]> => {
    try {
      const collectionRef = collection(db, collectionPath);
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as T[];
    } catch (error) {
      errorHandler.handle(error, { 
        customMessage: `Failed to query documents in ${collectionPath}` 
      });
      throw error;
    }
  },

  /**
   * Get all documents in a collection
   */
  getAll: async <T = DocumentData>(collectionName: string): Promise<T[]> => {
    try {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
      
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as T[];
    } catch (error) {
      errorHandler.handle(error, { 
        customMessage: `Failed to fetch documents from ${collectionName}` 
      });
      throw error;
    }
  },

  /**
   * Check if a document exists
   */
  exists: async (collectionName: string, id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      errorHandler.handle(error, { 
        customMessage: `Failed to check if document exists in ${collectionName}`,
        showToast: false
      });
      throw error;
    }
  },

  /**
   * Get collection reference
   */
  getCollectionRef: (collectionName: string) => {
    return collection(db, collectionName);
  },

  /**
   * Get document reference
   */
  getDocRef: (collectionName: string, id: string) => {
    return doc(db, collectionName, id);
  },

  /**
   * Toggle offline mode for testing or to save data when in poor network areas
   */
  setOfflineMode: async (offline: boolean): Promise<void> => {
    try {
      if (offline) {
        await disableNetwork(db);
        toast.info("App is now in offline mode");
      } else {
        await enableNetwork(db);
        toast.success("App is now online");
      }
    } catch (error) {
      console.error("Failed to change network status:", error);
      toast.error("Failed to change network mode");
    }
  }
};
