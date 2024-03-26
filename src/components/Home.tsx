import React, { useState } from "react";
import Button from "./Button";
import NewRoute from "./NewRoute";

const Home = () => {
  const [isNewRouteOpen, setIsNewRouteOpen] = useState(false);
  const openNewRoute = () => setIsNewRouteOpen(true);
  return (
    <>
      <div>
        <Button onClick={openNewRoute}>Create a route</Button>
      </div>
      <NewRoute open={isNewRouteOpen} setOpen={setIsNewRouteOpen} />
    </>
  );
};

export default Home;
