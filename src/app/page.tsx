"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import { NextPage } from "next";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

const Home: NextPage = () => {
  const initPos: LatLngExpression = [14.599512, 120.984222];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coords, setCoords] = useState<LatLngExpression | undefined>(undefined);
  const handleMapClick = (coords: LatLngExpression) => setCoords(coords);

  return (
    <>
      <div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="lg:pl-72 flex flex-col h-screen justify-center">
          <Navigation setSidebarOpen={setSidebarOpen} />

          <main className="flex grow z-0">
            <div className="absolute w-full h-full">
              <Map position={initPos} zoom={7} onMapClick={handleMapClick} />
              <div className="relative h-20 w-96 bottom-40 bg-white z-50 rounded-md left-[calc(50%-24rem)]">
                {JSON.stringify(coords)}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
