import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://170.64.209.149.sslip.io";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string; filename: string }> }
) {
  const { slug, filename } = await context.params;

  const r = await fetch(
    `${BACKEND}/api/dpo/restaurants/${encodeURIComponent(slug)}/headers/${encodeURIComponent(filename)}/enhance`,
    { method: "POST" }
  );

  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}
