"use client";

import { useEffect, useMemo, useState } from "react";

const BACKEND_URL = "https://170.64.209.149.sslip.io";

// Delivery Ignite public offer locked for website copy:
// Essential — $399 + GST — up to 20 items.
// Full Menu — $599 + GST — up to 50 items.
// Custom Quote — 50+ items or multi-location clients.
// Positioning: premium managed service only. No self-serve tools, recurring plans, or AI-credit language.

type RestaurantMode = "new" | "existing";
type ActiveTab = "originals" | "prepared" | "compare" | "enhanced" | "samples" | "banners";
type UploadType = "menu";
type WorkspaceMode = "restaurants" | "drinks";
type DrinksTab = "originals" | "enhanced";

type ProgressDetails = {
  processed?: number;
  total?: number;
  current?: string;
};

type LibraryImage = {
  filename: string;
  name?: string;
  url?: string;
  thumb_url?: string;
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
  samples_count?: number;
  banners_count?: number;
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
  prepared: "Prepared",
  compare: "Comparison",
  enhanced: "Enhanced",
  samples: "Samples",
  banners: "Banners",
};

const IMAGE_FOLDERS: Record<ActiveTab, string> = {
  originals: "originals_approved",
  prepared: "original_prepared",
  compare: "original_prepared",
  enhanced: "enhanced",
  samples: "samples",
  banners: "banners",
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
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("restaurants");
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
  const [preparedImages, setPreparedImages] = useState<LibraryImage[]>([]);
  const [enhancedImages, setEnhancedImages] = useState<LibraryImage[]>([]);
  const [sampleImages, setSampleImages] = useState<LibraryImage[]>([]);
  const [bannerImages, setBannerImages] = useState<LibraryImage[]>([]);

  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);
  const [workingLabel, setWorkingLabel] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressDetails, setProgressDetails] = useState<ProgressDetails | undefined>(undefined);
  const [selectedImageKeys, setSelectedImageKeys] = useState<Set<string>>(new Set());

  function normaliseLibraryImages(images: any[] | undefined): LibraryImage[] {
    return (images || []).map((img) => {
      const filename = img.filename || img.name || "image";
      const rawUrl = img.url || "";
      const rawThumbUrl = img.thumb_url || "";
      const cacheToken = img.modified || Date.now();

      return {
        ...img,
        filename,
        name: filename,
        url: rawUrl && rawUrl.startsWith("http") ? rawUrl : rawUrl ? `${BACKEND_URL}${rawUrl}?t=${cacheToken}` : undefined,
        thumb_url: rawThumbUrl && rawThumbUrl.startsWith("http") ? rawThumbUrl : rawThumbUrl ? `${BACKEND_URL}${rawThumbUrl}?t=${cacheToken}` : undefined,
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
      setPreparedImages(normaliseLibraryImages(folders.original_prepared || folders.prepared));
      setEnhancedImages(normaliseLibraryImages(folders.enhanced));
      setSampleImages(normaliseLibraryImages(folders.samples));
      setBannerImages(normaliseLibraryImages(folders.banners));
      setSelectedImageKeys(new Set());

      setStatus("Library loaded");
    } catch {
      setOriginalImages([]);
      setPreparedImages([]);
      setEnhancedImages([]);
      setSampleImages([]);
      setBannerImages([]);
      setSelectedImageKeys(new Set());
      setStatus("Ready");
      setError("Could not load saved images for this restaurant.");
    }
  }

  async function refreshRestaurantLibrary(slug: string, delayed = true) {
    if (!slug) return;

    await loadRestaurants();
    await loadRestaurantImages(slug);

    if (delayed) {
      window.setTimeout(async () => {
        await loadRestaurants();
        await loadRestaurantImages(slug);
      }, 800);
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

  const matchedPreparedImages = useMemo(() => {
    return preparedImages.filter((img) => enhancedByFilename.has(img.filename));
  }, [preparedImages, enhancedByFilename]);

  const unmatchedPreparedImages = useMemo(() => {
    return preparedImages.filter((img) => !enhancedByFilename.has(img.filename));
  }, [preparedImages, enhancedByFilename]);

  const matchedOriginalImages = matchedPreparedImages;
  const unmatchedOriginalImages = unmatchedPreparedImages;


  function clearRestaurantScopedState() {
    setFiles([]);
    setStatus("Ready");
    setMessage("");
    setError("");
    setLastJobId("");
    setLastUploadedFiles([]);
    setOriginalImages([]);
    setPreparedImages([]);
    setEnhancedImages([]);
    setSampleImages([]);
    setBannerImages([]);
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
    setStatus("Uploading original images...");
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

      setOriginalImages(previews);
      setActiveTab("originals");
      setMessage("Original images uploaded. Approve latest to save them to the restaurant library.");

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
      `Delete restaurant "${activeRestaurantName}" and permanently remove its files?\n\nType DELETE to confirm.`
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
      setMessage("Restaurant deleted successfully.");
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
      await refreshRestaurantLibrary(activeRestaurantSlug);
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
      setProgressDetails(undefined);
    }
  }

  async function prepareAllOriginals() {
    if (!activeRestaurantSlug) return;

    const check = window.prompt("Prepare all approved screenshots into cropped food-only originals?\n\nType PREPARE to confirm.");
    if (check !== "PREPARE") return;

    setLoading(true);
    setWorkingLabel("Preparing cropped food-only originals...");
    setError("");
    setMessage("");
    setStatus("Preparing originals...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/prepare`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.ok === false || data.success === false) {
        throw new Error(data.detail || data.error || "Prepare originals failed");
      }

      setProgress(100);
      await refreshRestaurantLibrary(activeRestaurantSlug);
      setActiveTab("prepared");
      setStatus("Prepared");
      setMessage(`Prepared ${data.prepared_count || data.count || data.files?.length || 0} food-only original image(s).`);
    } catch (err) {
      setStatus("Prepare failed");
      setError(err instanceof Error ? err.message : "Prepare originals failed");
    } finally {
      setLoading(false);
      setWorkingLabel("");
      setProgress(0);
      setProgressDetails(undefined);
    }
  }

  async function enhanceAllOriginals() {
    if (!activeRestaurantSlug) return;

    const check = window.prompt("Enhance all prepared images?\n\nType ENHANCE ALL to confirm.");
    if (check !== "ENHANCE ALL") return;

    setLoading(true);
    setWorkingLabel("Running Phase B on prepared originals...");
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
      await refreshRestaurantLibrary(activeRestaurantSlug);
      setActiveTab("enhanced");
      setStatus("Phase B complete");
      setMessage(`Enhanced ${data.count || data.processed?.length || 0} prepared image(s).`);
    } catch (err) {
      setStatus("Phase B failed");
      setError(err instanceof Error ? err.message : "Enhance all failed");
    } finally {
      setLoading(false);
      setWorkingLabel("");
      setProgress(0);
      setProgressDetails(undefined);
    }
  }


  async function downloadImage(img: LibraryImage, folder: string) {
    if (!activeRestaurantSlug) return;

    setError("");
    setMessage("");
    setStatus("Preparing download...");

    try {
      const href = `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/download-file/${encodeURIComponent(folder)}/${encodeURIComponent(img.filename)}`;
      const res = await fetch(href, { cache: "no-store" });

      if (!res.ok) {
        let details = "Download failed";
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
      a.download = img.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setStatus("Download ready");
      setMessage(`Downloaded ${img.filename}.`);
    } catch (err) {
      setStatus("Download failed");
      setError(err instanceof Error ? err.message : "Download failed");
    }
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
    if (activeTab === "prepared") {
      return { images: preparedImages, folder: "original_prepared", canEnhance: true, enhanceKind: "menu" as const };
    }
    if (activeTab === "enhanced") {
      return { images: enhancedImages, folder: "enhanced", canEnhance: false, enhanceKind: "none" as const };
    }
    if (activeTab === "samples") {
      return { images: sampleImages, folder: "samples", canEnhance: false, enhanceKind: "none" as const };
    }
    if (activeTab === "banners") {
      return { images: bannerImages, folder: "banners", canEnhance: false, enhanceKind: "none" as const };
    }
    return { images: originalImages, folder: "originals_approved", canEnhance: false, enhanceKind: "none" as const };
  }, [activeTab, originalImages, preparedImages, enhancedImages, sampleImages, bannerImages]);

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
      const total = selectedImages.length;
      let enhanced = 0;
      setProgressDetails({ processed: 0, total, current: selectedImages[0]?.filename });

      for (const img of selectedImages) {
        setProgressDetails({ processed: enhanced, total, current: img.filename });
        const endpoint = `${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/images/${encodeURIComponent(img.filename)}/enhance`;

        const res = await fetch(endpoint, { method: "POST" });
        const data = await res.json();

        if (!res.ok || data.ok === false) {
          throw new Error(data.detail || data.error || `Enhance failed for ${img.filename}`);
        }

        enhanced += 1;
        setProgressDetails({ processed: enhanced, total, current: img.filename });
        setProgress(Math.min(98, Math.round((enhanced / total) * 100)));
      }

      setSelectedImageKeys(new Set());
      setProgress(100);
      await refreshRestaurantLibrary(activeRestaurantSlug);
      setActiveTab("enhanced");
      setStatus("Enhanced");
      setMessage(`Enhanced ${enhanced} selected image(s).`);
    } catch (err) {
      setStatus("Enhance failed");
      setError(err instanceof Error ? err.message : "Enhance selected failed");
    } finally {
      setLoading(false);
      setWorkingLabel("");
      setProgress(0);
      setProgressDetails(undefined);
    }
  }

  async function createSampleImages() {
    if (!activeRestaurantSlug || selectedImages.length === 0 || activeTab !== "enhanced") return;

    const check = window.prompt(`Create ${selectedImages.length} watermarked sales sample(s)?

Type SAMPLE to confirm.`);
    if (check !== "SAMPLE") return;

    setLoading(true);
    setWorkingLabel(`Creating ${selectedImages.length} watermarked sample(s)...`);
    setProgressDetails({ processed: 0, total: selectedImages.length, current: selectedImages[0]?.filename });
    setProgress(8);
    setError("");
    setMessage("");
    setStatus("Creating samples...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/samples/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filenames: selectedImages.map((img) => img.filename),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.detail || data.error || "Create samples failed");
      }

      const createdCount = data.count || data.created?.length || selectedImages.length;
      setProgressDetails({ processed: createdCount, total: selectedImages.length });
      setProgress(100);
      setSelectedImageKeys(new Set());
      await refreshRestaurantLibrary(activeRestaurantSlug);
      setActiveTab("samples");
      setStatus("Samples ready");
      setMessage(`Created ${createdCount} watermarked sample(s).`);
    } catch (err) {
      setStatus("Create samples failed");
      setError(err instanceof Error ? err.message : "Create samples failed");
    } finally {
      setLoading(false);
      setWorkingLabel("");
      setProgress(0);
      setProgressDetails(undefined);
    }
  }

  async function createBannerImage() {
    if (!activeRestaurantSlug || selectedImages.length !== 3 || activeTab !== "enhanced") {
      setError("Select exactly 3 enhanced images to create one banner.");
      return;
    }

    const check = window.prompt(`Create 1 composed 16:9 banner from ${selectedImages.length} selected enhanced image(s)?

Type BANNER to confirm.`);
    if (check !== "BANNER") return;

    setLoading(true);
    setWorkingLabel("Creating composed restaurant banner...");
    setProgressDetails({ processed: 0, total: 1, current: selectedImages.map((img) => img.filename).join(" + ") });
    setProgress(8);
    setError("");
    setMessage("");
    setStatus("Creating banner...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/restaurants/${encodeURIComponent(activeRestaurantSlug)}/banners/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filenames: selectedImages.map((img) => img.filename),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.detail || data.error || "Create banner failed");
      }

      setProgressDetails({ processed: data.count || 1, total: 1 });
      setProgress(100);
      setSelectedImageKeys(new Set());
      await refreshRestaurantLibrary(activeRestaurantSlug);
      setActiveTab("banners");
      setStatus("Banner ready");
      setMessage(`Created ${data.count || 1} composed banner.`);
    } catch (err) {
      setStatus("Create banner failed");
      setError(err instanceof Error ? err.message : "Create banner failed");
    } finally {
      setLoading(false);
      setWorkingLabel("");
      setProgress(0);
      setProgressDetails(undefined);
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

    if (originalImages.length === 0) {
      return {
        title: "Setup",
        subtitle: "Upload originals",
        badge: "Setup mode",
        tone: "neutral" as const,
      };
    }

    if (originalImages.length > 0 && preparedImages.length === 0) {
      return {
        title: "Phase A",
        subtitle: "Original screenshots ready → prepare next",
        badge: "Prepare needed",
        tone: "neutral" as const,
      };
    }

    if (preparedImages.length > 0 && enhancedImages.length === 0) {
      return {
        title: "Prepared",
        subtitle: "Food-only originals ready → enhance next",
        badge: "Prepared ready",
        tone: "good" as const,
      };
    }

    if (unmatchedPreparedImages.length > 0) {
      return {
        title: "Phase B Partial",
        subtitle: `${matchedPreparedImages.length} matched / ${unmatchedPreparedImages.length} missing`,
        badge: "Phase B incomplete",
        tone: "bad" as const,
      };
    }

    if (preparedImages.length > 0 && enhancedImages.length > 0) {
      return {
        title: "Phase B Complete",
        subtitle: "Prepared → Enhanced matched",
        badge: "Phase B complete",
        tone: "good" as const,
      };
    }


    return {
      title: "Ready",
      subtitle: "Restaurant library loaded",
      badge: "Ready",
      tone: "good" as const,
    };
  }, [activeRestaurantSlug, originalImages.length, preparedImages.length, enhancedImages.length, unmatchedPreparedImages.length, matchedPreparedImages.length]);

  if (workspaceMode === "drinks") {
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
        {previewImage && (
          <PreviewModal
            image={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}

        <section style={{ maxWidth: 1220, margin: "0 auto" }}>
          <Hero modeTitle="Drinks Library" modeSubtitle="Global beverage asset library" />
          <WorkspaceSwitch active={workspaceMode} onChange={setWorkspaceMode} />
          <DrinksLibrary onPreview={setPreviewImage} />
        </section>
      </main>
    );
  }

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
      {workingLabel && <ProgressOverlay label={workingLabel} progress={progress} details={progressDetails} />}

      {previewImage && (
        <PreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}

      <section style={{ maxWidth: 1220, margin: "0 auto" }}>
        <Hero modeTitle={workflowState.title} modeSubtitle={workflowState.subtitle} />
        <WorkspaceSwitch active={workspaceMode} onChange={setWorkspaceMode} />

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
                <Kicker>Premium client setup</Kicker>
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
                  <option value="" style={{ color: "#000000", background: "#ffffff" }}>{restaurantsLoading ? "Loading restaurants..." : "Choose saved restaurant..."}</option>
                  {restaurants.map((r) => {
                    const originalCount = r.originals_count ?? r.approved_count ?? 0;
                    const enhancedCount = r.enhanced_count ?? 0;
                    const missingCount = Math.max(originalCount - enhancedCount, 0);
                    return (
                      <option key={r.slug} value={r.slug} style={{ color: "#000000", background: "#ffffff" }}>
                        {missingCount > 0 ? `⚠ ${r.name} — ${missingCount} missing enhanced` : `✅ ${r.name}`}
                      </option>
                    );
                  })}
                </select>
                <HelpText>Selecting a restaurant loads its Original, Enhanced, Samples and Banners libraries.</HelpText>
              </div>
            )}

            <Divider />

            <div style={{ marginTop: 18 }}>
              <Label>Upload client food/menu images</Label>
              <input
                id="file"
                type="file"
                multiple
                onChange={handleFiles}
                style={{ ...inputStyle, padding: 12, background: "#f8fafc" }}
              />
              <HelpText>
                Upload real restaurant food/menu photos or screenshots. The workflow is managed internally so clients never deal with self-serve tools or AI settings.
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
                  <Kicker>Active client</Kicker>
                  <h2 style={{ ...sectionTitle, marginTop: 4 }}>
                    {activeRestaurantName || "No restaurant selected"}
                  </h2>
                  <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                    {activeRestaurantSlug
                      ? `Library folder: ${activeRestaurantSlug}`
                      : "Create or select a client restaurant to manage its premium delivery assets."}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <Metric label="Original" value={String(originalImages.length)} />
                  <Metric label="Prepared" value={String(preparedImages.length)} tone={preparedImages.length > 0 ? "good" : "neutral"} />
                  <Metric label="Enhanced" value={String(enhancedImages.length)} />
                  <Metric label="Samples" value={String(sampleImages.length)} tone={sampleImages.length > 0 ? "good" : "neutral"} />
                  <Metric label="Missing" value={String(unmatchedOriginalImages.length)} tone={unmatchedOriginalImages.length > 0 ? "warn" : "good"} />
                  <Metric label="Banners" value={String(bannerImages.length)} tone={bannerImages.length > 0 ? "good" : "neutral"} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginTop: 20, flexWrap: "wrap" }}>
                <Tabs active={activeTab} setActive={setActiveTab} />
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={downloadAllRestaurantFiles} disabled={!activeRestaurantSlug} style={miniButton(!activeRestaurantSlug)}>
                    Download all restaurant files
                  </button>
                  <button onClick={prepareAllOriginals} disabled={loading || !activeRestaurantSlug || originalImages.length === 0} style={miniButton(loading || !activeRestaurantSlug || originalImages.length === 0)}>
                    Prepare All
                  </button>
                  <button onClick={enhanceAllOriginals} disabled={loading || !activeRestaurantSlug || preparedImages.length === 0} style={miniDarkButton(loading || !activeRestaurantSlug || preparedImages.length === 0)}>
                    Phase B: Enhance prepared
                  </button>
                </div>
              </div>

              {activeTab !== "compare" && activeBatch.images.length > 0 && (
                <BatchActionBar
                  selectedCount={selectedImages.length}
                  totalCount={activeBatch.images.length}
                  canEnhance={activeBatch.canEnhance}
                  enhanceLabel="Enhance Selected"
                  disabled={loading || !activeRestaurantSlug}
                  onSelectAll={selectAllVisible}
                  onClear={clearSelectedImages}
                  onDelete={deleteSelectedImages}
                  onEnhance={enhanceSelectedImages}
                  onDownloadSelected={downloadSelectedFiles}
                  canCreateSamples={activeTab === "enhanced"}
                  onCreateSamples={createSampleImages}
                  canCreateBanner={activeTab === "enhanced"}
                  onCreateBanner={createBannerImage}
                />
              )}

              {activeTab === "originals" && (
                <ImageGrid
                  title="Original"
                  subtitle="Approved Phase A screenshots/originals. Rename these first, then click Prepare All to crop the food-only source images."
                  images={originalImages}
                  emptyText={emptyLibraryText}
                  folder="originals_approved"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "originals_approved")}
                  selectedKeys={selectedImageKeys}
                  onToggleSelected={toggleImageSelected}
                  onRename={renameImage}
                />
              )}

              {activeTab === "prepared" && (
                <ImageGrid
                  title="Original Prepared"
                  subtitle="Food-only cropped images created from approved screenshots. Phase B enhancement runs from this folder only."
                  images={preparedImages}
                  emptyText="No prepared images yet. Go to Original and click Prepare All after renaming/approval."
                  folder="original_prepared"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "original_prepared")}
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
                  originals={preparedImages.length > 0 ? preparedImages : originalImages}
                  enhancedByFilename={enhancedByFilename}
                  samples={sampleImages}
                  banners={bannerImages}
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

              {activeTab === "samples" && (
                <ImageGrid
                  title="Samples"
                  subtitle="Watermarked premium samples created from selected enhanced images. These remain separate from final client exports."
                  images={sampleImages}
                  emptyText="No samples yet. Go to Enhanced, select 3 images, then click Create Samples."
                  folder="samples"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "samples")}
                  selectedKeys={selectedImageKeys}
                  onToggleSelected={toggleImageSelected}
                  onRename={renameImage}
                />
              )}

              {activeTab === "banners" && (
                <ImageGrid
                  title="Banners"
                  subtitle="Final platform-ready 16:9 restaurant banners composed from exactly 3 selected enhanced menu images."
                  images={bannerImages}
                  emptyText="No banner yet. Go to Enhanced, select exactly 3 images, then click Create Banner."
                  folder="banners"
                  restaurantSlug={activeRestaurantSlug}
                  onPreview={setPreviewImage}
                  onDownload={downloadImage}
                  onDelete={(img) => deleteImage(img, "banners")}
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
                  <h2 style={sectionTitle}>Managed production path</h2>
                </div>
                <StatusPill text={workflowState.badge} tone={workflowState.tone} />
              </div>

              <div style={workflowGrid}>
                <WorkflowStep number="01" title="Original" text="Upload and approve real client food/menu images. Rename dishes here while the menu context is still visible." />
                <WorkflowStep number="02" title="Prepared" text="Click Prepare All to crop clean food-only images into original_prepared using the locked Uber modal crop." />
                <WorkflowStep number="03" title="Enhanced" text="Generate premium, realistic menu-item outputs from prepared images only, preserving the actual food and avoiding fake AI fantasy styling." />
                <WorkflowStep number="04" title="Comparison" text="Review prepared source images against enhanced outputs before client delivery." />
                <WorkflowStep number="05" title="Samples" text="Create watermarked premium previews from selected enhanced images for the free sample workflow." />
                <WorkflowStep number="06" title="Banners" text="Select exactly 3 enhanced menu images to create a platform-ready 16:9 banner." />
              </div>
            </Panel>
          </div>
        </div>
      </section>
    </main>
  );
}


