"use client";

import { Dialog, Transition } from "@headlessui/react";
import {
  HomeIcon,
  MapIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { Fragment, useContext } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AuthContext } from "@/context/AuthContext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (s: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const auth = useContext(AuthContext);
  const navigation = [
    {
      name: "Home",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Map",
      href: "/dashboard/map",
      icon: MapIcon,
    },
    ...(auth
      ? [
          {
            name: "Routes",
            href: "/dashboard/routes",
            icon: MapPinIcon,
          },
          {
            name: "Aircraft",
            href: "/dashboard/aircraft",
            icon: PaperAirplaneIcon,
          },
        ]
      : []),
    // {
    //   name: "Flights",
    //   href: "/dashboard/flights",
    //   icon: ArchiveBoxIcon,
    // },
  ];

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link href={"/"}>
                      <Image
                        src="/images/favicon-32x32.png"
                        alt="airplane emoji"
                        className="w-8 h-auto"
                        width={32}
                        height={32}
                      />
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={clsx(
                                  pathname === item.href
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <item.icon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>

                      <li className="mt-auto"></li>
                      <h6 className="text-gray-400 text-xs">
                        <a href="https://www.skycrowd.dev">
                          Copyright © 2024 SkyCrowd Labs All Rights Reserved
                        </a>
                      </h6>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/">
              <Image
                src="/images/favicon-32x32.png"
                alt="airplane emoji"
                className="w-8 h-auto"
                width={32}
                height={32}
              />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={clsx(
                          pathname === item.href
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-800",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto"></li>
              <h6 className="text-gray-400 text-xs">
                <a href="https://www.skycrowd.dev">
                  Copyright © 2024 SkyCrowd Labs All Rights Reserved
                </a>
              </h6>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
