"use client";

import { useState } from "react";

const BACKEND_URL = "https://170.64.209.149.sslip.io";

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
  const [status, setStatus] = useState("Waiting");
  const [jobId, setJobId] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files || []));
    setError("");
    setMessage("");
  }

  async function createJob() {
    if (!restaurantName.trim()) return setError("Enter restaurant name");
    if (!files.length) return setError("Upload files first");

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Uploading...");
    setJobId("");
    setUploadedCount(0);
    setUploadedFiles([]);

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
        throw new Error(text || "Backend returned invalid response");
      }

      if (!res.ok || data.ok === false || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      setJobId(data.job_id || "");
      setStatus(data.status || "phase_a_review");
      setUploadedCount(data.uploaded_count || 0);
      setUploadedFiles(data.files || []);
      setMessage(data.message || "Manual Phase A upload complete.");
    } catch (err) {
      setStatus("Upload failed");
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setRestaurantName("");
    setFiles([]);
    setStatus("Waiting");
    setJobId("");
    setUploadedCount(0);
    setUploadedFiles([]);
    setError("");
    setMessage("");

    const input = document.getElementById("file") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>🚀 DPO Image Engine</h1>
      <p>Manual Phase A upload. No scraping.</p>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Restaurant name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          style={{ padding: 10, width: 320 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          id="file"
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.webp,.zip"
          onChange={handleFiles}
        />
      </div>

      {files.length > 0 && (
        <p style={{ marginTop: 10 }}>
          <b>Selected:</b> {files.length} file(s)
        </p>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={createJob} disabled={loading}>
          {loading ? "Uploading..." : "Create Phase A Job"}
        </button>

        <button onClick={reset} disabled={loading} style={{ marginLeft: 10 }}>
          Reset
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <p><b>Status:</b> {status}</p>
        <p><b>Job ID:</b> {jobId || "-"}</p>
        <p><b>Uploaded:</b> {uploadedCount}</p>
      </div>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Uploaded Files</h3>
          <ul>
            {uploadedFiles.map((f, i) => (
              <li key={`${f}-${i}`}>{f.split("/").pop()}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 30, color: "#999" }}>
        Phase B disabled
      </div>
    </main>
  );
}
