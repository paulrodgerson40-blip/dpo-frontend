"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Download,
  ImagePlus,
  Layers,
  PackageCheck,
  Sparkles,
  Store,
  UploadCloud,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const plans = {
  diy: [
    {
      name: "Starter DIY",
      price: "$499",
      subtitle: "Up to 20 images",
      description: "We enhance your images. You download and upload them yourself.",
      features: ["Premium image enhancement", "Ready-to-upload files", "Use anywhere", "Client image ownership"],
      cta: "Start DIY",
      highlight: false,
    },
    {
      name: "Standard DIY",
      price: "$799",
      subtitle: "Up to 50 images",
      description: "For restaurants ready to upgrade most of their menu visuals.",
      features: ["Premium image enhancement", "Ready-to-upload files", "Consistent visual style", "Client image ownership"],
      cta: "Start DIY",
      highlight: true,
      badge: "Best DIY Value",
    },
  ],
  managed: [
    {
      name: "Starter Managed",
      price: "$899",
      subtitle: "Up to 20 items",
      description: "We upgrade your visuals and update your Uber Eats menu for you.",
      features: ["Image enhancement", "Drinks handled", "Header banners included", "Uber Eats image upload", "Priority service"],
      cta: "Choose Managed",
      highlight: false,
    },
    {
      name: "Standard Managed",
      price: "$1,299",
      subtitle: "Up to 50 items",
      description: "The complete done-for-you visual upgrade for serious restaurants.",
      features: ["Image enhancement", "Drinks handled", "Header banners included", "Uber Eats image upload", "Priority service"],
      cta: "Choose Managed",
      highlight: true,
      badge: "Most Popular",
    },
  ],
};

function Pill({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm transition ${
        active
          ? "border-amber-300/60 bg-amber-300/10 text-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.15)]"
          : "border-white/10 bg-white/[0.03] text-zinc-300"
      }`}
    >
      {children}
    </span>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-sm text-zinc-300">
      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
      <span>{children}</span>
    </li>
  );
}

function PricingCard({ plan }: { plan: any }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      className={`relative overflow-hidden rounded-[2rem] border p-7 shadow-2xl transition ${
        plan.highlight
          ? "border-amber-300/45 bg-gradient-to-b from-amber-300/[0.12] via-white/[0.06] to-white/[0.03] shadow-amber-950/40"
          : "border-white/10 bg-white/[0.035] shadow-black/40"
      }`}
    >
      {plan.highlight && (
        <div className="absolute right-5 top-5 rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-200">
          {plan.badge}
        </div>
      )}

      <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30">
        {plan.highlight ? <Crown className="h-6 w-6 text-amber-300" /> : <Sparkles className="h-6 w-6 text-zinc-300" />}
      </div>

      <h3 className="text-2xl font-semibold tracking-tight text-white">{plan.name}</h3>
      <div className="mt-5 flex items-end gap-3">
        <span className="text-5xl font-semibold tracking-tight text-white">{plan.price}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-amber-200">{plan.subtitle}</p>
      <p className="mt-4 min-h-[48px] text-sm leading-6 text-zinc-400">{plan.description}</p>

      <button
        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold transition ${
          plan.highlight
            ? "bg-amber-300 text-black shadow-[0_0_35px_rgba(251,191,36,0.25)] hover:bg-amber-200"
            : "border border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.09]"
        }`}
      >
        {plan.cta}
        <ArrowRight className="h-4 w-4" />
      </button>

      <ul className="mt-7 space-y-4">
        {plan.features.map((feature: string) => (
          <CheckItem key={feature}>{feature}</CheckItem>
        ))}
      </ul>
    </motion.div>
  );
}

