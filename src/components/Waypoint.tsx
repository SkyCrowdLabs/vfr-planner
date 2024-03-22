import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Waypoint } from "./RouteBuilder";
import LatLon, { Dms } from "geodesy/latlon-spherical.js";

interface WaypointListProps {
  waypoints: Waypoint[];
}

const WaypointList: React.FC<WaypointListProps> = ({ waypoints }) => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {waypoints.map(({ id, name, latlng }, i) => {
        const distance =
          i > 0
            ? (waypoints[i - 1].latlng.distanceTo(latlng) / 1000).toFixed(2)
            : undefined;

        const p1 =
          i > 0
            ? new LatLon(
                waypoints[i - 1].latlng.lat,
                waypoints[i - 1].latlng.lng
              )
            : undefined;
        const p2 = new LatLon(latlng.lat, latlng.lng);
        const bearing = p1?.initialBearingTo(p2).toFixed(0);

        return (
          <li
            key={id}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {name}
                </p>
                {i > 0 && (
                  <p>
                    {distance} km, {bearing} deg
                  </p>
                )}
              </div>
            </div>
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
                      {({ active }) => (
                        <a
                          href="#"
                          className={clsx(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                          )}
                        >
                          Edit<span className="sr-only">, {name}</span>
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={clsx(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                          )}
                        >
                          Move<span className="sr-only">, {name}</span>
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={clsx(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                          )}
                        >
                          Delete<span className="sr-only">, {name}</span>
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default WaypointList;
