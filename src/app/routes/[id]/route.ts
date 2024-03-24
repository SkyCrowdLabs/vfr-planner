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
