import { NextResponse } from "next/server";

const BACKEND = "http://170.64.209.149:8001";

export async function GET(
  req: Request,
  context: { params: Promise<{ jobid: string }> }
) {
  try {
    const { jobid } = await context.params;

    const res = await fetch(`${BACKEND}/api/dpo/jobs/${jobid}`, {
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch job status" },
      { status: 500 }
    );
  }
}
