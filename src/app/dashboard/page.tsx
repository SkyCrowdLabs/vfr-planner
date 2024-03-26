"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import { NextPage } from "next";
import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import Routes from "@/components/Routes";
import Aircraft from "@/components/Aircraft";
import Flights from "@/components/Flights";
import { AuthContext, UserProfile } from "@/context/AuthContext";
import Spinner from "@/components/Spinner";
import { SWRConfig } from "swr";
import { useRouter } from "next/navigation";
import Home from "@/components/Home";

const RouteBuilder = dynamic(() => import("@/components/RouteBuilder"), {
  loading: () => (
    <div className="h-full w-full z-0">
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    </div>
  ),
  ssr: false,
});

const Dashboard: NextPage = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(
    undefined
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("Home");

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
      <SWRConfig
        value={{
          onError: (error) => {
            if (error.status === 401) {
              router.push("/login");
            }
          },
        }}
      >
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
              {activeTab === "Home" && <Home />}
              {activeTab === "Map" && (
                <RouteBuilder isLoggedIn={!!userProfile} />
              )}
              {activeTab === "Map" && <div>Map</div>}
              {activeTab === "Routes" && <Routes />}
              {activeTab === "Aircraft" && <Aircraft />} *
              {activeTab === "Flights" && <Flights />}
            </main>
          </div>
        </div>
      </SWRConfig>
    </AuthContext.Provider>
  );
};

export default Dashboard;
