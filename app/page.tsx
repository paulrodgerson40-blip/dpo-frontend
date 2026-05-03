"use client";

import { useMemo, useState } from "react";

const BACKEND_URL = "https://170.64.209.149.sslip.io";

type RestaurantMode = "new" | "existing";
type ActiveTab = "menu" | "originals" | "enhanced" | "headers" | "headerOutputs";
type UploadType = "menu" | "header";

type LibraryImage = {
  filename: string;
  url?: string;
  size?: number;
  updated_at?: string;
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

function prettyName(slugOrName: string) {
  return slugOrName.replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

function slugifyRestaurant(name: string) {
  return name
    .trim()
    .replace(/[^A-Za-z0-9 _-]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function imageUrl(jobId: string, filename: string) {
  return `${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/files/${encodeURIComponent(filename)}`;
}

export default function Home() {
  const [mode, setMode] = useState<RestaurantMode>("new");
  const [restaurantName, setRestaurantName] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [restaurants] = useState<string[]>([
    "Napolitano_Pizza",
    "Demo_Burger_Bar",
    "Sample_Cafe",
  ]);

  const [uploadType, setUploadType] = useState<UploadType>("menu");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("Ready");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [lastJobId, setLastJobId] = useState("");
  const [lastUploadedFiles, setLastUploadedFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("menu");

  // Separate image state prevents menu uploads from appearing in Headers,
  // and prevents old restaurant images from carrying over when switching restaurants.
  const [menuImages, setMenuImages] = useState<LibraryImage[]>([]);
  const [originalImages, setOriginalImages] = useState<LibraryImage[]>([]);
  const [headerImages, setHeaderImages] = useState<LibraryImage[]>([]);
  const [enhancedImages] = useState<LibraryImage[]>([]);
  const [headerOutputImages] = useState<LibraryImage[]>([]);

  const activeRestaurantName = useMemo(() => {
    if (mode === "new") return restaurantName.trim();
    return prettyName(selectedRestaurant);
  }, [mode, restaurantName, selectedRestaurant]);

  const activeRestaurantSlug = useMemo(() => {
    if (mode === "new") return slugifyRestaurant(restaurantName);
    return selectedRestaurant;
  }, [mode, restaurantName, selectedRestaurant]);

  function clearRestaurantScopedState() {
    setFiles([]);
    setStatus("Ready");
    setMessage("");
    setError("");
    setLastJobId("");
    setLastUploadedFiles([]);
    setMenuImages([]);
    setOriginalImages([]);
    setHeaderImages([]);

    const input = document.getElementById("file") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  function buildPreviewImages(jobId: string, filePaths: string[]): LibraryImage[] {
    return filePaths.map((path) => {
      const filename = fileName(path);
      return {
        filename,
        url: imageUrl(jobId, filename),
      };
    });
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files || []));
    setError("");
    setMessage("");
  }

  function resetUploadOnly() {
    setFiles([]);
    const input = document.getElementById("file") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  function resetAll() {
    setRestaurantName("");
    setSelectedRestaurant("");
    setMode("new");
    setUploadType("menu");
    setActiveTab("menu");
    clearRestaurantScopedState();
  }

  async function uploadFiles() {
    const nameForUpload =
      mode === "new" ? restaurantName.trim() : prettyName(selectedRestaurant);

    if (!nameForUpload) {
      setError(mode === "new" ? "Enter a new restaurant name." : "Select an existing restaurant.");
      return;
    }

    if (!files.length) {
      setError("Choose images or a ZIP file first.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setStatus(uploadType === "header" ? "Uploading header files..." : "Uploading menu images...");
    setLastJobId("");
    setLastUploadedFiles([]);

    try {
      const form = new FormData();
      form.append("restaurant_name", nameForUpload);
      form.append("upload_type", uploadType);
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

      const jobId = data.job_id || "";
      const uploadedFiles = data.files || [];
      const previews = buildPreviewImages(jobId, uploadedFiles);

      setLastJobId(jobId);
      setLastUploadedFiles(uploadedFiles);
      setStatus("Uploaded");

      if (uploadType === "header") {
        setHeaderImages(previews);
        setActiveTab("headers");
        setMessage("Header files uploaded. They are kept separate from menu images.");
      } else {
        setMenuImages(previews);
        setOriginalImages(previews);
        setActiveTab("menu");
        setMessage("Menu images uploaded. Uploaded filenames will be used as final image names.");
      }

      resetUploadOnly();
    } catch (err) {
      setStatus("Upload failed");
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function approveLatestUpload() {
    if (!lastJobId || !lastUploadedFiles.length) {
      setError("Upload files first before approving.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Approving uploaded files...");

    try {
      const images = lastUploadedFiles.map((path) => {
        const filename = fileName(path);
        return {
          original_filename: filename,
          approved_name: filename,
        };
      });

      const res = await fetch(`${BACKEND_URL}/api/dpo/manual-jobs/${lastJobId}/approve-phase-a`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images }),
      });

      const text = await res.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || "Approval failed");
      }

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Approval failed");
      }

      setStatus("Approved");
      setMessage(`${data.approved_count || images.length} file(s) approved. Final names come from uploaded filenames.`);
    } catch (err) {
      setStatus("Approval failed");
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setLoading(false);
    }
  }

  const emptyLibraryText = activeRestaurantSlug
    ? "No saved images loaded yet. Upload files or connect the restaurant library endpoint next."
    : "Select or create a restaurant to begin.";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(99,102,241,0.16), transparent 34%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        padding: "34px 20px 56px",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "#0f172a",
      }}
    >
      <section style={{ maxWidth: 1220, margin: "0 auto" }}>
        <Hero />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 420px) minmax(0, 1fr)",
            gap: 20,
            alignItems: "start",
          }}
        >
          <Panel>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center" }}>
              <div>
                <Kicker>Restaurant setup</Kicker>
                <h2 style={sectionTitle}>Choose library</h2>
              </div>
              <StatusPill text={status} tone={status.includes("failed") ? "bad" : status === "Approved" ? "good" : "neutral"} />
            </div>

            <div style={{ marginTop: 18 }}>
              <SegmentedControl
                value={mode}
                options={[
                  { value: "new", label: "New restaurant" },
                  { value: "existing", label: "Existing" },
                ]}
                onChange={(v) => {
                  setMode(v as RestaurantMode);
                  clearRestaurantScopedState();
                  setActiveTab("menu");
                }}
              />
            </div>

            {mode === "new" ? (
              <div style={{ marginTop: 18 }}>
                <Label>New restaurant name</Label>
                <input
                  value={restaurantName}
                  onChange={(e) => {
                    setRestaurantName(e.target.value);
                    clearRestaurantScopedState();
                  }}
                  placeholder="e.g. Napolitano Pizza"
                  style={inputStyle}
                />
                <HelpText>Creates a permanent restaurant folder using this name.</HelpText>
              </div>
            ) : (
              <div style={{ marginTop: 18 }}>
                <Label>Select restaurant</Label>
                <select
                  value={selectedRestaurant}
                  onChange={(e) => {
                    setSelectedRestaurant(e.target.value);
                    clearRestaurantScopedState();
                  }}
                  style={inputStyle}
                >
                  <option value="">Choose saved restaurant...</option>
                  {restaurants.map((r) => (
                    <option key={r} value={r}>
                      {prettyName(r)}
                    </option>
                  ))}
                </select>
                <HelpText>This will load the restaurant library once backend list endpoints are wired.</HelpText>
              </div>
            )}

            <Divider />

            <div>
              <Kicker>Upload type</Kicker>
              <div style={{ marginTop: 10 }}>
                <SegmentedControl
                  value={uploadType}
                  options={[
                    { value: "menu", label: "Menu images" },
                    { value: "header", label: "Headers" },
                  ]}
                  onChange={(v) => {
                    setUploadType(v as UploadType);
                    setActiveTab(v === "header" ? "headers" : "menu");
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <Label>{uploadType === "header" ? "Upload header/banner files" : "Upload menu image files"}</Label>
              <input
                id="file"
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.webp,.zip"
                onChange={handleFiles}
                style={{ ...inputStyle, padding: 12, background: "#f8fafc" }}
              />
              <HelpText>
                Rename files locally first. Uploaded filenames become final approved names.
              </HelpText>
            </div>

            {files.length > 0 && (
              <div style={selectedFilesBox}>
                <div style={{ fontWeight: 900 }}>{files.length} file(s) selected</div>
                <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                  {files.slice(0, 6).map((f) => (
                    <div key={f.name} style={fileChip}>
                      {f.name}
                    </div>
                  ))}
                  {files.length > 6 && <div style={{ color: "#64748b", fontSize: 13 }}>+ {files.length - 6} more</div>}
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
              <button onClick={uploadFiles} disabled={loading} style={primaryButton(loading)}>
                {loading ? "Working..." : "Upload"}
              </button>

              <button onClick={approveLatestUpload} disabled={loading || !lastJobId} style={successButton(loading || !lastJobId)}>
                Approve latest
              </button>
            </div>

            <button onClick={resetAll} disabled={loading} style={{ ...ghostButton, width: "100%", marginTop: 10 }}>
              Reset workspace
            </button>

            {message && <Notice tone="good">{message}</Notice>}
            {error && <Notice tone="bad">{error}</Notice>}
          </Panel>

          <div style={{ display: "grid", gap: 20 }}>
            <Panel>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center" }}>
                <div>
                  <Kicker>Active restaurant</Kicker>
                  <h2 style={{ ...sectionTitle, marginTop: 4 }}>
                    {activeRestaurantName || "No restaurant selected"}
                  </h2>
                  <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                    {activeRestaurantSlug
                      ? `Library folder: ${activeRestaurantSlug}`
                      : "Create or select a restaurant to manage its images."}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <Metric label="Menu" value={String(menuImages.length)} />
                  <Metric label="Headers" value={String(headerImages.length)} />
                  <Metric label="Job" value={lastJobId || "-"} />
                </div>
              </div>

              <Tabs active={activeTab} setActive={setActiveTab} />

              {activeTab === "menu" && (
                <ImageGrid
                  title="Approved menu images"
                  subtitle="Final menu source images. Uploaded filenames are preserved and used for outputs."
                  images={menuImages}
                  emptyText={emptyLibraryText}
                  actionLabel="Delete"
                />
              )}

              {activeTab === "originals" && (
                <ImageGrid
                  title="Original uploads"
                  subtitle="Untouched originals for audit, reprocessing, and fallback."
                  images={originalImages}
                  emptyText={emptyLibraryText}
                  actionLabel="Archive"
                />
              )}

              {activeTab === "enhanced" && (
                <ImageGrid
                  title="Enhanced outputs"
                  subtitle="Phase B processed menu images will appear here."
                  images={enhancedImages}
                  emptyText="No enhanced outputs yet. Phase B will generate these."
                  actionLabel="View"
                />
              )}

              {activeTab === "headers" && (
                <ImageGrid
                  title="Header originals"
                  subtitle="Restaurant hero images, banners, storefront shots, and branding assets."
                  images={headerImages}
                  emptyText="Upload header/banner files to start building this library."
                  actionLabel="Delete"
                  wide
                />
              )}

              {activeTab === "headerOutputs" && (
                <ImageGrid
                  title="Header outputs"
                  subtitle="Enhanced or generated restaurant header images will appear here."
                  images={headerOutputImages}
                  emptyText="No header outputs yet."
                  actionLabel="View"
                  wide
                />
              )}
            </Panel>

            <Panel>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
                <div>
                  <Kicker>Workflow</Kicker>
                  <h2 style={sectionTitle}>Production path</h2>
                </div>
                <StatusPill text="Phase B pending" tone="neutral" />
              </div>

              <div style={workflowGrid}>
                <WorkflowStep number="01" title="Create / select restaurant" text="Switching restaurants clears previews so libraries do not mix." />
                <WorkflowStep number="02" title="Upload named files" text="Menu and header files are held in separate tab states." />
                <WorkflowStep number="03" title="Approve latest batch" text="Approved files become the source of truth for Phase B." />
                <WorkflowStep number="04" title="Enhance outputs" text="Next stage creates polished menu and header assets." />
              </div>
            </Panel>
          </div>
        </div>
      </section>
    </main>
  );
}

function Hero() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 52%, #312e81 100%)",
        color: "white",
        borderRadius: 30,
        padding: 34,
        marginBottom: 22,
        boxShadow: "0 28px 70px rgba(15,23,42,0.28)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: 999,
          background: "rgba(59,130,246,0.24)",
          right: -70,
          top: -100,
          filter: "blur(2px)",
        }}
      />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", gap: 24, alignItems: "center" }}>
        <div>
          <div style={{ color: "#93c5fd", fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", fontSize: 13 }}>
            Delivery Platform Optimization
          </div>
          <h1 style={{ margin: "10px 0 8px", fontSize: 42, lineHeight: 1.05 }}>
            Restaurant Image Library
          </h1>
          <p style={{ margin: 0, color: "#dbeafe", fontSize: 17, maxWidth: 720 }}>
            Organize originals, approved menu images, headers, and enhanced outputs in one clean restaurant workspace.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 22,
            padding: 18,
            minWidth: 210,
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ fontSize: 13, color: "#bfdbfe", fontWeight: 800 }}>Current mode</div>
          <div style={{ marginTop: 8, fontSize: 24, fontWeight: 950 }}>Phase A</div>
          <div style={{ marginTop: 4, color: "#dbeafe", fontSize: 13 }}>Upload → Approve → Enhance</div>
        </div>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(226,232,240,0.95)",
        borderRadius: 26,
        padding: 24,
        boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
        backdropFilter: "blur(14px)",
      }}
    >
      {children}
    </section>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 950, textTransform: "uppercase", letterSpacing: 0.9 }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: 13, color: "#334155", fontWeight: 900, marginBottom: 8 }}>{children}</label>;
}

