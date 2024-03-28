import React from "react";
import { Route, Waypoint } from "@/types";
import { NextPage } from "next";
import RoutesTable from "./RoutesTable";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const getRoutes = async (): Promise<{ routes: Route[]; count: number }> => {
  const supabase = createClient();
  const userRes = await supabase.auth.getUser();

  if (!userRes.data.user) redirect("/login");

  const { error, data, count } = await supabase
    .from("routes")
    .select("*", { count: "exact" })
    .eq("user_id", userRes.data.user.id)
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) {
    return { routes: [], count: 0 };
  }
  return {
    routes: data.map((d) => ({
      ...d,
      waypoints: d.waypoints as unknown as Waypoint[],
    })),
    count: count as number,
  };
};

const Routes: NextPage = async () => {
  const { routes, count } = await getRoutes();
  return <RoutesTable routes={routes} count={count} />;
};

export default Routes;
