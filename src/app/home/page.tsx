"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import { NextPage } from "next";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse, User } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import Routes from "@/components/Routes";
import Aircraft from "@/components/Aircraft";
import Flights from "@/components/Flights";
import { Oval } from "react-loader-spinner";

const RouteBuilder = dynamic(() => import("@/components/RouteBuilder"), {
  loading: () => (
    <div className="h-full w-full z-0">
      <div className="flex h-full w-full items-center justify-center">
        <Oval
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </div>
  ),
  ssr: false,
});

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
  const [activeTab, setActiveTab] = useState("Map");

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
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="lg:pl-72 flex flex-col min-h-screen h-screen justify-center">
          <Navigation
            setSidebarOpen={setSidebarOpen}
            userProfile={userProfile}
          />

          <main className="flex grow z-0">
            {activeTab === "Map" && <RouteBuilder isLoggedIn={!!userProfile} />}
            {activeTab === "Routes" && <Routes />}
            {activeTab === "Aircraft" && <Aircraft />}
            {activeTab === "Flights" && <Flights />}
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
