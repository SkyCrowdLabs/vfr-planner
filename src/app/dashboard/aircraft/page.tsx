import React from "react";
import { Aircraft } from "@/types";
import { NextPage } from "next";
import AircraftTable from "./AircraftTable";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const getAircraft = async (): Promise<{
  aircraft: Aircraft[];
  count: number;
}> => {
  const supabase = createClient();
  const userRes = await supabase.auth.getUser();

  if (!userRes.data.user) redirect("/login");

  const { error, data, count } = await supabase
    .from("aircraft")
    .select("*", { count: "exact" })
    .eq("user_id", userRes.data.user.id)
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) {
    return { aircraft: [], count: 0 };
  }
  return {
    aircraft: data,
    count: count as number,
  };
};

const Aircraft: NextPage = async () => {
  const { aircraft, count } = await getAircraft();
  return <AircraftTable aircraft={aircraft} count={count} />;
};

export default Aircraft;
