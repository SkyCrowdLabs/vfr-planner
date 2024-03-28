"use client";
import React, { useContext, useState } from "react";
import Button from "@/components/Button";
import { NextPage } from "next";
import { DialogContext } from "@/context/DialogContext";

const Home: NextPage = () => {
  const { setCreateNewRouteVisible } = useContext(DialogContext);

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div>
        <Button
          onClick={() => {
            setCreateNewRouteVisible(true);
          }}
        >
          Add route
        </Button>
      </div>
    </div>
  );
};

export default Home;
