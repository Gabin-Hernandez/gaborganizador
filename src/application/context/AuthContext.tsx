'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/infrastructure/firebase/firebaseClient';
import { UserProfile } from '@/domain/entities/UserProfile';
import { UserProfileRepositoryFirebase } from '@/infrastructure/firebase/userProfileRepositoryFirebase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const profileRepo = new UserProfileRepositoryFirebase();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchProfile = async (uid: string) => {
    setProfileLoading(true);
    try {
      let p = await profileRepo.getProfile(uid);
      if (!p) {
        // Create initial un-onboarded profile doc
        const newProfile: Partial<UserProfile> & { uid: string } = {
          uid,
          email: auth.currentUser?.email || '',
          salary: 0,
          onboarded: false
        };
        await profileRepo.saveProfile(newProfile);
        p = await profileRepo.getProfile(uid);
      }
      if (p && typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(`finanzas_profile_${uid}`, JSON.stringify(p));
        } catch {
          // ignore quota issues
        }
      }
      setProfile(p);
      return p;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Instant hydration from cache if available
        if (typeof window !== 'undefined') {
          try {
            const cached = sessionStorage.getItem(`finanzas_profile_${currentUser.uid}`);
            if (cached) {
              setProfile(JSON.parse(cached));
            }
          } catch {
            // ignore JSON errors
          }
        }
        // Immediately unblock auth loading and sync profile in background
        setLoading(false);
        fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    await fetchProfile(res.user.uid);
  };

  const register = async (email: string, pass: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await fetchProfile(res.user.uid);
  };

  const logout = async () => {
    if (user && typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(`finanzas_profile_${user.uid}`);
      } catch {
        // ignore
      }
    }
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      return await fetchProfile(user.uid);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoading,
        login,
        register,
        logout,
        refreshProfile
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
