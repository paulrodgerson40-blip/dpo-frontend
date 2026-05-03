import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://170.64.209.149.sslip.io";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const r = await fetch(
      `${BACKEND}/api/dpo/restaurants/${params.slug}/images`,
      { cache: "no-store" }
    );

    const data = await r.json();

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
