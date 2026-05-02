"use client";

import { useState } from "react";

const BACKEND_URL = "https://170.64.209.149.sslip.io";

type ReviewImage = {
  original_filename: string;
  approved_name: string;
  removed?: boolean;
};

type ManualJobResponse = {
  ok?: boolean;
  job_id?: string;
  status?: string;
  uploaded_count?: number;
  files?: string[];
  error?: string;
};

function fileName(path: string) {
  return path.split("/").pop() || path;
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
    setStatus("Uploading images");
    setJobId("");
    setUploadedCount(0);
    setReviewImages([]);
    setApproved(false);

    try {
      const form = new FormData();
      form.append("restaurant_name", restaurantName.trim());
      files.forEach((f) => form.append("files", f));

      const res = await fetch(`${BACKEND_URL}/api/dpo/manual-jobs`, {
        method: "POST",
        body: form,
      });

      const text = await res.text();

      let data: ManualJobResponse;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || "Upload failed");
      }

      if (!res.ok || data.ok === false || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      const images = (data.files || []).map((f) => ({
        original_filename: fileName(f),
        approved_name: "",
        removed: false,
      }));

      setJobId(data.job_id || "");
      setStatus("Ready for manual naming");
      setUploadedCount(data.uploaded_count || images.length);
      setReviewImages(images);
      setMessage("Images uploaded. Type dish names, remove bad images, then approve Phase A.");
    } catch (err) {
      setStatus("Upload failed");
      setError(err instanceof Error ? err.message : "Upload failed");
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
        approved_name: img.approved_name.trim(),
      }))
      .filter((img) => img.approved_name.length > 0);

    if (!images.length) return setError("Enter at least one dish name before approving.");

    setApproving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/approve-phase-a`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Approval failed");
      }

      setApproved(true);
      setStatus("A_APPROVED");
      setMessage(`Phase A approved. ${data.approved_count} image(s) ready for Phase B.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setApproving(false);
    }
  }

  function updateName(index: number, value: string) {
    setReviewImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, approved_name: value } : img
      )
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
    return `${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/files/${encodeURIComponent(
      filename
    )}`;
  }

  const activeImages = reviewImages.filter((img) => !img.removed);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "36px 20px",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #111827, #1f2937)",
            color: "white",
            padding: 32,
            borderRadius: 24,
            boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
            marginBottom: 22,
          }}
        >
          <div style={{ fontSize: 14, color: "#93c5fd", fontWeight: 700 }}>
            Manual Phase A
          </div>
          <h1 style={{ margin: "8px 0 8px", fontSize: 36 }}>
            DPO Image Engine
          </h1>
          <p style={{ margin: 0, color: "#d1d5db", fontSize: 16 }}>
            Upload restaurant images, manually name dishes, remove bad images, then approve for Phase B.
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 22,
            padding: 26,
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ margin: "0 0 18px", fontSize: 22 }}>Create job</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(260px, 1fr) minmax(260px, 1fr)",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Restaurant name</label>
              <input
                placeholder="e.g. Napolitano Pizza"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                disabled={loading || approved}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Upload images or ZIP</label>
              <input
                id="file"
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.webp,.zip"
                onChange={handleFiles}
                disabled={loading || approved}
                style={{
                  ...inputStyle,
                  padding: "12px",
                  background: "#f9fafb",
                }}
              />
            </div>
          </div>

          {files.length > 0 && (
            <div style={{ marginTop: 12, color: "#4b5563", fontSize: 14 }}>
              Selected: <b>{files.length}</b> file(s)
            </div>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
            <button
              onClick={createJob}
              disabled={loading || approved}
              style={primaryButton(loading || approved)}
            >
              {loading ? "Uploading..." : "Upload Images"}
            </button>

            <button
              onClick={approvePhaseA}
              disabled={!jobId || approving || approved || activeImages.length === 0}
              style={greenButton(!jobId || approving || approved || activeImages.length === 0)}
            >
              {approved ? "Phase A Approved" : approving ? "Approving..." : "Approve Phase A"}
            </button>

            <button onClick={reset} disabled={loading || approving} style={secondaryButton()}>
              Reset
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
              marginTop: 22,
            }}
          >
            <Info label="Status" value={status} />
            <Info label="Job ID" value={jobId || "-"} />
            <Info label="Images" value={String(uploadedCount || activeImages.length || 0)} />
          </div>

          {message && <div style={notice("#ecfdf5", "#166534")}>{message}</div>}
          {error && <div style={notice("#fef2f2", "#991b1b")}>{error}</div>}
        </div>

        {activeImages.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 24 }}>Phase A Review</h2>
                <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
                  Type the exact dish name for each image. Remove screenshots you do not want processed.
                </p>
              </div>
              <div style={{ color: "#6b7280", fontWeight: 700 }}>
                {activeImages.length} active image(s)
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))",
                gap: 18,
                marginTop: 18,
              }}
            >
              {reviewImages.map((img, index) => {
                if (img.removed) return null;

                return (
                  <div
                    key={`${img.original_filename}-${index}`}
                    style={{
                      background: "white",
                      borderRadius: 20,
                      padding: 14,
                      boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <img
                      src={imageUrl(img.original_filename)}
                      alt={img.approved_name || img.original_filename}
                      style={{
                        width: "100%",
                        height: 190,
                        objectFit: "cover",
                        borderRadius: 16,
                        background: "#e5e7eb",
                      }}
                    />

                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 12,
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {img.original_filename}
                    </div>

                    <input
                      value={img.approved_name}
                      disabled={approved}
                      onChange={(e) => updateName(index, e.target.value)}
                      placeholder="Type dish name here"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        marginTop: 10,
                        padding: "13px 14px",
                        borderRadius: 14,
                        border: img.approved_name.trim()
                          ? "1px solid #d1d5db"
                          : "2px solid #f59e0b",
                        fontWeight: 800,
                        fontSize: 15,
                      }}
                    />

                    <button
                      onClick={() => removeImage(index)}
                      disabled={approved}
                      style={{
                        width: "100%",
                        marginTop: 10,
                        padding: "11px 12px",
                        borderRadius: 14,
                        border: "1px solid #fecaca",
                        background: "#fff1f2",
                        color: "#be123c",
                        fontWeight: 800,
                        cursor: approved ? "not-allowed" : "pointer",
                      }}
                    >
                      Remove image
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: 28,
            padding: 20,
            borderRadius: 18,
            background: approved ? "#ecfdf5" : "#e5e7eb",
            color: approved ? "#166534" : "#4b5563",
            fontWeight: 800,
          }}
        >
          Phase B: {approved ? "Ready for image enhancement." : "Disabled until Phase A is approved."}
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 15,
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 800, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ marginTop: 6, fontSize: 17, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #d1d5db",
  fontSize: 15,
  outline: "none",
};

function primaryButton(disabled: boolean): React.CSSProperties {
  return {
    padding: "13px 20px",
    borderRadius: 14,
    border: 0,
    background: disabled ? "#9ca3af" : "#111827",
    color: "white",
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function greenButton(disabled: boolean): React.CSSProperties {
  return {
    padding: "13px 20px",
    borderRadius: 14,
    border: 0,
    background: disabled ? "#9ca3af" : "#16a34a",
    color: "white",
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function secondaryButton(): React.CSSProperties {
  return {
    padding: "13px 20px",
    borderRadius: 14,
    border: "1px solid #d1d5db",
    background: "white",
    color: "#111827",
    fontWeight: 900,
    cursor: "pointer",
  };
}

function notice(bg: string, color: string): React.CSSProperties {
  return {
    marginTop: 18,
    padding: 15,
    borderRadius: 14,
    background: bg,
    color,
    fontWeight: 800,
  };
}
