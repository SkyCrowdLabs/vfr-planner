import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherApi } from "openmeteo";

interface WindsAloftRequest {
  locations: { lat: number; lng: number; alt?: number }[];
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as WindsAloftRequest;

  const params = {
    latitude: body.locations.map(({ lat }) => lat),
    longitude: body.locations.map(({ lng }) => lng),
    hourly: ["wind_speed_180m", "wind_direction_180m", "temperature_180m"],
    wind_speed_unit: "kn",
    forecast_days: 1,
    elevation: body.locations.map(({ alt }) =>
      typeof alt === "number" ? alt * 0.3048 : "NaN"
    ),
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params, 10);

  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  // Process first location. Add a for-loop for multiple locations or weather models
  for (let i = 0; i < body.locations.length; i++) {
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        windSpeed180m: hourly.variables(0)!.valuesArray()!,
        windDirection180m: hourly.variables(1)!.valuesArray()!,
        temperature180m: hourly.variables(2)!.valuesArray()!,
      },
    };

    // // // `weatherData` now contains a simple structure with arrays for datetime and weather data
    // for (let i = 0; i < weatherData.hourly.time.length; i++) {
    //   console.log(
    //     weatherData.hourly.time[i].toISOString(),
    //     `${weatherData.hourly.windDirection180m[i].toFixed(
    //       0
    //     )}/${weatherData.hourly.windSpeed180m[i].toFixed(0)}`,
    //     `${weatherData.hourly.temperature180m[i].toFixed(0)}`
    //   );
    // }

    console.log(weatherData);
  }

  return NextResponse.json({ message: "Success!" });
}

export async function GET(request: NextRequest) {
  const response = await fetch("http://localhost:3000/weather/winds-aloft", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      locations: [
        {
          lat: 14.656519078334904,
          lng: 121.07233697102521,
          alt: 1000,
        },
        {
          lat: 15.187167,
          lng: 120.557465,
          alt: 5000,
        },
        {
          lat: 10.310328,
          lng: 123.9792776,
          alt: 10000,
        },
      ],
    }),
  });

  return NextResponse.json(await response.json());
}
