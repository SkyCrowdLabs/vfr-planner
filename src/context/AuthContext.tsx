"use client";
import { PostgrestSingleResponse, User } from "@supabase/supabase-js";
import { createContext } from "react";

export interface UserProfile {
  user: User;
  profile: PostgrestSingleResponse<{
    created_at: string;
    first_name: string | null;
    id: string;
    last_name: string | null;
    middle_name: string | null;
    user_id: string | null;
  }>;
}

interface AuthProviderProps {
  children: React.ReactNode;
  userProfile: UserProfile | undefined;
}

export const AuthContext = createContext<UserProfile | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  userProfile,
}) => {
  return (
    <AuthContext.Provider value={userProfile}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
