import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.DPO_BACKEND_URL || "https://170.64.209.149.sslip.io";

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase().replace(/_/g, "-");
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const cleanSlug = normalizeSlug(slug);

  const r = await fetch(
    `${BACKEND}/api/dpo/restaurants/${encodeURIComponent(cleanSlug)}/images`,
    { cache: "no-store" }
  );

  const data = await r.json();

  return NextResponse.json(data, { status: r.status });
}
