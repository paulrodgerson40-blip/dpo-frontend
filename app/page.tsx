"use client";

import { useState } from "react";

type ManualJobResponse = {
  job_id?: string;
  status?: string;
  uploaded_count?: number;
  message?: string;
  files?: string[];
  error?: string;
};

export default function Home() {
  const [restaurantName, setRestaurantName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("Waiting");
  const [jobId, setJobId] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files || []));
    setError("");
  }

  async function createJob() {
    if (!restaurantName) {
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

    try {
      const form = new FormData();
      form.append("restaurant_name", restaurantName);
      files.forEach((f) => form.append("files", f));

      const res = await fetch("http://170.64.209.149.sslip.io/api/dpo/manual-jobs", {
        method: "POST",
        body: form,
      });

      const text = await res.text();

      let data: ManualJobResponse;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Upload too large (Vercel limit)");
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      setJobId(data.job_id || "");
      setStatus(data.status || "phase_a_review");
      setUploadedCount(data.uploaded_count || 0);
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
    setError("");

    const input = document.getElementById("file") as HTMLInputElement;
    if (input) input.value = "";
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>🚀 DPO Image Engine</h1>

      <p>Manual Phase A upload (no scraping)</p>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Restaurant name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          style={{ padding: 10, width: 300 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <input id="file" type="file" multiple onChange={handleFiles} />
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={createJob} disabled={loading}>
          {loading ? "Uploading..." : "Create Job"}
        </button>

        <button onClick={reset} style={{ marginLeft: 10 }}>
          Reset
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <p><b>Status:</b> {status}</p>
        <p><b>Job ID:</b> {jobId || "-"}</p>
        <p><b>Uploaded:</b> {uploadedCount}</p>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: 10 }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 30, color: "#999" }}>
        Phase B disabled
      </div>
    </main>
  );
}
