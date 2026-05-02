import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ "job-id": string }>;
};

const BACKEND = "https://170.64.209.149.sslip.io";

export async function GET(_req: NextRequest, context: RouteContext) {
  const params = await context.params;
  const jobId = params["job-id"];

  if (!jobId) {
    return NextResponse.json({ error: "Missing job id" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND}/api/dpo/manual-jobs/${jobId}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    return NextResponse.json(data ?? { error: "Invalid backend response" }, {
      status: res.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to contact backend" },
      { status: 500 }
    );
  }
}
