"use client";
import { useState } from "react";
import Sidebar from "@/app/dashboard/Sidebar";
import Navigation from "@/app/dashboard/Navigation";
import AuthProvider, { UserProfile } from "@/context/AuthContext";
import Notification from "@/components/Notification";
import DialogProvider from "@/context/DialogContext";
import NewRoute from "../../components/NewRouteDialog";
import ConfirmReset from "../../components/ConfirmResetDialog";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userProfile: UserProfile | undefined;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  userProfile,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createNewRouteVisible, setCreateNewRouteVisible] = useState(false);
  const [confirmResetVisible, setConfirmResetVisible] = useState(false);

  return (
    <AuthProvider userProfile={userProfile}>
      <DialogProvider
        state={{
          createNewRouteVisible,
          setCreateNewRouteVisible,
          confirmResetVisible,
          setConfirmResetVisible,
        }}
      >
        <div>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <div className="lg:pl-72 flex min-h-screen flex-col justify-start">
            <Navigation
              setSidebarOpen={setSidebarOpen}
              userProfile={userProfile}
            />
            <main className="flex grow z-0 bg-white">{children}</main>
          </div>
          <Notification />
          <NewRoute
            open={createNewRouteVisible}
            setOpen={setCreateNewRouteVisible}
          />
          <ConfirmReset
            open={confirmResetVisible}
            setOpen={setConfirmResetVisible}
          />
        </div>
      </DialogProvider>
    </AuthProvider>
  );
};

export default DashboardLayout;
