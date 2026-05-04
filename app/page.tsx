"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  Check,
  Download,
  ImagePlus,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Store,
  UploadCloud,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Button({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "dark" | "light" }) {
  const styles = {
    primary: "bg-[#06C167] text-black hover:bg-[#05ad5c] shadow-[0_10px_30px_rgba(6,193,103,0.25)]",
    dark: "bg-black text-white hover:bg-neutral-800",
    light: "bg-white text-black border border-black/10 hover:bg-neutral-50",
  };

  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${styles[variant]}`}>
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

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-xs font-medium text-neutral-500">{label}</div>
    </div>
  );
}

function PricingCard({
  title,
  price,
  limit,
  description,
  features,
  cta,
  highlighted = false,
  badge,
}: {
  title: string;
  price: string;
  limit: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 230, damping: 22 }}
      className={`relative rounded-[30px] border bg-white p-7 shadow-sm transition ${
        highlighted ? "border-black shadow-[0_24px_80px_rgba(0,0,0,0.13)]" : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      {badge && (
        <div className="absolute right-5 top-5 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
          {badge}
        </div>
      )}

      <div className={`mb-7 flex h-12 w-12 items-center justify-center rounded-2xl ${highlighted ? "bg-black text-white" : "bg-neutral-100 text-black"}`}>
        {highlighted ? <Sparkles className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
      </div>

      <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      <p className="mt-3 min-h-[48px] text-sm leading-6 text-neutral-600">{description}</p>

      <div className="mt-7 text-5xl font-bold tracking-tight">{price}</div>
      <div className="mt-2 text-sm font-semibold text-neutral-500">{limit}</div>

      <div className="mt-7">
        <Button variant={highlighted ? "dark" : "light"}>{cta}</Button>
      </div>

      <div className="my-7 h-px bg-neutral-100" />

      <ul className="space-y-3">
        {features.map((feature) => (
          <CheckItem key={feature}>{feature}</CheckItem>
        ))}
      </ul>
    </motion.div>
  );
}

function CompareRow({ label, diy, managed }: { label: string; diy: string; managed: string }) {
  return (
    <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-neutral-100 text-sm last:border-b-0">
      <div className="px-4 py-4 font-semibold text-neutral-800">{label}</div>
      <div className="px-4 py-4 text-neutral-600">{diy}</div>
      <div className="px-4 py-4 font-semibold text-black">{managed}</div>
    </div>
  );
}

export default function PremiumPricingPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F4] text-black">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F7F7F4]/90 backdrop-blur-xl">
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

          <nav className="hidden items-center gap-8 text-sm font-semibold text-neutral-600 md:flex">
            <a href="#sample" className="hover:text-black">Free sample</a>
            <a href="#pricing" className="hover:text-black">Pricing</a>
            <a href="#compare" className="hover:text-black">Compare</a>
            <a href="#updates" className="hover:text-black">Updates</a>
          </nav>

          <Button variant="dark">Get Free Sample</Button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute right-[-10rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#06C167]/12 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-[-14rem] h-[30rem] w-[30rem] rounded-full bg-black/5 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-28">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">
              <Zap className="h-4 w-4 text-[#06C167]" />
              Free 3 image preview available
            </div>

            <h1 className="mt-7 max-w-2xl text-6xl font-black leading-[0.88] tracking-[-0.08em] sm:text-7xl lg:text-8xl">
              Make your menu look worth ordering.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-600">
              Premium food image upgrades for restaurants. Use the files yourself, or let us update your Uber Eats visuals for you.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button>Get Free Sample</Button>
              <Button variant="light">View Pricing</Button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <MiniMetric value="3" label="Free sample" />
              <MiniMetric value="$499" label="DIY from" />
              <MiniMetric value="$899" label="Managed from" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-[40px] border border-black/10 bg-white p-4 shadow-[0_30px_100px_rgba(0,0,0,0.16)]">
              <div className="rounded-[32px] bg-black p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-3 w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">Before</div>
                    <div className="h-72 rounded-[28px] bg-gradient-to-br from-neutral-700 via-neutral-900 to-black" />
                    <p className="mt-4 text-xs leading-5 text-white/50">Flat lighting, inconsistent framing, low appetite appeal.</p>
                  </div>
                  <div>
                    <div className="mb-3 w-fit rounded-full bg-[#06C167] px-3 py-1 text-xs font-black text-black">After</div>
                    <div className="relative h-72 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#06C167]/25 via-orange-400/45 to-black">
                      <div className="absolute inset-x-8 bottom-8 h-32 rounded-full bg-orange-300/60 blur-2xl" />
                      <div className="absolute bottom-7 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full border-[18px] border-orange-300 bg-red-700 shadow-2xl" />
                    </div>
                    <p className="mt-4 text-xs leading-5 text-white/70">Premium style, stronger texture, platform-ready presentation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-6 hidden rounded-3xl border border-black/10 bg-white p-5 shadow-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#06C167]/15 text-[#06C167]">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-black">You own every image</div>
                  <div className="text-xs text-neutral-500">Use anywhere. No restrictions.</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="sample" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="rounded-[40px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.16)] sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold">Free proof of value</div>
              <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] sm:text-5xl">We enhance 3 images first.</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
                Send restaurants a watermarked preview before they pay. The improvement becomes the sales pitch.
              </p>
              <div className="mt-8">
                <Button>Request Free Sample</Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {["Original", "Enhanced", "Watermarked"].map((label, i) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                  <div className={`h-48 rounded-2xl ${i === 0 ? "bg-neutral-700" : i === 1 ? "bg-gradient-to-br from-orange-300 via-red-500 to-black" : "bg-gradient-to-br from-[#06C167] via-orange-400 to-black"}`} />
                  <div className="mt-4 text-sm font-bold">{label}</div>
                  <div className="mt-1 text-xs text-white/45">Sample preview</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">Pricing</div>
          <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-6xl">DIY or Managed. See both clearly.</h2>
          <p className="mt-5 text-lg leading-8 text-neutral-600">No confusing switch. Choose files only, or let us handle the Uber image upload for you.</p>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} transition={{ staggerChildren: 0.1 }} className="mt-12 grid gap-6 lg:grid-cols-4">
          <PricingCard
            title="Starter DIY"
            price="$499"
            limit="Up to 20 images"
            description="We enhance your images and deliver upload-ready files."
            cta="Start DIY"
            features={["Premium image enhancement", "Ready-to-upload files", "Use anywhere, no restrictions", "Client uploads images"]}
          />
          <PricingCard
            title="Standard DIY"
            price="$799"
            limit="Up to 50 images"
            description="For restaurants upgrading most of their menu visuals."
            cta="Choose Standard DIY"
            highlighted
            badge="Best DIY"
            features={["Premium image enhancement", "Ready-to-upload files", "Larger menu coverage", "Client uploads images"]}
          />
          <PricingCard
            title="Starter Managed"
            price="$899"
            limit="Up to 20 items"
            description="We enhance your visuals and update your Uber Eats images."
            cta="Choose Managed"
            features={["Image enhancement", "Drinks handled", "Headers included", "Uber Eats image upload", "Priority service"]}
          />
          <PricingCard
            title="Standard Managed"
            price="$1,299"
            limit="Up to 50 items"
            description="The full done-for-you visual upgrade for serious restaurants."
            cta="Choose Standard Managed"
            highlighted
            badge="Most Popular"
            features={["Image enhancement", "Drinks handled", "Headers included", "Uber Eats image upload", "Priority service"]}
          />
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
            <PackageCheck className="h-6 w-6 text-[#06C167]" />
            <h3 className="mt-5 font-black">DIY add-ons</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Drinks Pack $99. Header Pack $99.</p>
          </div>
          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-[#06C167]" />
            <h3 className="mt-5 font-black">Managed includes more</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Headers, drinks, Uber upload, and priority service are included.</p>
          </div>
          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
            <Building2 className="h-6 w-6 text-[#06C167]" />
            <h3 className="mt-5 font-black">Large menus</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Contact us for bulk or custom pricing.</p>
          </div>
        </div>
      </section>

      <section id="compare" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">Comparison</div>
            <h2 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-5xl">The difference is who does the work.</h2>
            <p className="mt-5 text-neutral-600">DIY gives you premium images. Managed gives you premium images plus Uber image upload and priority service.</p>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-sm">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-neutral-50 text-sm font-black">
              <div className="px-4 py-4">Feature</div>
              <div className="px-4 py-4">DIY</div>
              <div className="px-4 py-4">Managed</div>
            </div>
            <CompareRow label="Image enhancement" diy="Included" managed="Included" />
            <CompareRow label="Drinks" diy="$99 add-on" managed="Included" />
            <CompareRow label="Header banners" diy="$99 add-on" managed="Included" />
            <CompareRow label="Uber Eats image upload" diy="You handle it" managed="We handle it" />
            <CompareRow label="Priority service" diy="Standard queue" managed="Included" />
            <CompareRow label="Best for" diy="Hands-on owners" managed="Busy owners" />
          </div>
        </div>
      </section>

      <section id="updates" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[36px] border border-black bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
            <div className="inline-flex rounded-full bg-[#06C167]/15 px-4 py-2 text-sm font-black">Managed only</div>
            <h2 className="mt-6 text-4xl font-black tracking-[-0.05em]">Menu Updates Plan</h2>
            <p className="mt-4 text-neutral-600">Keep your menu current as you add new dishes. Managed clients receive priority updates.</p>
            <div className="mt-7 flex items-end gap-2">
              <span className="text-6xl font-black tracking-tight">$149</span>
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
            <div className="rounded-[36px] border border-neutral-200 bg-white p-8 shadow-sm">
              <h3 className="text-3xl font-black tracking-[-0.04em]">Completion Packs</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">Available after purchasing a Starter or Standard package to finish remaining menu items.</p>
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

            <div className="rounded-[36px] border border-neutral-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Multi-location restaurants</h3>
                  <p className="mt-1 text-sm text-neutral-600">Custom pricing for franchises and groups.</p>
                </div>
              </div>
              <div className="mt-7">
                <Button variant="light">Contact Us</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[40px] bg-black p-8 text-white sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Download className="h-9 w-9 text-[#06C167]" />
              <h2 className="mt-6 text-4xl font-black tracking-[-0.05em]">You own every image.</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
                Use your completed images across Uber Eats, DoorDash, your website, social media, print menus, and future campaigns. No restrictions.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Uber Eats", "DoorDash", "Website", "Social Media", "Print Menus", "Franchise Assets"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <BadgeCheck className="h-5 w-5 text-[#06C167]" />
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:px-10">
        <div className="rounded-[40px] border border-neutral-200 bg-white p-10 shadow-[0_25px_90px_rgba(0,0,0,0.08)] sm:p-14">
          <Camera className="mx-auto h-10 w-10 text-[#06C167]" />
          <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.06em]">Start with 3 free images.</h2>
          <p className="mx-auto mt-5 max-w-xl text-neutral-600">We’ll show the upgrade before you commit. Watermarked samples. No pressure.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button>Get Free Sample</Button>
            <Button variant="light">Contact Us</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 px-5 py-8 text-center text-sm text-neutral-500 sm:px-8 lg:px-10">
        Delivery Ignite — premium restaurant visual upgrades.
      </footer>
    </main>
  );
}
