"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { NextPage } from "next";
import NewRoute from "@/app/dashboard/NewRoute";
import toast from "react-hot-toast";

const Home: NextPage = () => {
  const [isNewRouteOpen, setIsNewRouteOpen] = useState(false);
  const openNewRoute = () => setIsNewRouteOpen(true);

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div>
        <Button onClick={openNewRoute}>Create a route</Button>
      </div>
      <NewRoute open={isNewRouteOpen} setOpen={setIsNewRouteOpen} />
    </div>
  );
};

export default Home;
