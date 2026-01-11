/**
 * Firebase Implementation of Core Service Interfaces
 * Shell: Concrete Firebase adapters
 * Wraps Firebase SDK to conform to the DatabaseService interface
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  onSnapshot,
  query,
  Query,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import {
  DatabaseService,
  AuthService,
  StorageService,
} from '@core/services';
import { db, storage } from '../firebase';

/**
 * Firebase Database Service Implementation
 */
export class FirebaseDatabase implements DatabaseService {
  async fetchCollection<T>(collectionName: string): Promise<T[]> {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map(doc => doc.data() as T);
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return [];
    }
  }

  async fetchDocument<T>(collectionName: string, documentId: string): Promise<T | null> {
    try {
      const snapshot = await getDoc(doc(db, collectionName, documentId));
      return snapshot.exists() ? (snapshot.data() as T) : null;
    } catch (error) {
      console.error(`Error fetching ${collectionName}/${documentId}:`, error);
      return null;
    }
  }

  async saveDocument<T>(collectionName: string, documentId: string, data: T): Promise<void> {
    try {
      await setDoc(doc(db, collectionName, documentId), data);
    } catch (error) {
      console.error(`Error saving ${collectionName}/${documentId}:`, error);
      throw error;
    }
  }

  async deleteDocument(collectionName: string, documentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, collectionName, documentId));
    } catch (error) {
      console.error(`Error deleting ${collectionName}/${documentId}:`, error);
      throw error;
    }
  }

  onCollectionChange<T>(
    collectionName: string,
    callback: (items: T[]) => void
  ): () => void {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      snapshot => {
        const items = snapshot.docs.map(doc => doc.data() as T);
        callback(items);
      },
      error => {
        console.error(`Error listening to ${collectionName}:`, error);
      }
    );
    return unsubscribe;
  }

  onDocumentChange<T>(
    collectionName: string,
    documentId: string,
    callback: (item: T | null) => void
  ): () => void {
    const unsubscribe = onSnapshot(
      doc(db, collectionName, documentId),
      snapshot => {
        callback(snapshot.exists() ? (snapshot.data() as T) : null);
      },
      error => {
        console.error(`Error listening to ${collectionName}/${documentId}:`, error);
      }
    );
    return unsubscribe;
  }
}

/**
 * Firebase Authentication Service Implementation
 */
export class FirebaseAuth implements AuthService {
  private auth = getAuth();

  async getCurrentUser(): Promise<{ uid: string; email: string } | null> {
    const user = this.auth.currentUser;
    return user ? { uid: user.uid, email: user.email || '' } : null;
  }

  async signIn(email: string, password: string): Promise<{ uid: string; email: string }> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return { uid: result.user.uid, email: result.user.email || '' };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string): Promise<{ uid: string; email: string }> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return { uid: result.user.uid, email: result.user.email || '' };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  onAuthStateChanged(
    callback: (user: { uid: string; email: string } | null) => void
  ): () => void {
    const unsubscribe = onAuthStateChanged(this.auth, user => {
      callback(
        user ? { uid: user.uid, email: user.email || '' } : null
      );
    });
    return unsubscribe;
  }
}

/**
 * Firebase Storage Service Implementation
 */
export class FirebaseStorage implements StorageService {
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    try {
      const fileRef = ref(storage, `${bucket}/${path}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error(`Error uploading file to ${bucket}/${path}:`, error);
      throw error;
    }
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    try {
      const fileRef = ref(storage, `${bucket}/${path}`);
      await deleteObject(fileRef);
    } catch (error) {
      console.error(`Error deleting file from ${bucket}/${path}:`, error);
      throw error;
    }
  }

  async getDownloadUrl(bucket: string, path: string): Promise<string> {
    try {
      const fileRef = ref(storage, `${bucket}/${path}`);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error(`Error getting download URL for ${bucket}/${path}:`, error);
      throw error;
    }
  }
}
