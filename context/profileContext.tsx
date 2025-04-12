import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useAuth } from './authContext';

export interface ProfileData {
  name: string;
  age: number;
  gender: string; // Changed from 'sex' to match your Firestore schema
  weight: number;
  height: number;
  profilePicture?: string;
}

interface ProfileContextType {
  profileData: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  updateProfileData: (data: Partial<ProfileData>) => Promise<void>;
  refreshProfileData: () => Promise<void>;
}

const defaultProfileData: ProfileData = {
  name: "Loading...",
  age: 0,
  gender: "",
  weight: 0,
  height: 0,
  profilePicture: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Function to fetch user profile data from Firestore
  const fetchUserProfile = async () => {
    if (!user) {
      setProfileData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as ProfileData;
        setProfileData(userData);
      } else {
        setProfileData(defaultProfileData);
        setError("No user data found");
      }
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      setError(err.message);
      setProfileData(defaultProfileData);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile in Firestore
  const updateProfileData = async (data: Partial<ProfileData>) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    setIsLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, data);
      
      // Update local state after successful Firestore update
      setProfileData(prev => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      throw new Error("Failed to update profile: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually refresh profile data
  const refreshProfileData = async () => {
    await fetchUserProfile();
  };

  // Fetch user profile when component mounts or user changes
  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  return (
    <ProfileContext.Provider 
      value={{ profileData, isLoading, error, updateProfileData, refreshProfileData }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};