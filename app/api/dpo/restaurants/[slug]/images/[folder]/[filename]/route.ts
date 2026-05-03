import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://170.64.209.149.sslip.io";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string; folder: string; filename: string }> }
) {
  const { slug, folder, filename } = await context.params;

  const r = await fetch(
    `${BACKEND}/api/dpo/restaurants/${encodeURIComponent(slug)}/images/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`,
    { method: "DELETE" }
  );

  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}
