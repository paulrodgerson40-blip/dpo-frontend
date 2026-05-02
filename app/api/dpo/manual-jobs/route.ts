import { NextResponse } from "next/server";

const BACKEND = "https://170.64.209.149.sslip.io";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const res = await fetch(`${BACKEND}/api/dpo/manual-jobs`, {
      method: "POST",
      body: formData,
    });

    const text = await res.text();

    return new Response(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    console.error("MANUAL JOB ERROR:", err);
    return NextResponse.json(
      { error: "Manual upload failed" },
      { status: 500 }
    );
  }
}
