import Spinner from "@/components/Spinner";
import { NextPage } from "next";
import React from "react";

const Loading: NextPage = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Spinner />;
    </div>
  );
};

export default Loading;
