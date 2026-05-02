cd /root/dpo_frontend

cat > app/page.tsx <<'TSX'
"use client";

import { useState } from "react";

const API_BASE = "http://170.64.209.149:8001";

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
    setFiles(Array.from(e.target.files || []));
    setError("");
  }

  async function createJob() {
    if (!restaurantName.trim()) return setError("Enter restaurant name first.");
    if (!files.length) return setError("Upload images or a ZIP first.");

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Uploading...");
    setJobFiles([]);
    setUploadedCount(0);
    setJobId("");

    try {
      const form = new FormData();
      form.append("restaurant_name", restaurantName.trim());
      files.forEach((f) => form.append("files", f));

      const res = await fetch(`${API_BASE}/api/dpo/manual-jobs`, {
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
      setJobFiles(data.files || []);
      setMessage(data.message || "Manual Phase A upload complete.");
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
    const input = document.getElementById("manual-files") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  const canUpload = restaurantName.trim() && files.length && !loading;

  return (
    <main style={{ minHeight: "100vh", padding: 40, fontFamily: "Arial, sans-serif", background: "#f6f7f9" }}>
      <section style={{ maxWidth: 900, margin: "0 auto", background: "#fff", padding: 30, borderRadius: 18 }}>
        <div style={{ display: "inline-block", background: "#111827", color: "#fff", padding: "6px 10px", borderRadius: 999, fontWeight: 700 }}>
          Manual Phase A
        </div>

        <h1>🚀 DPO Image Engine</h1>
        <p>Upload screenshots or original food images. Phase B is disabled until review tools are built.</p>

        <label style={{ fontWeight: 700 }}>
          Restaurant name
          <input
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="Example: Napolitano Pizza"
            style={{ width: "100%", padding: 12, marginTop: 8, marginBottom: 18 }}
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
            style={{ width: "100%", padding: 12, marginTop: 8, marginBottom: 18 }}
          />
        </label>

        {files.length > 0 && (
          <div style={{ background: "#f3f4f6", padding: 14, borderRadius: 10, marginBottom: 18 }}>
            <b>Selected files:</b> {files.length}
            <ul>
              {files.slice(0, 10).map((f) => <li key={f.name}>{f.name}</li>)}
            </ul>
            {files.length > 10 && <p>+ {files.length - 10} more</p>}
          </div>
        )}

        <button onClick={createJob} disabled={!canUpload} style={{ padding: "12px 18px", marginRight: 10 }}>
          {loading ? "Uploading..." : "Create Phase A Job"}
        </button>
        <button onClick={reset} disabled={loading} style={{ padding: "12px 18px" }}>
          Reset
        </button>

        <div style={{ marginTop: 24, padding: 16, background: "#fafafa", border: "1px solid #ddd", borderRadius: 10 }}>
          <p><b>Job ID:</b> {jobId || "-"}</p>
          <p><b>Status:</b> {status}</p>
          <p><b>Uploaded count:</b> {uploadedCount || "-"}</p>
          <p><b>Phase B:</b> <span style={{ color: "red", fontWeight: 700 }}>Disabled for now</span></p>
        </div>

        {message && <p style={{ color: "green", fontWeight: 700 }}>{message}</p>}
        {error && <p style={{ color: "red", fontWeight: 700 }}>{error}</p>}

        {jobFiles.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h2>Phase A Review List</h2>
            {jobFiles.map((f, i) => (
              <div key={f} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                <b>{String(i + 1).padStart(2, "0")}.</b> {f.split("/").pop()}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
TSX
