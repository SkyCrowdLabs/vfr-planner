"use client";

import React, { useContext, useEffect, useState } from "react";
import { LOCAL_STORAGE_WAYPOINTS_KEY } from "@/constants";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { Waypoint } from "./RouteBuilder";
import Pagination from "./Pagination";
import { format } from "date-fns";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export interface Route {
  created_at: string;
  id: number;
  name: string | null;
  user_id: string | null;
  waypoints: Waypoint[];
}

interface RouteProps {}

const Routes: React.FC<RouteProps> = () => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedRouteId, setSelectedRouteId] = useState<number | undefined>(
    undefined
  );
  const [count, setCount] = useState(0);

  const { data: routesResponse, error } = useSWR<{
    data: Route[];
    count: number;
  }>(`/routes?offset=${offset}&limit=${limit}`, fetcher);
  console.log(error);
  const { data: selectedRoute } = useSWR<{ data: Route }>(
    selectedRouteId ? `/routes/${selectedRouteId}` : null,
    fetcher
  );

  useEffect(() => {
    if (selectedRoute) {
      localStorage.setItem(
        LOCAL_STORAGE_WAYPOINTS_KEY,
        JSON.stringify(selectedRoute.data.waypoints)
      );
    }
  }, [selectedRoute]);

  const onClickRoute = async (id: number) => {
    setSelectedRouteId(id);
  };

  const handleNext = () => {
    const nextPage = selectedPage + 1;
    if ((nextPage - 1) * 10 < count) setSelectedPage(nextPage);
  };
  const handlePrev = () => {
    const prevPage = selectedPage - 1;
    if (prevPage > 0) setSelectedPage(prevPage);
  };
  const handleClickPage = (n: number) => {
    setSelectedPage(n);
  };
  useEffect(() => {
    setOffset((selectedPage - 1) * 10);
  }, [selectedPage]);
  useEffect(() => {
    setCount(routesResponse?.count || 0);
  }, [routesResponse]);

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
              <div className="-mx-4 mt-8 sm:-mx-0">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        Departure
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
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
                        className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {routesResponse?.data?.length &&
                      routesResponse?.data?.map((route) => (
                        <tr key={route.id}>
                          <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                            {route.name || "Unnamed route"}
                            <dl className="font-normal lg:hidden">
                              <dt className="sr-only">Departure</dt>
                              <dd className="mt-1 truncate text-gray-700">
                                {route.waypoints[0].name}
                              </dd>
                              <dt className="sr-only sm:hidden">Destination</dt>
                              <dd className="mt-1 truncate text-gray-500 sm:hidden">
                                {
                                  route.waypoints[route.waypoints.length - 1]
                                    .name
                                }
                              </dd>
                            </dl>
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                            {route.waypoints[0].name}
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                            {route.waypoints[route.waypoints.length - 1].name}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 min-w-48 sm:min-w-0">
                            {format(route.created_at, "HH:mm dd-MMM-yyyy")}
                          </td>
                          <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
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
                <Pagination
                  indexStart={offset + 1}
                  indexEnd={offset + (routesResponse?.data?.length || 0)}
                  count={count}
                  onClickNext={handleNext}
                  onClickPrev={handlePrev}
                  onClickPage={handleClickPage}
                  selectedPage={selectedPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routes;
