import { NextResponse } from "next/server";

const BACKEND = "https://170.64.209.149.sslip.io";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 1. Upload to backend
    const uploadRes = await fetch(`${BACKEND}/api/dpo/manual-jobs`, {
      method: "POST",
      body: formData,
    });

    const uploadText = await uploadRes.text();

    if (!uploadRes.ok) {
      return new Response(uploadText, {
        status: uploadRes.status,
        headers: {
          "Content-Type": uploadRes.headers.get("content-type") || "application/json",
        },
      });
    }

    let data: any;

    try {
      data = JSON.parse(uploadText);
    } catch {
      return new Response(uploadText, {
        status: uploadRes.status,
        headers: {
          "Content-Type": uploadRes.headers.get("content-type") || "application/json",
        },
      });
    }

    // 2. AUTO NAME (this is the missing piece)
    if (data?.job_id) {
      try {
        const autoRes = await fetch(
          `${BACKEND}/api/dpo/manual-jobs/${data.job_id}/auto-name`,
          { method: "POST" }
        );

        if (autoRes.ok) {
          const autoData = await autoRes.json();

          data = {
            ...data,
            phase_a_auto_named: true,
            review_images: autoData.review_images || [],
          };
        } else {
          data = {
            ...data,
            phase_a_auto_named: false,
            auto_name_error: await autoRes.text(),
          };
        }
      } catch (err: any) {
        data = {
          ...data,
          phase_a_auto_named: false,
          auto_name_error: err?.message || "Auto-name failed",
        };
      }
    }

    // 3. Return enriched response
    return NextResponse.json(data, { status: uploadRes.status });

  } catch (err) {
    console.error("MANUAL JOB ERROR:", err);

    return NextResponse.json(
      { error: "Manual upload failed" },
      { status: 500 }
    );
  }
}
