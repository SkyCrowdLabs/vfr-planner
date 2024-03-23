"use client";
import { Json } from "@/database.types";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export interface Routes {
  created_at: string;
  id: number;
  user_id: string | null;
  waypoints: Json;
}

const Routes = () => {
  const supabase = createClient();
  const [user, setUser] = useState<User | undefined>(undefined);
  const router = useRouter();
  const [routes, setRoutes] = useState<Routes[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      return;
    };

    getUser();
  }, [supabase, router]);

  useEffect(() => {
    const getRoutes = async () => {
      if (user) {
        const res = await fetch("routes");
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        console.log(data);
        setRoutes(data);
        return;
      }
    };

    getRoutes();
  }, [supabase, user]);

  return <div>{JSON.stringify(routes, null, 2)}</div>;
};

export default Routes;
