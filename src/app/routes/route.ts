import { Waypoint } from "@/components/RouteBuilder";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const user = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to do this",
      code: 201,
    });
  }

  const body: { waypoints?: Waypoint[]; name: string } = await request.json();
  if (!body.waypoints) {
    return NextResponse.json({
      message: "There is something wrong in the request",
      code: 400,
    });
  }

  const { error, data } = await supabase.from("routes").insert({
    name: body.name,
    waypoints: JSON.parse(JSON.stringify(body.waypoints)),
    user_id: user.data?.user?.id,
  });
  if (error) {
    console.error(error);
    NextResponse.json({ message: "There has been an error", code: 400 });
  }

  return NextResponse.json({ message: "Success!", data });
}

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const user = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to do this",
      code: 201,
    });
  }

  // const offset = request.nextUrl.searchParams.get("offset");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

  const { error, data, count } = await supabase
    .from("routes")
    .select("*", { count: "exact" })
    .eq("user_id", user.data.user?.id as string)
    .limit(limit)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    NextResponse.json({ message: "There has been an error", code: 400 });
  }
  return NextResponse.json({ message: "Success!", data, count });
}
