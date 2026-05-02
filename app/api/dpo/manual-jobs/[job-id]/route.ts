import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    job_id: string;
  }>;
};

// GET /api/dpo/manual-jobs/[job_id]
export async function GET(req: NextRequest, context: Params) {
  try {
    const { job_id } = await context.params;

    // 🔧 TODO: replace with real lookup (file/db)
    const job = {
      job_id,
      status: "phase_a_review",
      progress: 0,
      message: "Manual Phase A upload complete. Review before Phase B.",
    };

    return NextResponse.json(job);
  } catch (err) {
    console.error("GET job error:", err);

    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}
