import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.DPO_BACKEND_URL || "https://170.64.209.149.sslip.io";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const r = await fetch(`${BACKEND}/api/dpo/restaurants/${slug}/images`, {
    cache: "no-store",
  });

  const data = await r.json();

  return NextResponse.json(data, { status: r.status });
}
