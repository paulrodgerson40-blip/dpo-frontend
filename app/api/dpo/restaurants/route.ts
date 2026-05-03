import { NextResponse } from "next/server";

const BACKEND = "https://170.64.209.149.sslip.io";

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase().replace(/_/g, "-");
}

export async function GET() {
  try {
    const r = await fetch(`${BACKEND}/api/dpo/restaurants`, {
      cache: "no-store",
    });

    const data = await r.json();

    const restaurants = (data.restaurants || []).map((r: any) => ({
      ...r,
      slug: normalizeSlug(r.slug || ""),
    }));

    return NextResponse.json({ restaurants });
  } catch (err) {
    return NextResponse.json(
      { error: "Frontend proxy failed", details: String(err) },
      { status: 500 }
    );
  }
}
