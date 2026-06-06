/**
 * Core Service Interfaces
 * Define contracts that any backend implementation must fulfill
 * No Firebase, no implementation details - pure abstraction
 */

import { Project, ResearchPost, TimelineItem, Manifesto, Heuristic, Self, SiteConfig } from '../types';

/**
 * Database Service Interface
 * Abstracts away the specific database (Firebase, Supabase, PostgreSQL, etc.)
 */
export interface DatabaseService {
  /**
   * Fetch all documents from a collection
   */
  fetchCollection<T>(collectionName: string): Promise<T[]>;

  /**
   * Fetch a single document
   */
  fetchDocument<T>(collectionName: string, documentId: string): Promise<T | null>;

  /**
   * Save or update a document
   */
  saveDocument<T>(collectionName: string, documentId: string, data: T): Promise<void>;

  /**
   * Delete a document
   */
  deleteDocument(collectionName: string, documentId: string): Promise<void>;

  /**
   * Watch for real-time changes in a collection
   */
  onCollectionChange<T>(
    collectionName: string,
    callback: (items: T[]) => void
  ): () => void; // Returns unsubscribe function

  /**
   * Watch for real-time changes in a document
   */
  onDocumentChange<T>(
    collectionName: string,
    documentId: string,
    callback: (item: T | null) => void
  ): () => void; // Returns unsubscribe function
}

/**
 * Authentication Service Interface
 * Abstracts away the specific auth provider (Firebase, Auth0, Supabase, etc.)
 */
export interface AuthService {
  /**
   * Get the current logged-in user
   */
  getCurrentUser(): Promise<{ uid: string; email: string } | null>;

  /**
   * Send a magic code to the user's email
   */
  sendMagicCode(email: string): Promise<void>;

  /**
   * Verify the magic code to authenticate the user
   */
  verifyMagicCode(email: string, code: string): Promise<{ uid: string; email: string }>;

  /**
   * Sign out the current user
   */
  signOut(): Promise<void>;

  /**
   * Listen for auth state changes
   */
  onAuthStateChanged(callback: (user: { uid: string; email: string } | null) => void): () => void; // Returns unsubscribe
}

/**
 * Storage Service Interface
 * Abstracts away file storage (Firebase Storage, S3, etc.)
 */
export interface StorageService {
  /**
   * Upload a file and get the public URL
   */
  uploadFile(bucket: string, path: string, file: File): Promise<string>;

  /**
   * Delete a file
   */
  deleteFile(bucket: string, path: string): Promise<void>;

  /**
   * Get a file download URL
   */
  getDownloadUrl(bucket: string, path: string): Promise<string>;
}

/**
 * Service Registry
 * Container for all services - passed to React Context
 */
export interface ServiceRegistry {
  database: DatabaseService;
  auth: AuthService;
  storage: StorageService;
}
