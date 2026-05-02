cd /root/dpo_frontend

cat > app/page.tsx <<'TSX'
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
    setStatus("Uploading and auto-naming...");
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
              suggested_name: fallbackDishName(f),
              approved_name: fallbackDishName(f),
              removed: false,
            }));

      setJobId(job);
      setStatus(data.status || "phase_a_review");
      setUploadedCount(data.uploaded_count || images.length);
      setReviewImages(images);
      setMessage(
        data.auto_name_error
          ? "Uploaded. Auto-name had an issue, but you can rename manually."
          : "Uploaded and auto-named. Review before approving Phase A."
      );
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

    if (!images.length) return setError("No images selected for approval");

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

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Approval failed");
      }

      setApproved(true);
      setStatus("A_APPROVED");
      setMessage(`Phase A approved. ${data.approved_count} image(s) locked for Phase B.`);
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

  function reset() {
    setRestaurantName("");
    setFiles([]);
    setStatus("Waiting");
    setJobId("");
    setUploadedCount(0);
    setReviewImages([]);
    setError("");
    setMessage("");
    setApproved(false);

    const input = document.getElementById("file") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  function imageUrl(filename: string) {
    return `${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/files/${encodeURIComponent(filename)}`;
  }

  const activeImages = reviewImages.filter((img) => !img.removed);

  return (
    <main style={{ minHeight: "100vh", background: "#f4f5f7", padding: 32, fontFamily: "Arial, sans-serif" }}>
      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ background: "#111827", color: "white", padding: 28, borderRadius: 22, marginBottom: 22 }}>
          <h1 style={{ margin: 0, fontSize: 34 }}>DPO Image Engine</h1>
          <p style={{ margin: "10px 0 0", color: "#d1d5db" }}>
            Upload food images, auto-name them, review, then approve for Phase B.
          </p>
        </div>

        <div style={{ background: "white", padding: 24, borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <input
              placeholder="Restaurant name"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              disabled={loading || approved}
              style={{ padding: 14, border: "1px solid #d1d5db", borderRadius: 12, fontSize: 15 }}
            />

            <input
              id="file"
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.webp,.zip"
              onChange={handleFiles}
              disabled={loading || approved}
              style={{ padding: 12, border: "1px solid #d1d5db", borderRadius: 12 }}
            />
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={createJob}
              disabled={loading || approved}
              style={{
                padding: "13px 20px",
                borderRadius: 12,
                border: 0,
                background: loading || approved ? "#9ca3af" : "#111827",
                color: "white",
                fontWeight: 700,
                cursor: loading || approved ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Uploading + Auto-Naming..." : "Create Phase A Job"}
            </button>

            <button
              onClick={approvePhaseA}
              disabled={!jobId || approving || approved || activeImages.length === 0}
              style={{
                padding: "13px 20px",
                borderRadius: 12,
                border: 0,
                background: !jobId || approving || approved ? "#9ca3af" : "#16a34a",
                color: "white",
                fontWeight: 700,
                cursor: !jobId || approving || approved ? "not-allowed" : "pointer",
              }}
            >
              {approved ? "Phase A Approved" : approving ? "Approving..." : "Approve Phase A"}
            </button>

            <button
              onClick={reset}
              disabled={loading || approving}
              style={{
                padding: "13px 20px",
                borderRadius: 12,
                border: "1px solid #d1d5db",
                background: "white",
                color: "#111827",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>

          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <Info label="Status" value={status} />
            <Info label="Job ID" value={jobId || "-"} />
            <Info label="Images" value={String(uploadedCount || activeImages.length || 0)} />
          </div>

          {message && (
            <div style={{ marginTop: 18, padding: 14, borderRadius: 12, background: "#ecfdf5", color: "#166534", fontWeight: 700 }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{ marginTop: 18, padding: 14, borderRadius: 12, background: "#fef2f2", color: "#991b1b", fontWeight: 700 }}>
              {error}
            </div>
          )}
        </div>

        {activeImages.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h2 style={{ marginBottom: 6 }}>Phase A Review</h2>
            <p style={{ marginTop: 0, color: "#6b7280" }}>
              Auto-names are editable. Remove bad images, then approve to lock filenames.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 18 }}>
              {reviewImages.map((img, index) => {
                if (img.removed) return null;

                return (
                  <div key={img.original_filename} style={{ background: "white", borderRadius: 18, padding: 14, boxShadow: "0 8px 22px rgba(0,0,0,0.06)" }}>
                    <img
                      src={imageUrl(img.original_filename)}
                      alt={img.approved_name}
                      style={{ width: "100%", height: 190, objectFit: "cover", borderRadius: 14, background: "#eee" }}
                    />

                    <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {img.original_filename}
                    </div>

                    <input
                      value={img.approved_name}
                      disabled={approved}
                      onChange={(e) => updateName(index, e.target.value)}
                      placeholder="Dish name"
                      style={{
                        marginTop: 10,
                        width: "100%",
                        boxSizing: "border-box",
                        padding: 12,
                        border: "1px solid #d1d5db",
                        borderRadius: 12,
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    />

                    <button
                      onClick={() => removeImage(index)}
                      disabled={approved}
                      style={{
                        marginTop: 10,
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid #fecaca",
                        background: "#fff1f2",
                        color: "#be123c",
                        fontWeight: 700,
                        cursor: approved ? "not-allowed" : "pointer",
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginTop: 28, padding: 18, borderRadius: 16, background: approved ? "#ecfdf5" : "#f3f4f6", color: approved ? "#166534" : "#6b7280" }}>
          <b>Phase B:</b> {approved ? "Ready for image enhancement." : "Disabled until Phase A is approved."}
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 14, padding: 14 }}>
      <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
      <div style={{ marginTop: 5, fontSize: 16, fontWeight: 800 }}>{value}</div>
    </div>
  );
}
TSX

npm run build
