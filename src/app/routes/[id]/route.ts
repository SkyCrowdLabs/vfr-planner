import { Waypoint } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const user = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to do this",
      code: 201,
    });
  }

  const id = params.id;
  const { error, data } = await supabase
    .from("routes")
    .select("*")
    .eq("user_id", user.data.user?.id as string)
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    NextResponse.json({ message: "There has been an error", code: 400 });
  }

  return NextResponse.json({ message: "Success!", data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const id = params.id;
  const { error, data } = await supabase
    .from("routes")
    .update({
      name: body.name,
      waypoints: JSON.parse(JSON.stringify(body.waypoints)),
    })
    .eq("id", id)
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
