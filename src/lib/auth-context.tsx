import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'admin' | 'user' | 'farmer';
export type UserStatus = 'pending' | 'approved' | 'rejected';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  status: UserStatus | null;
  isApproved: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  status: null,
  isApproved: false,
  loading: true,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setRole(null);
      setStatus(null);
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      const isBootstrappedAdmin = currentUser.email === 'klassic.ig@gmail.com';

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (isBootstrappedAdmin) {
          setRole('admin');
          setStatus('approved');
        } else {
          setRole((data.role as UserRole) || 'user');
          setStatus((data.status as UserStatus) || 'pending');
        }
      } else {
        // Create user document with pending access unless bootstrapped admin
        const initialRole: UserRole = isBootstrappedAdmin ? 'admin' : 'user';
        const initialStatus: UserStatus = isBootstrappedAdmin ? 'approved' : 'pending';
        
        await setDoc(userDocRef, {
          email: currentUser.email || '',
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
          role: initialRole,
          status: initialStatus,
          createdAt: new Date().toISOString(),
        });

        setRole(initialRole);
        setStatus(initialStatus);
      }
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error);
      // Fallback
      if (currentUser.email === 'klassic.ig@gmail.com') {
        setRole('admin');
        setStatus('approved');
      } else {
        setRole('user');
        setStatus('pending');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      await fetchUserData(auth.currentUser);
    }
  }, [fetchUserData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await fetchUserData(currentUser);
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  const isApproved = role === 'admin' || status === 'approved';

  return (
    <AuthContext.Provider value={{ user, role, status, isApproved, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
