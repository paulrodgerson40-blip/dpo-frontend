"use client";

import { useEffect, useMemo, useState } from "react";

type Restaurant = {
  slug: string;
  name: string;
};

type LibraryImage = {
  name: string;
  url: string;
};

export default function Home() {
  const [mode, setMode] = useState<"new" | "existing">("existing");

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  const [menuImages, setMenuImages] = useState<LibraryImage[]>([]);
  const [originalImages, setOriginalImages] = useState<LibraryImage[]>([]);
  const [headerImages, setHeaderImages] = useState<LibraryImage[]>([]);

  const [status, setStatus] = useState("Ready");

  // 🔥 LOAD RESTAURANTS
  useEffect(() => {
    fetch("/api/dpo/restaurants")
      .then((r) => r.json())
      .then((data) => {
        setRestaurants(data.restaurants || []);
      });
  }, []);

  // 🔥 LOAD LIBRARY WHEN SELECTED
  useEffect(() => {
    if (!selectedRestaurant) return;

    fetch(`/api/dpo/restaurants/${selectedRestaurant}/images`)
      .then((r) => r.json())
      .then((data) => {
        const f = data.folders || {};

        setOriginalImages(f.originals || []);
        setMenuImages(f.approved || []);
        setHeaderImages(f.headers || []);
      })
      .catch(() => {
        setOriginalImages([]);
        setMenuImages([]);
        setHeaderImages([]);
      });
  }, [selectedRestaurant]);

  const hasRestaurant = !!selectedRestaurant;

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Restaurant Image Library</h1>

      {/* MODE */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setMode("new")}>New</button>
        <button onClick={() => setMode("existing")}>Existing</button>
      </div>

      {/* DROPDOWN */}
      {mode === "existing" && (
        <select
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
        >
          <option value="">Select restaurant</option>
          {restaurants.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>
      )}

      <h2 style={{ marginTop: 30 }}>
        {hasRestaurant ? selectedRestaurant : "No restaurant selected"}
      </h2>

      {/* MENU */}
      <Section title="Menu Images" images={menuImages} />

      {/* ORIGINALS */}
      <Section title="Originals" images={originalImages} />

      {/* HEADERS */}
      <Section title="Headers" images={headerImages} />

      <div style={{ marginTop: 30 }}>{status}</div>
    </main>
  );
}

function Section({
  title,
  images,
}: {
  title: string;
  images: LibraryImage[];
}) {
  return (
    <div style={{ marginTop: 30 }}>
      <h3>{title}</h3>

      {images.length === 0 ? (
        <div>No images</div>
      ) : (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {images.map((img) => (
            <img
              key={img.url}
              src={`https://170.64.209.149.sslip.io${img.url}`}
              style={{ width: 120, height: 120, objectFit: "cover" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
