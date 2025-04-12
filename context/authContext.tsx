import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { 
  doc, 
  setDoc
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { router } from "expo-router";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 100);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  
  const register = async (email: string, password: string, userData: any) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      try {
        // Store additional user data in Firestore without email and createdAt
        await setDoc(doc(db, "users", user.uid), {
          name: userData.name,
          age: userData.age,
          weight: userData.weight,
          height: userData.height,
          gender: userData.gender,
        });
        
        // Navigate to main app after successful registration
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 100);
        
        return user;
      } catch (firestoreError: any) {
        console.error("Firestore error:", firestoreError);
        throw new Error(`User created but profile data couldn't be saved: ${firestoreError.message}`);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setTimeout(() => {
        router.replace("/auth/login");
      }, 100);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};