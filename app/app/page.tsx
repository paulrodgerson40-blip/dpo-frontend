"use client";

import { useEffect, useMemo, useState } from "react";

const BACKEND_URL = "https://170.64.209.149.sslip.io";

type RestaurantMode = "new" | "existing";
type ActiveTab = "originals" | "compare" | "enhanced" | "headers" | "headerEnhanced";
type UploadType = "menu" | "header";

type LibraryImage = {
  filename: string;
  name?: string;
  url?: string;
  size?: number;
  updated_at?: string;
  modified?: number;
};

type Restaurant = {
  slug: string;
  name: string;
  originals_count?: number;
  approved_count?: number;
  enhanced_count?: number;
  headers_count?: number;
  outputs_count?: number;
  header_enhanced_count?: number;
};

type ManualJobResponse = {
  ok?: boolean;
  job_id?: string;
  status?: string;
  uploaded_count?: number;
  files?: string[];
  error?: string;
};

type PreviewImage = {
  title: string;
  url: string;
  filename: string;
};

const TAB_LABELS: Record<ActiveTab, string> = {
  originals: "Original",
  compare: "Comparison",
  enhanced: "Enhanced",
  headers: "Header",
  headerEnhanced: "Header Enhanced",
};

const IMAGE_FOLDERS: Record<ActiveTab, string> = {
  originals: "originals_approved",
  compare: "originals_approved",
  enhanced: "enhanced",
  headers: "headers",
  headerEnhanced: "header_enhanced",
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
    .replace(/[^a-z0-9 -]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function imageUrl(jobId: string, filename: string) {
  return `${BACKEND_URL}/api/dpo/manual-jobs/${jobId}/files/${encodeURIComponent(filename)}`;
}

function fullImageUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BACKEND_URL}${url}`;
}

function imageSelectKey(folder: string, filename: string) {
  return `${folder}::${filename}`;
}

export default function Home() {
  const [mode, setMode] = useState<RestaurantMode>("new");
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
  const [activeTab, setActiveTab] = useState<ActiveTab>("originals");

  const [originalImages, setOriginalImages] = useState<LibraryImage[]>([]);
  const [enhancedImages, setEnhancedImages] = useState<LibraryImage[]>([]);
  const [headerImages, setHeaderImages] = useState<LibraryImage[]>([]);
  const [headerEnhancedImages, setHeaderEnhancedImages] = useState<LibraryImage[]>([]);

  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);
  const [workingLabel, setWorkingLabel] = useState("");
  const [progress, setProgress] = useState(0);
  const [selectedImageKeys, setSelectedImageKeys] = useState<Set<string>>(new Set());

  function normaliseLibraryImages(images: any[] | undefined): LibraryImage[] {
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

      setOriginalImages(normaliseLibraryImages(folders.originals || folders.originals_approved));
      setEnhancedImages(normaliseLibraryImages(folders.enhanced));
      setHeaderImages(normaliseLibraryImages(folders.headers));
      setHeaderEnhancedImages(normaliseLibraryImages(folders.header_enhanced || folders.outputs));
      setSelectedImageKeys(new Set());

      setStatus("Library loaded");
    } catch {
      setOriginalImages([]);
      setEnhancedImages([]);
      setHeaderImages([]);
      setHeaderEnhancedImages([]);
      setSelectedImageKeys(new Set());
      setStatus("Ready");
      setError("Could not load saved images for this restaurant.");
    }
  }

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (mode !== "existing" || !selectedRestaurant) return;
    clearRestaurantScopedState();
    loadRestaurantImages(selectedRestaurant);
    setActiveTab("originals");
  }, [mode, selectedRestaurant]);

  useEffect(() => {
    if (!workingLabel) return;

    setProgress(8);
    const timer = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        return p + Math.max(2, Math.floor((92 - p) / 5));
      });
    }, 700);

    return () => window.clearInterval(timer);
  }, [workingLabel]);

  const activeRestaurantName = useMemo(() => {
    if (mode === "new") return restaurantName.trim();
    const found = restaurants.find((r) => r.slug === selectedRestaurant);
    return found?.name || prettyName(selectedRestaurant);
  }, [mode, restaurantName, selectedRestaurant, restaurants]);

  const activeRestaurantSlug = useMemo(() => {
    if (mode === "new") return slugifyRestaurant(restaurantName);
    return selectedRestaurant;
  }, [mode, restaurantName, selectedRestaurant]);

  const enhancedByFilename = useMemo(() => {
    const map = new Map<string, LibraryImage>();
    enhancedImages.forEach((img) => map.set(img.filename, img));
    return map;
  }, [enhancedImages]);

  const matchedOriginalImages = useMemo(() => {
    return originalImages.filter((img) => enhancedByFilename.has(img.filename));
  }, [originalImages, enhancedByFilename]);

  const unmatchedOriginalImages = useMemo(() => {
    return originalImages.filter((img) => !enhancedByFilename.has(img.filename));
  }, [originalImages, enhancedByFilename]);

  const headerEnhancedByFilename = useMemo(() => {
    const map = new Map<string, LibraryImage>();
    headerEnhancedImages.forEach((img) => map.set(img.filename, img));
    return map;
  }, [headerEnhancedImages]);

  function clearRestaurantScopedState() {
    setFiles([]);
    setStatus("Ready");
    setMessage("");
    setError("");
    setLastJobId("");
    setLastUploadedFiles([]);
    setOriginalImages([]);
    setEnhancedImages([]);
    setHeaderImages([]);
    setHeaderEnhancedImages([]);
    setSelectedImageKeys(new Set());

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
    setActiveTab("originals");
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
        setActiveTab("headers");
        setMessage("Header files uploaded. Approve latest to save them to the Header library.");
      } else {
        setOriginalImages(previews);
        setActiveTab("originals");
        setMessage("Original images uploaded. Approve latest to save them to the restaurant library.");
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
          upload_type: uploadType,
        };
      });

      const res = await fetch(`${BACKEND_URL}/api/dpo/manual-jobs/${lastJobId}/approve-phase-a`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images, upload_type: uploadType }),
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
      setMessage(`${data.approved_count || images.length} file(s) approved.`);

      if (activeRestaurantSlug) {
        await loadRestaurants();
        await loadRestaurantImages(activeRestaurantSlug);
      }
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

    const check = window.prompt(
      `Delete restaurant "${activeRestaurantName}" and archive all its files?\n\nType DELETE to confirm.`
    );

    if (check !== "DELETE") return;

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Deleting restaurant...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.detail || data.error || "Delete failed");
      }

      resetAll();
      await loadRestaurants();
      setStatus("Deleted");
      setMessage("Restaurant archived successfully.");
    } catch (err) {
      setStatus("Delete failed");
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  async function deleteImage(img: LibraryImage, folder: string) {
    if (!activeRestaurantSlug) return;

    const check = window.prompt(`Delete "${img.filename}"?\n\nType DELETE to confirm.`);
    if (check !== "DELETE") return;

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Deleting image...");

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/images/${encodeURIComponent(folder)}/${encodeURIComponent(img.filename)}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.detail || data.error || "Delete failed");
      }

      await loadRestaurantImages(activeRestaurantSlug);
      setStatus("Deleted");
      setMessage(`Deleted ${img.filename}.`);
    } catch (err) {
      setStatus("Delete failed");
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  async function enhanceImage(img: LibraryImage) {
    if (!activeRestaurantSlug) return;

    const check = window.prompt(`Enhance "${img.filename}"?\n\nType ENHANCE to confirm.`);
    if (check !== "ENHANCE") return;

    setLoading(true);
    setWorkingLabel(`Enhancing ${img.filename}...`);
    setError("");
    setMessage("");
    setStatus("Enhancing image...");

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/images/${encodeURIComponent(img.filename)}/enhance`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.detail || data.error || "Enhance failed");
      }

      setProgress(100);
      await loadRestaurantImages(activeRestaurantSlug);
      setActiveTab("enhanced");
      setStatus("Enhanced");
      setMessage(`${img.filename} enhanced successfully.`);
    } catch (err) {
      setStatus("Enhance failed");
      setError(err instanceof Error ? err.message : "Enhance failed");
    } finally {
      setLoading(false);
      setWorkingLabel("");
      setProgress(0);
    }
  }

  async function enhanceAllOriginals() {
    if (!activeRestaurantSlug) return;

    const check = window.prompt("Enhance all original images?\n\nType ENHANCE ALL to confirm.");
    if (check !== "ENHANCE ALL") return;

    setLoading(true);
    setWorkingLabel("Running Phase B on all originals...");
    setError("");
    setMessage("");
    setStatus("Phase B running...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/enhance-all`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.detail || data.error || "Enhance all failed");
      }

      setProgress(100);
      await loadRestaurantImages(activeRestaurantSlug);
      setActiveTab("enhanced");
      setStatus("Phase B complete");
      setMessage(`Enhanced ${data.count || data.processed?.length || 0} original image(s).`);
    } catch (err) {
      setStatus("Phase B failed");
      setError(err instanceof Error ? err.message : "Enhance all failed");
    } finally {
      setLoading(false);
      setWorkingLabel("");
      setProgress(0);
    }
  }

  async function enhanceHeaderImage(img: LibraryImage) {
    if (!activeRestaurantSlug) return;

    const check = window.prompt(`Enhance header "${img.filename}" as a 16:9 banner?\n\nType ENHANCE to confirm.`);
    if (check !== "ENHANCE") return;

    setLoading(true);
    setWorkingLabel(`Enhancing header ${img.filename}...`);
    setError("");
    setMessage("");
    setStatus("Enhancing header...");

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/headers/${encodeURIComponent(img.filename)}/enhance`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.detail || data.error || "Header enhance failed");
      }

      setProgress(100);
      await loadRestaurantImages(activeRestaurantSlug);
      setActiveTab("headerEnhanced");
      setStatus("Header enhanced");
      setMessage(`${img.filename} enhanced as a 16:9 header.`);
    } catch (err) {
      setStatus("Header enhance failed");
      setError(err instanceof Error ? err.message : "Header enhance failed");
    } finally {
      setLoading(false);
      setWorkingLabel("");
      setProgress(0);
    }
  }

  async function enhanceAllHeaders() {
    if (!activeRestaurantSlug) return;

    const check = window.prompt("Enhance all headers as 16:9 banners?\n\nType ENHANCE ALL to confirm.");
    if (check !== "ENHANCE ALL") return;

    setLoading(true);
    setWorkingLabel("Enhancing all headers...");
    setError("");
    setMessage("");
    setStatus("Header Phase B running...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/headers/enhance-all`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.detail || data.error || "Enhance all headers failed");
      }

      setProgress(100);
      await loadRestaurantImages(activeRestaurantSlug);
      setActiveTab("headerEnhanced");
      setStatus("Header Phase B complete");
      setMessage(`Enhanced ${data.count || data.processed?.length || 0} header image(s).`);
    } catch (err) {
      setStatus("Header Phase B failed");
      setError(err instanceof Error ? err.message : "Enhance all headers failed");
    } finally {
      setLoading(false);
      setWorkingLabel("");
      setProgress(0);
    }
  }

  function downloadImage(img: LibraryImage, folder: string) {
    if (!activeRestaurantSlug) return;

    const href = `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/download-file/${encodeURIComponent(folder)}/${encodeURIComponent(img.filename)}`;
    const a = document.createElement("a");
    a.href = href;
    a.download = img.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function downloadAllRestaurantFiles() {
    if (!activeRestaurantSlug) return;

    const a = document.createElement("a");
    a.href = `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/download-all`;
    a.download = `${activeRestaurantSlug}_full_export.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function downloadSelectedFiles() {
    if (!activeRestaurantSlug || selectedImages.length === 0) return;

    setError("");
    setMessage("");
    setStatus("Preparing selected download...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/download-selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: activeBatch.folder,
          filenames: selectedImages.map((img) => img.filename),
        }),
      });

      if (!res.ok) {
        let details = "Download selected failed";
        try {
          const data = await res.json();
          details = data.detail || data.error || details;
        } catch {}
        throw new Error(details);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeRestaurantSlug}_${activeBatch.folder}_selected.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setStatus("Download ready");
      setMessage(`Downloaded ${selectedImages.length} selected file(s).`);
    } catch (err) {
      setStatus("Download failed");
      setError(err instanceof Error ? err.message : "Download selected failed");
    }
  }

  async function renameImage(img: LibraryImage, folder: string, newName: string) {
    if (!activeRestaurantSlug) return;

    const cleanName = newName.trim();
    if (!cleanName || cleanName === img.filename) return;

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Renaming image...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/images/${encodeURIComponent(folder)}/${encodeURIComponent(img.filename)}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_filename: cleanName }),
      });

      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.detail || data.error || "Rename failed");
      }

      await loadRestaurantImages(activeRestaurantSlug);
      setStatus("Renamed");
      setMessage(`Renamed ${img.filename} to ${data.filename || cleanName}.`);
    } catch (err) {
      setStatus("Rename failed");
      setError(err instanceof Error ? err.message : "Rename failed");
    } finally {
      setLoading(false);
    }
  }

  const activeBatch = useMemo(() => {
    if (activeTab === "headers") {
      return { images: headerImages, folder: "headers", canEnhance: true, enhanceKind: "header" as const };
    }
    if (activeTab === "enhanced") {
      return { images: enhancedImages, folder: "enhanced", canEnhance: false, enhanceKind: "none" as const };
    }
    if (activeTab === "headerEnhanced") {
      return { images: headerEnhancedImages, folder: "header_enhanced", canEnhance: false, enhanceKind: "none" as const };
    }
    return { images: originalImages, folder: "originals_approved", canEnhance: activeTab === "originals", enhanceKind: "menu" as const };
  }, [activeTab, originalImages, enhancedImages, headerImages, headerEnhancedImages]);

  const selectedImages = useMemo(() => {
    return activeBatch.images.filter((img) => selectedImageKeys.has(imageSelectKey(activeBatch.folder, img.filename)));
  }, [activeBatch, selectedImageKeys]);

  function toggleImageSelected(folder: string, filename: string) {
    const key = imageSelectKey(folder, filename);
    setSelectedImageKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function selectAllVisible() {
    setSelectedImageKeys((prev) => {
      const next = new Set(prev);
      activeBatch.images.forEach((img) => next.add(imageSelectKey(activeBatch.folder, img.filename)));
      return next;
    });
  }

  function clearSelectedImages() {
    setSelectedImageKeys((prev) => {
      const next = new Set(prev);
      activeBatch.images.forEach((img) => next.delete(imageSelectKey(activeBatch.folder, img.filename)));
      return next;
    });
  }

  async function deleteSelectedImages() {
    if (!activeRestaurantSlug || selectedImages.length === 0) return;

    const check = window.prompt(`Delete ${selectedImages.length} selected image(s)?\n\nType DELETE to confirm.`);
    if (check !== "DELETE") return;

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Deleting selected images...");

    try {
      let deleted = 0;

      for (const img of selectedImages) {
        const res = await fetch(
          `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/images/${encodeURIComponent(activeBatch.folder)}/${encodeURIComponent(img.filename)}`,
          { method: "DELETE" }
        );

        const data = await res.json();

        if (!res.ok || data.ok === false) {
          throw new Error(data.detail || data.error || `Delete failed for ${img.filename}`);
        }

        deleted += 1;
      }

      setSelectedImageKeys(new Set());
      await loadRestaurantImages(activeRestaurantSlug);
      setStatus("Deleted");
      setMessage(`Deleted ${deleted} selected image(s).`);
    } catch (err) {
      setStatus("Delete failed");
      setError(err instanceof Error ? err.message : "Delete selected failed");
    } finally {
      setLoading(false);
    }
  }

  async function enhanceSelectedImages() {
    if (!activeRestaurantSlug || selectedImages.length === 0 || !activeBatch.canEnhance) return;

    const check = window.prompt(`Enhance ${selectedImages.length} selected image(s)?\n\nType ENHANCE to confirm.`);
    if (check !== "ENHANCE") return;

    setLoading(true);
    setWorkingLabel(`Enhancing ${selectedImages.length} selected image(s)...`);
    setError("");
    setMessage("");
    setStatus("Enhancing selected images...");

    try {
      let enhanced = 0;

      for (const img of selectedImages) {
        const endpoint = activeBatch.enhanceKind === "header"
          ? `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/headers/${encodeURIComponent(img.filename)}/enhance`
          : `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/images/${encodeURIComponent(img.filename)}/enhance`;

        const res = await fetch(endpoint, { method: "POST" });
        const data = await res.json();

        if (!res.ok || data.ok === false) {
          throw new Error(data.detail || data.error || `Enhance failed for ${img.filename}`);
        }

        enhanced += 1;
        setProgress(Math.min(98, Math.round((enhanced / selectedImages.length) * 100)));
      }

      setSelectedImageKeys(new Set());
      setProgress(100);
      await loadRestaurantImages(activeRestaurantSlug);
      setActiveTab(activeBatch.enhanceKind === "header" ? "headerEnhanced" : "enhanced");
      setStatus("Enhanced");
      setMessage(`Enhanced ${enhanced} selected image(s).`);
    } catch (err) {
      setStatus("Enhance failed");
      setError(err instanceof Error ? err.message : "Enhance selected failed");
    } finally {
      setLoading(false);
      setWorkingLabel("");
      setProgress(0);
    }
  }

  const emptyLibraryText = activeRestaurantSlug
    ? "No saved images found yet. Upload files and approve them to build this restaurant library."
    : "Select or create a restaurant to begin.";

  const workflowState = useMemo(() => {
    if (!activeRestaurantSlug) {
      return {
        title: "Setup",
        subtitle: "Select or create restaurant",
        badge: "Setup mode",
        tone: "neutral" as const,
      };
    }

    if (originalImages.length === 0 && headerImages.length === 0) {
      return {
        title: "Setup",
        subtitle: "Upload originals or headers",
        badge: "Setup mode",
        tone: "neutral" as const,
      };
    }

    if (originalImages.length > 0 && enhancedImages.length === 0) {
      return {
        title: "Phase A",
        subtitle: "Originals ready → enhance next",
        badge: "Phase A active",
        tone: "neutral" as const,
      };
    }

    if (unmatchedOriginalImages.length > 0) {
      return {
        title: "Phase B Partial",
        subtitle: `${matchedOriginalImages.length} matched / ${unmatchedOriginalImages.length} missing`,
        badge: "Phase B incomplete",
        tone: "bad" as const,
      };
    }

    if (originalImages.length > 0 && enhancedImages.length > 0) {
      return {
        title: "Phase B Complete",
        subtitle: "Original → Enhanced matched",
        badge: "Phase B complete",
        tone: "good" as const,
      };
    }

    if (headerImages.length > 0 && headerEnhancedImages.length === 0) {
      return {
        title: "Header Phase A",
        subtitle: "Headers ready → enhance next",
        badge: "Header setup",
        tone: "neutral" as const,
      };
    }

    return {
      title: "Ready",
      subtitle: "Restaurant library loaded",
      badge: "Ready",
      tone: "good" as const,
    };
  }, [activeRestaurantSlug, originalImages.length, enhancedImages.length, unmatchedOriginalImages.length, matchedOriginalImages.length, headerImages.length, headerEnhancedImages.length]);

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
      {workingLabel && <ProgressOverlay label={workingLabel} progress={progress} />}

      {previewImage && (
        <PreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}

      <section style={{ maxWidth: 1220, margin: "0 auto" }}>
        <Hero modeTitle={workflowState.title} modeSubtitle={workflowState.subtitle} />

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
              <StatusPill text={status} tone={status.toLowerCase().includes("failed") ? "bad" : status.includes("complete") || status === "Approved" || status === "Enhanced" ? "good" : "neutral"} />
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
                  <option value="">{restaurantsLoading ? "Loading restaurants..." : "Choose saved restaurant..."}</option>
                  {restaurants.map((r) => {
                    const originalCount = r.originals_count ?? r.approved_count ?? 0;
                    const enhancedCount = r.enhanced_count ?? 0;
                    const missingCount = Math.max(originalCount - enhancedCount, 0);
                    return (
                      <option key={r.slug} value={r.slug}>
                        {missingCount > 0 ? `⚠ ${r.name} — ${missingCount} missing enhanced` : `✅ ${r.name}`}
                      </option>
                    );
                  })}
                </select>
                <HelpText>Selecting a restaurant loads its Original, Enhanced, Header and Header Enhanced libraries.</HelpText>
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
                    setActiveTab(v === "header" ? "headers" : "originals");
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <Label>{uploadType === "header" ? "Upload header/banner files" : "Upload original food/menu images"}</Label>
              <input
                id="file"
                type="file"
                multiple
                onChange={handleFiles}
                style={{ ...inputStyle, padding: 12, background: "#f8fafc" }}
              />
              <HelpText>
                Upload anything for now. Files are accepted as-is and the backend auto-renames them to avoid duplicate filename conflicts.
              </HelpText>
            </div>

            {files.length > 0 && (
              <div style={selectedFilesBox}>
                <div style={{ fontWeight: 900 }}>{files.length} file(s) selected</div>
                <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                  {files.slice(0, 6).map((f, idx) => (
                    <div key={`${f.name}-${f.size}-${f.lastModified}-${idx}`} style={fileChip}>
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

            <button onClick={deleteRestaurant} disabled={loading || !activeRestaurantSlug} style={{ ...dangerButton(loading || !activeRestaurantSlug), width: "100%", marginTop: 10 }}>
              Delete restaurant
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
                  <Metric label="Original" value={String(originalImages.length)} />
                  <Metric label="Enhanced" value={String(enhancedImages.length)} />
                  <Metric label="Missing" value={String(unmatchedOriginalImages.length)} tone={unmatchedOriginalImages.length > 0 ? "warn" : "good"} />
                  <Metric label="Headers" value={String(headerImages.length)} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginTop: 20, flexWrap: "wrap" }}>
                <Tabs active={activeTab} setActive={setActiveTab} />
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={downloadAllRestaurantFiles} disabled={!activeRestaurantSlug} style={miniButton(!activeRestaurantSlug)}>
                    Download all restaurant files
                  </button>
                  <button onClick={enhanceAllOriginals} disabled={loading || !activeRestaurantSlug || originalImages.length === 0} style={miniDarkButton(loading || !activeRestaurantSlug || originalImages.length === 0)}>
                    Phase B: Enhance all originals
                  </button>
                </div>
              </div>

              {activeTab !== "compare" && activeBatch.images.length > 0 && (
                <BatchActionBar
                  selectedCount={selectedImages.length}
                  totalCount={activeBatch.images.length}
                  canEnhance={activeBatch.canEnhance}
                  enhanceLabel={activeBatch.enhanceKind === "header" ? "Enhance Selected Headers" : "Enhance Selected"}
                  disabled={loading || !activeRestaurantSlug}
                  onSelectAll={selectAllVisible}
                  onClear={clearSelectedImages}
                  onDelete={deleteSelectedImages}
                  onEnhance={enhanceSelectedImages}
                  onDownloadSelected={downloadSelectedFiles}
                />
              )}

              {activeTab === "originals" && (
                <ImageGrid
                  title="Original"
                  subtitle="Approved Phase A source images. These are the source of truth for menu-item enhancement."
                  images={originalImages}
                  emptyText={emptyLibraryText}
                  folder="originals_approved"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "originals_approved")}
                  onEnhance={enhanceImage}
                  showEnhance
                  enhanceLabel="Enhance"
                  selectedKeys={selectedImageKeys}
                  onToggleSelected={toggleImageSelected}
                  onRename={renameImage}
                />
              )}

              {activeTab === "compare" && (
                <CompareGrid
                  originals={originalImages}
                  enhancedByFilename={enhancedByFilename}
                  headers={headerImages}
                  headerEnhanced={headerEnhancedImages}
                  restaurantSlug={activeRestaurantSlug}
                  emptyText={emptyLibraryText}
                  onPreview={setPreviewImage}
                />
              )}

              {activeTab === "enhanced" && (
                <ImageGrid
                  title="Enhanced"
                  subtitle="Phase B enhanced menu-item outputs."
                  images={enhancedImages}
                  emptyText="No enhanced outputs yet. Enhance an individual original or run Phase B."
                  folder="enhanced"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "enhanced")}
                  selectedKeys={selectedImageKeys}
                  onToggleSelected={toggleImageSelected}
                  onRename={renameImage}
                />
              )}

              {activeTab === "headers" && (
                <ImageGrid
                  title="Header"
                  subtitle="Original header/banner files. Header enhancement uses a separate 16:9 prompt."
                  images={headerImages}
                  emptyText="Upload header/banner files to start building this library."
                  folder="headers"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "headers")}
                  onEnhance={enhanceHeaderImage}
                  showEnhance
                  enhanceLabel="Enhance header"
                  selectedKeys={selectedImageKeys}
                  onToggleSelected={toggleImageSelected}
                  onRename={renameImage}
                  wide
                />
              )}

              {activeTab === "headerEnhanced" && (
                <ImageGrid
                  title="Header Enhanced"
                  subtitle="16:9 enhanced restaurant/storefront header outputs."
                  images={headerEnhancedImages}
                  emptyText="No enhanced headers yet."
                  folder="header_enhanced"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "header_enhanced")}
                  selectedKeys={selectedImageKeys}
                  onToggleSelected={toggleImageSelected}
                  onRename={renameImage}
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
                <StatusPill text={workflowState.badge} tone={workflowState.tone} />
              </div>

              <div style={workflowGrid}>
                <WorkflowStep number="01" title="Original" text="Upload and approve source images. Files are auto-renamed to avoid duplicate conflicts." />
                <WorkflowStep number="02" title="Comparison" text="Review header and menu images side-by-side before publishing." />
                <WorkflowStep number="03" title="Enhanced" text="Generate menu-item outputs with the square food-photo prompt." />
                <WorkflowStep number="04" title="Header" text="Upload banner/header assets separately from menu images." />
                <WorkflowStep number="05" title="Header Enhanced" text="Generate 16:9 hero banners using the dedicated header prompt." />
              </div>
            </Panel>
          </div>
        </div>
      </section>
    </main>
  );
}

function Hero({ modeTitle, modeSubtitle }: { modeTitle: string; modeSubtitle: string }) {
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
            Manage original images, compare old vs new, enhance menu assets, and create 16:9 restaurant headers.
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
          <div style={{ marginTop: 8, fontSize: 24, fontWeight: 950 }}>{modeTitle}</div>
          <div style={{ marginTop: 4, color: "#dbeafe", fontSize: 13 }}>{modeSubtitle}</div>
        </div>
      </div>
    </div>
  );
}

function ProgressOverlay({ label, progress }: { label: string; progress: number }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.46)",
        backdropFilter: "blur(8px)",
        zIndex: 50,
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "min(460px, 100%)", background: "white", borderRadius: 26, padding: 26, boxShadow: "0 30px 80px rgba(0,0,0,.28)" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={spinnerStyle} />
          <div>
            <div style={{ fontWeight: 950, fontSize: 19 }}>{label}</div>
            <div style={{ color: "#64748b", marginTop: 4 }}>Please keep this page open.</div>
          </div>
        </div>
        <div style={{ marginTop: 18, background: "#e2e8f0", height: 12, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(135deg,#4f46e5,#111827)", transition: "width .4s ease" }} />
        </div>
        <div style={{ marginTop: 8, textAlign: "right", fontWeight: 900, color: "#475569" }}>{progress}%</div>
      </div>
    </div>
  );
}

function PreviewModal({ image, onClose }: { image: PreviewImage; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.82)",
        zIndex: 60,
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(1100px, 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "white", marginBottom: 12, gap: 16 }}>
          <div>
            <div style={{ fontWeight: 950, fontSize: 20 }}>{image.title}</div>
            <div style={{ color: "#cbd5e1", marginTop: 3 }}>{image.filename}</div>
          </div>
          <button onClick={onClose} style={{ ...ghostButton, width: 110 }}>Close</button>
        </div>
        <div style={{ background: "#0f172a", borderRadius: 22, overflow: "hidden", maxHeight: "82vh" }}>
          <img src={image.url} alt={image.filename} style={{ width: "100%", height: "100%", maxHeight: "82vh", objectFit: "contain", display: "block" }} />
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
    { id: "originals", label: "Original" },
    { id: "enhanced", label: "Enhanced" },
    { id: "headers", label: "Header" },
    { id: "headerEnhanced", label: "Header Enhanced" },
    { id: "compare", label: "Comparison" },
  ];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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

function BatchActionBar({
  selectedCount,
  totalCount,
  canEnhance,
  enhanceLabel,
  disabled,
  onSelectAll,
  onClear,
  onDelete,
  onEnhance,
  onDownloadSelected,
}: {
  selectedCount: number;
  totalCount: number;
  canEnhance: boolean;
  enhanceLabel: string;
  disabled: boolean;
  onSelectAll: () => void;
  onClear: () => void;
  onDelete: () => void;
  onEnhance: () => void;
  onDownloadSelected: () => void;
}) {
  const noSelection = selectedCount === 0;

  return (
    <div
      style={{
        marginTop: 16,
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 12,
        background: "#f8fafc",
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontWeight: 950, color: selectedCount ? "#3730a3" : "#475569" }}>
        {selectedCount} selected / {totalCount} visible
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={onSelectAll} disabled={disabled || totalCount === 0} style={miniButton(disabled || totalCount === 0)}>
          Select All
        </button>
        <button type="button" onClick={onClear} disabled={disabled || noSelection} style={miniButton(disabled || noSelection)}>
          Clear
        </button>
        <button type="button" onClick={onDownloadSelected} disabled={disabled || noSelection} style={miniButton(disabled || noSelection)}>
          Download Selected
        </button>
        {canEnhance && (
          <button type="button" onClick={onEnhance} disabled={disabled || noSelection} style={miniDarkButton(disabled || noSelection)}>
            {enhanceLabel}
          </button>
        )}
        <button type="button" onClick={onDelete} disabled={disabled || noSelection} style={dangerButton(disabled || noSelection)}>
          Delete Selected
        </button>
      </div>
    </div>
  );
}

function ImageGrid({
  title,
  subtitle,
  images,
  emptyText,
  folder,
  restaurantSlug,
  onPreview,
  onDownload,
  onDelete,
  onEnhance,
  selectedKeys,
  onToggleSelected,
  onRename,
  showEnhance = false,
  enhanceLabel = "Enhance",
  wide = false,
}: {
  title: string;
  subtitle: string;
  images: LibraryImage[];
  emptyText: string;
  folder: string;
  restaurantSlug: string;
  onPreview: (img: PreviewImage) => void;
  onDownload: (img: LibraryImage, folder: string) => void;
  onDelete: (img: LibraryImage) => void;
  onEnhance?: (img: LibraryImage) => void;
  selectedKeys?: Set<string>;
  onToggleSelected?: (folder: string, filename: string) => void;
  onRename?: (img: LibraryImage, folder: string, newName: string) => void;
  showEnhance?: boolean;
  enhanceLabel?: string;
  wide?: boolean;
}) {
  const [editingName, setEditingName] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  function startRename(img: LibraryImage) {
    setEditingName(img.filename);
    setDraftName(img.filename);
  }

  function finishRename(img: LibraryImage) {
    const nextName = draftName.trim();
    setEditingName(null);
    if (nextName && nextName !== img.filename && onRename) {
      onRename(img, folder, nextName);
    }
  }

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
        <EmptyBox>{emptyText}</EmptyBox>
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
          {images.map((img) => {
            const url = fullImageUrl(img.url);
            const selected = selectedKeys?.has(imageSelectKey(folder, img.filename)) || false;
            return (
              <div
                key={`${folder}-${img.filename}-${img.url || ""}`}
                style={{
                  background: "white",
                  border: selected ? "2px solid #4f46e5" : "1px solid #e2e8f0",
                  borderRadius: 20,
                  padding: selected ? 11 : 12,
                  boxShadow: selected ? "0 14px 30px rgba(79,70,229,0.18)" : "0 10px 24px rgba(15,23,42,0.06)",
                  position: "relative",
                }}
              >
                {onToggleSelected && (
                  <label
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      zIndex: 3,
                      width: 30,
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 10,
                      background: selected ? "#4f46e5" : "rgba(255,255,255,0.92)",
                      border: selected ? "1px solid #4f46e5" : "1px solid #cbd5e1",
                      boxShadow: "0 8px 18px rgba(15,23,42,0.18)",
                      cursor: "pointer",
                    }}
                    title={selected ? "Selected" : "Select image"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggleSelected(folder, img.filename)}
                      style={{ width: 16, height: 16, accentColor: "#4f46e5", cursor: "pointer" }}
                    />
                  </label>
                )}

                <button
                  type="button"
                  onClick={() => onPreview({ title, url, filename: img.filename })}
                  style={{
                    width: "100%",
                    height: wide ? 170 : 160,
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #e2e8f0, #f8fafc)",
                    border: 0,
                    padding: 0,
                    cursor: "zoom-in",
                  }}
                >
                  {url ? (
                    <img
                      src={url}
                      alt={img.filename}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : null}
                </button>

                {editingName === img.filename ? (
                  <input
                    value={draftName}
                    autoFocus
                    onChange={(e) => setDraftName(e.target.value)}
                    onBlur={() => finishRename(img)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") finishRename(img);
                      if (e.key === "Escape") setEditingName(null);
                    }}
                    style={{ ...inputStyle, marginTop: 10, padding: "8px 10px", fontSize: 13, fontWeight: 900 }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => startRename(img)}
                    style={{
                      marginTop: 10,
                      width: "100%",
                      border: 0,
                      background: "transparent",
                      padding: 0,
                      textAlign: "left",
                      fontWeight: 950,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: onRename ? "text" : "default",
                      color: "#0f172a",
                    }}
                    title="Click to rename"
                  >
                    {img.filename}
                  </button>
                )}

                <div style={{ display: "grid", gridTemplateColumns: showEnhance ? "1fr 1fr" : "1fr", gap: 8, marginTop: 10 }}>
                  <button type="button" onClick={() => onDownload(img, folder)} style={cardButton}>
                    Download
                  </button>
                  {showEnhance && onEnhance && (
                    <button type="button" onClick={() => onEnhance(img)} style={cardButtonDark}>
                      {enhanceLabel}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(img)}
                  style={{
                    ...cardButtonDanger,
                    marginTop: 8,
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CompareGrid({
  originals,
  enhancedByFilename,
  headers,
  headerEnhanced,
  restaurantSlug,
  emptyText,
  onPreview,
}: {
  originals: LibraryImage[];
  enhancedByFilename: Map<string, LibraryImage>;
  headers: LibraryImage[];
  headerEnhanced: LibraryImage[];
  restaurantSlug: string;
  emptyText: string;
  onPreview: (img: PreviewImage) => void;
}) {
  const matched = originals.filter((orig) => enhancedByFilename.has(orig.filename));
  const unmatched = originals.filter((orig) => !enhancedByFilename.has(orig.filename));
  const headerOriginal = headers[0];
  const headerFinal = headerEnhanced[0];
  const hasAnyComparisonAssets = Boolean(headerOriginal || headerFinal || originals.length || headerEnhanced.length || matched.length);

  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 20 }}>Comparison</h3>
          <p style={{ margin: "6px 0 0", color: "#64748b", lineHeight: 1.45 }}>
            Review the enhanced header first, then compare menu images below. Only matched menu filenames appear as comparison pairs.
          </p>
        </div>
        <div style={{ color: "#64748b", fontWeight: 900 }}>{matched.length} menu pair(s)</div>
      </div>

      {!hasAnyComparisonAssets ? (
        <EmptyBox>{emptyText}</EmptyBox>
      ) : (
        <>
          <div style={compareStatusGrid}>
            <CompareStatusBadge label="Header original" value={headerOriginal ? 1 : 0} tone={headerOriginal ? "good" : "neutral"} />
            <CompareStatusBadge label="Header enhanced" value={headerFinal ? 1 : 0} tone={headerFinal ? "good" : "warn"} />
            <CompareStatusBadge label="Menu pairs" value={matched.length} tone={matched.length > 0 ? "good" : "neutral"} />
            <CompareStatusBadge label="Missing menu enhanced" value={unmatched.length} tone={unmatched.length > 0 ? "warn" : "good"} />
          </div>

          <div style={comparisonSectionBox}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 950, fontSize: 18 }}>Header Comparison</div>
                <div style={{ marginTop: 4, color: "#64748b", fontSize: 13 }}>
                  This is the primary delivery-platform hero image. Original on the left, enhanced on the right.
                </div>
              </div>
              <div style={matchedPill}>Top priority</div>
            </div>

            {headerOriginal || headerFinal ? (
              <div style={headerComparisonGrid}>
                <SideBySideImage
                  label="Original header"
                  image={headerOriginal}
                  emptyText="No original header uploaded yet."
                  title="Original Header"
                  onPreview={onPreview}
                  wide
                />
                <SideBySideImage
                  label="Enhanced header"
                  image={headerFinal}
                  emptyText="No enhanced header generated yet."
                  title="Enhanced Header"
                  onPreview={onPreview}
                  wide
                />
              </div>
            ) : (
              <EmptyBox>No header uploaded yet. Upload and enhance a header to create the first comparison.</EmptyBox>
            )}
          </div>

          <div style={{ ...comparisonSectionBox, marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 950, fontSize: 18 }}>Menu Image Comparison</div>
                <div style={{ marginTop: 4, color: "#64748b", fontSize: 13 }}>
                  Original menu items compared against their enhanced outputs, matched by filename.
                </div>
              </div>
              <div style={matchedPill}>{matched.length} matched</div>
            </div>

            {unmatched.length > 0 && (
              <div style={{ ...missingEnhancedBox, marginTop: 0, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 950, color: "#92400e" }}>Unmatched menu originals</div>
                    <div style={{ marginTop: 4, color: "#78350f", fontSize: 13 }}>
                      These original menu images do not yet have matching enhanced outputs.
                    </div>
                  </div>
                  <div style={{ ...smallWarnPill }}>{unmatched.length} missing</div>
                </div>
              </div>
            )}

            {matched.length === 0 ? (
              <EmptyBox>No matched menu comparisons yet. Enhance originals first, or make sure enhanced filenames match the originals.</EmptyBox>
            ) : (
              <div style={{ display: "grid", gap: 18 }}>
                {matched.map((orig) => {
                  const enhanced = enhancedByFilename.get(orig.filename)!;
                  return (
                    <div
                      key={`compare-${orig.filename}`}
                      style={{
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: 22,
                        padding: 14,
                        boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
                        <div style={{ fontWeight: 950 }}>{orig.filename}</div>
                        <div style={matchedPill}>Matched</div>
                      </div>
                      <CompareImage
                        label="Original | Enhanced"
                        url={`${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(restaurantSlug)}/compare/${encodeURIComponent(orig.filename)}?v=${orig.modified || ""}-${enhanced.modified || ""}`}
                        filename={orig.filename}
                        onPreview={onPreview}
                      />
                      <a
                        href={`${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(restaurantSlug)}/compare/${encodeURIComponent(orig.filename)}`}
                        download={`compare_${orig.filename}`}
                        style={{ ...cardButton, display: "block", marginTop: 10, textAlign: "center", textDecoration: "none" }}
                      >
                        Download comparison
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SideBySideImage({
  label,
  image,
  emptyText,
  title,
  onPreview,
  wide = false,
}: {
  label: string;
  image?: LibraryImage;
  emptyText: string;
  title: string;
  onPreview: (img: PreviewImage) => void;
  wide?: boolean;
}) {
  const url = fullImageUrl(image?.url);

  return (
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 12, boxShadow: "0 10px 24px rgba(15,23,42,0.05)" }}>
      <div style={{ marginBottom: 10, fontWeight: 950, color: "#334155" }}>{label}</div>
      {image && url ? (
        <button
          type="button"
          onClick={() => onPreview({ title, url, filename: image.filename })}
          style={{
            width: "100%",
            height: wide ? 230 : 180,
            borderRadius: 16,
            overflow: "hidden",
            background: "#f8fafc",
            border: 0,
            padding: 0,
            cursor: "zoom-in",
          }}
        >
          <img src={url} alt={image.filename} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </button>
      ) : (
        <div style={{ height: wide ? 230 : 180, border: "1px dashed #cbd5e1", borderRadius: 16, display: "grid", placeItems: "center", color: "#64748b", fontWeight: 850, textAlign: "center", padding: 16 }}>
          {emptyText}
        </div>
      )}
      {image && <div style={{ marginTop: 10, fontWeight: 850, fontSize: 13, color: "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{image.filename}</div>}
    </div>
  );
}

function CompareImage({ label, url, filename, onPreview }: { label: string; url: string; filename: string; onPreview: (img: PreviewImage) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPreview({ title: label, url, filename })}
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 0,
        overflow: "hidden",
        background: "#f8fafc",
        cursor: "zoom-in",
        minHeight: 230,
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", left: 10, top: 10, zIndex: 2, background: "rgba(15,23,42,.72)", color: "white", borderRadius: 999, padding: "5px 9px", fontSize: 12, fontWeight: 900 }}>
        {label}
      </div>
      <img src={url} alt={`${label} ${filename}`} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
    </button>
  );
}

function EmptyBox({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
}

function Metric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "good" | "warn" }) {
  const toneStyle =
    tone === "good"
      ? { border: "#bbf7d0", bg: "#f0fdf4", value: "#166534" }
      : tone === "warn"
        ? { border: "#fed7aa", bg: "#fff7ed", value: "#c2410c" }
        : { border: "#e2e8f0", bg: "#f8fafc", value: "#0f172a" };

  return (
    <div style={{ background: toneStyle.bg, border: `1px solid ${toneStyle.border}`, borderRadius: 16, padding: "10px 12px", minWidth: 92 }}>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 900, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 950, marginTop: 3, color: toneStyle.value }}>{value}</div>
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

function dangerButton(disabled: boolean): React.CSSProperties {
  return {
    border: 0,
    borderRadius: 14,
    padding: "12px 16px",
    background: disabled ? "#cbd5e1" : "linear-gradient(135deg, #dc2626, #991b1b)",
    color: "white",
    fontWeight: 950,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function miniButton(disabled: boolean): React.CSSProperties {
  return {
    border: "1px solid #cbd5e1",
    borderRadius: 999,
    padding: "9px 13px",
    background: disabled ? "#f1f5f9" : "white",
    color: disabled ? "#94a3b8" : "#334155",
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function miniDarkButton(disabled: boolean): React.CSSProperties {
  return {
    border: 0,
    borderRadius: 999,
    padding: "9px 13px",
    background: disabled ? "#94a3b8" : "#111827",
    color: "white",
    fontWeight: 900,
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

const cardButton: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  borderRadius: 12,
  padding: "9px 10px",
  fontWeight: 900,
  color: "#475569",
  cursor: "pointer",
};

const cardButtonDark: React.CSSProperties = {
  ...cardButton,
  background: "#111827",
  color: "white",
  border: "1px solid #111827",
};

const cardButtonDanger: React.CSSProperties = {
  width: "100%",
  border: "1px solid #fecaca",
  background: "#fef2f2",
  borderRadius: 12,
  padding: "9px 10px",
  fontWeight: 900,
  color: "#991b1b",
  cursor: "pointer",
};

const comparisonSectionBox: React.CSSProperties = {
  marginTop: 18,
  border: "1px solid #e2e8f0",
  borderRadius: 22,
  padding: 16,
  background: "#f8fafc",
};

const headerComparisonGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
};

const compareStatusGrid: React.CSSProperties = {
  marginTop: 16,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 10,
};

function CompareStatusBadge({ label, value, tone }: { label: string; value: number; tone: "good" | "warn" | "neutral" }) {
  const style =
    tone === "good"
      ? { bg: "#ecfdf5", border: "#bbf7d0", label: "#166534", value: "#166534" }
      : tone === "warn"
        ? { bg: "#fff7ed", border: "#fed7aa", label: "#92400e", value: "#c2410c" }
        : { bg: "#f8fafc", border: "#e2e8f0", label: "#64748b", value: "#0f172a" };

  return (
    <div style={{ background: style.bg, border: `1px solid ${style.border}`, borderRadius: 16, padding: "12px 14px" }}>
      <div style={{ fontSize: 11, color: style.label, fontWeight: 950, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 22, fontWeight: 950, color: style.value }}>{value}</div>
    </div>
  );
}

const missingEnhancedBox: React.CSSProperties = {
  marginTop: 16,
  border: "1px solid #fed7aa",
  background: "#fff7ed",
  borderRadius: 20,
  padding: 14,
};

const smallWarnPill: React.CSSProperties = {
  border: "1px solid #fdba74",
  background: "#ffedd5",
  color: "#9a3412",
  borderRadius: 999,
  padding: "7px 10px",
  fontWeight: 950,
  fontSize: 12,
};

const unmatchedGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: 10,
  marginTop: 12,
};

const unmatchedItem: React.CSSProperties = {
  border: "1px solid #fed7aa",
  background: "white",
  borderRadius: 14,
  padding: 8,
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "zoom-in",
  textAlign: "left",
};

const unmatchedThumbWrap: React.CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 10,
  overflow: "hidden",
  background: "#f8fafc",
  flex: "0 0 auto",
};

const unmatchedThumb: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const unmatchedName: React.CSSProperties = {
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 900,
  color: "#7c2d12",
  fontSize: 12.5,
};

const matchedPill: React.CSSProperties = {
  background: "#dcfce7",
  color: "#166534",
  borderRadius: 999,
  padding: "6px 9px",
  fontWeight: 950,
  fontSize: 11,
};

const workflowGrid: React.CSSProperties = {
  marginTop: 16,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 12,
};

const spinnerStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 999,
  border: "4px solid #e2e8f0",
  borderTopColor: "#4f46e5",
  animation: "spin 0.9s linear infinite",
};
