"use client";

import { useState } from "react";

const BACKEND_URL = "https://170.64.209.149.sslip.io";

type ReviewImage = {
  original_filename: string;
  approved_name: string;
  removed?: boolean;
};

type ManualJobResponse = {
  job_id?: string;
  status?: string;
  uploaded_count?: number;
  files?: string[];
  review_images?: ReviewImage[];
  error?: string;
  auto_name_error?: string;
};

function fileName(path: string) {
  return path.split("/").pop() || path;
}

function fallbackDishName(path: string) {
  return fileName(path).replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
}

export default function Home() {
  const [restaurantName, setRestaurantName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [jobId, setJobId] = useState("");
  const [reviewImages, setReviewImages] = useState<ReviewImage[]>([]);
  const [status, setStatus] = useState("Waiting");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files || []));
    setError("");
  }

  async function createJob() {
    if (!restaurantName.trim()) return setError("Enter restaurant name");
    if (!files.length) return setError("Upload files first");

    setLoading(true);
    setError("");
    setStatus("Uploading...");

    try {
      const form = new FormData();
      form.append("restaurant_name", restaurantName.trim());
      files.forEach((f) => form.append("files", f));

      // 🔥 DIRECT TO VPS (bypasses Vercel limit)
      const res = await fetch(`${BACKEND_URL}/api/dpo/manual-jobs`, {
        method: "POST",
        body: form,
      });

      const uploadText = await res.text();

      let data: ManualJobResponse;
      try {
        data = JSON.parse(uploadText);
      } catch {
        throw new Error(uploadText);
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      setStatus("Auto-naming...");

      // 🔥 AUTO-NAME CALL
      if (data.job_id) {
        const autoRes = await fetch(
          `${BACKEND_URL}/api/dpo/manual-jobs/${data.job_id}/auto-name`,
          { method: "POST" }
        );

        const autoText = await autoRes.text();

        if (autoRes.ok) {
          const autoData = JSON.parse(autoText);
          data.review_images = autoData.review_images;
        } else {
          console.log("Auto-name failed:", autoText);
        }
      }

      const images =
        data.review_images && data.review_images.length > 0
          ? data.review_images
          : (data.files || []).map((f) => ({
              original_filename: fileName(f),
              approved_name: fallbackDishName(f),
            }));

      setJobId(data.job_id || "");
      setReviewImages(images);
      setStatus("Ready for review");
    } catch (err) {
      setStatus("Failed");
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function approvePhaseA() {
    const images = reviewImages
      .filter((i) => !i.removed)
      .map((i) => ({
        original_filename: i.original_filename,
        approved_name: i.approved_name,
      }));

    const res = await fetch(
      `${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/approve-phase-a`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      }
    );

    if (res.ok) {
      setApproved(true);
      setStatus("Phase A Approved");
    }
  }

  function updateName(i: number, value: string) {
    setReviewImages((prev) =>
      prev.map((img, idx) =>
        idx === i ? { ...img, approved_name: value } : img
      )
    );
  }

  function removeImage(i: number) {
    setReviewImages((prev) =>
      prev.map((img, idx) =>
        idx === i ? { ...img, removed: true } : img
      )
    );
  }

  function imageUrl(name: string) {
    return `${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/files/${encodeURIComponent(name)}`;
  }

  return (
    <main style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>DPO Image Engine</h1>

      <input
        placeholder="Restaurant name"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
      />

      <input type="file" multiple onChange={handleFiles} />

      <br /><br />

      <button onClick={createJob}>
        {loading ? "Processing..." : "Upload + Auto Name"}
      </button>

      <button onClick={approvePhaseA} disabled={!jobId || approved}>
        {approved ? "Approved" : "Approve Phase A"}
      </button>

      <p>Status: {status}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {reviewImages.map((img, i) =>
          img.removed ? null : (
            <div key={i}>
              <img
                src={imageUrl(img.original_filename)}
                style={{ width: 200, height: 150 }}
              />
              <input
                value={img.approved_name}
                onChange={(e) => updateName(i, e.target.value)}
              />
              <button onClick={() => removeImage(i)}>Remove</button>
            </div>
          )
        )}
      </div>
    </main>
  );
}
