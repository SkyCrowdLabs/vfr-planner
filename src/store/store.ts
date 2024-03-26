import { Airport, Waypoint } from "@/types";
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
  addWaypoint: (waypoint: Waypoint) => void;
  editWaypoint: (id: string, waypoint: Partial<Waypoint>) => void;
  removeWaypoint: (id: string) => void;
  saveRoute: () => void;
  editRoute: () => void;
}

export const useRouteStore = create<RouteState>()(
  persist(
    (set, get) => ({
      id: undefined,
      name: undefined,
      departure: undefined,
      destination: undefined,
      waypoints: [],
      isLoading: false,
      isModified: false,
      error: undefined,

      initializeRoute: (departure, destination) =>
        set((state) => ({
          ...state,
          departure,
          destination,
          isModified: true,
        })),
      addWaypoint: (waypoint) => {
        set((state) => ({
          ...state,
          waypoints: [...state.waypoints, waypoint],
          isModified: true,
        }));
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
