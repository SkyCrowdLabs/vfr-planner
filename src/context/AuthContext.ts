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

export const AuthContext = createContext<UserProfile | undefined>(undefined);