export default function PremiumPricingPage() {
  const [mode, setMode] = useState<"managed" | "diy">("managed");

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute left-1/2 top-[-10rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:px-10 lg:pt-16">
        <nav className="mb-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-white">Delivery Ignite</div>
              <div className="text-xs text-zinc-500">Restaurant image upgrades</div>
            </div>
          </div>
          <button className="hidden rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08] sm:inline-flex">
            Get Free Sample
          </button>
        </nav>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.55 }} className="mx-auto max-w-4xl text-center">
          <Pill active>
            <Zap className="mr-2 h-4 w-4" /> Free 3 image preview available
          </Pill>

          <h1 className="mt-8 text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
            Turn your menu into a premium visual experience.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
            We transform restaurant images into high-converting menu assets for Uber Eats, websites, social media, and beyond.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-300 px-7 py-4 text-sm font-semibold text-black shadow-[0_0_40px_rgba(251,191,36,0.25)] transition hover:bg-amber-200 sm:w-auto">
              Get Free Sample
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08] sm:w-auto">
              View Pricing
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="mx-auto mt-16 grid max-w-5xl gap-5 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="relative min-h-[360px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.12),transparent_35%)]" />
            <div className="relative h-full rounded-[1.7rem] border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between">
                <Pill>Before</Pill>
                <Pill active>After</Pill>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="h-56 rounded-[1.5rem] border border-white/10 bg-zinc-900/80 p-4 opacity-60">
                  <div className="h-full rounded-[1.1rem] bg-gradient-to-br from-zinc-700 to-zinc-950" />
                </div>
                <div className="h-56 rounded-[1.5rem] border border-amber-300/30 bg-amber-300/10 p-4 shadow-[0_0_40px_rgba(251,191,36,0.12)]">
                  <div className="h-full rounded-[1.1rem] bg-gradient-to-br from-amber-200/40 via-orange-500/30 to-zinc-950" />
                </div>
              </div>
              <p className="mt-6 text-sm leading-6 text-zinc-400">Show clients the improvement before they pay. We enhance 3 images and watermark them for proof.</p>
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl">
            <ImagePlus className="h-8 w-8 text-amber-300" />
            <h2 className="mt-6 text-3xl font-semibold tracking-tight">Try it free.</h2>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Upload 3 images and we’ll send back a watermarked preview so you can see the upgrade instantly.
            </p>
            <div className="mt-7 space-y-3">
              <CheckItem>3 enhanced sample images</CheckItem>
              <CheckItem>Before/after comparison</CheckItem>
              <CheckItem>No commitment required</CheckItem>
            </div>
            <button className="mt-8 w-full rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-zinc-200">
              Request Free Sample
            </button>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Pill active>Pricing</Pill>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Choose how involved you want to be.</h2>
          <p className="mt-5 text-zinc-400">We can deliver premium files, or handle the Uber Eats visual upgrade for you.</p>
        </div>

        <div className="mx-auto mt-10 flex w-fit rounded-full border border-white/10 bg-white/[0.04] p-1">
          <button
            onClick={() => setMode("diy")}
            className={`rounded-full px-6 py-3 text-sm font-semibold transition ${mode === "diy" ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}
          >
            DIY
          </button>
          <button
            onClick={() => setMode("managed")}
            className={`rounded-full px-6 py-3 text-sm font-semibold transition ${mode === "managed" ? "bg-amber-300 text-black" : "text-zinc-400 hover:text-white"}`}
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
          {plans[mode].map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </motion.div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-6">
            <PackageCheck className="h-6 w-6 text-amber-300" />
            <h3 className="mt-5 font-semibold text-white">Large menus</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Have a large menu? Contact us for bulk or custom pricing.</p>
          </div>
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-6">
            <Layers className="h-6 w-6 text-amber-300" />
            <h3 className="mt-5 font-semibold text-white">DIY add-ons</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Drinks Pack $99. Header Pack $99. Managed includes these already.</p>
          </div>
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-6">
            <Download className="h-6 w-6 text-amber-300" />
            <h3 className="mt-5 font-semibold text-white">You own the images</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Use them on delivery platforms, websites, social media, and anywhere else.</p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-amber-300/35 bg-amber-300/[0.08] p-8 shadow-[0_0_55px_rgba(251,191,36,0.08)]">
            <Pill active>Best value for managed clients</Pill>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight">Menu Updates Plan</h2>
            <p className="mt-4 text-zinc-400">Keep your menu fresh as new items are added. Available for Managed clients only.</p>
            <div className="mt-7 flex items-end gap-3">
              <span className="text-5xl font-semibold">$149</span>
              <span className="pb-2 text-zinc-400">/ month</span>
            </div>
            <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-300 px-6 py-4 text-sm font-semibold text-black transition hover:bg-amber-200">
              Add Updates Plan
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
              <Zap className="h-7 w-7 text-amber-300" />
              <h3 className="mt-5 text-xl font-semibold">Priority service</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">Managed clients are prioritised for faster turnaround and updates.</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
              <UploadCloud className="h-7 w-7 text-amber-300" />
              <h3 className="mt-5 text-xl font-semibold">Uber updates</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">For Managed clients, we update Uber Eats with the new visuals.</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 sm:col-span-2">
              <h3 className="text-xl font-semibold">Completion Packs</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">Available after an initial package purchase to finish remaining menu items.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                  <div className="text-2xl font-semibold">$199</div>
                  <div className="mt-1 text-sm text-zinc-400">Up to 10 items</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                  <div className="text-2xl font-semibold">$349</div>
                  <div className="mt-1 text-sm text-zinc-400">Up to 20 items</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <Store className="h-8 w-8 text-amber-300" />
            <h3 className="mt-6 text-2xl font-semibold">Multi-location restaurants</h3>
            <p className="mt-4 text-sm leading-6 text-zinc-400">Custom pricing is available for franchises and businesses with multiple stores.</p>
            <button className="mt-7 rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.09]">
              Contact Us
            </button>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 lg:col-span-2">
            <h3 className="text-3xl font-semibold tracking-tight">All images are yours. Use them anywhere.</h3>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
              Delivery platforms, websites, social media, print menus, franchise assets — no restrictions. You are building a reusable image library for your business.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Pill>Uber Eats</Pill>
              <Pill>DoorDash</Pill>
              <Pill>Website</Pill>
              <Pill>Social Media</Pill>
              <Pill>Menu Assets</Pill>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-5xl px-5 pb-24 pt-8 text-center sm:px-8 lg:px-10">
        <div className="rounded-[2.4rem] border border-amber-300/30 bg-gradient-to-br from-amber-300/[0.12] to-white/[0.04] p-10 shadow-[0_0_70px_rgba(251,191,36,0.1)] sm:p-14">
          <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Ready to upgrade your menu?</h2>
          <p className="mx-auto mt-5 max-w-xl text-zinc-300">Start with a free 3 image preview and see the difference before committing.</p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-2xl bg-amber-300 px-7 py-4 text-sm font-semibold text-black transition hover:bg-amber-200">
              Get Free Sample
            </button>
            <button className="rounded-2xl border border-white/10 bg-black/20 px-7 py-4 text-sm font-semibold text-white transition hover:bg-black/30">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
