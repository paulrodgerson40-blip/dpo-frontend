import { NextResponse } from "next/server";

const BACKEND =
  process.env.DPO_BACKEND_URL || "https://170.64.209.149.sslip.io";

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase().replace(/_/g, "-");
}

export async function GET() {
  const r = await fetch(`${BACKEND}/api/dpo/restaurants`, {
    cache: "no-store",
  });

  const data = await r.json();

  const restaurants = (data.restaurants || []).map((restaurant: any) => ({
    ...restaurant,
    slug: normalizeSlug(restaurant.slug || ""),
  }));

  return NextResponse.json(
    {
      ...data,
      restaurants,
    },
    { status: r.status }
  );
}
