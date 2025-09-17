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
  updateProfile: (newProfile: UserProfile) => void;
  clearProfile: () => void;
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

  const updateProfile = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, []);

  const value = {
    profile,
    updateProfile,
    clearProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
