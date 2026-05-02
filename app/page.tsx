"use client";

import { useState } from "react";

const API_BASE = "";

type ManualJobResponse = {
  job_id?: string;
  job_type?: string;
  restaurant_name?: string;
  restaurant_slug?: string;
  status?: string;
  progress?: number;
  uploaded_count?: number;
  phase_b_enabled?: boolean;
  message?: string;
  files?: string[];
  error?: string;
  ok?: boolean;
};

export default function Home() {
  const [restaurantName, setRestaurantName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("Waiting for manual upload");
  const [message, setMessage] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [jobFiles, setJobFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setError("");
    setStatus(selected.length ? "Files selected" : "Waiting for manual upload");
  }

  async function createManualJob() {
    if (!restaurantName.trim()) {
      setError("Enter a restaurant name first.");
      return;
    }

    if (!files.length) {
      setError("Upload screenshots, images, or a ZIP first.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setJobId("");
    setUploadedCount(0);
    setJobFiles([]);
    setStatus("Uploading manual Phase A files...");

    try {
      const form = new FormData();
      form.append("restaurant_name", restaurantName.trim());

      for (const file of files) {
        form.append("files", file);
      }

      const res = await fetch(`${API_BASE}/api/dpo/manual-jobs`, {
        method: "POST",
        body: form,
      });

      const data: ManualJobResponse = await res.json();

      if (!res.ok || data.ok === false || data.error) {
        throw new Error(data.error || "Manual Phase A upload failed.");
      }

      setJobId(data.job_id || "");
      setStatus(data.status || "phase_a_review");
      setMessage(data.message || "Manual Phase A upload complete. Review files before Phase B.");
      setUploadedCount(data.uploaded_count || 0);
      setJobFiles(data.files || []);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed");
      setError(err instanceof Error ? err.message : "Unknown upload error");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setRestaurantName("");
    setFiles([]);
    setJobId("");
    setStatus("Waiting for manual upload");
    setMessage("");
    setUploadedCount(0);
    setJobFiles([]);
    setError("");

    const input = document.getElementById("manual-files") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  const canUpload = restaurantName.trim().length > 0 && files.length > 0 && !loading;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 40,
        fontFamily: "Arial, sans-serif",
        background: "#f6f7f9",
        color: "#111827",
      }}
    >
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 18,
          padding: 30,
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <p
          style={{
            display: "inline-block",
            margin: 0,
            padding: "6px 10px",
            borderRadius: 999,
            background: "#111827",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Manual Phase A
        </p>

        <h1 style={{ marginTop: 18, marginBottom: 8, fontSize: 34 }}>
          🚀 DPO Image Engine
        </h1>

        <p style={{ color: "#4b5563", fontSize: 16, lineHeight: 1.6, marginTop: 0 }}>
          Upload high-quality screenshots or original food images. The system will store them
          for Phase A review first. Phase B enhancement stays disabled until the upload list is
          confirmed.
        </p>

        <div
          style={{
            marginTop: 26,
            display: "grid",
            gap: 18,
          }}
        >
          <label style={{ fontWeight: 700 }}>
            Restaurant name
            <input
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Example: Napolitano Pizza"
              style={{
                width: "100%",
                boxSizing: "border-box",
                marginTop: 8,
                padding: 13,
                fontSize: 16,
                borderRadius: 10,
                border: "1px solid #d1d5db",
                outline: "none",
              }}
            />
          </label>

          <label style={{ fontWeight: 700 }}>
            Upload screenshots, images, or ZIP
            <input
              id="manual-files"
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.webp,.zip"
              onChange={handleFileChange}
              style={{
                width: "100%",
                boxSizing: "border-box",
                marginTop: 8,
                padding: 13,
                fontSize: 15,
                borderRadius: 10,
                border: "1px dashed #9ca3af",
                background: "#f9fafb",
              }}
            />
          </label>

          {files.length > 0 && (
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
              }}
            >
              <b>Selected files:</b> {files.length}
              <ul style={{ marginBottom: 0, paddingLeft: 20, color: "#374151" }}>
                {files.slice(0, 10).map((file) => (
                  <li key={`${file.name}-${file.size}`}>{file.name}</li>
                ))}
              </ul>
              {files.length > 10 && (
                <p style={{ marginBottom: 0, color: "#6b7280" }}>
                  + {files.length - 10} more files
                </p>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={createManualJob}
              disabled={!canUpload}
              style={{
                padding: "13px 18px",
                fontSize: 16,
                borderRadius: 10,
                border: "none",
                cursor: canUpload ? "pointer" : "not-allowed",
                background: canUpload ? "#111827" : "#9ca3af",
                color: "#fff",
                fontWeight: 800,
              }}
            >
              {loading ? "Uploading..." : "Create Phase A Job"}
            </button>

            <button
              onClick={resetForm}
              disabled={loading}
              style={{
                padding: "13px 18px",
                fontSize: 16,
                borderRadius: 10,
                border: "1px solid #d1d5db",
                cursor: loading ? "not-allowed" : "pointer",
                background: "#fff",
                color: "#111827",
                fontWeight: 700,
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            padding: 18,
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            background: "#fafafa",
          }}
        >
          <p style={{ marginTop: 0 }}>
            <b>Job ID:</b> {jobId || "-"}
          </p>
          <p>
            <b>Status:</b> {status}
          </p>
          <p>
            <b>Uploaded count:</b> {uploadedCount || "-"}
          </p>
          <p style={{ marginBottom: 0 }}>
            <b>Phase B:</b>{" "}
            <span style={{ color: "#dc2626", fontWeight: 800 }}>Disabled for now</span>
          </p>
        </div>

        {message && (
          <div
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 12,
              background: "#ecfdf5",
              border: "1px solid #86efac",
              color: "#166534",
              fontWeight: 700,
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 12,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        )}

        {jobFiles.length > 0 && (
          <div style={{ marginTop: 26 }}>
            <h2 style={{ fontSize: 22, marginBottom: 10 }}>Phase A Review List</h2>
            <p style={{ color: "#6b7280", marginTop: 0 }}>
              These are the uploaded files stored by the backend. Next step will be
              auto-name detection, manual edit, delete, replace, then Run Phase B.
            </p>

            <div
              style={{
                display: "grid",
                gap: 10,
                marginTop: 14,
              }}
            >
              {jobFiles.map((file, index) => {
                const name = file.split("/").pop() || file;
                return (
                  <div
                    key={`${file}-${index}`}
                    style={{
                      padding: 12,
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      background: "#fff",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <b>{String(index + 1).padStart(2, "0")}.</b> {name}
                    </span>
                    <span style={{ color: "#6b7280", fontSize: 13 }}>uploaded</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: 30,
            padding: 16,
            borderRadius: 12,
            background: "#fffbeb",
            border: "1px solid #fde68a",
            color: "#92400e",
          }}
        >
          <b>Current plan:</b> scrape mode is deprecated. Manual upload is now the
          primary Phase A. Phase B will be re-enabled only after review/rename/replace
          controls are built.
        </div>
      </section>
    </main>
  );
}
