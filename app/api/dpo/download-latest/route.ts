import { NextResponse } from "next/server";

const BACKEND = "http://170.64.209.149:8001";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/download-latest`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Backend download failed" },
        { status: res.status }
      );
    }

    const fileBuffer = await res.arrayBuffer();

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/zip",
        "Content-Disposition":
          res.headers.get("Content-Disposition") ||
          'attachment; filename="dpo-images.zip"',
      },
    });
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Failed to download latest output" },
      { status: 500 }
    );
  }
}
