"use client";

import { useEffect, useMemo, useState } from "react";

const BACKEND_URL = "https://170.64.209.149.sslip.io";

type RestaurantMode = "new" | "existing";
type ActiveTab = "originals" | "enhanced" | "headers" | "headerOutputs";
type UploadType = "original" | "header";

type LibraryImage = {
  filename: string;
  name?: string;
  url?: string;
  size?: number;
  modified?: number;
};

type Restaurant = {
  slug: string;
  name: string;
  originals_count?: number;
  enhanced_count?: number;
  headers_count?: number;
  outputs_count?: number;
};

type ManualJobResponse = {
  ok?: boolean;
  job_id?: string;
  status?: string;
  uploaded_count?: number;
  files?: string[];
  error?: string;
};

const IMAGE_FOLDERS: Record<ActiveTab, string> = {
  originals: "originals_approved",
  enhanced: "enhanced",
  headers: "headers",
  headerOutputs: "outputs",
};

function fileName(path: string) {
  return path.split("/").pop() || path;
}

function prettyName(slugOrName: string) {
  return slugOrName.replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();
}

function slugifyRestaurant(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function manualJobImageUrl(jobId: string, filename: string) {
  return `${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/files/${encodeURIComponent(filename)}`;
}


function downloadFileUrl(slug: string, folder: string, filename: string) {
  return `/api/dpo/restaurants/${encodeURIComponent(slug)}/download-file/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`;
}

function fullImageUrl(url?: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${BACKEND_URL}${url}`;
}

function normaliseLibraryImages(images: any[] | undefined): LibraryImage[] {
  return (images || []).map((img) => {
    const filename = img.filename || img.name || "image";
    return {
      ...img,
      filename,
      name: filename,
      url: fullImageUrl(img.url),
    };
  });
}

export default function Home() {
  const [mode, setMode] = useState<RestaurantMode>("existing");
  const [restaurantName, setRestaurantName] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);

  const [uploadType, setUploadType] = useState<UploadType>("original");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("Ready");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [lastJobId, setLastJobId] = useState("");
  const [lastUploadedFiles, setLastUploadedFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("originals");

  const [originalImages, setOriginalImages] = useState<LibraryImage[]>([]);
  const [enhancedImages, setEnhancedImages] = useState<LibraryImage[]>([]);
  const [headerImages, setHeaderImages] = useState<LibraryImage[]>([]);
  const [headerOutputImages, setHeaderOutputImages] = useState<LibraryImage[]>([]);

  const [previewImage, setPreviewImage] = useState<LibraryImage | null>(null);

  const activeRestaurantName = useMemo(() => {
    if (mode === "new") return restaurantName.trim();
    const found = restaurants.find((r) => r.slug === selectedRestaurant);
    return found?.name || prettyName(selectedRestaurant);
  }, [mode, restaurantName, selectedRestaurant, restaurants]);

  const activeRestaurantSlug = useMemo(() => {
    if (mode === "new") return slugifyRestaurant(restaurantName);
    return selectedRestaurant;
  }, [mode, restaurantName, selectedRestaurant]);

  const activeImages = useMemo(() => {
    if (activeTab === "originals") return originalImages;
    if (activeTab === "enhanced") return enhancedImages;
    if (activeTab === "headers") return headerImages;
    return headerOutputImages;
  }, [activeTab, originalImages, enhancedImages, headerImages, headerOutputImages]);

  async function loadRestaurants() {
    setRestaurantsLoading(true);
    try {
      const res = await fetch("/api/dpo/restaurants", { cache: "no-store" });
      const data = await res.json();
      setRestaurants(data.restaurants || []);
    } catch {
      setError("Could not load restaurant library.");
      setRestaurants([]);
    } finally {
      setRestaurantsLoading(false);
    }
  }

  async function loadRestaurantImages(slug: string) {
    if (!slug) return;
    setStatus("Loading library...");
    setError("");
    try {
      const res = await fetch(`/api/dpo/restaurants/${encodeURIComponent(slug)}/images`, { cache: "no-store" });
      const data = await res.json();
      const folders = data.folders || {};

      setOriginalImages(normaliseLibraryImages(folders.originals));
      setEnhancedImages(normaliseLibraryImages(folders.enhanced));
      setHeaderImages(normaliseLibraryImages(folders.headers));
      setHeaderOutputImages(normaliseLibraryImages(folders.outputs));
      setStatus("Library loaded");
    } catch {
      setOriginalImages([]);
      setEnhancedImages([]);
      setHeaderImages([]);
      setHeaderOutputImages([]);
      setStatus("Ready");
      setError("Could not load saved images for this restaurant.");
    }
  }

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (mode !== "existing" || !selectedRestaurant) return;
    clearRestaurantScopedState(false);
    loadRestaurantImages(selectedRestaurant);
    setActiveTab("originals");
  }, [mode, selectedRestaurant]);

  function clearRestaurantScopedState(clearSelection = true) {
    setFiles([]);
    setStatus("Ready");
    setMessage("");
    setError("");
    setLastJobId("");
    setLastUploadedFiles([]);
    setOriginalImages([]);
    setEnhancedImages([]);
    setHeaderImages([]);
    setHeaderOutputImages([]);
    setPreviewImage(null);
    if (clearSelection) setSelectedRestaurant("");

    const input = document.getElementById("file") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  function buildPreviewImages(jobId: string, filePaths: string[]): LibraryImage[] {
    return filePaths.map((path) => {
      const filename = fileName(path);
      return { filename, name: filename, url: manualJobImageUrl(jobId, filename) };
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
    setMode("existing");
    setUploadType("original");
    setActiveTab("originals");
    clearRestaurantScopedState(true);
  }

  async function uploadFiles() {
    const nameForUpload = mode === "new" ? restaurantName.trim() : activeRestaurantName;

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
    setStatus(uploadType === "header" ? "Uploading header files..." : "Uploading original images...");
    setLastJobId("");
    setLastUploadedFiles([]);

    try {
      const form = new FormData();
      form.append("restaurant_name", nameForUpload);
      form.append("upload_type", uploadType === "header" ? "header" : "menu");
      files.forEach((f) => form.append("files", f));

      const res = await fetch(`${BACKEND_URL}/api/dpo/manual-jobs`, { method: "POST", body: form });
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
        setMessage("Header files uploaded. Approve latest to add them to the library.");
      } else {
        setOriginalImages(previews);
        setActiveTab("originals");
        setMessage("Original images uploaded. Approve latest to add them to the library.");
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
        return { original_filename: filename, approved_name: filename };
      });

      const res = await fetch(`${BACKEND_URL}/api/dpo/manual-jobs/${lastJobId}/approve-phase-a`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        const msg = data.detail || data.error || "Approval failed";
        if (!String(msg).toLowerCase().includes("already")) {
          throw new Error(msg);
        }
      }

      setStatus("Approved");
      setMessage(`${data.approved_count || images.length} file(s) approved. Final names come from uploaded filenames.`);
      setLastUploadedFiles([]);
      resetUploadOnly();

      if (mode === "new") {
        const slug = slugifyRestaurant(restaurantName);
        await loadRestaurants();
        setMode("existing");
        setSelectedRestaurant(slug);
        await loadRestaurantImages(slug);
      } else if (selectedRestaurant) {
        await loadRestaurantImages(selectedRestaurant);
      }
    } catch (err) {
      setStatus("Approval failed");
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setLoading(false);
    }
  }

  async function deleteRestaurant() {
    if (!activeRestaurantSlug) return;
    const ok = window.prompt(`Type DELETE to archive restaurant: ${activeRestaurantName}`);
    if (ok !== "DELETE") return;

    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.detail || data.error || "Delete failed");

      setMessage("Restaurant archived successfully.");
      resetAll();
      await loadRestaurants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete restaurant failed");
    } finally {
      setLoading(false);
    }
  }

  async function deleteImage(img: LibraryImage, tab: ActiveTab) {
    if (!activeRestaurantSlug) return;
    const ok = window.prompt(`Type DELETE to remove: ${img.filename}`);
    if (ok !== "DELETE") return;

    const folder = IMAGE_FOLDERS[tab];
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/images/${encodeURIComponent(folder)}/${encodeURIComponent(img.filename)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.detail || data.error || "Delete failed");
      setMessage(`${img.filename} archived.`);
      await loadRestaurantImages(activeRestaurantSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete image failed");
    } finally {
      setLoading(false);
    }
  }

  async function enhanceImage(img: LibraryImage) {
    if (!activeRestaurantSlug) return;
    const ok = window.prompt(`Type ENHANCE to enhance: ${img.filename}`);
    if (ok !== "ENHANCE") return;

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Enhancing image...");
    try {
      const res = await fetch(
        `/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/images/${encodeURIComponent(img.filename)}/enhance`,
        { method: "POST" }
      );
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.detail || data.error || "Enhance failed");
      setMessage(`${img.filename} enhanced.`);
      setStatus("Enhanced");
      await loadRestaurantImages(activeRestaurantSlug);
      setActiveTab("enhanced");
    } catch (err) {
      setStatus("Enhance failed");
      setError(err instanceof Error ? err.message : "Enhance failed");
    } finally {
      setLoading(false);
    }
  }

  async function enhanceAll() {
    if (!activeRestaurantSlug) return;
    const ok = window.prompt("Type ENHANCE ALL to enhance every original image.");
    if (ok !== "ENHANCE ALL") return;

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Enhancing all originals...");
    try {
      const res = await fetch(`/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/enhance-all`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.detail || data.error || "Enhance all failed");
      setMessage(`${data.count || data.processed?.length || 0} image(s) enhanced.`);
      setStatus("Enhanced");
      await loadRestaurantImages(activeRestaurantSlug);
      setActiveTab("enhanced");
    } catch (err) {
      setStatus("Enhance failed");
      setError(err instanceof Error ? err.message : "Enhance all failed");
    } finally {
      setLoading(false);
    }
  }

  const emptyLibraryText = activeRestaurantSlug
    ? "No images found in this folder yet."
    : "Select or create a restaurant to begin.";

  const downloadAllUrl = activeRestaurantSlug
    ? `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/download-all`
    : "#";

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
              <StatusPill text={status} tone={status.includes("failed") ? "bad" : status === "Approved" || status === "Enhanced" ? "good" : "neutral"} />
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
                  clearRestaurantScopedState(true);
                  setActiveTab("originals");
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
                    clearRestaurantScopedState(false);
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
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">{restaurantsLoading ? "Loading restaurants..." : "Choose saved restaurant..."}</option>
                  {restaurants.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <HelpText>Selecting a restaurant loads originals, enhanced outputs, and headers.</HelpText>
              </div>
            )}

            {activeRestaurantSlug && mode === "existing" && (
              <button onClick={deleteRestaurant} disabled={loading} style={{ ...dangerButton(loading), width: "100%", marginTop: 16 }}>
                Delete restaurant
              </button>
            )}

            <Divider />

            <div>
              <Kicker>Upload type</Kicker>
              <div style={{ marginTop: 10 }}>
                <SegmentedControl
                  value={uploadType}
                  options={[
                    { value: "original", label: "Originals" },
                    { value: "header", label: "Headers" },
                  ]}
                  onChange={(v) => {
                    setUploadType(v as UploadType);
                    setActiveTab(v === "header" ? "headers" : "originals");
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <Label>{uploadType === "header" ? "Upload header/banner files" : "Upload original food images"}</Label>
              <input
                id="file"
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.webp,.zip"
                onChange={handleFiles}
                style={{ ...inputStyle, padding: 12, background: "#f8fafc" }}
              />
              <HelpText>Rename files locally first. Uploaded filenames become source names for Phase B.</HelpText>
            </div>

            {files.length > 0 && (
              <div style={selectedFilesBox}>
                <div style={{ fontWeight: 900 }}>{files.length} file(s) selected</div>
                <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                  {files.slice(0, 6).map((f) => (
                    <div key={f.name} style={fileChip}>{f.name}</div>
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

            <button onClick={enhanceAll} disabled={loading || !activeRestaurantSlug || originalImages.length === 0} style={{ ...purpleButton(loading || !activeRestaurantSlug || originalImages.length === 0), width: "100%", marginTop: 10 }}>
              Phase B: Enhance all originals
            </button>

            <a
              href={activeRestaurantSlug ? downloadAllUrl : undefined}
              style={{ ...downloadAllButton(!activeRestaurantSlug), width: "100%", marginTop: 10, textDecoration: "none" }}
            >
              Download all restaurant files
            </a>

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
                  <h2 style={{ ...sectionTitle, marginTop: 4 }}>{activeRestaurantName || "No restaurant selected"}</h2>
                  <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                    {activeRestaurantSlug ? `Library folder: ${activeRestaurantSlug}` : "Create or select a restaurant to manage its images."}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <Metric label="Originals" value={String(originalImages.length)} />
                  <Metric label="Enhanced" value={String(enhancedImages.length)} />
                  <Metric label="Headers" value={String(headerImages.length)} />
                </div>
              </div>

              <Tabs active={activeTab} setActive={setActiveTab} />

              {activeTab === "originals" && (
                <ImageGrid
                  title="Originals (Approved)"
                  subtitle="Source food images. Click to preview, download individually, delete, or enhance one image."
                  images={originalImages}
                  emptyText={emptyLibraryText}
                  folder="originals_approved"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDelete={(img) => deleteImage(img, "originals_approved")}
                  onEnhance={enhanceImage}
                  showEnhance
                />
              )}

              {activeTab === "enhanced" && (
                <ImageGrid
                  title="Enhanced"
                  subtitle="Phase B outputs. Click to preview, download individually, or delete."
                  images={enhancedImages}
                  emptyText="No enhanced outputs yet. Enhance one original or run Phase B for all."
                  folder="enhanced"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDelete={(img) => deleteImage(img, "enhanced")}
                />
              )}

              {activeTab === "headers" && (
                <ImageGrid
                  title="Headers"
                  subtitle="Restaurant hero images, banners, storefront shots, and branding assets."
                  images={headerImages}
                  emptyText="Upload header/banner files to start building this library."
                  folder="headers"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDelete={(img) => deleteImage(img, "headers")}
                  wide
                />
              )}

              {activeTab === "headerOutputs" && (
                <ImageGrid
                  title="Header outputs"
                  subtitle="Enhanced or generated restaurant header images will appear here."
                  images={headerOutputImages}
                  emptyText="No header outputs yet."
                  folder="outputs"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDelete={(img) => deleteImage(img, "headerOutputs")}
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
                <StatusPill text="Phase B ready" tone="neutral" />
              </div>

              <div style={workflowGrid}>
                <WorkflowStep number="01" title="Create / select restaurant" text="Each restaurant has its own isolated image library." />
                <WorkflowStep number="02" title="Upload originals" text="Originals are the source of truth for Phase B." />
                <WorkflowStep number="03" title="Enhance one or all" text="Enhance individual images or batch process the full restaurant." />
                <WorkflowStep number="04" title="Export outputs" text="Download all restaurant files in a structured zip." />
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {previewImage && <ImagePreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />}
    </main>
  );
}

function Hero() {
  return (
    <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 52%, #312e81 100%)", color: "white", borderRadius: 30, padding: 34, marginBottom: 22, boxShadow: "0 28px 70px rgba(15,23,42,0.28)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 260, height: 260, borderRadius: 999, background: "rgba(59,130,246,0.24)", right: -70, top: -100, filter: "blur(2px)" }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", gap: 24, alignItems: "center" }}>
        <div>
          <div style={{ color: "#93c5fd", fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", fontSize: 13 }}>Delivery Platform Optimization</div>
          <h1 style={{ margin: "10px 0 8px", fontSize: 42, lineHeight: 1.05 }}>Restaurant Image Library</h1>
          <p style={{ margin: 0, color: "#dbeafe", fontSize: 17, maxWidth: 720 }}>Manage originals, enhanced outputs, headers, and final delivery-ready restaurant assets.</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 22, padding: 18, minWidth: 210, backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 13, color: "#bfdbfe", fontWeight: 800 }}>Current mode</div>
          <div style={{ marginTop: 8, fontSize: 24, fontWeight: 950 }}>Phase B Ready</div>
          <div style={{ marginTop: 4, color: "#dbeafe", fontSize: 13 }}>Originals → Enhanced → Export</div>
        </div>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <section style={{ background: "rgba(255,255,255,0.88)", border: "1px solid rgba(226,232,240,0.95)", borderRadius: 26, padding: 24, boxShadow: "0 16px 40px rgba(15,23,42,0.08)", backdropFilter: "blur(14px)" }}>{children}</section>;
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 950, textTransform: "uppercase", letterSpacing: 0.9 }}>{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: 13, color: "#334155", fontWeight: 900, marginBottom: 8 }}>{children}</label>;
}

function HelpText({ children }: { children: React.ReactNode }) {
  return <div style={{ marginTop: 7, color: "#64748b", fontSize: 12.5, lineHeight: 1.35 }}>{children}</div>;
}

function SegmentedControl({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 6, background: "#e2e8f0", padding: 5, borderRadius: 16 }}>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button key={option.value} onClick={() => onChange(option.value)} style={{ border: 0, borderRadius: 12, padding: "10px 12px", background: active ? "white" : "transparent", color: active ? "#0f172a" : "#64748b", fontWeight: 900, cursor: "pointer", boxShadow: active ? "0 6px 16px rgba(15,23,42,0.10)" : "none" }}>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Tabs({ active, setActive }: { active: ActiveTab; setActive: (tab: ActiveTab) => void }) {
  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "originals", label: "Originals" },
    { id: "enhanced", label: "Enhanced" },
    { id: "headers", label: "Headers" },
    { id: "headerOutputs", label: "Header Outputs" },
  ];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 22, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return <button key={tab.id} onClick={() => setActive(tab.id)} style={{ border: isActive ? "1px solid #4f46e5" : "1px solid #e2e8f0", background: isActive ? "#eef2ff" : "white", color: isActive ? "#3730a3" : "#475569", borderRadius: 999, padding: "9px 13px", fontWeight: 900, cursor: "pointer" }}>{tab.label}</button>;
      })}
    </div>
  );
}

function ImageGrid({ title, subtitle, images, emptyText, folder, restaurantSlug, onPreview, onDelete, onEnhance, showEnhance = false, wide = false }: { title: string; subtitle: string; images: LibraryImage[]; emptyText: string; folder: string; restaurantSlug: string; onPreview: (image: LibraryImage) => void; onDelete: (image: LibraryImage) => void; onEnhance?: (image: LibraryImage) => void; showEnhance?: boolean; wide?: boolean }) {
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
        <div style={{ marginTop: 16, border: "1px dashed #cbd5e1", borderRadius: 22, padding: 28, background: "#f8fafc", color: "#64748b", textAlign: "center", fontWeight: 800 }}>{emptyText}</div>
      ) : (
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: wide ? "repeat(auto-fill, minmax(320px, 1fr))" : "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 }}>
          {images.map((img) => (
            <div key={`${folder}-${img.filename}`} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 12, boxShadow: "0 10px 24px rgba(15,23,42,0.06)" }}>
              <button onClick={() => onPreview(img)} style={{ width: "100%", height: wide ? 170 : 160, borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, #e2e8f0, #f8fafc)", border: 0, padding: 0, cursor: "zoom-in" }}>
                {img.url ? <img src={img.url} alt={img.filename} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : null}
              </button>

              <div style={{ marginTop: 10, fontWeight: 950, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={img.filename}>{img.filename}</div>

              <div style={{ display: "grid", gridTemplateColumns: showEnhance ? "1fr 1fr" : "1fr 1fr", gap: 8, marginTop: 10 }}>
                {showEnhance && onEnhance ? (
                  <button type="button" onClick={() => onEnhance(img)} style={smallActionButton("primary")}>Enhance</button>
                ) : (
                  <a href={downloadFileUrl(restaurantSlug, folder, img.filename)} download={img.filename} style={{ ...smallActionButton("primary"), textDecoration: "none", textAlign: "center" }}>Download</a>
                )}
                <button type="button" onClick={() => onDelete(img)} style={smallActionButton("danger")}>Delete</button>
              </div>

              {showEnhance && (
                <a href={downloadFileUrl(restaurantSlug, folder, img.filename)} download={img.filename} style={{ ...smallActionButton("neutral"), marginTop: 8, textDecoration: "none", textAlign: "center" }}>Download</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImagePreviewModal({ image, onClose }: { image: LibraryImage; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.84)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "92vw", maxHeight: "92vh", background: "white", borderRadius: 24, padding: 16, boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ fontWeight: 950 }}>{image.filename}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={smallActionButton("neutral")}>Close</button>
          </div>
        </div>
        {image.url && <img src={image.url} alt={image.filename} style={{ maxWidth: "88vw", maxHeight: "78vh", objectFit: "contain", borderRadius: 16, display: "block" }} />}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "10px 12px", minWidth: 92 }}><div style={{ fontSize: 11, color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>{label}</div><div style={{ fontSize: 16, fontWeight: 950, marginTop: 3 }}>{value}</div></div>;
}

function WorkflowStep({ number, title, text }: { number: string; title: string; text: string }) {
  return <div style={{ border: "1px solid #e2e8f0", borderRadius: 20, padding: 16, background: "#f8fafc" }}><div style={{ color: "#4f46e5", fontWeight: 950 }}>{number}</div><div style={{ marginTop: 7, fontWeight: 950 }}>{title}</div><div style={{ marginTop: 5, color: "#64748b", lineHeight: 1.45, fontSize: 13 }}>{text}</div></div>;
}

function StatusPill({ text, tone }: { text: string; tone: "good" | "bad" | "neutral" }) {
  const styles = tone === "good" ? { bg: "#dcfce7", color: "#166534" } : tone === "bad" ? { bg: "#fee2e2", color: "#991b1b" } : { bg: "#eef2ff", color: "#3730a3" };
  return <div style={{ background: styles.bg, color: styles.color, borderRadius: 999, padding: "8px 12px", fontWeight: 950, fontSize: 12 }}>{text}</div>;
}

function Notice({ children, tone }: { children: React.ReactNode; tone: "good" | "bad" }) {
  return <div style={{ marginTop: 16, borderRadius: 16, padding: 14, background: tone === "good" ? "#ecfdf5" : "#fef2f2", color: tone === "good" ? "#166534" : "#991b1b", fontWeight: 850, lineHeight: 1.4 }}>{children}</div>;
}

function Divider() { return <div style={{ height: 1, background: "#e2e8f0", margin: "22px 0" }} />; }

const sectionTitle: React.CSSProperties = { margin: "4px 0 0", fontSize: 22, lineHeight: 1.15 };
const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: 14, border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontSize: 15, outline: "none" };
const selectedFilesBox: React.CSSProperties = { marginTop: 14, border: "1px solid #e2e8f0", background: "#f8fafc", borderRadius: 16, padding: 14 };
const fileChip: React.CSSProperties = { border: "1px solid #e2e8f0", background: "white", borderRadius: 10, padding: "7px 9px", color: "#475569", fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

function primaryButton(disabled: boolean): React.CSSProperties { return { border: 0, borderRadius: 14, padding: "13px 16px", background: disabled ? "#94a3b8" : "linear-gradient(135deg, #111827, #312e81)", color: "white", fontWeight: 950, cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 12px 24px rgba(49,46,129,0.22)" }; }
function successButton(disabled: boolean): React.CSSProperties { return { border: 0, borderRadius: 14, padding: "13px 16px", background: disabled ? "#94a3b8" : "linear-gradient(135deg, #16a34a, #15803d)", color: "white", fontWeight: 950, cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 12px 24px rgba(22,163,74,0.20)" }; }
function purpleButton(disabled: boolean): React.CSSProperties { return { border: 0, borderRadius: 14, padding: "13px 16px", background: disabled ? "#94a3b8" : "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white", fontWeight: 950, cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 12px 24px rgba(124,58,237,0.22)" }; }
function dangerButton(disabled: boolean): React.CSSProperties { return { border: 0, borderRadius: 14, padding: "13px 16px", background: disabled ? "#94a3b8" : "linear-gradient(135deg, #dc2626, #991b1b)", color: "white", fontWeight: 950, cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 12px 24px rgba(220,38,38,0.18)" }; }
function downloadAllButton(disabled: boolean): React.CSSProperties { return { display: "block", boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: 14, padding: "12px 16px", background: disabled ? "#e2e8f0" : "white", color: disabled ? "#94a3b8" : "#334155", fontWeight: 950, textAlign: "center", pointerEvents: disabled ? "none" : "auto" }; }
function smallActionButton(tone: "primary" | "danger" | "neutral"): React.CSSProperties { return { border: tone === "danger" ? "1px solid #fecaca" : "1px solid #e2e8f0", background: tone === "danger" ? "#fff1f2" : tone === "primary" ? "#eef2ff" : "#f8fafc", color: tone === "danger" ? "#991b1b" : tone === "primary" ? "#3730a3" : "#475569", borderRadius: 12, padding: "9px 10px", fontWeight: 950, cursor: "pointer", display: "block" }; }

const ghostButton: React.CSSProperties = { border: "1px solid #cbd5e1", borderRadius: 14, padding: "12px 16px", background: "white", color: "#334155", fontWeight: 950, cursor: "pointer" };
const workflowGrid: React.CSSProperties = { marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 };
