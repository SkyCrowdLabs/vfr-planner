import React from "react";
import Spinner from "./Spinner";

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default Loader;
