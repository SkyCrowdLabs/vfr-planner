"use client";

import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import Pagination from "@/components/Pagination";
import { format } from "date-fns";
import { Route } from "@/types";
import { useRouteStore } from "@/store/store";
import next, { NextPage } from "next";
import toast from "react-hot-toast";
import { DialogContext } from "@/context/DialogContext";
import { PlusIcon } from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";

interface RoutesTableProps {
  routes: Route[];
  count: number;
}

const RoutesTable: NextPage<RoutesTableProps> = ({ routes, count }) => {
  const [offset, setOffset] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedRouteId, setSelectedRouteId] = useState<number | undefined>(
    undefined
  );
  const { setCreateNewRouteVisible } = useContext(DialogContext);
  const [initialState, setInitialState] = useState(true);

  const loadRoute = useRouteStore((state) => state.loadRoute);
  const setIsMapBusy = useRouteStore((state) => state.setIsMapBusy);
  const isModified = useRouteStore((state) => state.isModified);

  const { data: routesResponse, error } = useSWR<{
    data: Route[];
    count: number;
  }>(initialState ? null : `/routes?offset=${offset}&limit=10`, fetcher);
  const { data: selectedRoute } = useSWR<{ data: Route }>(
    selectedRouteId ? `/routes/${selectedRouteId}` : null,
    fetcher
  );

  const onClickRoute = async (id: number) => {
    setSelectedRouteId(id);
    setIsMapBusy(true);
  };
  const handleNext = () => {
    setInitialState(false);
    const nextPage = selectedPage + 1;
    if ((nextPage - 1) * 10 < count) {
      console.log(nextPage, (selectedPage - 1) * 10);
      setSelectedPage(nextPage);
      setOffset((nextPage - 1) * 10);
    }
  };
  const handlePrev = () => {
    setInitialState(false);
    const prevPage = selectedPage - 1;
    if (prevPage > 0) {
      setSelectedPage(prevPage);
      setOffset((prevPage - 1) * 10);
    }
  };
  const handleClickPage = (n: number) => {
    setInitialState(false);
    setSelectedPage(n);
    setOffset((n - 1) * 10);
  };

  useEffect(() => {
    if (selectedRoute) {
      loadRoute(selectedRoute.data);
      setIsMapBusy(false);
      toast.success("Route successfully loaded");
    }
  }, [loadRoute, selectedRoute, setIsMapBusy]);

  return (
    <div className="flex grow flex-row justify-center md:mt-8 mt-4">
      <div className="px-4 sm:px-6 lg:px-8">
        {!!routes.length ? (
          <>
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
                  onClick={() => {
                    setCreateNewRouteVisible(true);
                  }}
                  type="button"
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add route
                </button>
                {isModified}
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="-mx-4 mt-4 sm:-mx-0">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-6 sm:pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
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
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {(initialState
                          ? routes
                          : routesResponse?.data || []
                        ).map((route) => (
                          <tr
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                              if (route.id) onClickRoute(route.id);
                            }}
                            key={route.id}
                          >
                            <td className="w-full max-w-0 py-4 pl-6 sm:pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none">
                              {route.name || "Unnamed route"}
                              <dl className="font-normal lg:hidden">
                                <dt className="sr-only">Departure</dt>
                                <dd className="mt-1 truncate text-gray-700">
                                  {route.waypoints[0].name}
                                </dd>
                                <dt className="sr-only sm:hidden">
                                  Destination
                                </dt>
                                <dd className="mt-1 truncate text-gray-700 sm:hidden">
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
                              {route.created_at &&
                                format(route.created_at, "HH:mm dd-MMM-yyyy")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Pagination
                      indexStart={offset + 1}
                      indexEnd={offset + routes.length}
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
          </>
        ) : (
          <div className="flex h-full justify-center items-center">
            <div className="text-center md:mb-16">
              <MapPinIcon className="h-12 text-gray-400 w-full" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No routes
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a route.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setCreateNewRouteVisible(true);
                  }}
                  type="button"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <PlusIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  New Route
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutesTable;
