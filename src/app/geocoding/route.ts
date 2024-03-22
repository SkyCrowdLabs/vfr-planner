import { NextRequest, NextResponse } from "next/server";
import convert from "xml-js";

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lng = request.nextUrl.searchParams.get("lng");

  if (!(lat && lng)) {
    return NextResponse.json({
      message: "Please provide coordinates",
      status: 400,
    });
  }

  const res = await fetch(`https://api.3geonames.org/${lat},${lng}`);
  const text = await res.text();
  const raw: any = convert.xml2js(text, { compact: true });

  const data = Object.entries(raw.geodata.nearest).reduce(
    (acc, [key, value]) => {
      if (
        !["name", "prov", "region", "state", "city", "elevation"].includes(key)
      )
        return acc;
      return { ...acc, [key]: (value as any)["_text"] as string };
    },
    {} as { [key: string]: string }
  );

  return NextResponse.json({ message: "Success!", data });
}
