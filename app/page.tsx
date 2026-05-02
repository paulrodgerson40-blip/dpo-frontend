"use client";

import { useState } from "react";

type ManualJobResponse = {
  job_id?: string;
  status?: string;
  uploaded_count?: number;
  message?: string;
  files?: string[];
  error?: string;
  ok?: boolean;
};

export default function Home() {
  const [restaurantName, setRestaurantName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("Waiting for upload");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [jobFiles, setJobFiles] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setError("");
  }

  async function createJob() {
    if (!restaurantName.trim()) {
      setError("Enter restaurant name");
      return;
    }

    if (!files.length) {
      setError("Upload files first");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("Uploading...");
    setMessage("");
    setJobFiles([]);

    try {
      const form = new FormData();
      form.append("restaurant_name", restaurantName);

      files.forEach(f => form.append("files", f));

      const res = await fetch("/api/dpo/manual-jobs", {
        method: "POST",
        body: form,
      });

      let data: ManualJobResponse;

      try {
        data = await res.json();
      } catch {
        throw new Error("Backend returned invalid response");
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      setJobId(data.job_id || "");
      setStatus(data.status || "phase_a_review");
      setUploadedCount(data.uploaded_count || 0);
      setJobFiles(data.files || []);
      setMessage(data.message || "Upload complete");
    } catch (err) {
      setStatus("Upload failed");
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setRestaurantName("");
    setFiles([]);
    setJobId("");
    setStatus("Waiting for upload");
    setUploadedCount(0);
    setJobFiles([]);
    setMessage("");
    setError("");

    const input = document.getElementById("file-input") as HTMLInputElement;
    if (input) input.value = "";
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial", background: "#f5f5f5" }}>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <h1>🚀 DPO Image Engine</h1>

        <p style={{ color: "#555" }}>
          Upload screenshots. Phase A only. Phase B disabled.
        </p>

        {/* Restaurant */}
        <div style={{ marginTop: 20 }}>
          <label>
            <b>Restaurant</b>
            <input
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
          </label>
        </div>

        {/* Files */}
        <div style={{ marginTop: 20 }}>
          <label>
            <b>Upload images</b>
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ width: "100%", marginTop: 6 }}
            />
          </label>
        </div>

        {/* Selected */}
        {files.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <b>{files.length} files selected</b>
          </div>
        )}

        {/* Buttons */}
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button onClick={createJob} disabled={loading}>
            {loading ? "Uploading..." : "Create Job"}
          </button>

          <button onClick={reset}>Reset</button>
        </div>

        {/* Status */}
        <div style={{ marginTop: 20 }}>
          <p><b>Job ID:</b> {jobId || "-"}</p>
          <p><b>Status:</b> {status}</p>
          <p><b>Uploaded:</b> {uploadedCount}</p>
        </div>

        {/* Message */}
        {message && (
          <div style={{ marginTop: 10, color: "green" }}>{message}</div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginTop: 10, color: "red" }}>{error}</div>
        )}

        {/* Files */}
        {jobFiles.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>Uploaded Files</h3>
            <ul>
              {jobFiles.map((f, i) => (
                <li key={i}>{f.split("/").pop()}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notice */}
        <div style={{ marginTop: 20, color: "#a16207" }}>
          Phase B disabled until review tools are built.
        </div>
      </div>
    </main>
  );
}
