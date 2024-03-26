import { Airport, Waypoint } from "@/types";
import { getDistanceNm } from "@/utils/getDistanceNm";
import { getTrueCourseDeg } from "@/utils/getTrueCourse";
import { LatLng } from "leaflet";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RouteState {
  id?: string;
  name?: string;
  departure?: Airport;
  destination?: Airport;
  waypoints: Waypoint[];
  isModified: boolean;
  isLoading: boolean;
  error?: string;
  initializeRoute: (departure: Airport, destination: Airport) => void;
  addWaypoint: (waypoint: Waypoint, i: number) => void;
  editWaypoint: (id: string, waypoint: Partial<Waypoint>) => void;
  removeWaypoint: (id: string) => void;
  saveRoute: () => void;
  editRoute: () => void;
  getRoute: () => Pick<
    RouteState,
    "id" | "name" | "departure" | "destination" | "waypoints"
  >;
  resetRoute: () => void;
}

const initialRouteState = {
  id: undefined,
  name: undefined,
  departure: undefined,
  destination: undefined,
  waypoints: [],
  isLoading: false,
  isModified: false,
  error: undefined,
};

export const useRouteStore = create<RouteState>()(
  persist(
    (set, get) => ({
      ...initialRouteState,
      initializeRoute: (departure, destination) =>
        set((state) => {
          const departureWaypoint = {
            id: `departure-${departure.ident}`,
            name: departure.ident || "",
            latlng: new LatLng(
              departure.latitude_deg as number,
              departure.longitude_deg as number
            ),
          };
          const destinationWaypoint = {
            id: `destination-${destination.ident}`,
            name: destination.ident || "",
            latlng: new LatLng(
              destination.latitude_deg as number,
              destination.longitude_deg as number
            ),
          };
          return {
            ...state,
            departure,
            destination,
            waypoints: [
              departureWaypoint,
              {
                ...destinationWaypoint,
                distanceFromPrev: getDistanceNm(
                  departureWaypoint,
                  destinationWaypoint
                ),
                bearingFromPrev: getTrueCourseDeg(
                  departureWaypoint,
                  destinationWaypoint
                ),
              },
            ],
            isModified: true,
          };
        }),
      addWaypoint: (waypoint, i) => {
        set((state) => {
          const newWaypoints = [...state.waypoints];
          newWaypoints.splice(i, 0, waypoint);
          return {
            ...state,
            waypoints: newWaypoints,
            isModified: true,
          };
        });
      },
      editWaypoint: (id, waypoint) => {
        set((state) => {
          const index = state.waypoints.findIndex((w) => w.id === id);
          const editedWaypoints = [...state.waypoints];
          editedWaypoints[index] = { ...editedWaypoints[index], ...waypoint };
          return { ...state, waypoints: editedWaypoints, isModified: true };
        });
      },
      removeWaypoint: (id) => {
        set((state) => {
          const index = state.waypoints.findIndex((w) => w.id === id);
          const editedWaypoints = [...state.waypoints];
          editedWaypoints.splice(index, 1);
          return { ...state, waypoints: editedWaypoints, isModified: true };
        });
      },
      saveRoute: async () => {
        set((state) => {
          return { ...state, isLoading: true };
        });
        const routeState = get();
        const res = await fetch("/routes", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: routeState.name,
            departure: routeState.departure,
            destination: routeState.destination,
            waypoints: routeState.waypoints,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          set((state) => ({ ...state, error: data.message, isLoading: false }));
        }
        set((state) => ({
          ...state,
          isLoading: false,
          isModified: false,
          id: data.data.id,
        }));
      },
      editRoute: async () => {
        set((state) => {
          return { ...state, isLoading: true };
        });
        const routeState = get();
        const res = await fetch(`/routes/${routeState.id}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: routeState.name,
            departure: routeState.departure,
            destination: routeState.destination,
            waypoints: routeState.waypoints,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          set((state) => ({ ...state, error: data.message, isLoading: false }));
        }
        set((state) => ({
          ...state,
          isLoading: false,
          isModified: false,
        }));
      },
      getRoute: () => {
        const routeState = get();
        return {
          id: routeState.id,
          name: routeState.name,
          departure: routeState.departure,
          destination: routeState.destination,
          waypoints: routeState.waypoints,
        };
      },
      resetRoute: () => set((state) => ({ ...state, ...initialRouteState })),
    }),
    {
      name: "route-storage",
      partialize: (state) => ({
        id: state.id,
        name: state.name,
        departure: state.departure,
        destination: state.destination,
        waypoints: state.waypoints,
        isModified: state.isModified,
        isLoading: state.isLoading,
        error: state.error,
      }),
    }
  )
);
