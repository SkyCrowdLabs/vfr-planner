import { Waypoint } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const userRes = await supabase.auth.getUser();
  if (!userRes.data || userRes.error) {
    return NextResponse.json(
      {
        message: "You are not authorized to do this",
      },
      { status: 401 }
    );
  }

  const body: { waypoints?: Waypoint[]; name: string } = await request.json();
  if (!body.waypoints) {
    return NextResponse.json(
      {
        message: "There is something wrong in the request",
      },
      { status: 400 }
    );
  }

  const { error, data } = await supabase
    .from("routes")
    .insert({
      name: body.name,
      waypoints: JSON.parse(JSON.stringify(body.waypoints)),
      user_id: userRes.data?.user?.id,
    })
    .select()
    .order("created_at", { ascending: true })
    .limit(1)
    .single();
  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "There has been an error" },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Success!", data });
}

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const userRes = await supabase.auth.getUser();
  if (!userRes.data || userRes.error) {
    return NextResponse.json(
      {
        message: "You are not authorized to do this",
      },
      { status: 401 }
    );
  }

  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

  const { error, data, count } = await supabase
    .from("routes")
    .select("*", { count: "exact" })
    .eq("user_id", userRes.data.user?.id as string)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "There has been an error" },
      { status: 400 }
    );
  }
  return NextResponse.json({ message: "Success!", data, count });
}