function HelpText({ children }: { children: React.ReactNode }) {
  return <div style={{ marginTop: 7, color: "#64748b", fontSize: 12.5, lineHeight: 1.35 }}>{children}</div>;
}

function SegmentedControl({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 6, background: "#e2e8f0", padding: 5, borderRadius: 16 }}>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              border: 0,
              borderRadius: 12,
              padding: "10px 12px",
              background: active ? "white" : "transparent",
              color: active ? "#0f172a" : "#64748b",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: active ? "0 6px 16px rgba(15,23,42,0.10)" : "none",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Tabs({ active, setActive }: { active: ActiveTab; setActive: (tab: ActiveTab) => void }) {
  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "menu", label: "Menu Images" },
    { id: "originals", label: "Originals" },
    { id: "enhanced", label: "Enhanced" },
    { id: "headers", label: "Headers" },
    { id: "headerOutputs", label: "Header Outputs" },
  ];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 22, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              border: isActive ? "1px solid #4f46e5" : "1px solid #e2e8f0",
              background: isActive ? "#eef2ff" : "white",
              color: isActive ? "#3730a3" : "#475569",
              borderRadius: 999,
              padding: "9px 13px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function ImageGrid({
  title,
  subtitle,
  images,
  emptyText,
  actionLabel,
  wide = false,
}: {
  title: string;
  subtitle: string;
  images: LibraryImage[];
  emptyText: string;
  actionLabel: string;
  wide?: boolean;
}) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 20 }}>{title}</h3>
          <p style={{ margin: "6px 0 0", color: "#64748b", lineHeight: 1.45 }}>{subtitle}</p>
        </div>
        <div style={{ color: "#64748b", fontWeight: 900 }}>{images.length} file(s)</div>
      </div>

      {images.length === 0 ? (
        <div
          style={{
            marginTop: 16,
            border: "1px dashed #cbd5e1",
            borderRadius: 22,
            padding: 28,
            background: "#f8fafc",
            color: "#64748b",
            textAlign: "center",
            fontWeight: 800,
          }}
        >
          {emptyText}
        </div>
      ) : (
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: wide
              ? "repeat(auto-fill, minmax(320px, 1fr))"
              : "repeat(auto-fill, minmax(210px, 1fr))",
            gap: 16,
          }}
        >
          {images.map((img) => (
            <div
              key={img.filename}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 20,
                padding: 12,
                boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: wide ? 170 : 160,
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #e2e8f0, #f8fafc)",
                }}
              >
                {img.url ? (
                  <img
                    src={img.url}
                    alt={img.filename}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : null}
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontWeight: 950,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={img.filename}
              >
                {img.filename}
              </div>

              <button
                type="button"
                style={{
                  marginTop: 10,
                  width: "100%",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "9px 10px",
                  fontWeight: 900,
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                {actionLabel}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "10px 12px", minWidth: 92 }}>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 950, marginTop: 3 }}>{value}</div>
    </div>
  );
}

function WorkflowStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 20, padding: 16, background: "#f8fafc" }}>
      <div style={{ color: "#4f46e5", fontWeight: 950 }}>{number}</div>
      <div style={{ marginTop: 7, fontWeight: 950 }}>{title}</div>
      <div style={{ marginTop: 5, color: "#64748b", lineHeight: 1.45, fontSize: 13 }}>{text}</div>
    </div>
  );
}

function StatusPill({ text, tone }: { text: string; tone: "good" | "bad" | "neutral" }) {
  const styles =
    tone === "good"
      ? { bg: "#dcfce7", color: "#166534" }
      : tone === "bad"
        ? { bg: "#fee2e2", color: "#991b1b" }
        : { bg: "#eef2ff", color: "#3730a3" };

  return (
    <div style={{ background: styles.bg, color: styles.color, borderRadius: 999, padding: "8px 12px", fontWeight: 950, fontSize: 12 }}>
      {text}
    </div>
  );
}

function Notice({ children, tone }: { children: React.ReactNode; tone: "good" | "bad" }) {
  return (
    <div
      style={{
        marginTop: 16,
        borderRadius: 16,
        padding: 14,
        background: tone === "good" ? "#ecfdf5" : "#fef2f2",
        color: tone === "good" ? "#166534" : "#991b1b",
        fontWeight: 850,
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#e2e8f0", margin: "22px 0" }} />;
}

const sectionTitle: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: 22,
  lineHeight: 1.15,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#0f172a",
  fontSize: 15,
  outline: "none",
};

const selectedFilesBox: React.CSSProperties = {
  marginTop: 14,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  borderRadius: 16,
  padding: 14,
};

const fileChip: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "white",
  borderRadius: 10,
  padding: "7px 9px",
  color: "#475569",
  fontSize: 12.5,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

function primaryButton(disabled: boolean): React.CSSProperties {
  return {
    border: 0,
    borderRadius: 14,
    padding: "13px 16px",
    background: disabled ? "#94a3b8" : "linear-gradient(135deg, #111827, #312e81)",
    color: "white",
    fontWeight: 950,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "0 12px 24px rgba(49,46,129,0.22)",
  };
}

function successButton(disabled: boolean): React.CSSProperties {
  return {
    border: 0,
    borderRadius: 14,
    padding: "13px 16px",
    background: disabled ? "#94a3b8" : "linear-gradient(135deg, #16a34a, #15803d)",
    color: "white",
    fontWeight: 950,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "0 12px 24px rgba(22,163,74,0.20)",
  };
}

const ghostButton: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: "12px 16px",
  background: "white",
  color: "#334155",
  fontWeight: 950,
  cursor: "pointer",
};

const workflowGrid: React.CSSProperties = {
  marginTop: 16,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 12,
};
