"use client";
import { useState } from "react";
import Sidebar from "@/app/dashboard/Sidebar";
import Navigation from "@/app/dashboard/Navigation";
import { AuthContext, UserProfile } from "@/context/AuthContext";
import Notification from "@/components/Notification";
import { DialogContext } from "@/context/DialogContext";
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
    <AuthContext.Provider value={userProfile}>
      <DialogContext.Provider
        value={{
          createNewRouteVisible,
          setCreateNewRouteVisible,
          confirmResetVisible,
          setConfirmResetVisible,
        }}
      >
        <div>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <div className="lg:pl-72 flex flex-col min-h-screen h-screen justify-center">
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
      </DialogContext.Provider>
    </AuthContext.Provider>
  );
};

export default DashboardLayout;
