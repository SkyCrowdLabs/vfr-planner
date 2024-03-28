import { NextPage } from "next";
import { createClient } from "@/utils/supabase/server";
import { UserProfile } from "@/context/AuthContext";
import DashboardLayout from "./DashboardLayout";

interface DashboardProps {
  children: React.ReactNode;
}

const getUserProfile = async (): Promise<UserProfile | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const supabase = createClient();
  const { error, data } = await supabase.auth.getUser();
  if (error || !data) return undefined;

  const profile = await supabase
    .from("profiles")
    .select()
    .eq("user_id", data.user.id)
    .limit(1)
    .single();
  return { user: data.user, profile };
};

const Dashboard: NextPage<DashboardProps> = async ({ children }) => {
  const userProfile = await getUserProfile();
  return (
    <DashboardLayout userProfile={userProfile}>{children}</DashboardLayout>
  );
};

export default Dashboard;
