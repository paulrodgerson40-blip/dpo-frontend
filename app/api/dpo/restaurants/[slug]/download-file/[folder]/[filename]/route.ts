import { NextRequest } from "next/server";

const BACKEND = "https://170.64.209.149.sslip.io";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string; folder: string; filename: string }> }
) {
  const { slug, folder, filename } = await context.params;

  const fileUrl = `${BACKEND}/restaurant-files/${encodeURIComponent(slug)}/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`;

  const r = await fetch(fileUrl, { cache: "no-store" });

  return new Response(r.body, {
    status: r.status,
    headers: {
      "Content-Type": r.headers.get("Content-Type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
