"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  Check,
  ChevronRight,
  Download,
  ImagePlus,
  LayoutGrid,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Store,
  UploadCloud,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

type Mode = "managed" | "diy";

const pricing = {
  diy: [
    {
      name: "Starter DIY",
      price: "$499",
      subtitle: "Up to 20 images",
      description: "We enhance your menu images and deliver upload-ready files.",
      features: ["Premium image enhancement", "Ready-to-upload files", "Consistent restaurant style", "Use anywhere, no restrictions"],
      cta: "Start with DIY",
      highlighted: false,
    },
    {
      name: "Standard DIY",
      price: "$799",
      subtitle: "Up to 50 images",
      description: "Best for restaurants upgrading most of their existing menu visuals.",
      features: ["Premium image enhancement", "Ready-to-upload files", "Larger menu coverage", "Use anywhere, no restrictions"],
      cta: "Choose Standard DIY",
      highlighted: true,
      badge: "Best DIY Value",
    },
  ],
  managed: [
    {
      name: "Starter Managed",
      price: "$899",
      subtitle: "Up to 20 items",
      description: "We upgrade your visuals and update your Uber Eats images for you.",
      features: ["Image enhancement", "Drinks handled", "Header banners included", "Uber Eats image upload", "Priority service"],
      cta: "Choose Starter Managed",
      highlighted: false,
    },
    {
      name: "Standard Managed",
      price: "$1,299",
      subtitle: "Up to 50 items",
      description: "The complete done-for-you visual upgrade for serious restaurants.",
      features: ["Image enhancement", "Drinks handled", "Header banners included", "Uber Eats image upload", "Priority service"],
      cta: "Choose Standard Managed",
      highlighted: true,
      badge: "Most Popular",
    },
  ],
};

