import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import { app } from '@shell/firebase';

export const auth = getAuth(app);

// Ensure auth survives reloads/offline sessions
setPersistence(auth, browserLocalPersistence).catch((error) => {
	console.warn('Auth persistence fallback to default:', error?.code ?? error);
});

// Owner email - only this user can access admin
export const OWNER_EMAIL = 'core@sspirial.systems'; // Change this to your email
