import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("airports")
    .select("*")
    .eq("iso_country", "PH");
  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "There has been an error" },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Success!", data });
}
