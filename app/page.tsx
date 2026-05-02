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

function cleanName(path: string) {
  return path.split("/").pop() || path;
}

export default function Home() {
  const [restaurantName, setRestaurantName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("Waiting");
  const [jobId, setJobId] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
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
    setNames({});

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

      const uploaded = data.files || [];
      const initialNames: Record<string, string> = {};
      uploaded.forEach((f) => {
        initialNames[f] = cleanName(f).replace(/\.[^.]+$/, "");
      });

      setJobId(data.job_id || "");
      setStatus(data.status || "phase_a_review");
      setUploadedCount(data.uploaded_count || 0);
      setUploadedFiles(uploaded);
      setNames(initialNames);
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
    setNames({});
    setError("");
    setMessage("");

    const input = document.getElementById("file") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  function imageUrl(filePath: string) {
    return `${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/files/${encodeURIComponent(cleanName(filePath))}`;
  }

  return (
    <main style={{ padding: 36, fontFamily: "Arial, sans-serif", background: "#f6f7f9", minHeight: "100vh" }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", background: "#fff", padding: 28, borderRadius: 16 }}>
        <h1>🚀 DPO Image Engine</h1>
        <p><b>Manual Phase A</b> — upload, review, rename, then Phase B later.</p>

        <div style={{ marginTop: 20 }}>
          <input
            placeholder="Restaurant name"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            style={{ padding: 12, width: 340, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <input id="file" type="file" multiple accept=".png,.jpg,.jpeg,.webp,.zip" onChange={handleFiles} />
        </div>

        {files.length > 0 && (
          <p style={{ marginTop: 12 }}>
            <b>Selected:</b> {files.length} file(s)
          </p>
        )}

        <div style={{ marginTop: 18 }}>
          <button onClick={createJob} disabled={loading} style={{ padding: "12px 18px", cursor: "pointer" }}>
            {loading ? "Uploading..." : "Create Phase A Job"}
          </button>
          <button onClick={reset} disabled={loading} style={{ marginLeft: 10, padding: "12px 18px" }}>
            Reset
          </button>
        </div>

        <div style={{ marginTop: 22, padding: 14, background: "#fafafa", border: "1px solid #ddd", borderRadius: 10 }}>
          <p><b>Status:</b> {status}</p>
          <p><b>Job ID:</b> {jobId || "-"}</p>
          <p><b>Uploaded:</b> {uploadedCount}</p>
        </div>

        {message && <p style={{ color: "green", fontWeight: 700 }}>{message}</p>}
        {error && <p style={{ color: "red", fontWeight: 700 }}>{error}</p>}

        {uploadedFiles.length > 0 && (
          <div style={{ marginTop: 30 }}>
            <h2>Phase A Review</h2>
            <p>Check each image, rename the item, and remove bad screenshots later.</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                gap: 18,
                marginTop: 18,
              }}
            >
              {uploadedFiles.map((file, i) => {
                const filename = cleanName(file);

                return (
                  <div key={file} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, background: "#fff" }}>
                    <img
                      src={imageUrl(file)}
                      alt={filename}
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid #eee",
                      }}
                    />

                    <p style={{ fontSize: 13, color: "#666" }}>
                      <b>{String(i + 1).padStart(2, "0")}.</b> {filename}
                    </p>

                    <input
                      value={names[file] || ""}
                      onChange={(e) => setNames({ ...names, [file]: e.target.value })}
                      placeholder="Dish name"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: 10,
                        border: "1px solid #ccc",
                        borderRadius: 8,
                      }}
                    />

                    <button
                      onClick={() => {
                        setUploadedFiles(uploadedFiles.filter((x) => x !== file));
                      }}
                      style={{
                        marginTop: 10,
                        padding: "8px 10px",
                        color: "#b91c1c",
                        border: "1px solid #fecaca",
                        background: "#fff",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      Remove from review
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginTop: 30, color: "#999" }}>
          Phase B disabled
        </div>
      </section>
    </main>
  );
}
