"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_wholesaler: boolean;
  created_at: string;
  updated_at: string;
  profile_image?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (newProfile: UserProfile) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Cambiar a false por defecto

  const updateProfile = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsLoading(false); // Asegurar que se quite el loading cuando se actualiza
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setIsLoading(true); // Poner loading al limpiar para mostrar skeleton en el header
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const value = {
    profile,
    isLoading,
    updateProfile,
    clearProfile,
    setLoading,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
