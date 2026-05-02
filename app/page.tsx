"use client";

import { useState } from "react";

const BACKEND_URL = "https://170.64.209.149.sslip.io";

type ReviewImage = {
  original_filename: string;
  suggested_name?: string;
  approved_name: string;
  removed?: boolean;
};

type ManualJobResponse = {
  ok?: boolean;
  job_id?: string;
  status?: string;
  uploaded_count?: number;
  message?: string;
  files?: string[];
  review_images?: ReviewImage[];
  error?: string;
  auto_name_error?: string;
};

function fileName(path: string) {
  return path.split("/").pop() || path;
}

function fallbackDishName(name: string) {
  return fileName(name).replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
}

export default function Home() {
  const [restaurantName, setRestaurantName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("Waiting");
  const [jobId, setJobId] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [reviewImages, setReviewImages] = useState<ReviewImage[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files || []));
    setError("");
    setMessage("");
    setApproved(false);
  }

  async function createJob() {
    if (!restaurantName.trim()) return setError("Enter restaurant name");
    if (!files.length) return setError("Upload files first");

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Uploading + Auto-naming...");
    setJobId("");
    setUploadedCount(0);
    setReviewImages([]);
    setApproved(false);

    try {
      const form = new FormData();
      form.append("restaurant_name", restaurantName.trim());
      files.forEach((f) => form.append("files", f));

      const res = await fetch("/api/dpo/manual-jobs", {
        method: "POST",
        body: form,
      });

      const data: ManualJobResponse = await res.json();

      if (!res.ok || data.ok === false || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      const job = data.job_id || "";

      const images =
        data.review_images && data.review_images.length > 0
          ? data.review_images
          : (data.files || []).map((f) => ({
              original_filename: fileName(f),
              approved_name: fallbackDishName(f),
              removed: false,
            }));

      setJobId(job);
      setStatus(data.status || "phase_a_review");
      setUploadedCount(data.uploaded_count || images.length);
      setReviewImages(images);
      setMessage("Uploaded and auto-named. Review and approve.");
    } catch (err) {
      setStatus("Upload failed");
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function approvePhaseA() {
    if (!jobId) return setError("No job selected");

    const images = reviewImages
      .filter((img) => !img.removed)
      .map((img) => ({
        original_filename: img.original_filename,
        approved_name: img.approved_name,
      }));

    if (!images.length) return setError("No images selected");

    setApproving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/approve-phase-a`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Approval failed");

      setApproved(true);
      setStatus("A_APPROVED");
      setMessage("Phase A approved. Ready for Phase B.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setApproving(false);
    }
  }

  function updateName(index: number, value: string) {
    setReviewImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, approved_name: value } : img))
    );
  }

  function removeImage(index: number) {
    setReviewImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, removed: true } : img))
    );
  }

  function imageUrl(filename: string) {
    return `${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/files/${encodeURIComponent(filename)}`;
  }

  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: "0 auto", fontFamily: "Arial" }}>
      <h1>DPO Image Engine</h1>

      <input
        placeholder="Restaurant name"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
      />

      <input type="file" multiple onChange={handleFiles} />

      <div style={{ marginTop: 10 }}>
        <button onClick={createJob} disabled={loading}>
          {loading ? "Processing..." : "Upload + Auto Name"}
        </button>

        <button onClick={approvePhaseA} disabled={!jobId || approved}>
          {approved ? "Approved" : "Approve Phase A"}
        </button>
      </div>

      <p>Status: {status}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 250px)", gap: 16 }}>
        {reviewImages.map((img, i) =>
          img.removed ? null : (
            <div key={i}>
              <img src={imageUrl(img.original_filename)} style={{ width: "100%", height: 150 }} />
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
