import { init } from '@instantdb/react';
import { DatabaseService, AuthService, StorageService } from '@core/services';

const rawAppId = import.meta.env.VITE_INSTANT_APP_ID || '';
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUuid = uuidRegex.test(rawAppId);

if (!isValidUuid) {
  console.warn(
    '⚠️ sspirial.systems: VITE_INSTANT_APP_ID is not configured or is not a valid UUID.\n' +
    'Please set VITE_INSTANT_APP_ID in your .env.local file.\n' +
    'Falling back to dummy UUID: 00000000-0000-0000-0000-000000000000'
  );
}

const APP_ID = isValidUuid ? rawAppId : '00000000-0000-0000-0000-000000000000';
export const db = init({ appId: APP_ID });

function toUuid(str: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) {
    return str.toLowerCase();
  }

  // Generate a deterministic UUID based on the string hash
  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 << 5) - hash1 + char;
    hash1 |= 0;
    hash2 = (hash2 << 7) - hash2 + char;
    hash2 |= 0;
  }

  const hex1 = Math.abs(hash1).toString(16).padStart(8, '0');
  const hex2 = Math.abs(hash2).toString(16).padStart(8, '0');
  const base = (hex1 + hex2 + hex1 + hex2).slice(0, 32);

  return [
    base.slice(0, 8),
    base.slice(8, 12),
    base.slice(12, 16),
    base.slice(16, 20),
    base.slice(20, 32)
  ].join('-');
}

export class InstantDBDatabase implements DatabaseService {
  async fetchCollection<T>(collectionName: string): Promise<T[]> {
    try {
      const result = await db.queryOnce({ [collectionName]: {} });
      return (result.data?.[collectionName] as T[]) || [];
    } catch (error) {
      console.error(`Error fetching collection ${collectionName}:`, error);
      return [];
    }
  }

  async fetchDocument<T>(collectionName: string, documentId: string): Promise<T | null> {
    try {
      const uuid = toUuid(documentId);
      const result = await db.queryOnce({
        [collectionName]: {
          $: {
            where: {
              id: uuid
            }
          }
        }
      });
      const items = result.data?.[collectionName] as T[];
      return items && items.length > 0 ? items[0] : null;
    } catch (error) {
      console.error(`Error fetching document ${collectionName}/${documentId}:`, error);
      return null;
    }
  }

  async saveDocument<T>(collectionName: string, documentId: string, data: T): Promise<void> {
    try {
      const uuid = toUuid(documentId);
      const payload = typeof data === 'object' && data !== null
        ? { ...data, id: uuid }
        : data;
      // In InstantDB, transact update operates as an upsert (creates if entity id does not exist)
      await db.transact(
        db.tx[collectionName][uuid].update(payload as any)
      );
    } catch (error) {
      console.error(`Error saving document ${collectionName}/${documentId}:`, error);
      throw error;
    }
  }

  async deleteDocument(collectionName: string, documentId: string): Promise<void> {
    try {
      const uuid = toUuid(documentId);
      await db.transact(
        db.tx[collectionName][uuid].delete()
      );
    } catch (error) {
      console.error(`Error deleting document ${collectionName}/${documentId}:`, error);
      throw error;
    }
  }

  onCollectionChange<T>(collectionName: string, callback: (items: T[]) => void): () => void {
    const unsub = db.core.subscribeQuery(
      { [collectionName]: {} },
      (resp) => {
        if (resp.error) {
          console.error(`Error subscribing to collection ${collectionName}:`, resp.error);
          return;
        }
        if (resp.data) {
          callback((resp.data[collectionName] as T[]) || []);
        }
      }
    );
    return unsub;
  }

  onDocumentChange<T>(collectionName: string, documentId: string, callback: (item: T | null) => void): () => void {
    const uuid = toUuid(documentId);
    const unsub = db.core.subscribeQuery(
      {
        [collectionName]: {
          $: {
            where: {
              id: uuid
            }
          }
        }
      },
      (resp) => {
        if (resp.error) {
          console.error(`Error subscribing to document ${collectionName}/${documentId}:`, resp.error);
          return;
        }
        if (resp.data) {
          const items = resp.data[collectionName] as T[];
          callback(items && items.length > 0 ? items[0] : null);
        }
      }
    );
    return unsub;
  }
}

export class InstantDBAuth implements AuthService {
  async getCurrentUser(): Promise<{ uid: string; email: string } | null> {
    try {
      const user = await db.core.getAuth();
      return user ? { uid: user.id, email: user.email || '' } : null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  async sendMagicCode(email: string): Promise<void> {
    try {
      await db.auth.sendMagicCode({ email });
    } catch (error) {
      console.error('Error sending magic code:', error);
      throw error;
    }
  }

  async verifyMagicCode(email: string, code: string): Promise<{ uid: string; email: string }> {
    try {
      const { user } = await db.auth.signInWithMagicCode({ email, code });
      return { uid: user.id, email: user.email || '' };
    } catch (error) {
      console.error('Error verifying magic code:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await db.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  onAuthStateChanged(callback: (user: { uid: string; email: string } | null) => void): () => void {
    const unsub = db.core.subscribeAuth(({ user }) => {
      callback(user ? { uid: user.id, email: user.email || '' } : null);
    });
    return unsub;
  }
}

export class Base64StorageService implements StorageService {
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    // No-op for base64 direct embedding
  }

  async getDownloadUrl(bucket: string, path: string): Promise<string> {
    return '';
  }
}
