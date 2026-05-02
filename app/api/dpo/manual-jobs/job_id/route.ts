import { NextResponse } from "next/server";

const BACKEND = "http://170.64.209.149:8001";

export async function GET(
  req: Request,
  context: { params: Promise<{ job_id: string }> }
) {
  try {
    const { job_id } = await context.params;

    const res = await fetch(`${BACKEND}/api/dpo/manual-jobs/${job_id}`, {
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("MANUAL JOB FETCH ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch manual job" },
      { status: 500 }
    );
  }
}
