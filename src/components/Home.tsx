import React, { useState } from "react";
import Button from "./Button";
import dynamic from "next/dynamic";
import Spinner from "./Spinner";

const NewRoute = dynamic(() => import("./NewRoute"), {
  loading: () => (
    <div className="h-full w-full z-0">
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    </div>
  ),
  ssr: false,
});

const Home = () => {
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