function Button({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "secondary" | "dark" }) {
  const styles = {
    primary: "bg-[#06C167] text-black hover:bg-[#05ad5c]",
    secondary: "bg-white text-black border border-black/10 hover:bg-neutral-50",
    dark: "bg-black text-white hover:bg-neutral-800",
  };

  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${styles[variant]}`}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-neutral-700">
      <Check className="mt-1 h-4 w-4 shrink-0 text-[#06C167]" />
      <span>{children}</span>
    </li>
  );
}

function PlanCard({ plan }: { plan: any }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      className={`relative rounded-[28px] border bg-white p-7 shadow-sm transition ${
        plan.highlighted ? "border-black shadow-[0_18px_60px_rgba(0,0,0,0.12)]" : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      {plan.badge && (
        <div className="absolute right-5 top-5 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
          {plan.badge}
        </div>
      )}

      <div className={`mb-7 flex h-12 w-12 items-center justify-center rounded-2xl ${plan.highlighted ? "bg-black text-white" : "bg-neutral-100 text-black"}`}>
        {plan.highlighted ? <Sparkles className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
      </div>

      <h3 className="text-2xl font-semibold tracking-tight text-black">{plan.name}</h3>
      <p className="mt-3 min-h-[48px] text-sm leading-6 text-neutral-600">{plan.description}</p>

      <div className="mt-7 flex items-end gap-2">
        <span className="text-5xl font-semibold tracking-tight text-black">{plan.price}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-neutral-500">{plan.subtitle}</p>

      <div className="mt-7">
        <Button variant={plan.highlighted ? "dark" : "secondary"}>{plan.cta}</Button>
      </div>

      <div className="mt-7 h-px bg-neutral-100" />

      <ul className="mt-7 space-y-3">
        {plan.features.map((feature: string) => (
          <CheckItem key={feature}>{feature}</CheckItem>
        ))}
      </ul>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="text-3xl font-semibold tracking-tight text-black">{value}</div>
      <div className="mt-2 text-sm text-neutral-500">{label}</div>
    </div>
  );
}

export default function PremiumPricingPage() {
  const [mode, setMode] = useState<Mode>("managed");

  return (
    <main className="min-h-screen bg-[#F7F7F4] text-black">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F7F7F4]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">Delivery Ignite</div>
              <div className="text-xs text-neutral-500">Restaurant image upgrades</div>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-medium text-neutral-600 md:flex">
            <a href="#samples" className="hover:text-black">Free sample</a>
            <a href="#pricing" className="hover:text-black">Pricing</a>
            <a href="#updates" className="hover:text-black">Updates</a>
          </nav>

          <Button variant="dark">Get Free Sample</Button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute right-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#06C167]/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-28">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm">
              <Zap className="h-4 w-4 text-[#06C167]" />
              Free 3 image preview available
            </div>

            <h1 className="mt-7 max-w-2xl text-6xl font-semibold tracking-[-0.07em] text-black sm:text-7xl lg:text-8xl">
              Make your menu look worth ordering.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-600">
              Premium food image upgrades for restaurants on Uber Eats and beyond. We can deliver the files, or handle the Uber image upload for you.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button>Get Free Sample</Button>
              <Button variant="secondary">View Pricing</Button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <Metric label="Free sample" value="3" />
              <Metric label="Starter from" value="$499" />
              <Metric label="Managed from" value="$899" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-[36px] border border-black/10 bg-white p-4 shadow-[0_30px_90px_rgba(0,0,0,0.14)]">
              <div className="overflow-hidden rounded-[28px] bg-black">
                <div className="grid grid-cols-2">
                  <div className="p-5">
                    <div className="mb-3 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/80 w-fit">Before</div>
                    <div className="h-72 rounded-3xl bg-gradient-to-br from-neutral-600 via-neutral-800 to-black opacity-70" />
                    <p className="mt-4 text-xs leading-5 text-white/55">Flat lighting, inconsistent framing, low appetite appeal.</p>
                  </div>
                  <div className="bg-[#111] p-5">
                    <div className="mb-3 rounded-full bg-[#06C167] px-3 py-1 text-xs font-bold text-black w-fit">After</div>
                    <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-[#06C167]/20 via-orange-400/40 to-black">
                      <div className="absolute inset-x-8 bottom-8 h-32 rounded-full bg-orange-300/60 blur-2xl" />
                      <div className="absolute bottom-7 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full border-[18px] border-orange-300 bg-red-700 shadow-2xl" />
                    </div>
                    <p className="mt-4 text-xs leading-5 text-white/70">Premium style, stronger texture, platform-ready presentation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 hidden rounded-3xl border border-black/10 bg-white p-5 shadow-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#06C167]/15 text-[#06C167]">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold">Client owns all images</div>
                  <div className="text-xs text-neutral-500">Use anywhere, no restrictions</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="samples" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[36px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.18)] sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                Free proof of value
              </div>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">We enhance 3 images first.</h2>
              <p className="mt-5 text-base leading-7 text-white/65">
                Show the improvement before they pay. Send restaurants a watermarked preview and let the quality do the selling.
              </p>
              <div className="mt-8">
                <Button>Request Free Sample</Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {["Original", "Enhanced", "Watermarked"].map((label, i) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                  <div className={`h-48 rounded-2xl ${i === 0 ? "bg-neutral-700" : i === 1 ? "bg-gradient-to-br from-orange-300 via-red-500 to-black" : "bg-gradient-to-br from-[#06C167] via-orange-400 to-black"}`} />
                  <div className="mt-4 text-sm font-semibold">{label}</div>
                  <div className="mt-1 text-xs text-white/45">Sample preview</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Pricing</div>
          <h2 className="mt-6 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">Choose your level of involvement.</h2>
          <p className="mt-5 text-lg leading-8 text-neutral-600">DIY if you want the files. Managed if you want us to handle the Uber Eats image upgrade for you.</p>
        </div>

        <div className="mx-auto mt-10 flex w-fit rounded-full border border-black/10 bg-white p-1 shadow-sm">
          <button
            onClick={() => setMode("diy")}
            className={`rounded-full px-7 py-3 text-sm font-bold transition ${mode === "diy" ? "bg-black text-white" : "text-neutral-500 hover:text-black"}`}
          >
            DIY
          </button>
          <button
            onClick={() => setMode("managed")}
            className={`rounded-full px-7 py-3 text-sm font-bold transition ${mode === "managed" ? "bg-[#06C167] text-black" : "text-neutral-500 hover:text-black"}`}
          >
            Managed
          </button>
        </div>

        <motion.div
          key={mode}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.12 }}
          className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2"
        >
          {pricing[mode].map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </motion.div>

        <div className="mx-auto mt-7 grid max-w-5xl gap-4 md:grid-cols-3">
          <div className="rounded-[26px] border border-neutral-200 bg-white p-6 shadow-sm">
            <LayoutGrid className="h-6 w-6 text-[#06C167]" />
            <h3 className="mt-5 font-bold">Large menus</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Contact us for bulk or custom pricing.</p>
          </div>
          <div className="rounded-[26px] border border-neutral-200 bg-white p-6 shadow-sm">
            <PackageCheck className="h-6 w-6 text-[#06C167]" />
            <h3 className="mt-5 font-bold">DIY add-ons</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Drinks Pack $99. Header Pack $99.</p>
          </div>
          <div className="rounded-[26px] border border-neutral-200 bg-white p-6 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-[#06C167]" />
            <h3 className="mt-5 font-bold">Managed includes more</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Headers, drinks, Uber upload, and priority service are included.</p>
          </div>
        </div>
      </section>

      <section id="updates" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[34px] border border-black bg-white p-8 shadow-[0_25px_80px_rgba(0,0,0,0.10)]">
            <div className="inline-flex rounded-full bg-[#06C167]/15 px-4 py-2 text-sm font-bold text-black">Managed only</div>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em]">Menu Updates Plan</h2>
            <p className="mt-4 text-neutral-600">Keep your menu fresh as you add new dishes. Managed clients receive priority updates.</p>
            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-semibold">$149</span>
              <span className="pb-2 text-neutral-500">/ month</span>
            </div>
            <ul className="mt-8 space-y-3">
              <CheckItem>Up to 10 new items per month</CheckItem>
              <CheckItem>Image enhancement included</CheckItem>
              <CheckItem>Uber Eats updates handled for you</CheckItem>
              <CheckItem>Priority service</CheckItem>
            </ul>
            <div className="mt-8">
              <Button>Add Updates Plan</Button>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[34px] border border-neutral-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-semibold tracking-tight">Completion Packs</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">Available after purchasing a Starter or Standard package to finish remaining menu items.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-neutral-50 p-6">
                  <div className="text-3xl font-semibold">$199</div>
                  <div className="mt-1 text-sm text-neutral-500">Up to 10 items</div>
                </div>
                <div className="rounded-3xl bg-neutral-50 p-6">
                  <div className="text-3xl font-semibold">$349</div>
                  <div className="mt-1 text-sm text-neutral-500">Up to 20 items</div>
                </div>
              </div>
            </div>

            <div className="rounded-[34px] border border-neutral-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">Multi-location restaurants</h3>
                  <p className="mt-1 text-sm text-neutral-600">Custom pricing for franchises and groups.</p>
                </div>
              </div>
              <div className="mt-7">
                <Button variant="secondary">Contact Us</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[36px] bg-black p-8 text-white sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Download className="h-9 w-9 text-[#06C167]" />
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em]">You own every image.</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
                All completed images are yours to use across delivery platforms, your website, social media, menus, and future campaigns. No restrictions.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Uber Eats", "DoorDash", "Website", "Social Media", "Print Menus", "Franchise Assets"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <BadgeCheck className="h-5 w-5 text-[#06C167]" />
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:px-10">
        <div className="rounded-[36px] border border-neutral-200 bg-white p-10 shadow-[0_25px_90px_rgba(0,0,0,0.08)] sm:p-14">
          <Camera className="mx-auto h-10 w-10 text-[#06C167]" />
          <h2 className="mt-6 text-5xl font-semibold tracking-[-0.06em]">Start with 3 free images.</h2>
          <p className="mx-auto mt-5 max-w-xl text-neutral-600">We’ll show the upgrade before you commit. Watermarked samples. No pressure.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button>Get Free Sample</Button>
            <Button variant="secondary">Contact Us</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 px-5 py-8 text-center text-sm text-neutral-500 sm:px-8 lg:px-10">
        Delivery Ignite — premium restaurant visual upgrades.
      </footer>
    </main>
  );
}
