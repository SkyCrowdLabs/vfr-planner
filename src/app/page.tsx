"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import { NextPage } from "next";
import RouteBuilder from "@/components/RouteBuilder";

const Home: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="lg:pl-72 flex flex-col h-screen justify-center">
          <Navigation setSidebarOpen={setSidebarOpen} />

          <main className="flex grow z-0">
            <RouteBuilder />
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
