"use client";

import { useEffect, useMemo, useState } from "react";

const BACKEND_URL = "https://170.64.209.149.sslip.io";

type RestaurantMode = "new" | "existing";
type ActiveTab = "original" | "compare" | "enhanced" | "header" | "headerEnhanced";
type UploadType = "menu" | "header";

type LibraryImage = {
  filename: string;
  name?: string;
  url?: string;
  size?: number;
  modified?: number;
  updated_at?: string;
};

type Restaurant = {
  slug: string;
  name: string;
  originals_count?: number;
  approved_count?: number;
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
  original: "originals_approved",
  compare: "originals_approved",
  enhanced: "enhanced",
  header: "headers",
  headerEnhanced: "outputs",
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
    .replace(/[^a-z0-9 _-]/g, "-")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function jobImageUrl(jobId: string, filename: string) {
  return `${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/files/${encodeURIComponent(filename)}`;
}

function normalizeImages(images: any[] | undefined): LibraryImage[] {
  return (images || []).map((img) => {
    const filename = img.filename || img.name || "image";
    const rawUrl = img.url || "";
    return {
      ...img,
      filename,
      name: filename,
      url: rawUrl && rawUrl.startsWith("http") ? rawUrl : rawUrl ? `${BACKEND_URL}${rawUrl}` : undefined,
    };
  });
}

function confirmPhrase(message: string, phrase: string) {
  const value = window.prompt(`${message}\n\nType ${phrase} to confirm.`);
  return value === phrase;
}

export default function Home() {
  const [mode, setMode] = useState<RestaurantMode>("existing");
  const [restaurantName, setRestaurantName] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);

  const [uploadType, setUploadType] = useState<UploadType>("menu");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("Ready");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [lastJobId, setLastJobId] = useState("");
  const [lastUploadedFiles, setLastUploadedFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("original");

  const [originalImages, setOriginalImages] = useState<LibraryImage[]>([]);
  const [enhancedImages, setEnhancedImages] = useState<LibraryImage[]>([]);
  const [headerImages, setHeaderImages] = useState<LibraryImage[]>([]);
  const [headerOutputImages, setHeaderOutputImages] = useState<LibraryImage[]>([]);
  const [previewImage, setPreviewImage] = useState<LibraryImage | null>(null);

  const [phaseBRunning, setPhaseBRunning] = useState(false);
  const [phaseBProgress, setPhaseBProgress] = useState(0);
  const [enhancingFile, setEnhancingFile] = useState("");

  const activeRestaurantName = useMemo(() => {
    if (mode === "new") return restaurantName.trim();
    const found = restaurants.find((r) => r.slug === selectedRestaurant);
    return found?.name || prettyName(selectedRestaurant);
  }, [mode, restaurantName, selectedRestaurant, restaurants]);

  const activeRestaurantSlug = useMemo(() => {
    if (mode === "new") return slugifyRestaurant(restaurantName);
    return selectedRestaurant;
  }, [mode, restaurantName, selectedRestaurant]);

  const comparisonRows = useMemo(() => {
    const enhancedByName = new Map(enhancedImages.map((img) => [img.filename, img]));
    return originalImages.map((original) => ({
      filename: original.filename,
      original,
      enhanced: enhancedByName.get(original.filename) || null,
    }));
  }, [originalImages, enhancedImages]);

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
      const res = await fetch(`/api/dpo/restaurants/${encodeURIComponent(slug)}/images`, {
        cache: "no-store",
      });
      const data = await res.json();
      const folders = data.folders || {};

      setOriginalImages(normalizeImages(folders.originals));
      setEnhancedImages(normalizeImages(folders.enhanced));
      setHeaderImages(normalizeImages(folders.headers));
      setHeaderOutputImages(normalizeImages(folders.outputs));

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
    setActiveTab("original");
  }, [mode, selectedRestaurant]);

  useEffect(() => {
    if (!phaseBRunning) return;

    setPhaseBProgress(8);
    const timer = window.setInterval(() => {
      setPhaseBProgress((p) => {
        if (p >= 92) return p;
        return Math.min(92, p + Math.floor(Math.random() * 8) + 3);
      });
    }, 900);

    return () => window.clearInterval(timer);
  }, [phaseBRunning]);

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
      return {
        filename,
        url: jobImageUrl(jobId, filename),
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
    setMode("existing");
    setUploadType("menu");
    setActiveTab("original");
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
    setStatus(uploadType === "header" ? "Uploading header files..." : "Uploading original images...");
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
        setActiveTab("header");
        setMessage("Header files uploaded. Approve latest to save them into this restaurant.");
      } else {
        setOriginalImages(previews);
        setActiveTab("original");
        setMessage("Images uploaded. Click Approve latest to save them into Originals.");
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
      setMessage(`${data.approved_count || images.length} file(s) approved and saved.`);
      setLastJobId("");
      setLastUploadedFiles([]);

      await loadRestaurants();
      if (activeRestaurantSlug) await loadRestaurantImages(activeRestaurantSlug);
      setActiveTab(uploadType === "header" ? "header" : "original");
    } catch (err) {
      setStatus("Approval failed");
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setLoading(false);
    }
  }

  async function deleteRestaurant() {
    if (!activeRestaurantSlug) {
      setError("Select a restaurant first.");
      return;
    }

    if (!confirmPhrase(`Delete restaurant "${activeRestaurantName}" and archive all its files?`, "DELETE")) {
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Deleting restaurant...");

    try {
      const res = await fetch(`/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Delete failed");
      }

      setMessage("Restaurant deleted and archived.");
      resetAll();
      await loadRestaurants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete restaurant failed");
    } finally {
      setLoading(false);
      setStatus("Ready");
    }
  }

  async function deleteImage(img: LibraryImage, folder: string) {
    if (!activeRestaurantSlug) return;

    if (!confirmPhrase(`Delete "${img.filename}" from ${folder}?`, "DELETE")) return;

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Deleting image...");

    try {
      const res = await fetch(
        `/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/images/${encodeURIComponent(folder)}/${encodeURIComponent(img.filename)}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Delete failed");
      }

      setMessage(`${img.filename} deleted.`);
      await loadRestaurantImages(activeRestaurantSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
      setStatus("Ready");
    }
  }

  async function enhanceImage(img: LibraryImage) {
    if (!activeRestaurantSlug) return;

    if (!confirmPhrase(`Enhance "${img.filename}"?`, "ENHANCE")) return;

    setPhaseBRunning(true);
    setPhaseBProgress(0);
    setEnhancingFile(img.filename);
    setLoading(true);
    setError("");
    setMessage("");
    setStatus(`Enhancing ${img.filename}...`);

    try {
      const res = await fetch(
        `/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/images/${encodeURIComponent(img.filename)}/enhance`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Enhance failed");
      }

      setPhaseBProgress(100);
      setMessage(`${img.filename} enhanced.`);
      await loadRestaurantImages(activeRestaurantSlug);
      setActiveTab("enhanced");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enhance failed");
    } finally {
      setLoading(false);
      setStatus("Ready");
      setEnhancingFile("");
      setTimeout(() => {
        setPhaseBRunning(false);
        setPhaseBProgress(0);
      }, 700);
    }
  }

  async function enhanceAll() {
    if (!activeRestaurantSlug) return;

    if (!confirmPhrase(`Enhance all originals for "${activeRestaurantName}"?`, "ENHANCE ALL")) {
      return;
    }

    setPhaseBRunning(true);
    setPhaseBProgress(0);
    setEnhancingFile("All originals");
    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Phase B running...");

    try {
      const res = await fetch(`/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/enhance-all`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Enhance all failed");
      }

      setPhaseBProgress(100);
      setMessage(`Phase B complete. Enhanced ${data.count || data.processed?.length || 0} image(s).`);
      await loadRestaurantImages(activeRestaurantSlug);
      setActiveTab("enhanced");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enhance all failed");
    } finally {
      setLoading(false);
      setStatus("Ready");
      setEnhancingFile("");
      setTimeout(() => {
        setPhaseBRunning(false);
        setPhaseBProgress(0);
      }, 700);
    }
  }

  function downloadImage(img: LibraryImage, folder: string) {
    if (!activeRestaurantSlug) return;
    window.location.href = `/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/download-file/${encodeURIComponent(folder)}/${encodeURIComponent(img.filename)}`;
  }

  function downloadAllRestaurantFiles() {
    if (!activeRestaurantSlug) return;
    window.location.href = `/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/download-all`;
  }

  const emptyLibraryText = activeRestaurantSlug
    ? "No images found yet. Upload files and approve them to build this restaurant library."
    : "Select or create a restaurant to begin.";

  return (
    <main style={pageStyle}>
      <section style={{ maxWidth: 1220, margin: "0 auto" }}>
        <Hero />

        <div style={layoutGrid}>
          <Panel>
            <div style={spaceBetween}>
              <div>
                <Kicker>Restaurant setup</Kicker>
                <h2 style={sectionTitle}>Choose library</h2>
              </div>
              <StatusPill text={status} tone={status.toLowerCase().includes("failed") ? "bad" : status === "Approved" ? "good" : "neutral"} />
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
                  clearRestaurantScopedState(v === "new");
                  setActiveTab("original");
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
                  onChange={(e) => {
                    setSelectedRestaurant(e.target.value);
                    clearRestaurantScopedState(false);
                  }}
                  style={inputStyle}
                >
                  <option value="">{restaurantsLoading ? "Loading restaurants..." : "Choose saved restaurant..."}</option>
                  {restaurants.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <HelpText>Selecting a restaurant loads saved originals, enhanced images, and headers.</HelpText>
              </div>
            )}

            <Divider />

            <div>
              <Kicker>Upload type</Kicker>
              <div style={{ marginTop: 10 }}>
                <SegmentedControl
                  value={uploadType}
                  options={[
                    { value: "menu", label: "Original images" },
                    { value: "header", label: "Headers" },
                  ]}
                  onChange={(v) => {
                    setUploadType(v as UploadType);
                    setActiveTab(v === "header" ? "header" : "original");
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <Label>{uploadType === "header" ? "Upload header/banner files" : "Upload original image files"}</Label>
              <input
                id="file"
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.webp,.zip"
                onChange={handleFiles}
                style={{ ...inputStyle, padding: 12, background: "#f8fafc" }}
              />
              <HelpText>Duplicate filenames are blocked. Delete the old file first or rename the new file.</HelpText>
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

            {activeRestaurantSlug && (
              <button onClick={deleteRestaurant} disabled={loading} style={{ ...dangerButton(loading), width: "100%", marginTop: 10 }}>
                Delete restaurant
              </button>
            )}

            {phaseBRunning && (
              <ProgressBox label={enhancingFile ? `Enhancing: ${enhancingFile}` : "Phase B running"} progress={phaseBProgress} />
            )}

            {message && <Notice tone="good">{message}</Notice>}
            {error && <Notice tone="bad">{error}</Notice>}
          </Panel>

          <div style={{ display: "grid", gap: 20 }}>
            <Panel>
              <div style={spaceBetween}>
                <div>
                  <Kicker>Active restaurant</Kicker>
                  <h2 style={{ ...sectionTitle, marginTop: 4 }}>
                    {activeRestaurantName || "No restaurant selected"}
                  </h2>
                  <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                    {activeRestaurantSlug
                      ? `Library folder: ${activeRestaurantSlug}`
                      : "Create or select a restaurant to manage images."}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <Metric label="Original" value={String(originalImages.length)} />
                  <Metric label="Enhanced" value={String(enhancedImages.length)} />
                  <Metric label="Headers" value={String(headerImages.length)} />
                </div>
              </div>

              <Tabs active={activeTab} setActive={setActiveTab} />

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                <button onClick={downloadAllRestaurantFiles} disabled={!activeRestaurantSlug || loading} style={secondaryButton(!activeRestaurantSlug || loading)}>
                  Download all restaurant files
                </button>
                <button onClick={enhanceAll} disabled={!activeRestaurantSlug || loading || originalImages.length === 0} style={primaryButton(!activeRestaurantSlug || loading || originalImages.length === 0)}>
                  Phase B: Enhance all originals
                </button>
              </div>

              {activeTab === "original" && (
                <ImageGrid
                  title="Original"
                  subtitle="Approved Phase A source images. These are the source of truth for enhancement."
                  images={originalImages}
                  emptyText={emptyLibraryText}
                  actionLabel="Delete"
                  folder="originals_approved"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "originals_approved")}
                  onEnhance={enhanceImage}
                  showEnhance
                />
              )}

              {activeTab === "compare" && (
                <CompareGrid
                  rows={comparisonRows}
                  onPreview={setPreviewImage}
                  emptyText={emptyLibraryText}
                />
              )}

              {activeTab === "enhanced" && (
                <ImageGrid
                  title="Enhanced"
                  subtitle="Phase B outputs. These are the polished delivery-platform images."
                  images={enhancedImages}
                  emptyText="No enhanced outputs yet. Enhance one image or run Phase B."
                  actionLabel="Delete"
                  folder="enhanced"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "enhanced")}
                />
              )}

              {activeTab === "header" && (
                <ImageGrid
                  title="Header"
                  subtitle="Restaurant hero images, banners, storefront shots, and branding assets."
                  images={headerImages}
                  emptyText="Upload header/banner files to start building this library."
                  actionLabel="Delete"
                  folder="headers"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "headers")}
                  wide
                />
              )}

              {activeTab === "headerEnhanced" && (
                <ImageGrid
                  title="Header Enhanced"
                  subtitle="Enhanced restaurant header images."
                  images={headerOutputImages}
                  emptyText="No enhanced header outputs yet."
                  actionLabel="Delete"
                  folder="outputs"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "outputs")}
                  wide
                />
              )}
            </Panel>

            <Panel>
              <div style={spaceBetween}>
                <div>
                  <Kicker>Workflow</Kicker>
                  <h2 style={sectionTitle}>Production path</h2>
                </div>
                <StatusPill text="Phase B active" tone="good" />
              </div>

              <div style={workflowGrid}>
                <WorkflowStep number="01" title="Original" text="Upload and approve the restaurant’s source menu images." />
                <WorkflowStep number="02" title="Old Vs New" text="Compare original and enhanced images side by side using matching filenames." />
                <WorkflowStep number="03" title="Enhanced" text="Download final polished images or delete outputs you do not want." />
                <WorkflowStep number="04" title="Headers" text="Keep restaurant banners separate from menu item images." />
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {previewImage && (
        <PreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </main>
  );
}

