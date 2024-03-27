import { Fragment, useRef, useState } from "react";
import { Combobox, Dialog, Label, Transition } from "@headlessui/react";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import clsx from "clsx";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { Airport } from "@/types";
import { useRouteStore } from "@/store/store";
import { useRouter } from "next/navigation";

interface NewRouteProps {
  open: boolean;
  setOpen: (b: boolean) => void;
}

const NewRoute: React.FC<NewRouteProps> = ({ open, setOpen }) => {
  const router = useRouter();
  const initializeRoute = useRouteStore((state) => state.initializeRoute);
  const cancelButtonRef = useRef(null);
  const [departureSearch, setDepartureSearch] = useState("");
  const [arrivalSearch, setArrivalSearch] = useState("");
  const { data: airports } = useSWR<{ data: Airport[] }>(`/airports`, fetcher);
  const [departure, setDeparture] = useState<Airport | undefined>(undefined);
  const [arrival, setArrival] = useState<Airport | undefined>(undefined);

  const departureAirportsList =
    airports?.data.filter(
      ({ ident, name }) =>
        ident?.toLowerCase().includes(departureSearch.toLowerCase()) ||
        name?.toLowerCase().includes(departureSearch.toLowerCase())
    ) || airports?.data;
  const arrivalAirportsList =
    airports?.data.filter(
      ({ ident, name }) =>
        ident?.toLowerCase().includes(arrivalSearch.toLowerCase()) ||
        name?.toLowerCase().includes(arrivalSearch.toLowerCase())
    ) || airports?.data;

  const initialize = () => {
    if (!departure || !arrival) return;
    initializeRoute(departure, arrival);
    router.push("/dashboard/map");
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Create new route
                  </Dialog.Title>
                  <div className="mt-2">
                    <Combobox
                      as="div"
                      value={departure}
                      onChange={setDeparture}
                    >
                      <Label className="block text-sm font-medium leading-6 text-gray-900">
                        Departure
                      </Label>
                      <div className="relative mt-2">
                        <Combobox.Input
                          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onChange={(event) =>
                            setDepartureSearch(event.target.value)
                          }
                          displayValue={(airport: Airport) =>
                            `${airport.ident} ${airport.name}` || ""
                          }
                          placeholder="Select a departure airport"
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Combobox.Button>

                        {!!departureAirportsList?.length && (
                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {departureAirportsList &&
                              departureAirportsList.map((airport) => (
                                <Combobox.Option
                                  key={airport.id}
                                  value={airport}
                                  className={({ focus }) =>
                                    clsx(
                                      "relative cursor-default select-none py-2 pl-3 pr-9",
                                      focus
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                    )
                                  }
                                >
                                  {({ focus, selected }) => (
                                    <>
                                      <span
                                        className={clsx(
                                          "block truncate",
                                          selected && "font-semibold"
                                        )}
                                      >
                                        {airport.ident} {airport.name}
                                      </span>

                                      {selected && (
                                        <span
                                          className={clsx(
                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                            focus
                                              ? "text-white"
                                              : "text-indigo-600"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                          </Combobox.Options>
                        )}
                      </div>
                    </Combobox>
                  </div>
                  <div className="mt-2">
                    <Combobox as="div" value={arrival} onChange={setArrival}>
                      <Label className="block text-sm font-medium leading-6 text-gray-900">
                        Arrival
                      </Label>
                      <div className="relative mt-2">
                        <Combobox.Input
                          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onChange={(event) =>
                            setArrivalSearch(event.target.value)
                          }
                          displayValue={(airport: Airport) =>
                            `${airport.ident} ${airport.name}` || ""
                          }
                          placeholder="Select an arrival airport"
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Combobox.Button>

                        {!!arrivalAirportsList?.length && (
                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {arrivalAirportsList &&
                              arrivalAirportsList.map((airport) => (
                                <Combobox.Option
                                  key={airport.id}
                                  value={airport}
                                  className={({ focus }) =>
                                    clsx(
                                      "relative cursor-default select-none py-2 pl-3 pr-9",
                                      focus
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                    )
                                  }
                                >
                                  {({ focus, selected }) => (
                                    <>
                                      <span
                                        className={clsx(
                                          "block truncate",
                                          selected && "font-semibold"
                                        )}
                                      >
                                        {airport.ident} {airport.name}
                                      </span>

                                      {selected && (
                                        <span
                                          className={clsx(
                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                            focus
                                              ? "text-white"
                                              : "text-indigo-600"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                          </Combobox.Options>
                        )}
                      </div>
                    </Combobox>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={initialize}
                  >
                    Build route
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default NewRoute;