function WorkspaceSwitch({ active, onChange }: { active: WorkspaceMode; onChange: (mode: WorkspaceMode) => void }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        margin: "0 0 20px",
        background: "rgba(255,255,255,0.74)",
        border: "1px solid rgba(226,232,240,0.95)",
        borderRadius: 22,
        padding: 8,
        boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
        width: "fit-content",
      }}
    >
      <button
        type="button"
        onClick={() => onChange("restaurants")}
        style={workspaceButton(active === "restaurants")}
      >
        Restaurant Library
      </button>
      <button
        type="button"
        onClick={() => onChange("drinks")}
        style={workspaceButton(active === "drinks")}
      >
        Global Drinks Library
      </button>
    </div>
  );
}

function DrinksLibrary({ onPreview }: { onPreview: (img: PreviewImage) => void }) {
  const [tab, setTab] = useState<DrinksTab>("originals");
  const [originals, setOriginals] = useState<LibraryImage[]>([]);
  const [enhanced, setEnhanced] = useState<LibraryImage[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [workingLabel, setWorkingLabel] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressDetails, setProgressDetails] = useState<ProgressDetails | undefined>(undefined);
  const [status, setStatus] = useState("Ready");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function normalise(images: any[] | undefined): LibraryImage[] {
    return (images || []).map((img) => {
      const filename = img.filename || img.name || "image";
      const rawUrl = img.url || "";
      const rawThumbUrl = img.thumb_url || "";
      const cacheToken = img.modified || Date.now();

      return {
        ...img,
        filename,
        name: filename,
        url: rawUrl && rawUrl.startsWith("http") ? rawUrl : rawUrl ? `${BACKEND_URL}${rawUrl}?t=${cacheToken}` : undefined,
        thumb_url: rawThumbUrl && rawThumbUrl.startsWith("http") ? rawThumbUrl : rawThumbUrl ? `${BACKEND_URL}${rawThumbUrl}?t=${cacheToken}` : undefined,
      };
    });
  }

  async function loadDrinks() {
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/drinks`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.detail || data.error || "Could not load drinks library");
      setOriginals(normalise(data.originals));
      setEnhanced(normalise(data.enhanced));
      setStatus("Library loaded");
    } catch (err) {
      setStatus("Load failed");
      setError(err instanceof Error ? err.message : "Could not load drinks library");
    }
  }

  useEffect(() => {
    loadDrinks();
  }, []);

  useEffect(() => {
    if (!workingLabel) return;
    setProgress(8);
    const timer = window.setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + Math.max(2, Math.floor((92 - p) / 5))));
    }, 700);
    return () => window.clearInterval(timer);
  }, [workingLabel]);

  const activeFolder = tab === "originals" ? "originals" : "enhanced";
  const activeImages = tab === "originals" ? originals : enhanced;
  const selectedImages = useMemo(() => {
    return activeImages.filter((img) => selectedKeys.has(imageSelectKey(activeFolder, img.filename)));
  }, [activeImages, activeFolder, selectedKeys]);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files || []));
    setError("");
    setMessage("");
  }

  function clearInput() {
    setFiles([]);
    const input = document.getElementById("drinks-file") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  async function uploadDrinks() {
    if (!files.length) {
      setError("Choose drink images first.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Uploading drinks...");

    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));

      const res = await fetch(`${BACKEND_URL}/api/dpo/drinks/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.detail || data.error || "Upload failed");

      clearInput();
      await loadDrinks();
      setTab("originals");
      setStatus("Uploaded");
      setMessage(`Uploaded ${data.saved?.length || 0} drink image(s).`);
    } catch (err) {
      setStatus("Upload failed");
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelected(folder: string, filename: string) {
    const key = imageSelectKey(folder, filename);
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function selectAllVisible() {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      activeImages.forEach((img) => next.add(imageSelectKey(activeFolder, img.filename)));
      return next;
    });
  }

  function clearSelected() {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      activeImages.forEach((img) => next.delete(imageSelectKey(activeFolder, img.filename)));
      return next;
    });
  }

  async function enhanceSelected() {
    if (tab !== "originals" || selectedImages.length === 0) return;
    const check = window.prompt(`Enhance ${selectedImages.length} selected drink image(s)?\n\nType ENHANCE to confirm.`);
    if (check !== "ENHANCE") return;

    setLoading(true);
    setWorkingLabel(`Enhancing ${selectedImages.length} drink image(s)...`);
    setError("");
    setMessage("");
    setStatus("Enhancing drinks...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/drinks/enhance-selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: selectedImages.map((img) => img.filename) }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.detail || data.error || "Enhance failed");

      setProgress(100);
      setSelectedKeys(new Set());
      await loadDrinks();
      setTab("enhanced");
      setStatus("Enhanced");
      setMessage(`Enhanced ${data.processed?.length || 0} drink image(s).${data.failed?.length ? ` ${data.failed.length} failed.` : ""}`);
    } catch (err) {
      setStatus("Enhance failed");
      setError(err instanceof Error ? err.message : "Enhance failed");
    } finally {
      setLoading(false);
      setWorkingLabel("");
      setProgress(0);
      setProgressDetails(undefined);
    }
  }

  async function deleteSelected() {
    if (selectedImages.length === 0) return;
    const check = window.prompt(`Delete ${selectedImages.length} selected ${activeFolder} drink image(s)?\n\nType DELETE to confirm.`);
    if (check !== "DELETE") return;

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Deleting drinks...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/drinks/delete-selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: activeFolder, files: selectedImages.map((img) => img.filename) }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.detail || data.error || "Delete failed");

      setSelectedKeys(new Set());
      await loadDrinks();
      setStatus("Deleted");
      setMessage(`Deleted ${data.deleted?.length || 0} drink image(s).`);
    } catch (err) {
      setStatus("Delete failed");
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  async function downloadSelected() {
    if (selectedImages.length === 0) return;

    setError("");
    setMessage("");
    setStatus("Preparing drinks download...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/drinks/download-selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: activeFolder, files: selectedImages.map((img) => img.filename) }),
      });
      if (!res.ok) {
        let details = "Download failed";
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
      a.download = `drinks_${activeFolder}_selected.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setStatus("Download ready");
      setMessage(`Downloaded ${selectedImages.length} selected drink file(s).`);
    } catch (err) {
      setStatus("Download failed");
      setError(err instanceof Error ? err.message : "Download failed");
    }
  }

  async function downloadOne(img: LibraryImage, folder: string) {
    const url = fullImageUrl(img.url);
    if (!url) return;

    setError("");
    setMessage("");
    setStatus("Preparing download...");

    try {
      // Fetch as a blob so the browser downloads the file instead of opening it in a new tab.
      // This keeps individual drink downloads as image files, while batch downloads remain ZIP files.
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = img.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(objectUrl);
      setStatus("Download ready");
      setMessage(`Downloaded ${img.filename}.`);
    } catch (err) {
      setStatus("Download failed");
      setError(err instanceof Error ? err.message : "Download failed");
    }
  }

  async function deleteOne(img: LibraryImage, folder: string) {
    const check = window.prompt(`Delete "${img.filename}"?\n\nType DELETE to confirm.`);
    if (check !== "DELETE") return;

    setLoading(true);
    setError("");
    setMessage("");
    setStatus("Deleting drink...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/dpo/drinks/delete-selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder, files: [img.filename] }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.detail || data.error || "Delete failed");
      await loadDrinks();
      setStatus("Deleted");
      setMessage(`Deleted ${img.filename}.`);
    } catch (err) {
      setStatus("Delete failed");
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {workingLabel && <ProgressOverlay label={workingLabel} progress={progress} details={progressDetails} />}

      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <Kicker>Global drinks library</Kicker>
            <h2 style={{ ...sectionTitle, marginTop: 4 }}>Reusable drink assets</h2>
            <p style={{ margin: "6px 0 0", color: "#64748b", maxWidth: 720 }}>
              Upload drink screenshots or product images once, enhance them with the beverage prompt, then download selected files whenever needed.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Metric label="Original drinks" value={String(originals.length)} />
            <Metric label="Enhanced drinks" value={String(enhanced.length)} tone={enhanced.length > 0 ? "good" : "neutral"} />
            <StatusPill text={status} tone={status.toLowerCase().includes("failed") ? "bad" : status === "Enhanced" || status === "Uploaded" ? "good" : "neutral"} />
          </div>
        </div>

        <Divider />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1fr) auto", gap: 12, alignItems: "end" }}>
          <div>
            <Label>Upload drink originals</Label>
            <input
              id="drinks-file"
              type="file"
              multiple
              onChange={handleFiles}
              style={{ ...inputStyle, padding: 12, background: "#f8fafc" }}
            />
            <HelpText>These files go to the global drinks library, not a restaurant folder.</HelpText>
          </div>
          <button onClick={uploadDrinks} disabled={loading || files.length === 0} style={primaryButton(loading || files.length === 0)}>
            Upload drinks
          </button>
        </div>

        {files.length > 0 && (
          <div style={selectedFilesBox}>
            <div style={{ fontWeight: 900 }}>{files.length} drink file(s) selected</div>
            <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
              {files.slice(0, 6).map((f, idx) => (
                <div key={`${f.name}-${f.size}-${f.lastModified}-${idx}`} style={fileChip}>{f.name}</div>
              ))}
              {files.length > 6 && <div style={{ color: "#64748b", fontSize: 13 }}>+ {files.length - 6} more</div>}
            </div>
          </div>
        )}

        {message && <Notice tone="good">{message}</Notice>}
        {error && <Notice tone="bad">{error}</Notice>}
      </Panel>

      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => { setTab("originals"); setSelectedKeys(new Set()); }} style={tabButton(tab === "originals")}>
              Originals
            </button>
            <button type="button" onClick={() => { setTab("enhanced"); setSelectedKeys(new Set()); }} style={tabButton(tab === "enhanced")}>
              Enhanced
            </button>
          </div>
          <button type="button" onClick={loadDrinks} disabled={loading} style={miniButton(loading)}>
            Refresh library
          </button>
        </div>

        {activeImages.length > 0 && (
          <BatchActionBar
            selectedCount={selectedImages.length}
            totalCount={activeImages.length}
            canEnhance={tab === "originals"}
            enhanceLabel="Enhance Selected Drinks"
            disabled={loading}
            onSelectAll={selectAllVisible}
            onClear={clearSelected}
            onDelete={deleteSelected}
            onEnhance={enhanceSelected}
            onDownloadSelected={downloadSelected}
          />
        )}

        <ImageGrid
          title={tab === "originals" ? "Drink Originals" : "Enhanced Drinks"}
          subtitle={tab === "originals" ? "Global beverage source images. Select and enhance these with the drink-only prompt." : "Enhanced beverage outputs ready to download and use."}
          images={activeImages}
          emptyText={tab === "originals" ? "No drink originals yet. Upload drinks above to start the global library." : "No enhanced drinks yet. Select originals and run Enhance Selected Drinks."}
          folder={activeFolder}
          restaurantSlug="drinks-library"
          onPreview={onPreview}
          onDownload={downloadOne}
          onDelete={(img) => deleteOne(img, activeFolder)}
          onEnhance={tab === "originals" ? (img) => {
            setSelectedKeys(new Set([imageSelectKey("originals", img.filename)]));
            window.setTimeout(() => enhanceSelected(), 0);
          } : undefined}
          showEnhance={false}
          selectedKeys={selectedKeys}
          onToggleSelected={toggleSelected}
        />
      </Panel>
    </div>
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
            Delivery Ignite Managed Production
          </div>
          <h1 style={{ margin: "10px 0 8px", fontSize: 42, lineHeight: 1.05 }}>
            Premium Delivery Image Library
          </h1>
          <p style={{ margin: 0, color: "#dbeafe", fontSize: 17, maxWidth: 720 }}>
            Premium managed production system for real restaurant photos: prepare clean originals, preserve the actual food, enhance menu assets, create watermarked samples, and generate platform-ready banners.
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

function ProgressOverlay({ label, progress, details }: { label: string; progress: number; details?: ProgressDetails }) {
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
            {details?.total ? (
              <div style={{ color: "#64748b", marginTop: 4 }}>
                Processed: <b>{details.processed || 0}</b> / <b>{details.total}</b>
                {typeof details.processed === "number" ? ` • Remaining: ${Math.max(details.total - details.processed, 0)}` : ""}
                {details.current ? ` • Current: ${details.current}` : ""}
              </div>
            ) : (
              <div style={{ color: "#64748b", marginTop: 4 }}>Please keep this page open.</div>
            )}
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
    { id: "prepared", label: "Prepared" },
    { id: "enhanced", label: "Enhanced" },
    { id: "samples", label: "Samples" },
    { id: "banners", label: "Banners" },
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
  canCreateSamples = false,
  onCreateSamples,
  canCreateBanner = false,
  onCreateBanner,
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
  canCreateSamples?: boolean;
  onCreateSamples?: () => void;
  canCreateBanner?: boolean;
  onCreateBanner?: () => void;
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
        {canCreateSamples && (
          <button type="button" onClick={onCreateSamples} disabled={disabled || noSelection} style={successButton(disabled || noSelection)}>
            Create Samples
          </button>
        )}
        {canCreateBanner && (
          <button type="button" onClick={onCreateBanner} disabled={disabled || selectedCount !== 3} style={miniDarkButton(disabled || selectedCount !== 3)}>
            Create Banner
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
            const thumbUrl = fullImageUrl(img.thumb_url || img.url);
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
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
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
  samples,
  banners,
  restaurantSlug,
  emptyText,
  onPreview,
}: {
  originals: LibraryImage[];
  enhancedByFilename: Map<string, LibraryImage>;
  samples: LibraryImage[];
  banners: LibraryImage[];
  restaurantSlug: string;
  emptyText: string;
  onPreview: (img: PreviewImage) => void;
}) {
  type ComparisonItem = {
    key: string;
    title: string;
    badge: string;
    leftLabel: string;
    rightLabel: string;
    left: LibraryImage;
    right: LibraryImage;
    outputFilename: string;
    group: "sample" | "menu";
  };

  const [selectedComparisonKeys, setSelectedComparisonKeys] = useState<Set<string>>(new Set());
  const [batchDownloading, setBatchDownloading] = useState(false);

  const sampleByFilename = useMemo(() => {
    const map = new Map<string, LibraryImage>();
    samples.forEach((img) => map.set(img.filename, img));
    return map;
  }, [samples]);

  const matched = originals.filter((orig) => enhancedByFilename.has(orig.filename));
  const unmatched = originals.filter((orig) => !enhancedByFilename.has(orig.filename));
  const sampleMatches = originals.filter((orig) => sampleByFilename.has(orig.filename)).slice(0, 3);

  const sampleComparisonItems: ComparisonItem[] = sampleMatches
    .map((orig, index) => {
      const sample = sampleByFilename.get(orig.filename);
      if (!sample) return null;
      return {
        key: `sample::${orig.filename}`,
        title: `Sample ${index + 1} — ${orig.filename}`,
        badge: "Watermarked",
        leftLabel: "Original",
        rightLabel: "Watermarked enhanced",
        left: orig,
        right: sample,
        outputFilename: `sample_${index + 1}_${orig.filename.replace(/\.[^.]+$/, "")}_comparison.png`,
        group: "sample" as const,
      };
    })
    .filter(Boolean) as ComparisonItem[];

  const menuComparisonItems: ComparisonItem[] = matched
    .map((orig) => {
      const enhanced = enhancedByFilename.get(orig.filename);
      if (!enhanced) return null;
      return {
        key: `menu::${orig.filename}`,
        title: orig.filename,
        badge: "Matched",
        leftLabel: "Original",
        rightLabel: "Enhanced",
        left: orig,
        right: enhanced,
        outputFilename: `${orig.filename.replace(/\.[^.]+$/, "")}_comparison.png`,
        group: "menu" as const,
      };
    })
    .filter(Boolean) as ComparisonItem[];

  const allComparisonItems = [...sampleComparisonItems, ...menuComparisonItems];
  const selectedComparisonItems = allComparisonItems.filter((item) => selectedComparisonKeys.has(item.key));
  const hasAnyComparisonAssets = Boolean(originals.length || matched.length || sampleMatches.length || banners.length);

  function toggleComparisonSelected(key: string) {
    setSelectedComparisonKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function selectAllComparisons() {
    setSelectedComparisonKeys(new Set(allComparisonItems.map((item) => item.key)));
  }

  function clearComparisonSelection() {
    setSelectedComparisonKeys(new Set());
  }

  async function downloadComparisonBatch(items: ComparisonItem[], label: string) {
    if (!items.length) return;

    setBatchDownloading(true);
    try {
      for (const item of items) {
        const leftUrl = fullImageUrl(item.left.url);
        const rightUrl = fullImageUrl(item.right.url);
        if (!leftUrl || !rightUrl) continue;

        await downloadStitchedComparison({
          leftUrl,
          rightUrl,
          filename: item.outputFilename,
          title: item.title,
          leftLabel: item.leftLabel,
          rightLabel: item.rightLabel,
        });

        // Small delay prevents browsers from blocking rapid multiple downloads.
        await new Promise((resolve) => window.setTimeout(resolve, 220));
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : `Could not download ${label}`);
    } finally {
      setBatchDownloading(false);
    }
  }

  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 20 }}>Comparison</h3>
          <p style={{ margin: "6px 0 0", color: "#64748b", lineHeight: 1.45 }}>
            Compare original menu images against enhanced outputs. Banners are created separately from exactly 3 selected enhanced dishes.
          </p>
        </div>
        <div style={{ color: "#64748b", fontWeight: 900 }}>{matched.length} menu pair(s)</div>
      </div>

      {!hasAnyComparisonAssets ? (
        <EmptyBox>{emptyText}</EmptyBox>
      ) : (
        <>
          <div style={compareStatusGrid}>
            <CompareStatusBadge label="Menu pairs" value={matched.length} tone={matched.length > 0 ? "good" : "neutral"} />
            <CompareStatusBadge label="Samples" value={sampleMatches.length} tone={sampleMatches.length > 0 ? "good" : "neutral"} />
            <CompareStatusBadge label="Missing enhanced" value={unmatched.length} tone={unmatched.length > 0 ? "warn" : "good"} />
            <CompareStatusBadge label="Banners" value={banners.length} tone={banners.length > 0 ? "good" : "neutral"} />
          </div>

          {allComparisonItems.length > 0 && (
            <div style={{ ...comparisonSectionBox, marginTop: 18, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 950, fontSize: 16 }}>Stitched comparison batch actions</div>
                <div style={{ marginTop: 4, color: "#64748b", fontSize: 13 }}>
                  Select comparison cards, then download selected or all stitched before/after PNG files.
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button type="button" onClick={selectAllComparisons} disabled={batchDownloading} style={miniButton(batchDownloading)}>
                  Select All
                </button>
                <button type="button" onClick={clearComparisonSelection} disabled={batchDownloading || selectedComparisonKeys.size === 0} style={miniButton(batchDownloading || selectedComparisonKeys.size === 0)}>
                  Clear
                </button>
                <button type="button" onClick={() => downloadComparisonBatch(selectedComparisonItems, "selected comparisons")} disabled={batchDownloading || selectedComparisonItems.length === 0} style={miniDarkButton(batchDownloading || selectedComparisonItems.length === 0)}>
                  {batchDownloading ? "Creating..." : `Download Selected (${selectedComparisonItems.length})`}
                </button>
                <button type="button" onClick={() => downloadComparisonBatch(allComparisonItems, "all comparisons")} disabled={batchDownloading || allComparisonItems.length === 0} style={miniDarkButton(batchDownloading || allComparisonItems.length === 0)}>
                  Download All ({allComparisonItems.length})
                </button>
              </div>
            </div>
          )}

          {sampleComparisonItems.length > 0 && (
            <div style={{ ...comparisonSectionBox, marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 950, fontSize: 18 }}>Top sample comparisons</div>
                  <div style={{ marginTop: 4, color: "#64748b", fontSize: 13 }}>
                    Sample 1–3: one stitched comparison card per sample, with prepared original on the left and watermarked enhanced sample on the right.
                  </div>
                </div>
                <div style={matchedPill}>{sampleComparisonItems.length} sample pair(s)</div>
              </div>

              <div style={{ display: "grid", gap: 18 }}>
                {sampleComparisonItems.map((item) => (
                  <StitchedComparisonCard
                    key={item.key}
                    title={item.title}
                    badge={item.badge}
                    leftLabel={item.leftLabel}
                    rightLabel={item.rightLabel}
                    left={item.left}
                    right={item.right}
                    outputFilename={item.outputFilename}
                    onPreview={onPreview}
                    selectable
                    selected={selectedComparisonKeys.has(item.key)}
                    onToggleSelected={() => toggleComparisonSelected(item.key)}
                  />
                ))}
              </div>
            </div>
          )}

          {banners.length > 0 && (
            <div style={{ ...comparisonSectionBox, marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 950, fontSize: 18 }}>Banner</div>
                  <div style={{ marginTop: 4, color: "#64748b", fontSize: 13 }}>
                    Final 16:9 banner created from selected enhanced dishes.
                  </div>
                </div>
                <div style={matchedPill}>New banner system</div>
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                {banners.map((banner) => (
                  <button
                    key={banner.filename}
                    type="button"
                    onClick={() => onPreview({ title: "Banner", url: fullImageUrl(banner.url), filename: banner.filename })}
                    style={{ border: "1px solid #e2e8f0", borderRadius: 18, overflow: "hidden", background: "#0f172a", padding: 0, cursor: "zoom-in" }}
                  >
                    <img src={fullImageUrl(banner.thumb_url || banner.url)} alt={banner.filename} style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", display: "block" }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ ...comparisonSectionBox, marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 950, fontSize: 18 }}>Menu image comparison</div>
                <div style={{ marginTop: 4, color: "#64748b", fontSize: 13 }}>
                  Each card shows one stitched comparison view and includes a download button for a joined PNG file.
                </div>
              </div>
              <div style={matchedPill}>{menuComparisonItems.length} matched</div>
            </div>

            {menuComparisonItems.length === 0 ? (
              <EmptyBox>No matched enhanced menu images yet.</EmptyBox>
            ) : (
              <div style={{ display: "grid", gap: 18 }}>
                {menuComparisonItems.map((item) => (
                  <StitchedComparisonCard
                    key={item.key}
                    title={item.title}
                    badge={item.badge}
                    leftLabel={item.leftLabel}
                    rightLabel={item.rightLabel}
                    left={item.left}
                    right={item.right}
                    outputFilename={item.outputFilename}
                    onPreview={onPreview}
                    selectable
                    selected={selectedComparisonKeys.has(item.key)}
                    onToggleSelected={() => toggleComparisonSelected(item.key)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}


async function loadCanvasImage(url: string): Promise<HTMLImageElement> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load image for comparison download");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not render comparison image"));
    };
    img.src = objectUrl;
  });
}

function drawImageContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.min(w / img.width, h / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = x + (w - drawW) / 2;
  const dy = y + (h - drawH) / 2;
  ctx.drawImage(img, dx, dy, drawW, drawH);
}

async function downloadStitchedComparison({
  leftUrl,
  rightUrl,
  filename,
  title,
  leftLabel,
  rightLabel,
}: {
  leftUrl: string;
  rightUrl: string;
  filename: string;
  title: string;
  leftLabel: string;
  rightLabel: string;
}) {
  const [leftImg, rightImg] = await Promise.all([loadCanvasImage(leftUrl), loadCanvasImage(rightUrl)]);

  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = 1060;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  const safeCtx = ctx;

  safeCtx.fillStyle = "#f8fafc";
  safeCtx.fillRect(0, 0, canvas.width, canvas.height);

  safeCtx.fillStyle = "#0f172a";
  safeCtx.font = "800 42px Arial, sans-serif";
  safeCtx.fillText(title, 70, 72);

  const cardY = 120;
  const cardW = 800;
  const cardH = 840;
  const gap = 60;
  const leftX = 70;
  const rightX = leftX + cardW + gap;

  function drawPanel(x: number, label: string, img: HTMLImageElement) {
    safeCtx.fillStyle = "#ffffff";
    safeCtx.strokeStyle = "#dbe3ef";
    safeCtx.lineWidth = 4;
    safeCtx.beginPath();
    safeCtx.roundRect(x, cardY, cardW, cardH, 30);
    safeCtx.fill();
    safeCtx.stroke();

    safeCtx.fillStyle = "#334155";
    safeCtx.font = "800 34px Arial, sans-serif";
    safeCtx.fillText(label, x + 34, cardY + 56);

    safeCtx.fillStyle = "#f1f5f9";
    safeCtx.beginPath();
    safeCtx.roundRect(x + 34, cardY + 90, cardW - 68, cardH - 130, 24);
    safeCtx.fill();

    drawImageContain(safeCtx, img, x + 34, cardY + 90, cardW - 68, cardH - 130);
  }

  drawPanel(leftX, leftLabel, leftImg);
  drawPanel(rightX, rightLabel, rightImg);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create comparison image"))), "image/png", 0.95);
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function StitchedComparisonCard({
  title,
  badge,
  leftLabel,
  rightLabel,
  left,
  right,
  outputFilename,
  onPreview,
  selectable = false,
  selected = false,
  onToggleSelected,
}: {
  title: string;
  badge: string;
  leftLabel: string;
  rightLabel: string;
  left: LibraryImage;
  right: LibraryImage;
  outputFilename: string;
  onPreview: (img: PreviewImage) => void;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelected?: () => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const leftUrl = fullImageUrl(left.url);
  const rightUrl = fullImageUrl(right.url);
  const leftThumbUrl = fullImageUrl(left.thumb_url || left.url);
  const rightThumbUrl = fullImageUrl(right.thumb_url || right.url);

  async function handleDownload() {
    if (!leftUrl || !rightUrl) return;
    setDownloading(true);
    try {
      await downloadStitchedComparison({
        leftUrl,
        rightUrl,
        filename: outputFilename,
        title,
        leftLabel,
        rightLabel,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not download stitched comparison");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div style={{ ...comparisonSectionBox, borderColor: selected ? "#4f46e5" : "#e2e8f0", boxShadow: selected ? "0 0 0 3px rgba(79,70,229,0.12)" : "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {selectable && (
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 950, color: "#334155", cursor: "pointer", flexShrink: 0 }}>
              <input
                type="checkbox"
                checked={selected}
                onChange={onToggleSelected}
                style={{ width: 18, height: 18, accentColor: "#4f46e5" }}
              />
              Select
            </label>
          )}
          <div style={{ fontWeight: 950, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={matchedPill}>{badge}</div>
          <button type="button" onClick={handleDownload} disabled={downloading} style={miniDarkButton(downloading)}>
            {downloading ? "Creating..." : "Download stitched file"}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onPreview({ title: `${title} stitched comparison`, url: rightUrl, filename: outputFilename })}
        style={{
          width: "100%",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          background: "white",
          padding: 12,
          cursor: "zoom-in",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          overflow: "hidden",
        }}
      >
        <div>
          <div style={{ marginBottom: 8, fontWeight: 950, color: "#334155", textAlign: "left" }}>{leftLabel}</div>
          <img src={leftThumbUrl} alt={left.filename} style={{ width: "100%", height: 230, objectFit: "contain", background: "#f8fafc", borderRadius: 14, display: "block" }} />
        </div>
        <div>
          <div style={{ marginBottom: 8, fontWeight: 950, color: "#334155", textAlign: "left" }}>{rightLabel}</div>
          <img src={rightThumbUrl} alt={right.filename} style={{ width: "100%", height: 230, objectFit: "contain", background: "#f8fafc", borderRadius: 14, display: "block" }} />
        </div>
      </button>
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
  const thumbUrl = fullImageUrl(image?.thumb_url || image?.url);

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
          <img src={thumbUrl} alt={image.filename} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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


function workspaceButton(active: boolean): React.CSSProperties {
  return {
    border: active ? "1px solid #4f46e5" : "1px solid transparent",
    background: active ? "#eef2ff" : "transparent",
    color: active ? "#3730a3" : "#475569",
    borderRadius: 16,
    padding: "11px 14px",
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: active ? "0 8px 18px rgba(79,70,229,0.12)" : "none",
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
  border: "1px solid rgba(255,255,255,0.14)",
  background: "#ffffff",
  color: "#000000",
  WebkitTextFillColor: "#000000",
  fontSize: 15,
  fontWeight: 700,
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
