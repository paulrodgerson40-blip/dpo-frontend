import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://170.64.209.149.sslip.io";

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase().replace(/_/g, "-");
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const cleanSlug = normalizeSlug(slug);

    const r = await fetch(
      `${BACKEND}/api/dpo/restaurants/${cleanSlug}/images`,
      { cache: "no-store" }
    );

    const data = await r.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Image proxy failed", details: String(err) },
      { status: 500 }
    );
  }
}
