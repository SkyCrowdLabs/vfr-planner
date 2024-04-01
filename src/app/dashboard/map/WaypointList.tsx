"use client";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useRouteStore } from "@/store/store";

interface WaypointListProps {}

const WaypointList: React.FC<WaypointListProps> = () => {
  const waypoints = useRouteStore((state) => state.waypoints);
  const name = useRouteStore((state) => state.name);
  const removeWaypoint = useRouteStore((state) => state.removeWaypoint);
  const renameWaypoint = useRouteStore((state) => state.renameWaypoint);
  const [isRenaming, setIsRenaming] = useState<string | undefined>(undefined);
  const lastIndex = waypoints.length - 1;
  const [newName, setNewName] = useState("");

  const handleDelete = (id: string): void => {
    if (isRenaming === id) setIsRenaming(undefined);
    removeWaypoint(id);
  };

  return (
    <ul role="list" className="divide-y divide-gray-100">
      <h2 className="text font-semibold leading-6 text-gray-900 mt-3 py-7">
        {name}
      </h2>
      {waypoints.map(({ id, name, distanceFromPrev, bearingFromPrev }, i) => {
        return (
          <li
            key={id}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div className="min-w-0">
              <div className="flex flex-col gap-2 items-start gap-x-3">
                {isRenaming === id ? (
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Name
                    </label>
                    <input
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value);
                      }}
                      type="name"
                      name="name"
                      id="name"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder={name}
                    />
                  </div>
                ) : (
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {name}
                  </p>
                )}
                {i > 0 && (
                  <p>
                    {distanceFromPrev?.toFixed(2)} nm,{" "}
                    {bearingFromPrev?.toFixed(0)} deg
                  </p>
                )}
              </div>
            </div>
            {![0, lastIndex].includes(i) && (
              <div className="flex flex-none items-center gap-x-4">
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        {({ focus }) => (
                          <>
                            {isRenaming === id ? (
                              <>
                                <button
                                  onClick={() => {
                                    renameWaypoint(id, newName);
                                    setNewName("");
                                    setIsRenaming(undefined);
                                  }}
                                  className={clsx(
                                    focus ? "bg-gray-50" : "",
                                    "block px-3 py-1 text-sm leading-6 text-gray-900"
                                  )}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setIsRenaming(undefined);
                                    setNewName("");
                                  }}
                                  className={clsx(
                                    focus ? "bg-gray-50" : "",
                                    "block px-3 py-1 text-sm leading-6 text-gray-900"
                                  )}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  setIsRenaming(id);
                                }}
                                className={clsx(
                                  focus ? "bg-gray-50" : "",
                                  "block px-3 py-1 text-sm leading-6 text-gray-900"
                                )}
                              >
                                Rename
                                <span className="sr-only">, {name}</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleDelete(id);
                              }}
                              className={clsx(
                                focus ? "bg-gray-50" : "",
                                "block px-3 py-1 text-sm leading-6 text-gray-900"
                              )}
                            >
                              Delete<span className="sr-only">, {name}</span>
                            </button>
                          </>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default WaypointList;
