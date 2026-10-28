import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { auth, db, signInWithPopup, signOut, googleProvider, testConnection } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  dbConnected: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateUserProgress: (completedCount: number, currentWeek: number) => void;
}

const DEFAULT_INTERN: UserProfile = {
  id: 'demo-intern-101',
  fullName: 'Sarah Chen (Intern)',
  email: 'intern.sarah@example.com',
  role: 'intern',
  completedTasksCount: 3,
  currentWeek: 4,
};

const DEFAULT_MENTOR: UserProfile = {
  id: 'mentor-admin-1',
  fullName: 'Mohammed (Lead Mentor)',
  email: 'mohammedhrasin@gmail.com',
  role: 'mentor',
  completedTasksCount: 48,
  currentWeek: 48,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('internship_app_user');
    return saved ? JSON.parse(saved) : DEFAULT_INTERN;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    // Test Firestore connection on boot
    testConnection().then((ok) => setDbConnected(ok));

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          const isBootstrapAdmin = fbUser.email === 'mohammedhrasin@gmail.com';

          if (snap.exists()) {
            const data = snap.data();
            const profile: UserProfile = {
              id: fbUser.uid,
              fullName: data.fullName || fbUser.displayName || 'User',
              email: fbUser.email || '',
              role: isBootstrapAdmin ? 'mentor' : (data.role || 'intern'),
              completedTasksCount: data.completedTasksCount ?? 0,
              currentWeek: data.currentWeek ?? 1,
            };
            setUser(profile);
            localStorage.setItem('internship_app_user', JSON.stringify(profile));
          } else {
            const newProfile: UserProfile = {
              id: fbUser.uid,
              fullName: fbUser.displayName || 'Intern User',
              email: fbUser.email || '',
              role: isBootstrapAdmin ? 'mentor' : 'intern',
              completedTasksCount: 0,
              currentWeek: 1,
            };
            await setDoc(userDocRef, {
              ...newProfile,
              createdAt: new Date().toISOString(),
            });
            setUser(newProfile);
            localStorage.setItem('internship_app_user', JSON.stringify(newProfile));
          }
        } catch (err) {
          console.warn('Could not sync user with Firestore, keeping local user state:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign In error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setUser(DEFAULT_INTERN);
      localStorage.setItem('internship_app_user', JSON.stringify(DEFAULT_INTERN));
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const switchRole = (newRole: UserRole) => {
    const updatedUser = newRole === 'mentor' ? DEFAULT_MENTOR : DEFAULT_INTERN;
    setUser(updatedUser);
    localStorage.setItem('internship_app_user', JSON.stringify(updatedUser));
  };

  const updateUserProgress = (completedCount: number, currentWeek: number) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      completedTasksCount: completedCount,
      currentWeek: currentWeek,
    };
    setUser(updated);
    localStorage.setItem('internship_app_user', JSON.stringify(updated));

    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      setDoc(userDocRef, { completedTasksCount: completedCount, currentWeek }, { merge: true }).catch((e) =>
        console.warn('Progress sync error:', e)
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        dbConnected,
        loginWithGoogle,
        logout,
        switchRole,
        updateUserProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
