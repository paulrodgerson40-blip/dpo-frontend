import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://170.64.209.149.sslip.io";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const r = await fetch(
      `${BACKEND}/api/dpo/restaurants/${encodeURIComponent(slug)}/images`,
      { cache: "no-store" }
    );

    const data = await r.json();

    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    return NextResponse.json(
      { error: "failed", detail: String(e) },
      { status: 500 }
    );
  }
}
