import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ "job-id": string }>;
};

const BACKEND_URL =
  process.env.DPO_BACKEND_URL || "http://127.0.0.1:8001";

export async function GET(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  const jobId = params["job-id"];

  if (!jobId) {
    return NextResponse.json({ error: "Missing job id" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/dpo/manual-jobs/${jobId}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    return NextResponse.json(data ?? { error: "Invalid backend response" }, {
      status: res.status,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to contact backend" },
      { status: 500 }
    );
  }
}
