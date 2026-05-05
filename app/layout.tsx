import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Delivery Ignite – Restaurant Image Upgrades",
  description:
    "Turn low-quality Uber Eats photos into premium, high-converting images. Get 3 free samples.",

  openGraph: {
    title: "Delivery Ignite",
    description: "Make your menu look worth ordering.",
    url: "https://deliveryignite.com",
    siteName: "Delivery Ignite",
    images: [
      {
        url: "/images/og-preview.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_AU",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Delivery Ignite",
    description: "Make your menu look worth ordering.",
    images: ["/images/og-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