function Hero() {
  return (
    <div style={heroStyle}>
      <div style={heroGlow} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", gap: 24, alignItems: "center" }}>
        <div>
          <div style={{ color: "#93c5fd", fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", fontSize: 13 }}>
            Delivery Platform Optimization
          </div>
          <h1 style={{ margin: "10px 0 8px", fontSize: 42, lineHeight: 1.05 }}>
            Restaurant Image Library
          </h1>
          <p style={{ margin: 0, color: "#dbeafe", fontSize: 17, maxWidth: 760 }}>
            Original → Old Vs New → Enhanced. Build consistent, high-converting restaurant image packs.
          </p>
        </div>

        <div style={heroBadge}>
          <div style={{ fontSize: 13, color: "#bfdbfe", fontWeight: 800 }}>Current mode</div>
          <div style={{ marginTop: 8, fontSize: 24, fontWeight: 950 }}>Phase B</div>
          <div style={{ marginTop: 4, color: "#dbeafe", fontSize: 13 }}>Approve → Enhance → Export</div>
        </div>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <section style={panelStyle}>{children}</section>;
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div style={kickerStyle}>{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={labelStyle}>{children}</label>;
}

function HelpText({ children }: { children: React.ReactNode }) {
  return <div style={helpTextStyle}>{children}</div>;
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
          <button key={option.value} onClick={() => onChange(option.value)} style={segmentedButton(active)}>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Tabs({ active, setActive }: { active: ActiveTab; setActive: (tab: ActiveTab) => void }) {
  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "original", label: "Original" },
    { id: "compare", label: "Old Vs New" },
    { id: "enhanced", label: "Enhanced" },
    { id: "header", label: "Header" },
    { id: "headerEnhanced", label: "Header Enhanced" },
  ];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 22, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button key={tab.id} onClick={() => setActive(tab.id)} style={tabButton(isActive)}>
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
  folder,
  onPreview,
  onDownload,
  onDelete,
  onEnhance,
  showEnhance = false,
  wide = false,
}: {
  title: string;
  subtitle: string;
  images: LibraryImage[];
  emptyText: string;
  actionLabel: string;
  folder: string;
  restaurantSlug: string;
  onPreview: (img: LibraryImage) => void;
  onDownload: (img: LibraryImage, folder: string) => void;
  onDelete: (img: LibraryImage) => void;
  onEnhance?: (img: LibraryImage) => void;
  showEnhance?: boolean;
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
        <EmptyState text={emptyText} />
      ) : (
        <div style={imageGridStyle(wide)}>
          {images.map((img) => (
            <div key={img.filename} style={cardStyle}>
              <button type="button" onClick={() => onPreview(img)} style={imageButtonStyle(wide)}>
                {img.url ? (
                  <img src={img.url} alt={img.filename} style={imageStyle} />
                ) : null}
              </button>

              <div style={filenameStyle} title={img.filename}>
                {img.filename}
              </div>

              <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                {showEnhance && onEnhance && (
                  <button type="button" onClick={() => onEnhance(img)} style={enhanceButton}>
                    Enhance
                  </button>
                )}
                <button type="button" onClick={() => onDownload(img, folder)} style={cardButton}>
                  Download
                </button>
                <button type="button" onClick={() => onDelete(img)} style={deleteSmallButton}>
                  {actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CompareGrid({
  rows,
  onPreview,
  emptyText,
}: {
  rows: { filename: string; original: LibraryImage; enhanced: LibraryImage | null }[];
  onPreview: (img: LibraryImage) => void;
  emptyText: string;
}) {
  if (rows.length === 0) {
    return (
      <div style={{ marginTop: 22 }}>
        <h3 style={{ margin: 0, fontSize: 20 }}>Old Vs New</h3>
        <EmptyState text={emptyText} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 20 }}>Old Vs New</h3>
          <p style={{ margin: "6px 0 0", color: "#64748b", lineHeight: 1.45 }}>
            Side-by-side comparison using matching filenames.
          </p>
        </div>
        <div style={{ color: "#64748b", fontWeight: 900 }}>{rows.length} item(s)</div>
      </div>

      <div style={{ display: "grid", gap: 18, marginTop: 16 }}>
        {rows.map((row) => (
          <div key={row.filename} style={compareCardStyle}>
            <div style={compareHeaderStyle}>{row.filename}</div>
            <div style={compareGridStyle}>
              <CompareImage label="Original" image={row.original} onPreview={onPreview} />
              {row.enhanced ? (
                <CompareImage label="Enhanced" image={row.enhanced} onPreview={onPreview} />
              ) : (
                <div style={missingEnhancedStyle}>
                  <div style={{ fontWeight: 950 }}>No enhanced version yet</div>
                  <div style={{ marginTop: 6, color: "#64748b", fontSize: 13 }}>Enhance this original to compare it here.</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareImage({ label, image, onPreview }: { label: string; image: LibraryImage; onPreview: (img: LibraryImage) => void }) {
  return (
    <div>
      <div style={{ fontWeight: 950, marginBottom: 8 }}>{label}</div>
      <button type="button" onClick={() => onPreview(image)} style={compareImageButton}>
        {image.url ? <img src={image.url} alt={image.filename} style={imageStyle} /> : null}
      </button>
    </div>
  );
}

function PreviewModal({ image, onClose }: { image: LibraryImage; onClose: () => void }) {
  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={spaceBetween}>
          <div>
            <Kicker>Preview</Kicker>
            <h3 style={{ margin: "4px 0 0", fontSize: 20 }}>{image.filename}</h3>
          </div>
          <button onClick={onClose} style={closeButton}>Close</button>
        </div>
        <div style={{ marginTop: 16, borderRadius: 20, overflow: "hidden", background: "#020617" }}>
          {image.url && <img src={image.url} alt={image.filename} style={{ width: "100%", maxHeight: "78vh", objectFit: "contain", display: "block" }} />}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div style={emptyStateStyle}>{text}</div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={metricStyle}>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 950, marginTop: 3 }}>{value}</div>
    </div>
  );
}

function WorkflowStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div style={workflowStepStyle}>
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

  return <div style={{ background: styles.bg, color: styles.color, borderRadius: 999, padding: "8px 12px", fontWeight: 950, fontSize: 12 }}>{text}</div>;
}

function Notice({ children, tone }: { children: React.ReactNode; tone: "good" | "bad" }) {
  return (
    <div style={{ marginTop: 16, borderRadius: 16, padding: 14, background: tone === "good" ? "#ecfdf5" : "#fef2f2", color: tone === "good" ? "#166534" : "#991b1b", fontWeight: 850, lineHeight: 1.4 }}>
      {children}
    </div>
  );
}

function ProgressBox({ label, progress }: { label: string; progress: number }) {
  return (
    <div style={progressBoxStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontWeight: 950 }}>
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div style={progressTrackStyle}>
        <div style={{ ...progressFillStyle, width: `${progress}%` }} />
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#e2e8f0", margin: "22px 0" }} />;
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top left, rgba(99,102,241,0.16), transparent 34%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
  padding: "34px 20px 56px",
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  color: "#0f172a",
};

const layoutGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(320px, 420px) minmax(0, 1fr)",
  gap: 20,
  alignItems: "start",
};

const spaceBetween: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  alignItems: "center",
};

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 52%, #312e81 100%)",
  color: "white",
  borderRadius: 30,
  padding: 34,
  marginBottom: 22,
  boxShadow: "0 28px 70px rgba(15,23,42,0.28)",
  position: "relative",
  overflow: "hidden",
};

const heroGlow: React.CSSProperties = {
  position: "absolute",
  width: 260,
  height: 260,
  borderRadius: 999,
  background: "rgba(59,130,246,0.24)",
  right: -70,
  top: -100,
  filter: "blur(2px)",
};

const heroBadge: React.CSSProperties = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 22,
  padding: 18,
  minWidth: 210,
  backdropFilter: "blur(12px)",
};

const panelStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(226,232,240,0.95)",
  borderRadius: 26,
  padding: 24,
  boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
  backdropFilter: "blur(14px)",
};

const kickerStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#6366f1",
  fontWeight: 950,
  textTransform: "uppercase",
  letterSpacing: 0.9,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "#334155",
  fontWeight: 900,
  marginBottom: 8,
};

const helpTextStyle: React.CSSProperties = {
  marginTop: 7,
  color: "#64748b",
  fontSize: 12.5,
  lineHeight: 1.35,
};

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

function segmentedButton(active: boolean): React.CSSProperties {
  return {
    border: 0,
    borderRadius: 12,
    padding: "10px 12px",
    background: active ? "white" : "transparent",
    color: active ? "#0f172a" : "#64748b",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: active ? "0 6px 16px rgba(15,23,42,0.10)" : "none",
  };
}

function tabButton(active: boolean): React.CSSProperties {
  return {
    border: active ? "1px solid #4f46e5" : "1px solid #e2e8f0",
    background: active ? "#eef2ff" : "white",
    color: active ? "#3730a3" : "#475569",
    borderRadius: 999,
    padding: "9px 13px",
    fontWeight: 900,
    cursor: "pointer",
  };
}

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

function secondaryButton(disabled: boolean): React.CSSProperties {
  return {
    border: "1px solid #cbd5e1",
    borderRadius: 14,
    padding: "12px 14px",
    background: disabled ? "#f1f5f9" : "white",
    color: disabled ? "#94a3b8" : "#334155",
    fontWeight: 950,
    cursor: disabled ? "not-allowed" : "pointer",
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

function dangerButton(disabled: boolean): React.CSSProperties {
  return {
    border: "1px solid #fecaca",
    borderRadius: 14,
    padding: "12px 16px",
    background: disabled ? "#f8fafc" : "#fef2f2",
    color: disabled ? "#94a3b8" : "#991b1b",
    fontWeight: 950,
    cursor: disabled ? "not-allowed" : "pointer",
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

const imageGridStyle = (wide: boolean): React.CSSProperties => ({
  marginTop: 16,
  display: "grid",
  gridTemplateColumns: wide ? "repeat(auto-fill, minmax(320px, 1fr))" : "repeat(auto-fill, minmax(210px, 1fr))",
  gap: 16,
});

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 20,
  padding: 12,
  boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
};

const imageButtonStyle = (wide: boolean): React.CSSProperties => ({
  width: "100%",
  height: wide ? 170 : 160,
  borderRadius: 16,
  overflow: "hidden",
  background: "linear-gradient(135deg, #e2e8f0, #f8fafc)",
  border: 0,
  padding: 0,
  cursor: "zoom-in",
});

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const filenameStyle: React.CSSProperties = {
  marginTop: 10,
  fontWeight: 950,
  fontSize: 13,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const cardButton: React.CSSProperties = {
  width: "100%",
  border: "1px solid #cbd5e1",
  background: "white",
  borderRadius: 12,
  padding: "9px 10px",
  fontWeight: 900,
  color: "#334155",
  cursor: "pointer",
};

const enhanceButton: React.CSSProperties = {
  width: "100%",
  border: 0,
  background: "linear-gradient(135deg, #4f46e5, #312e81)",
  borderRadius: 12,
  padding: "9px 10px",
  fontWeight: 950,
  color: "white",
  cursor: "pointer",
};

const deleteSmallButton: React.CSSProperties = {
  width: "100%",
  border: "1px solid #fecaca",
  background: "#fef2f2",
  borderRadius: 12,
  padding: "9px 10px",
  fontWeight: 900,
  color: "#991b1b",
  cursor: "pointer",
};

const emptyStateStyle: React.CSSProperties = {
  marginTop: 16,
  border: "1px dashed #cbd5e1",
  borderRadius: 22,
  padding: 28,
  background: "#f8fafc",
  color: "#64748b",
  textAlign: "center",
  fontWeight: 800,
};

const metricStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: "10px 12px",
  minWidth: 92,
};

const workflowStepStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 20,
  padding: 16,
  background: "#f8fafc",
};

const workflowGrid: React.CSSProperties = {
  marginTop: 16,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 12,
};

const progressBoxStyle: React.CSSProperties = {
  marginTop: 16,
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
  borderRadius: 16,
  padding: 14,
  color: "#312e81",
};

const progressTrackStyle: React.CSSProperties = {
  marginTop: 10,
  height: 10,
  borderRadius: 999,
  background: "rgba(99,102,241,0.18)",
  overflow: "hidden",
};

const progressFillStyle: React.CSSProperties = {
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(90deg, #4f46e5, #818cf8)",
  transition: "width 450ms ease",
};

const modalBackdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.76)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  zIndex: 50,
};

const modalCard: React.CSSProperties = {
  width: "min(1100px, 96vw)",
  maxHeight: "94vh",
  background: "white",
  borderRadius: 24,
  padding: 18,
  boxShadow: "0 30px 100px rgba(0,0,0,0.35)",
  overflow: "auto",
};

const closeButton: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#334155",
  fontWeight: 950,
  borderRadius: 12,
  padding: "10px 14px",
  cursor: "pointer",
};

const compareCardStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 22,
  background: "#fff",
  padding: 14,
  boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
};

const compareHeaderStyle: React.CSSProperties = {
  fontWeight: 950,
  marginBottom: 12,
  color: "#0f172a",
};

const compareGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

const compareImageButton: React.CSSProperties = {
  width: "100%",
  height: 250,
  borderRadius: 18,
  overflow: "hidden",
  border: 0,
  background: "linear-gradient(135deg, #e2e8f0, #f8fafc)",
  padding: 0,
  cursor: "zoom-in",
};

const missingEnhancedStyle: React.CSSProperties = {
  border: "1px dashed #cbd5e1",
  borderRadius: 18,
  minHeight: 250,
  background: "#f8fafc",
  color: "#475569",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: 18,
};
