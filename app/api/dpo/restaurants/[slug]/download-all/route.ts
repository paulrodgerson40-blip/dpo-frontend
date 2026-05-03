import { NextRequest } from "next/server";

const BACKEND = "https://170.64.209.149.sslip.io";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const r = await fetch(
    `${BACKEND}/api/dpo/restaurants/${encodeURIComponent(slug)}/download-all`,
    { cache: "no-store" }
  );

  return new Response(r.body, {
    status: r.status,
    headers: {
      "Content-Type": r.headers.get("Content-Type") || "application/zip",
      "Content-Disposition":
        r.headers.get("Content-Disposition") ||
        `attachment; filename="${slug}_full_export.zip"`,
    },
  });
}
