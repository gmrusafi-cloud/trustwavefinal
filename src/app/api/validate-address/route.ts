import { NextRequest, NextResponse } from "next/server";
import { validateShippingAddress } from "@/lib/address-validator";

export async function POST(req: NextRequest) {
  try {
    const { address, city, postalCode, subtotal } = await req.json();

    const apiKey =
      process.env.GOOGLE_MAPS_PLATFORM_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLATFORM_KEY;

    let geocodedData: any = null;

    // If Google Maps API Key is available, attempt Address Validation or Geocoding
    if (apiKey && apiKey !== "YOUR_API_KEY" && address) {
      try {
        const fullQuery = `${address}, ${city || ''}, ${postalCode || ''}, Bangladesh`;
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          fullQuery
        )}&components=country:BD&key=${apiKey}`;

        const res = await fetch(geocodeUrl);
        const data = await res.json();

        if (data.status === "OK" && data.results && data.results[0]) {
          const first = data.results[0];
          geocodedData = {
            formattedAddress: first.formatted_address,
            location: first.geometry.location,
            placeId: first.place_id,
            types: first.types,
            isGeocoded: true,
          };
        }
      } catch (err) {
        console.error("Google Maps geocode API call error:", err);
      }
    }

    // Perform local zone rule calculation
    const validation = validateShippingAddress(
      address || "",
      city || "",
      postalCode || "",
      Number(subtotal) || 0
    );

    return NextResponse.json({
      ...validation,
      geocoded: geocodedData,
      validatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Address validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate address" },
      { status: 500 }
    );
  }
}
