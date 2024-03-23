"use client";
import { Json } from "@/database.types";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LOCAL_STORAGE_WAYPOINTS_KEY, Waypoint } from "./RouteBuilder";

export interface Route {
  created_at: string;
  id: number;
  name: string | null;
  user_id: string | null;
  waypoints: Waypoint[];
}

interface RouteProps {}

const Routes: React.FC<RouteProps> = () => {
  const supabase = createClient();
  const [user, setUser] = useState<User | undefined>(undefined);
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);

  const onClickRoute = async (id: number) => {
    const res = await fetch(`/routes?id=${id}`);
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    localStorage.setItem(
      LOCAL_STORAGE_WAYPOINTS_KEY,
      JSON.stringify(data.data.waypoints)
    );
    return;
  };

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      return;
    };

    getUser();
  }, [supabase, router]);

  useEffect(() => {
    const getRoutes = async () => {
      if (user) {
        const res = await fetch("routes");
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setRoutes(data.data);
        return;
      }
    };

    getRoutes();
  }, [supabase, user]);

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Routes
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the routes in your account including their name,
              departure, destination and date created.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add route
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Departure
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Destination
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Created at
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {routes.length > 0 &&
                      routes.map((route) => (
                        <tr
                          key={route.id}
                          className="hover:bg-gray-200 hover:cursor-pointer"
                          onClick={() => onClickRoute(route.id)}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {route.name || "Unnamed route"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {route.waypoints[0].name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {route.waypoints[route.waypoints.length - 1].name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {route.created_at}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                              <span className="sr-only">, {route.name}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routes;
