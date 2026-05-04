"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-black text-white ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="h-full w-full">
        <rect width="48" height="48" rx="14" fill="#000000" />
        <path
          d="M24 10C26.7 18.2 29.8 21.3 38 24C29.8 26.7 26.7 29.8 24 38C21.3 29.8 18.2 26.7 10 24C18.2 21.3 21.3 18.2 24 10Z"
          fill="white"
        />
        <path
          d="M35 8C36.1 11.2 37.8 12.9 41 14C37.8 15.1 36.1 16.8 35 20C33.9 16.8 32.2 15.1 29 14C32.2 12.9 33.9 11.2 35 8Z"
          fill="#06C167"
        />
      </svg>
    </div>
  );
}

function BrandLockup({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark className="h-10 w-10" />
      <div>
        <div className={`text-sm font-black tracking-tight ${dark ? "text-white" : "text-black"}`}>
          Delivery Ignite
        </div>
        <div className={`text-xs ${dark ? "text-white/55" : "text-neutral-500"}`}>
          Restaurant image upgrades
        </div>
      </div>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-neutral-700">
      <span className="mt-1 shrink-0 text-[#06C167]">✓</span>
      <span>{children}</span>
    </li>
  );
}


type DrinkAsset = {
  filename: string;
  url: string;
  size?: number;
};

type DrinksPayload = {
  ok: boolean;
  originals: DrinkAsset[];
  enhanced: DrinkAsset[];
};

const DPO_API_BASE =
  process.env.NEXT_PUBLIC_DPO_API_BASE || "https://170.64.209.149.sslip.io";

function assetUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${DPO_API_BASE}${url}`;
}

function formatBytes(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toggleSetValue(set: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) {
  set((prev) => {
    const next = new Set(prev);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  });
}

function DrinksGrid({
  title,
  subtitle,
  assets,
  selected,
  onToggle,
  emptyText,
}: {
  title: string;
  subtitle: string;
  assets: DrinkAsset[];
  selected: Set<string>;
  onToggle: (filename: string) => void;
  emptyText: string;
}) {
  return (
    <div className="rounded-[30px] border border-black/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-xl font-black tracking-tight">{title}</h3>
          <p className="mt-1 text-xs font-medium text-neutral-500">{subtitle}</p>
        </div>
        <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-700">
          {selected.size}/{assets.length} selected
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="flex h-56 items-center justify-center rounded-3xl border border-dashed border-black/10 bg-neutral-50 text-sm font-semibold text-neutral-400">
          {emptyText}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => {
            const isSelected = selected.has(asset.filename);
            return (
              <button
                key={asset.filename}
                type="button"
                onClick={() => onToggle(asset.filename)}
                className={`group relative overflow-hidden rounded-3xl border bg-neutral-50 text-left transition ${
                  isSelected
                    ? "border-[#06C167] ring-4 ring-[#06C167]/20"
                    : "border-black/10 hover:border-black/30"
                }`}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                  <img
                    src={assetUrl(asset.url)}
                    alt={asset.filename}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div
                    className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-black shadow-sm ${
                      isSelected
                        ? "border-[#06C167] bg-[#06C167] text-black"
                        : "border-white/70 bg-black/45 text-white backdrop-blur"
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </div>
                </div>
                <div className="p-3">
                  <div className="truncate text-xs font-black text-neutral-800">{asset.filename}</div>
                  <div className="mt-1 text-[11px] font-semibold text-neutral-400">{formatBytes(asset.size)}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DrinksLibraryPanel() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [originals, setOriginals] = useState<DrinkAsset[]>([]);
  const [enhanced, setEnhanced] = useState<DrinkAsset[]>([]);
  const [selectedOriginals, setSelectedOriginals] = useState<Set<string>>(new Set());
  const [selectedEnhanced, setSelectedEnhanced] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Ready");

  const selectedOriginalList = useMemo(() => Array.from(selectedOriginals), [selectedOriginals]);
  const selectedEnhancedList = useMemo(() => Array.from(selectedEnhanced), [selectedEnhanced]);

  async function loadDrinks() {
    const res = await fetch(`${DPO_API_BASE}/api/dpo/drinks`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load drinks: ${res.status}`);
    const data = (await res.json()) as DrinksPayload;
    setOriginals(data.originals || []);
    setEnhanced(data.enhanced || []);
  }

  useEffect(() => {
    loadDrinks().catch((err) => setMessage(err.message || "Failed to load drinks"));
  }, []);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setMessage(`Uploading ${files.length} drink image${files.length === 1 ? "" : "s"}...`);
    try {
      const form = new FormData();
      Array.from(files).forEach((file) => form.append("files", file));
      const res = await fetch(`${DPO_API_BASE}/api/dpo/drinks/upload`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      await loadDrinks();
      setMessage("Drink originals uploaded.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setMessage(err?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function enhanceSelected() {
    if (selectedOriginalList.length === 0) return setMessage("Select original drinks to enhance first.");
    setBusy(true);
    setMessage(`Enhancing ${selectedOriginalList.length} selected drink image${selectedOriginalList.length === 1 ? "" : "s"}...`);
    try {
      const res = await fetch(`${DPO_API_BASE}/api/dpo/drinks/enhance-selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: selectedOriginalList }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      await loadDrinks();
      setSelectedOriginals(new Set());
      setMessage(`Enhanced ${data.processed?.length || 0} drink image${(data.processed?.length || 0) === 1 ? "" : "s"}.`);
    } catch (err: any) {
      setMessage(err?.message || "Enhance failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteSelected(folder: "originals" | "enhanced") {
    const files = folder === "originals" ? selectedOriginalList : selectedEnhancedList;
    if (files.length === 0) return setMessage(`Select ${folder} drinks to delete first.`);
    setBusy(true);
    setMessage(`Deleting ${files.length} ${folder} drink image${files.length === 1 ? "" : "s"}...`);
    try {
      const res = await fetch(`${DPO_API_BASE}/api/dpo/drinks/delete-selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder, files }),
      });
      if (!res.ok) throw new Error(await res.text());
      await loadDrinks();
      if (folder === "originals") setSelectedOriginals(new Set());
      else setSelectedEnhanced(new Set());
      setMessage("Selected drink files deleted.");
    } catch (err: any) {
      setMessage(err?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function downloadSelected(folder: "originals" | "enhanced") {
    const files = folder === "originals" ? selectedOriginalList : selectedEnhancedList;
    if (files.length === 0) return setMessage(`Select ${folder} drinks to download first.`);
    setBusy(true);
    setMessage(`Preparing ${folder} drink ZIP...`);
    try {
      const res = await fetch(`${DPO_API_BASE}/api/dpo/drinks/download-selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder, files }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `drinks_${folder}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMessage("Download started.");
    } catch (err: any) {
      setMessage(err?.message || "Download failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="drinks-library" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="overflow-hidden rounded-[34px] border border-black bg-white shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
        <div className="grid gap-6 bg-black p-7 text-white lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full bg-[#06C167] px-4 py-2 text-xs font-black text-black">
              Global Drinks Library
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.06em]">
              Upload drinks once. Enhance, download, delete anytime.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
              This is separate from restaurant folders. Use it to grow a reusable beverage asset library across all jobs.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
                className="rounded-full bg-[#06C167] px-5 py-3 text-sm font-black text-black transition hover:bg-[#05ad5c] disabled:opacity-50"
              >
                Upload Drinks
              </button>
              <button
                type="button"
                onClick={enhanceSelected}
                disabled={busy || selectedOriginals.size === 0}
                className="rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-neutral-100 disabled:opacity-40"
              >
                Enhance Selected
              </button>
              <button
                type="button"
                onClick={() => downloadSelected("enhanced")}
                disabled={busy || selectedEnhanced.size === 0}
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10 disabled:opacity-40"
              >
                Download Enhanced
              </button>
              <button
                type="button"
                onClick={() => loadDrinks().then(() => setMessage("Refreshed."))}
                disabled={busy}
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10 disabled:opacity-40"
              >
                Refresh
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={(event) => uploadFiles(event.target.files)}
            />
            <div className="mt-4 rounded-2xl bg-black/30 px-4 py-3 text-xs font-semibold text-white/65">
              Status: <span className="text-white">{busy ? "Working... " : ""}{message}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedOriginals(new Set(originals.map((x) => x.filename)))}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black"
              >
                Select all originals
              </button>
              <button
                type="button"
                onClick={() => setSelectedOriginals(new Set())}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black"
              >
                Clear originals
              </button>
              <button
                type="button"
                onClick={() => downloadSelected("originals")}
                disabled={busy || selectedOriginals.size === 0}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black disabled:opacity-40"
              >
                Download originals
              </button>
              <button
                type="button"
                onClick={() => deleteSelected("originals")}
                disabled={busy || selectedOriginals.size === 0}
                className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600 disabled:opacity-40"
              >
                Delete originals
              </button>
            </div>
            <DrinksGrid
              title="Original Drinks"
              subtitle="Raw drink images waiting for enhancement"
              assets={originals}
              selected={selectedOriginals}
              onToggle={(filename) => toggleSetValue(setSelectedOriginals, filename)}
              emptyText="No original drinks uploaded yet"
            />
          </div>

          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedEnhanced(new Set(enhanced.map((x) => x.filename)))}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black"
              >
                Select all enhanced
              </button>
              <button
                type="button"
                onClick={() => setSelectedEnhanced(new Set())}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black"
              >
                Clear enhanced
              </button>
              <button
                type="button"
                onClick={() => downloadSelected("enhanced")}
                disabled={busy || selectedEnhanced.size === 0}
                className="rounded-full bg-black px-4 py-2 text-xs font-black text-white disabled:opacity-40"
              >
                Download enhanced
              </button>
              <button
                type="button"
                onClick={() => deleteSelected("enhanced")}
                disabled={busy || selectedEnhanced.size === 0}
                className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600 disabled:opacity-40"
              >
                Delete enhanced
              </button>
            </div>
            <DrinksGrid
              title="Enhanced Drinks"
              subtitle="Finished beverage images ready to download"
              assets={enhanced}
              selected={selectedEnhanced}
              onToggle={(filename) => toggleSetValue(setSelectedEnhanced, filename)}
              emptyText="No enhanced drinks yet"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PremiumPricingPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F4] text-black">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F7F7F4]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <BrandLockup />

          <nav className="hidden items-center gap-8 text-sm font-semibold text-neutral-600 md:flex">
            <a href="#drinks-library" className="hover:text-black">Drinks</a>
            <a href="#sample" className="hover:text-black">Free sample</a>
            <a href="#proof" className="hover:text-black">Proof</a>
            <a href="#pricing" className="hover:text-black">Pricing</a>
            <a href="#updates" className="hover:text-black">Updates</a>
          </nav>

          <a
            href="#sample"
            className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            Get Free Sample →
          </a>
        </div>
      </header>

      <DrinksLibraryPanel />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute right-[-10rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#06C167]/12 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-[-14rem] h-[30rem] w-[30rem] rounded-full bg-black/5 blur-3xl" />

        {/* subtle brand watermark */}
        <div className="pointer-events-none absolute right-[8%] top-24 hidden opacity-[0.035] lg:block">
          <LogoMark className="h-52 w-52 rounded-[48px]" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">
              <span className="text-[#06C167]">●</span>
              Free 3 image preview available
            </div>

            <div className="mt-7 flex items-center gap-3">
              <LogoMark className="h-8 w-8 rounded-lg" />
              <span className="text-sm font-black tracking-tight text-neutral-700">
                Delivery Ignite
              </span>
            </div>

            <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">
              Make your menu look worth ordering.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600">
              Premium food image upgrades for restaurants. Use the files yourself,
              or let us update your Uber Eats visuals for you.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#sample" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06C167] px-7 py-4 text-sm font-black text-black shadow-[0_10px_30px_rgba(6,193,103,0.25)] transition hover:bg-[#05ad5c]">
                Get Free Sample →
              </a>
              <a href="#pricing" className="rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-black text-black transition hover:bg-neutral-50">
                View Pricing →
              </a>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="text-3xl font-black tracking-tight">3</div>
                <div className="mt-1 text-xs font-medium text-neutral-500">Free sample</div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="text-3xl font-black tracking-tight">$499</div>
                <div className="mt-1 text-xs font-medium text-neutral-500">DIY from</div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="text-3xl font-black tracking-tight">$899</div>
                <div className="mt-1 text-xs font-medium text-neutral-500">Managed from</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[34px] border border-black/10 bg-white p-3 shadow-[0_30px_100px_rgba(0,0,0,0.16)]">
              <div className="relative overflow-hidden rounded-[28px] bg-black p-4">
                <div className="absolute right-4 top-4 z-10 opacity-80">
                  <LogoMark className="h-8 w-8 rounded-lg" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">Before</div>
                    <div className="relative h-56 w-full overflow-hidden rounded-[22px] bg-neutral-800">
                      <Image
                        src="/images/dish-before.png"
                        alt="Garlic bread before image enhancement"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-white/50">Flat lighting, inconsistent framing, low appetite appeal.</p>
                  </div>
                  <div>
                    <div className="mb-2 w-fit rounded-full bg-[#06C167] px-3 py-1 text-xs font-black text-black">After</div>
                    <div className="relative h-56 w-full overflow-hidden rounded-[22px] bg-black">
                      <Image
                        src="/images/dish-after.png"
                        alt="Garlic bread after image enhancement"
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute bottom-3 right-3 rounded-xl bg-black/65 p-1.5 backdrop-blur">
                        <LogoMark className="h-5 w-5 rounded-md" />
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-white/70">Premium style, stronger texture, platform-ready presentation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-9 left-8 hidden rounded-3xl border border-black/10 bg-white p-5 shadow-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#06C167]/15 text-[#06C167]">✓</div>
                <div>
                  <div className="text-sm font-black">You own every image</div>
                  <div className="text-xs text-neutral-500">Use anywhere. No restrictions.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* FULL MENU BEFORE / AFTER */}
      <section id="proof" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">
            Full menu proof
          </div>
          <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-5xl">
            One good image helps. A consistent menu changes everything.
          </h2>
          <p className="mt-4 text-base leading-7 text-neutral-600">
            The biggest impact is not one hero shot — it is making the whole menu feel clean,
            premium, and worth ordering from.
          </p>
        </div>

        <div className="mt-10 grid gap-7 lg:grid-cols-2">
          <div className="rounded-[36px] border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-4 w-fit rounded-full bg-neutral-100 px-4 py-2 text-sm font-black">Before</div>
            <div className="relative h-[430px] w-full overflow-hidden rounded-[24px] bg-white">
              <Image
                src="/images/menu-before.png"
                alt="Full menu before image upgrade"
                fill
                className="object-contain scale-[1.16]"
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              Inconsistent lighting, random angles, low quality photos, and no visual brand consistency.
            </p>
          </div>

          <div className="rounded-[36px] border border-black bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
            <div className="mb-4 w-fit rounded-full bg-[#06C167] px-4 py-2 text-sm font-black text-black">After</div>
            <div className="relative h-[430px] w-full overflow-hidden rounded-[24px] bg-white">
              <Image
                src="/images/menu-after.png"
                alt="Full menu after image upgrade"
                fill
                className="object-contain scale-[1.16]"
              />
              <div className="absolute bottom-4 right-4 rounded-xl bg-white/85 p-2 shadow-sm backdrop-blur">
                <LogoMark className="h-6 w-6 rounded-lg" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              Consistent image style, stronger appetite appeal, cleaner presentation, and a more premium store presence.
            </p>
          </div>
        </div>
      </section>




      {/* HEADER BEFORE / AFTER */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">
              Header upgrade
            </div>
            <h2 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.06em]">
              Your storefront banner should sell the restaurant instantly.
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-600">
              Headers are often the first thing customers see. We create premium visual headers
              that make the store feel more established and more appetising.
            </p>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[30px] border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="mb-2 w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-black">Before header</div>
              <div className="relative h-60 w-full overflow-hidden rounded-[22px] bg-white">
                <Image
                  src="/images/header-before.png"
                  alt="Header before image upgrade"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="rounded-[30px] border border-black bg-white p-4 shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
              <div className="mb-2 w-fit rounded-full bg-[#06C167] px-3 py-1 text-xs font-black text-black">After header</div>
              <div className="relative h-60 w-full overflow-hidden rounded-[22px] bg-black">
                <Image
                  src="/images/header-after.png"
                  alt="Header after image upgrade"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 right-4 rounded-xl bg-black/65 p-2 backdrop-blur">
                  <LogoMark className="h-6 w-6 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* FREE SAMPLE SECTION */}
      <section id="sample" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:p-10">
          <div className="absolute right-8 top-8 opacity-70">
            <LogoMark className="h-10 w-10" />
          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 opacity-[0.08]">
            <LogoMark className="h-56 w-56 rounded-[48px]" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold">Free proof of value</div>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                See the upgrade before you pay.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/65">
                We enhance 3 of your images and send a watermarked preview. If you like it, we continue.
              </p>
              <div className="mt-8">
                <a href="#pricing" className="inline-flex rounded-full bg-[#06C167] px-6 py-3 text-sm font-black text-black">
                  Request Free Sample →
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-neutral-800">
                  <Image
                    src="/images/sample-original.png"
                    alt="Original sample image"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 text-sm font-bold">Original</div>
                <div className="mt-1 text-xs text-white/45">Current menu photo</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-black">
                  <Image
                    src="/images/sample-enhanced.png"
                    alt="Enhanced sample image"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 right-3 rounded-xl bg-black/65 p-1.5 backdrop-blur">
                    <LogoMark className="h-5 w-5 rounded-md" />
                  </div>
                </div>
                <div className="mt-4 text-sm font-bold">Enhanced</div>
                <div className="mt-1 text-xs text-white/45">Premium upgrade</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-black">
                  <Image
                    src="/images/sample-watermarked.png"
                    alt="Watermarked preview sample image"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div className="rounded-full border border-white/25 bg-black/45 px-4 py-2 text-xs font-black tracking-[0.2em] text-white/90 backdrop-blur">
                      PREVIEW
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm font-bold">Preview</div>
                <div className="mt-1 text-xs text-white/45">Free preview</div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">Pricing</div>
          <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-5xl">
            DIY or Managed. See both clearly.
          </h2>
          <p className="mt-4 text-base leading-7 text-neutral-600">
            No confusing switch. Choose files only, or let us handle the Uber image upload for you.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          <div className="rounded-[26px] border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-bold tracking-tight">Starter DIY</h3>
            <p className="mt-3 min-h-[48px] text-sm leading-6 text-neutral-600">
              We enhance your images and deliver upload-ready files.
            </p>
            <div className="mt-6 text-4xl font-black tracking-tight">$499</div>
            <div className="mt-2 text-sm font-semibold text-neutral-500">Up to 20 images</div>
            <button className="mt-6 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black">Start DIY →</button>
            <div className="my-6 h-px bg-neutral-100" />
            <ul className="space-y-3">
              <CheckItem>Premium image enhancement</CheckItem>
              <CheckItem>Ready-to-upload files</CheckItem>
              <CheckItem>Use anywhere, no restrictions</CheckItem>
              <CheckItem>Client uploads images</CheckItem>
            </ul>
          </div>

          <div className="rounded-[26px] border border-neutral-300 bg-white p-6 shadow-sm">
            <div className="mb-4 w-fit rounded-full bg-black px-3 py-1 text-xs font-black text-white">Best DIY</div>
            <h3 className="text-2xl font-bold tracking-tight">Standard DIY</h3>
            <p className="mt-3 min-h-[48px] text-sm leading-6 text-neutral-600">
              For restaurants upgrading most of their menu visuals.
            </p>
            <div className="mt-6 text-4xl font-black tracking-tight">$799</div>
            <div className="mt-2 text-sm font-semibold text-neutral-500">Up to 50 images</div>
            <button className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-black text-white">Choose Standard DIY →</button>
            <div className="my-6 h-px bg-neutral-100" />
            <ul className="space-y-3">
              <CheckItem>Premium image enhancement</CheckItem>
              <CheckItem>Ready-to-upload files</CheckItem>
              <CheckItem>Larger menu coverage</CheckItem>
              <CheckItem>Client uploads images</CheckItem>
            </ul>
          </div>

          <div className="rounded-[26px] border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-bold tracking-tight">Starter Managed</h3>
            <p className="mt-3 min-h-[48px] text-sm leading-6 text-neutral-600">
              We enhance your visuals and update your Uber Eats images.
            </p>
            <div className="mt-6 text-4xl font-black tracking-tight">$899</div>
            <div className="mt-2 text-sm font-semibold text-neutral-500">Up to 20 items</div>
            <button className="mt-6 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black">Choose Managed →</button>
            <div className="my-6 h-px bg-neutral-100" />
            <ul className="space-y-3">
              <CheckItem>Image enhancement</CheckItem>
              <CheckItem>Drinks handled</CheckItem>
              <CheckItem>Headers included</CheckItem>
              <CheckItem>Uber Eats image upload</CheckItem>
              <CheckItem>Priority service</CheckItem>
            </ul>
          </div>

          <div className="scale-[1.02] rounded-[26px] border border-black bg-black p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <div className="mb-4 w-fit rounded-full bg-[#06C167] px-3 py-1 text-xs font-black text-black">Most Popular</div>
            <h3 className="text-2xl font-bold tracking-tight">Standard Managed</h3>
            <p className="mt-3 min-h-[48px] text-sm leading-6 text-white/65">
              The full done-for-you visual upgrade for serious restaurants.
            </p>
            <div className="mt-6 text-4xl font-black tracking-tight">$1,299</div>
            <div className="mt-2 text-sm font-semibold text-white/60">Up to 50 items</div>
            <button className="mt-6 rounded-full bg-[#06C167] px-6 py-3 text-sm font-black text-black">Choose Standard Managed →</button>
            <div className="my-6 h-px bg-white/10" />
            <ul className="space-y-3">
              <li>✓ Image enhancement</li>
              <li>✓ Drinks handled</li>
              <li>✓ Headers included</li>
              <li>✓ Uber Eats image upload</li>
              <li>✓ Priority service</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="font-black">DIY add-ons</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Drinks Pack $99. Header Pack $99.</p>
          </div>
          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="font-black">Managed includes more</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Headers, drinks, Uber upload, and priority service are included.</p>
          </div>
          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="font-black">Large menus</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Contact us for bulk or custom pricing.</p>
          </div>
        </div>
      </section>




      {/* COMPARISON */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">Comparison</div>
            <h2 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-5xl">
              The difference is who does the work.
            </h2>
            <p className="mt-5 text-neutral-600">
              DIY gives you premium images. Managed gives you premium images plus Uber image upload and priority service.
            </p>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-neutral-50 text-sm font-black">
              <div className="px-4 py-3">Feature</div>
              <div className="px-4 py-3">DIY</div>
              <div className="px-4 py-3">Managed</div>
            </div>
            {[
              ["Image enhancement", "Included", "Included"],
              ["Drinks", "$99 add-on", "Included"],
              ["Header banners", "$99 add-on", "Included"],
              ["Uber Eats image upload", "You handle it", "We handle it"],
              ["Priority service", "Standard queue", "Included"],
              ["Best for", "Hands-on owners", "Busy owners"],
            ].map(([a, b, c]) => (
              <div key={a} className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-neutral-100 text-sm last:border-b-0">
                <div className="px-4 py-3 font-semibold text-neutral-800">{a}</div>
                <div className="px-4 py-3 text-neutral-600">{b}</div>
                <div className="px-4 py-3 font-semibold text-black">{c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* UPDATES + COMPLETION */}
      <section id="updates" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[30px] border border-black bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
            <div className="inline-flex rounded-full bg-[#06C167]/15 px-4 py-2 text-sm font-black">Managed only</div>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.05em]">Menu Updates Plan</h2>
            <p className="mt-4 text-neutral-600">Keep your menu current as you add new dishes. Managed clients receive priority updates.</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-black tracking-tight">$149</span>
              <span className="pb-2 text-neutral-500">/ month</span>
            </div>
            <p className="mt-2 font-bold text-[#06C167]">Cheaper than one-off updates</p>
            <ul className="mt-6 space-y-3">
              <CheckItem>Up to 10 new items per month</CheckItem>
              <CheckItem>Image enhancement included</CheckItem>
              <CheckItem>Uber Eats updates handled for you</CheckItem>
              <CheckItem>Priority service</CheckItem>
            </ul>
            <button className="mt-6 rounded-full bg-[#06C167] px-6 py-3 text-sm font-black text-black">Add Updates Plan →</button>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[30px] border border-neutral-200 bg-white p-7 shadow-sm">
              <h3 className="text-3xl font-black tracking-[-0.04em]">Finish your menu</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Completion Packs are available after purchasing a Starter or Standard package to finish remaining menu items.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-neutral-50 p-6">
                  <div className="text-4xl font-black">$199</div>
                  <div className="mt-1 text-sm text-neutral-500">Up to 10 items</div>
                </div>
                <div className="rounded-3xl bg-neutral-50 p-6">
                  <div className="text-4xl font-black">$349</div>
                  <div className="mt-1 text-sm text-neutral-500">Up to 20 items</div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-neutral-200 bg-white p-7 shadow-sm">
              <h3 className="text-2xl font-black tracking-tight">Multi-location restaurants</h3>
              <p className="mt-2 text-sm text-neutral-600">Custom pricing for franchises and groups.</p>
              <button className="mt-6 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black">Contact Us →</button>
            </div>
          </div>
        </div>
      </section>




      {/* OWNERSHIP */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white sm:p-10">
          <div className="pointer-events-none absolute -right-14 -top-14 opacity-[0.08]">
            <LogoMark className="h-52 w-52 rounded-[48px]" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <BrandLockup dark />
              <h2 className="mt-7 text-4xl font-black tracking-[-0.05em]">You own every image.</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
                Use your completed images across Uber Eats, DoorDash, your website, social media,
                print menus, and future campaigns. No restrictions.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Uber Eats", "DoorDash", "Website", "Social Media", "Print Menus", "Franchise Assets"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <span className="text-[#06C167]">✓</span>
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>




      {/* FINAL CTA */}
      <section className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-[34px] border border-neutral-200 bg-white p-9 shadow-[0_25px_90px_rgba(0,0,0,0.08)] sm:p-14">
          <div className="mx-auto flex justify-center">
            <LogoMark className="h-12 w-12 rounded-2xl" />
          </div>
          <h2 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.06em]">Start with 3 free images.</h2>
          <p className="mx-auto mt-5 max-w-xl text-neutral-600">We’ll show the upgrade before you commit. Watermarked samples. No pressure.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button className="rounded-full bg-[#06C167] px-7 py-4 text-sm font-black text-black">Get Free Sample →</button>
            <button className="rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-black text-black">Contact Us →</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-neutral-500 sm:flex-row">
          <BrandLockup />
          <div>Delivery Ignite — premium restaurant visual upgrades.</div>
        </div>
      </footer>
    </main>
  );
}
