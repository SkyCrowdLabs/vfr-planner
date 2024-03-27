"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/dashboard/Sidebar";
import Navigation from "@/app/dashboard/Navigation";
import { NextPage } from "next";
import { createClient } from "@/utils/supabase/client";
import { AuthContext, UserProfile } from "@/context/AuthContext";

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard: NextPage<DashboardProps> = ({ children }) => {
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
    <AuthContext.Provider value={userProfile}>
      <div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="lg:pl-72 flex flex-col min-h-screen h-screen justify-center">
          <Navigation
            setSidebarOpen={setSidebarOpen}
            userProfile={userProfile}
          />

          <main className="flex grow z-0 bg-white">{children}</main>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default Dashboard;
