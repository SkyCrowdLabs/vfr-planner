"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import Pagination from "@/components/Pagination";
import { format } from "date-fns";
import { Aircraft } from "@/types";
import { NextPage } from "next";

interface AircraftProps {}

const AircraftPage: NextPage<AircraftProps> = () => {
  const [offset, setOffset] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [count, setCount] = useState(0);

  const { data: aircraftResponse, error } = useSWR<{
    data: Aircraft[];
    count: number;
  }>(`/aircraft?offset=${offset}&limit=10`, fetcher);
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
    setCount(aircraftResponse?.count || 0);
  }, [aircraftResponse]);

  return (
    <div className="flex grow flex-row justify-center md:mt-8 mt-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Aircraft
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the aircraft in your account including their tail
              number, type, engine and date created.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add aircraft
            </button>
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
                        className="py-3.5 pl-6 sm:pl-4 pr-3 text-left text-sm font-semibold text-gray-900 "
                      >
                        Tail number
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                      >
                        Engine
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
                    {!!aircraftResponse?.data?.length &&
                      aircraftResponse?.data?.map((aircraft) => (
                        <tr
                          className="cursor-pointer hover:bg-gray-200"
                          key={aircraft.id}
                        >
                          <td className="w-full max-w-0 py-4 pl-6 sm:pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none ">
                            {aircraft.tail_num}
                            <dl className="font-normal lg:hidden">
                              <dt className="sr-only">Type</dt>
                              <dd className="mt-1 truncate text-gray-700">
                                {aircraft.type}
                              </dd>
                            </dl>
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                            {aircraft.type}
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                            {aircraft.engine}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 min-w-48 sm:min-w-0">
                            {aircraft.created_at &&
                              format(aircraft.created_at, "HH:mm dd-MMM-yyyy")}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <Pagination
                  indexStart={offset + 1}
                  indexEnd={offset + (aircraftResponse?.data?.length || 0)}
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

export default AircraftPage;
