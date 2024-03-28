"use client";
import React, { useContext } from "react";
import { MapPinIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { DialogContext } from "@/context/DialogContext";
import clsx from "clsx";

const Home: NextPage = () => {
  const { setCreateNewRouteVisible } = useContext(DialogContext);
  const items = [
    {
      title: "Create a Route",
      description: "Establish the route for your flight.",
      icon: MapPinIcon,
      background: "bg-pink-500",
      handleClick: () => setCreateNewRouteVisible(true),
    },
    {
      title: "Create an Aircraft",
      description: "Let us now the aircraft that you will use.",
      icon: PaperAirplaneIcon,
      background: "bg-yellow-500",
      handleClick: () => {},
    },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="md:mb-16 mx-8">
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Flight plans
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          You haven’t created a flight plan yet. Get started by selecting
          creating a route or an aircraft.
        </p>
        <ul
          role="list"
          className="mt-6 grid grid-cols-1 gap-6 border-b border-t border-gray-200 py-6 sm:grid-cols-2"
        >
          {items.map((item, itemIdx) => (
            <li key={itemIdx} className="flow-root">
              <div className="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-50">
                <div
                  className={clsx(
                    item.background,
                    "flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg"
                  )}
                >
                  <item.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    <button
                      onClick={item.handleClick}
                      className="focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      <span>{item.title}</span>
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
