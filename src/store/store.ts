import { Airport, Route, Waypoint } from "@/types";
import { getDistanceNm } from "@/utils/getDistanceNm";
import { getTrueCourseDeg } from "@/utils/getTrueCourse";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RouteState extends Route {
  isModified: boolean;
  isLoading: boolean;
  error?: string;
  initializeRoute: (departure: Airport, destination: Airport) => void;
  addWaypoint: (waypoint: Waypoint, i: number) => void;
  editWaypoint: (id: string, waypoint: Waypoint) => void;
  removeWaypoint: (id: string) => void;
  saveRoute: () => Promise<void>;
  editRoute: () => Promise<void>;
  loadRoute: (route: Route) => void;
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
            latlng: {
              lat: departure.latitude_deg as number,
              lng: departure.longitude_deg as number,
            },
          };
          const destinationWaypoint = {
            id: `destination-${destination.ident}`,
            name: destination.ident || "",
            latlng: {
              lat: destination.latitude_deg as number,
              lng: destination.longitude_deg as number,
            },
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
          const prevWaypoint = { ...state.waypoints[i - 1] };
          const nextWaypoint = { ...state.waypoints[i] };

          const currentWaypoint: Waypoint = {
            ...waypoint,
            distanceFromPrev: getDistanceNm(prevWaypoint, waypoint),
            bearingFromPrev: getTrueCourseDeg(prevWaypoint, waypoint),
          };
          const updatedNextWaypoint: Waypoint = {
            ...nextWaypoint,
            distanceFromPrev: getDistanceNm(waypoint, nextWaypoint),
            bearingFromPrev: getTrueCourseDeg(waypoint, nextWaypoint),
          };

          const newWaypoints = [...state.waypoints];
          newWaypoints.splice(i, 0, currentWaypoint);
          newWaypoints[i + 1] = updatedNextWaypoint;

          return {
            ...state,
            waypoints: newWaypoints,
            isModified: true,
          };
        });
      },
      editWaypoint: (id, waypoint) => {
        set((state) => {
          const i = state.waypoints.findIndex((w) => w.id === id);
          const prevWaypoint = { ...state.waypoints[i - 1] };
          const nextWaypoint = { ...state.waypoints[i + 1] };
          const currentWaypoint = { ...state.waypoints[i] };

          const currentNewWaypoint: Waypoint = {
            ...currentWaypoint,
            ...waypoint,
            distanceFromPrev: getDistanceNm(prevWaypoint, waypoint),
            bearingFromPrev: getTrueCourseDeg(prevWaypoint, waypoint),
          };
          const updatedNextWaypoint: Waypoint = {
            ...nextWaypoint,
            distanceFromPrev: getDistanceNm(waypoint, nextWaypoint),
            bearingFromPrev: getTrueCourseDeg(waypoint, nextWaypoint),
          };

          const editedWaypoints = [...state.waypoints];
          editedWaypoints[i] = currentNewWaypoint;
          editedWaypoints[i + 1] = updatedNextWaypoint;
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
          return;
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
      loadRoute: (route: Route) => {
        set((state) => ({
          ...state,
          ...route,
          isLoading: false,
          isModified: false,
        }));
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
      skipHydration: true,
    }
  )
);
