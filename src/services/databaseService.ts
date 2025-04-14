
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  WithFieldValue,
  orderBy
} from "firebase/firestore";
import { db } from "@/config/firebase";

// Base database operations
export const dbService = {
  // Create document with custom ID
  createWithId: async <T extends DocumentData>(
    collectionName: string,
    id: string,
    data: WithFieldValue<T>
  ) => {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return id;
  },

  // Create document with auto-generated ID
  create: async <T extends DocumentData>(
    collectionName: string,
    data: WithFieldValue<T>
  ) => {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Get document by ID
  getById: async <T>(
    collectionName: string,
    id: string
  ): Promise<T | null> => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    
    return null;
  },

  // Alias for getById for backward compatibility
  get: async <T>(
    collectionName: string,
    id: string
  ): Promise<T | null> => {
    return dbService.getById(collectionName, id);
  },

  // Query collection
  query: async <T>(
    collectionName: string,
    ...queryConstraints: QueryConstraint[]
  ): Promise<T[]> => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }) as T);
  },

  // Update document
  update: async <T extends DocumentData>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return id;
  },

  // Delete document
  delete: async (collectionName: string, id: string) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return id;
  },

  // Get all documents in a collection
  getAll: async <T>(collectionName: string): Promise<T[]> => {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }) as T);
  },

  // Add document (alias for create method)
  add: async <T extends DocumentData>(
    collectionName: string,
    data: WithFieldValue<T>
  ) => {
    return dbService.create(collectionName, data);
  }
};
