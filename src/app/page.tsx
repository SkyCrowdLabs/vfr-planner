"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import { NextPage } from "next";
import RouteBuilder from "@/components/RouteBuilder";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse, User } from "@supabase/supabase-js";

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

const Home: NextPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(
    undefined
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUserInfo = async () => {
      const { error, data } = await supabase.auth.getUser();
      if (error || !data) return;

      const profile = await supabase
        .from("profiles")
        .select()
        .eq("user_id", data.user.id)
        .limit(1)
        .single();
      setUserProfile({ user: data.user, profile });
    };

    getUserInfo();
  }, [supabase]);

  return (
    <>
      <div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="lg:pl-72 flex flex-col min-h-screen h-screen justify-center">
          <Navigation
            setSidebarOpen={setSidebarOpen}
            userProfile={userProfile}
          />

          <main className="flex grow z-0">
            <RouteBuilder />
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
