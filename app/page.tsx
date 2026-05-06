"use client";

import React from "react";
import Image from "next/image";

const img = (name: string) => `/images/${name}`;

const ASSETS = {
  logo: img("logo-delivery-ignite.png"),
  hero: img("burger-hero.png"),
  spread: img("banner-food-spread.png.png"),
  beforeMenu: img("before-menu.png"),
  afterMenu: img("after-menu.png"),
  beforeBanner: img("before-banner.png"),
  afterBanner: img("after-banner.png"),
};

const transformations = [
  {
    title: "Parma Upgrade",
    before: img("beforee.png"),
    after: img("aftere.png"),
    note: "Same Parma. Premium food photography.",
  },
  {
    title: "Sushi Upgrade",
    before: img("beforeb.png"),
    after: img("afterb.png"),
    note: "Same Sushi. Premium presentation.",
  },
  {
    title: "Burger Upgrade",
    before: img("beforec.png"),
    after: img("afterc.png"),
    note: "Same Burger. Cleaner conversion image.",
  },
  {
    title: "Pizza Upgrade",
    before: img("befored.png"),
    after: img("afterd.png"),
    note: "Same Pizza. Better appetite appeal.",
  },
  {
    title: "Spring Roll Upgrade",
    before: img("beforeA.png"),
    after: img("aftera.png"),
    note: "Same Spring Roll. Higher perceived quality.",
  },
];

const pricing = [
  {
    name: "Starter DIY",
    price: "$499",
    detail: "Up to 20 images",
    button: "Start DIY",
    features: [
      "Premium image enhancement",
      "Ready-to-upload files",
      "Use anywhere, no restrictions",
      "Client uploads images",
    ],
  },
  {
    name: "Standard DIY",
    price: "$799",
    detail: "Up to 50 images",
    button: "Choose Standard DIY",
    badge: "Best DIY",
    features: [
      "Premium image enhancement",
      "Ready-to-upload files",
      "Larger menu coverage",
      "Client uploads images",
    ],
  },
  {
    name: "Starter Managed",
    price: "$899",
    detail: "Up to 20 items",
    button: "Choose Managed",
    features: [
      "Image enhancement",
      "Drinks handled",
      "Headers included",
      "Uber Eats image upload",
      "Priority service",
    ],
  },
  {
    name: "Standard Managed",
    price: "$1,299",
    detail: "Up to 50 items",
    button: "Choose Standard Managed",
    badge: "Most Popular",
    highlight: true,
    features: [
      "Image enhancement",
      "Drinks handled",
      "Headers included",
      "Uber Eats image upload",
      "Priority service",
    ],
  },
];

function LocalImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const hasObjectFit = /\bobject-(cover|contain|fill|none|scale-down)\b/.test(className);
  const finalClassName = `${hasObjectFit ? "" : "object-cover"} ${className}`.trim();

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={finalClassName}
    />
  );
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-20 w-[320px] sm:h-24 sm:w-[420px] ${className}`}>
      <Image
        src={ASSETS.logo}
        alt="Delivery Ignite"
        fill
        priority
        sizes="520px"
        className="object-contain object-left"
      />
    </div>
  );
}

function OrangeButton({
  children,
  href = "#sample",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#ff5a00] via-[#ff7200] to-[#ff9d20] px-7 py-4 text-sm font-black uppercase tracking-[0.05em] text-white shadow-[0_0_32px_rgba(255,107,0,0.48),inset_0_1px_0_rgba(255,255,255,0.26)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_64px_rgba(255,107,0,0.72),inset_0_1px_0_rgba(255,255,255,0.26)]"
    >
      <span className="absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-white/20 opacity-0 transition duration-500 group-hover:left-[130%] group-hover:opacity-100" />
      <span className="relative">{children}</span>
      <span className="relative ml-2 transition group-hover:translate-x-1">→</span>
    </a>
  );
}

function GhostButton({
  children,
  href = "#pricing",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/[0.07] px-7 py-4 text-sm font-black uppercase tracking-[0.05em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur transition duration-300 hover:border-cyan-300/70 hover:bg-cyan-400/10"
    >
      {children}
    </a>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/42 px-4 py-3 text-xs font-black uppercase tracking-[0.09em] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
      {children}
    </div>
  );
}

function HeroProof({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="group text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-cyan-300/38 bg-cyan-400/8 text-3xl shadow-[0_0_35px_rgba(34,211,238,0.16)] transition group-hover:border-cyan-300 group-hover:bg-cyan-400/14 group-hover:shadow-[0_0_52px_rgba(34,211,238,0.24)]">
        {icon}
      </div>
      <div className="mt-3 text-[12px] font-black uppercase leading-tight tracking-[0.05em] text-white">
        {title}
      </div>
      <div className="mt-1 text-[11px] leading-4 text-white/45">{sub}</div>
    </div>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-white/72">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/12 text-xs font-black text-cyan-200">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.14)]">
      {children}
    </div>
  );
}

function BeforeAfterCard({
  title,
  before,
  after,
  note,
}: {
  title: string;
  before: string;
  after: string;
  note: string;
}) {
  return (
    <div className="mx-3 w-[450px] shrink-0 rounded-[32px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative h-56 overflow-hidden rounded-2xl bg-black">
          <LocalImage src={before} alt={`${title} before`} className="object-contain saturate-[0.84] contrast-[0.92]" sizes="240px" />
          <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-black">
            BEFORE
          </span>
        </div>
        <div className="relative h-56 overflow-hidden rounded-2xl bg-black shadow-[0_0_32px_rgba(34,211,238,0.18)]">
          <LocalImage src={after} alt={`${title} after`} className="object-contain" sizes="240px" />
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ff9d20] px-3 py-1 text-xs font-black shadow-[0_0_18px_rgba(34,211,238,0.18)]">
            AFTER
          </span>
        </div>
      </div>
      <div className="mt-4 text-xl font-black uppercase tracking-[-0.04em]">{title}</div>
      <div className="mt-1 text-sm text-white/48">{note}</div>
    </div>
  );
}

function Testimonial({ quote, name, meta }: { quote: string; name: string; meta: string }) {
  return (
    <div className="mx-3 w-[360px] shrink-0 rounded-[30px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-xl">
      <div className="text-cyan-200">★★★★★</div>
      <p className="mt-4 text-lg font-bold leading-7 text-white">“{quote}”</p>
      <div className="mt-6 text-sm font-black text-white">{name}</div>
      <div className="mt-1 text-xs text-white/45">{meta}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <style jsx global>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: .38; transform: scale(1); }
          50% { opacity: .72; transform: scale(1.09); }
        }
        html { scroll-behavior: smooth; }
        .di-marquee-left { animation: marquee-left 34s linear infinite; }
        .di-marquee-right { animation: marquee-right 38s linear infinite; }
        .di-pulse { animation: pulse-glow 4s ease-in-out infinite; }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/76 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-5 py-6 sm:px-8 lg:px-10">
          <Logo className="scale-[2.15] origin-left" />
          <nav className="hidden items-center gap-7 text-[11px] font-black uppercase tracking-[0.14em] text-white/55 md:flex">
            <a href="#proof" className="transition hover:text-[#ff7a00]">Proof</a>
            <a href="#menu" className="transition hover:text-[#ff7a00]">Menu Upgrade</a>
            <a href="#data" className="transition hover:text-[#ff7a00]">Why it works</a>
            <a href="#pricing" className="transition hover:text-[#ff7a00]">Pricing</a>
          </nav>
          <a
            href="#sample"
            className="rounded-full border border-cyan-300/35 bg-cyan-400/8 px-5 py-3 text-[11px] font-black uppercase tracking-[0.08em] text-white shadow-[0_0_28px_rgba(34,211,238,0.16)] transition hover:bg-orange-500"
          >
            Get Free Sample →
          </a>
        </div>
      </header>

      <section className="relative min-h-[830px] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_73%_20%,rgba(255,107,0,0.28),transparent_30%),radial-gradient(circle_at_44%_78%,rgba(34,211,238,0.08),transparent_34%),linear-gradient(90deg,#050505_0%,#050505_35%,rgba(5,5,5,.80)_55%,rgba(5,5,5,.25)_100%)]" />

        <div className="absolute inset-y-0 right-0 w-full lg:w-[66%]">
          <LocalImage
            src={ASSETS.hero}
            alt="Premium burger hero image"
            priority
            className="scale-[0.92] object-[78%_50%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/52 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />
        </div>

        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="di-pulse absolute right-[-150px] top-[-180px] h-[560px] w-[560px] rounded-full bg-cyan-400/18 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="max-w-[720px]">
            <SectionEyebrow>Free 3 image preview available</SectionEyebrow>

            <h1 className="mt-7 text-[64px] font-black uppercase leading-[0.78] tracking-[-0.085em] sm:text-[92px] lg:text-[118px]">
              Premium
              <span className="block">Images.</span>
              <span className="block bg-gradient-to-r from-[#ff5a00] via-[#ff7600] to-[#22d3ee] bg-clip-text text-transparent drop-shadow-[0_0_34px_rgba(255,107,0,0.22)]">
                More Orders.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/72">
              We turn ordinary restaurant photos into premium delivery-platform visuals that increase appetite appeal, improve perceived quality, and make customers order faster.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Pill>Uber Eats</Pill>
              <Pill>DoorDash</Pill>
              <Pill>Websites</Pill>
              <Pill>Franchise assets</Pill>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <OrangeButton href="#sample">Get Free Sample</OrangeButton>
              <GhostButton href="#proof">See Transformations</GhostButton>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-5 sm:grid-cols-4">
              <HeroProof icon="📸" title="No Photoshoot" sub="Use existing images" />
              <HeroProof icon="⚡" title="Fast Turnaround" sub="Preview first" />
              <HeroProof icon="📈" title="More Clicks" sub="Stronger appeal" />
              <HeroProof icon="🏆" title="Premium Brand" sub="Storefront polish" />
            </div>
          </div>

          <div className="absolute bottom-14 right-6 hidden max-w-[230px] rounded-full border border-cyan-300/45 bg-black/78 p-5 text-center shadow-[0_0_48px_rgba(34,211,238,0.22)] backdrop-blur-xl lg:block">
            <div className="text-lg font-black uppercase leading-tight text-white">
              Same Food
              <span className="block text-white/70">Better Photos</span>
              <span className="block text-[#ff7a00]">More Orders</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-white/10 bg-[#070707] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute left-[-240px] top-[-40px] h-[520px] w-[520px] rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <SectionEyebrow>Delivery platform luxury</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              Not fake food.
              <span className="block text-[#ff7a00]">Real food, upgraded.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
              Your actual dishes stay recognisable. We improve lighting, texture, contrast, consistency and presentation so the whole restaurant looks more valuable.
            </p>
            <ul className="mt-8 space-y-3">
              <Check>Preserves the restaurant’s real food identity</Check>
              <Check>Creates a consistent premium visual style</Check>
              <Check>Builds trust before customers read the menu</Check>
            </ul>
          </div>

          <div className="relative h-[420px] overflow-hidden rounded-[42px] border border-white/12 bg-black shadow-[0_35px_130px_rgba(0,0,0,0.60),0_0_80px_rgba(255,107,0,0.14)]">
            <LocalImage src={ASSETS.spread} alt="Premium multi-cuisine food spread" className="scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-2xl border border-cyan-300/28 bg-black/70 px-5 py-4 backdrop-blur">
              <div className="text-xs font-black uppercase tracking-[0.12em] text-cyan-100">Multi-cuisine ready</div>
              <div className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">Burger · Pizza · Sushi · Dessert</div>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="relative border-b border-white/10 bg-[#080808] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute right-[-260px] top-10 h-[560px] w-[560px] rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="mx-auto max-w-[1500px]">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Full menu transformation</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              Same menu.
              <span className="block text-[#ff7a00]">Higher perceived value.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/60">
              Same prices, same items, same restaurant — but the upgraded version looks more trustworthy, premium and order-worthy.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-[1380px] overflow-hidden rounded-[42px] border border-white/12 bg-white/[0.045] p-3 shadow-[0_35px_130px_rgba(0,0,0,0.64)] sm:p-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_18px_70px_rgba(0,0,0,0.35)]">
                <div className="absolute left-4 top-4 z-10 rounded-full bg-black/78 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  Before
                </div>
                <div className="relative aspect-[1081/1137] w-full">
                  <LocalImage
                    src={ASSETS.beforeMenu}
                    alt="Before menu"
                    className="object-contain object-center"
                    sizes="(min-width: 1280px) 670px, 94vw"
                  />
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[30px] border border-cyan-300/35 bg-white shadow-[0_0_70px_rgba(34,211,238,0.18),0_18px_70px_rgba(0,0,0,0.35)]">
                <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ff9d20] px-4 py-2 text-xs font-black shadow-[0_0_18px_rgba(34,211,238,0.18)] uppercase tracking-[0.08em] text-white shadow-[0_10px_30px_rgba(255,107,0,0.35)]">
                  After
                </div>
                <div className="relative aspect-[1081/1137] w-full">
                  <LocalImage
                    src={ASSETS.afterMenu}
                    alt="After menu"
                    className="object-contain object-center"
                    sizes="(min-width: 1280px) 670px, 94vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-[#050505] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <SectionEyebrow>Storefront branding</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              From takeaway photos
              <span className="block text-[#ff7a00]">to franchise-level branding.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
              We create premium storefront banners using the restaurant’s own food assets, giving the whole store a stronger first impression.
            </p>
          </div>

          <div className="grid gap-5">
            <div className="relative h-64 overflow-hidden rounded-[32px] border border-white/10 bg-black">
              <LocalImage src={ASSETS.beforeBanner} alt="Before banner" className="object-contain" />
              <span className="absolute left-5 top-5 rounded-full bg-black/75 px-4 py-2 text-xs font-black uppercase tracking-[0.08em]">Before</span>
            </div>
            <div className="relative h-64 overflow-hidden rounded-[32px] border border-cyan-300/35 bg-black shadow-[0_0_70px_rgba(34,211,238,0.18)]">
              <LocalImage src={ASSETS.afterBanner} alt="After banner" className="object-contain" />
              <span className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ff9d20] px-4 py-2 text-xs font-black shadow-[0_0_18px_rgba(34,211,238,0.18)] uppercase tracking-[0.08em]">After</span>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="relative border-b border-white/10 bg-[#080808] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Real before & after examples</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              We keep your food.
              <span className="block text-[#ff7a00]">We upgrade the sell.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/60">
              The goal is not to invent fake dishes. The goal is to make the restaurant’s actual menu look premium enough to stop the scroll.
            </p>
          </div>

          <div className="mx-auto mt-9 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "AI-enhanced food photos",
              "Consistent branding and style",
              "Uber Eats optimised images",
              "Storefront banners",
              "Ready-to-upload files",
              "Before and after comparison",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.08em] text-white/68 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                <span className="mr-2 text-cyan-200">✓</span>{item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden">
          <div className="di-marquee-left flex w-max">
            {[...transformations, ...transformations].map((item, idx) => (
              <BeforeAfterCard key={`${item.title}-${idx}`} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section id="data" className="relative overflow-hidden border-b border-white/10 bg-[#050505] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute left-[-260px] top-[-120px] h-[620px] w-[620px] rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="absolute right-[-260px] bottom-[-180px] h-[620px] w-[620px] rounded-full bg-cyan-400/8 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <SectionEyebrow>Why images sell</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
              Your photos decide
              <span className="block">the first click.</span>
              <span className="block text-[#ff7a00]">Then your food does the rest.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/62">
              On delivery apps, customers cannot smell, taste or touch the food. Your image becomes the first signal of freshness, trust, value and whether the meal is worth ordering.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              ["First-click signal", "Before price, description or add-ons, the photo is often the fastest way a customer decides whether to open the item."],
              ["Perceived quality", "Cleaner lighting, stronger texture and consistent presentation make the restaurant feel more professional and trustworthy."],
              ["Scroll competition", "Customers compare restaurants side-by-side in fast-moving feeds. Better photos help stop the scroll."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-[34px] border border-white/10 bg-white/[0.055] p-7 shadow-[0_22px_80px_rgba(0,0,0,0.35)]"
              >
                <div className="text-2xl font-black uppercase leading-[0.95] tracking-[-0.045em] text-[#ff7a00]">
                  {title}
                </div>
                <p className="mt-4 text-sm leading-7 text-white/62">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[34px] border border-orange-500/24 bg-gradient-to-br from-orange-500/[0.12] to-white/[0.035] p-7 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Owner takeaway</div>
              <p className="mt-4 text-3xl font-black uppercase leading-[0.94] tracking-[-0.055em] text-white sm:text-4xl">
                Better photos do not just make food look nicer.
                <span className="block text-[#ff7a00]">They make the restaurant feel safer, cleaner and more valuable.</span>
              </p>
            </div>

            <div className="rounded-[34px] border border-orange-500/24 bg-gradient-to-br from-white/[0.055] to-orange-500/[0.09] p-7 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Delivery app reality</div>
              <p className="mt-4 text-3xl font-black uppercase leading-[0.94] tracking-[-0.055em] text-white sm:text-4xl">
                Your food is not only competing against similar food.
                <span className="block text-[#ff7a00]">It is competing against better-looking photos.</span>
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["3 sec", "Customers judge fast."],
              ["6 signals", "Lighting, clarity, texture, portion, freshness and trust."],
              ["1 chance", "The first image decides whether they keep scrolling."],
            ].map(([stat, text]) => (
              <div
                key={stat}
                className="rounded-[26px] border border-white/10 bg-white/[0.045] p-5 text-center shadow-[0_18px_60px_rgba(0,0,0,0.30)]"
              >
                <div className="text-4xl font-black uppercase tracking-[-0.06em] text-[#ff7a00]">{stat}</div>
                <p className="mx-auto mt-3 max-w-[220px] text-sm leading-6 text-white/58">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[26px] border border-white/10 bg-white/[0.035] px-5 py-4 text-[10px] leading-5 text-white/38 sm:text-xs">
            <p>
              <span className="font-black uppercase tracking-[0.10em] text-white/58">Evidence note: </span>
              Based on publicly available Uber Eats merchant photo guidance, DoorDash merchant photo requirements, and hospitality/consumer-behaviour research connecting food photo style with perceived quality, trust and purchase intention. No sales uplift is guaranteed; better visual presentation improves the customer decision environment.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b0b0b] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Two ways to work</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              How it <span className="text-[#ff7a00]">works</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/55">
              Choose the simple DIY file package, or the managed path where we handle the image upload work for you.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[38px] border border-white/10 bg-white/[0.045] p-7 shadow-[0_28px_95px_rgba(0,0,0,0.38)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Pathway one</div>
                  <h3 className="mt-3 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
                    DIY <span className="text-[#ff7a00]">files only</span>
                  </h3>
                </div>
                <div className="rounded-full border border-white/12 bg-black/45 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white/65">Fastest</div>
              </div>

              <div className="mt-7 grid gap-4">
                {[
                  ["1", "You send the images", "Upload your current menu photos or share the files you want improved."],
                  ["2", "We enhance the set", "Food images are upgraded for lighting, texture, contrast and consistent presentation."],
                  ["3", "You receive final files", "Download ready-to-upload images and use them anywhere, with no restrictions."],
                ].map(([num, title, text]) => (
                  <div key={num} className="flex gap-4 rounded-[26px] border border-white/10 bg-black/28 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/55 text-2xl font-black text-cyan-200 shadow-[0_0_26px_rgba(34,211,238,0.18)]">{num}</div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-[-0.02em] text-white">{title}</h4>
                      <p className="mt-1 text-sm leading-6 text-white/56">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[38px] border border-cyan-300/34 bg-gradient-to-b from-cyan-400/[0.10] to-white/[0.045] p-7 shadow-[0_0_80px_rgba(34,211,238,0.13),0_28px_95px_rgba(0,0,0,0.38)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Pathway two</div>
                  <h3 className="mt-3 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
                    Managed <span className="text-[#ff7a00]">done for you</span>
                  </h3>
                </div>
                <div className="rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ff9d20] px-4 py-2 text-xs font-black shadow-[0_0_18px_rgba(34,211,238,0.18)] uppercase tracking-[0.08em] text-white shadow-[0_0_28px_rgba(255,107,0,0.26)]">Easiest</div>
              </div>

              <div className="mt-7 grid gap-4">
                {[
                  ["1", "Send us your store link", "Share your Uber Eats or DoorDash store. We map the menu, images and priority items."],
                  ["2", "We create the package", "Food images, drinks, banners and headers are prepared in a consistent premium style."],
                  ["3", "We support upload", "You receive the finished package, with Uber Eats image upload included in managed plans."],
                ].map(([num, title, text]) => (
                  <div key={num} className="flex gap-4 rounded-[26px] border border-cyan-300/18 bg-black/30 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/60 text-2xl font-black text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.20)]">{num}</div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-[-0.02em] text-white">{title}</h4>
                      <p className="mt-1 text-sm leading-6 text-white/58">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#070707] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <SectionEyebrow>Restaurant owner reaction</SectionEyebrow>
              <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
                This is the upgrade
                <span className="block text-[#ff7a00]">they can see instantly.</span>
              </h2>
            </div>
            <p className="max-w-md text-white/55">
              Temporary testimonials for layout. Replace with real restaurant names and feedback as completed jobs come in.
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-hidden">
          <div className="di-marquee-right flex w-max">
            {[
              ["Our menu finally looks like the food we actually serve.", "Restaurant owner", "Burger shop · Melbourne"],
              ["The before and after made the decision easy.", "Operator", "Asian restaurant · VIC"],
              ["This made our delivery store feel like a proper brand.", "Manager", "Cafe · South East Melbourne"],
              ["Same food, but it looks like a franchise now.", "Owner", "Pizza store · Melbourne"],
              ["Our menu finally looks like the food we actually serve.", "Restaurant owner", "Burger shop · Melbourne"],
              ["The before and after made the decision easy.", "Operator", "Asian restaurant · VIC"],
            ].map(([quote, name, meta], idx) => (
              <Testimonial key={idx} quote={quote} name={name} meta={meta} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative border-y border-white/10 bg-[#0b0b0b] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute right-[-200px] top-16 h-[480px] w-[480px] rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Packages</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              DIY or Managed.
              <span className="block text-[#ff7a00]">See both clearly.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/55">
              Choose files only, or let us handle the Uber image upload for you.
            </p>
            <p className="mt-3 text-sm font-black uppercase tracking-[0.08em] text-orange-200/80">
              All prices exclude GST unless stated otherwise.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-[34px] p-6 ${
                  plan.highlight
                    ? "scale-[1.02] border border-orange-500 bg-gradient-to-b from-orange-500/16 to-cyan-400/[0.035] shadow-[0_0_76px_rgba(255,107,0,0.18),0_0_38px_rgba(34,211,238,0.08)]"
                    : "border border-white/10 bg-white/[0.045]"
                }`}
              >
                {plan.badge && (
                  <div className="mb-4 w-fit rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff9a1f] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-white">
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-2xl font-black tracking-[-0.03em] text-white">{plan.name}</h3>
                <p className="mt-4 min-h-[44px] text-sm leading-6 text-white/55">
                  Premium visual upgrade package for restaurants ready to improve their delivery presence.
                </p>
                <div className="mt-6 text-5xl font-black tracking-[-0.05em]">
                  {plan.price} <span className="text-base text-white/45">+ GST</span>
                </div>
                <div className="mt-2 text-sm font-bold text-white/50">{plan.detail}</div>
                <a
                  href="#sample"
                  className={`mt-6 inline-flex w-full justify-center rounded-full px-5 py-4 text-sm font-black uppercase tracking-[0.04em] transition ${
                    plan.highlight
                      ? "bg-gradient-to-r from-[#ff6b00] to-[#ff9a1f] text-white shadow-[0_0_35px_rgba(255,107,0,0.35)]"
                      : "border border-white/12 bg-white/[0.06] text-white hover:border-cyan-300/60"
                  }`}
                >
                  {plan.button} →
                </a>
                <div className="my-6 h-px bg-white/10" />
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <Check key={f}>{f}</Check>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["DIY add-ons", "Drinks Pack $99 + GST. Header Pack $99 + GST."],
              ["Managed includes more", "Headers, drinks, Uber upload, and priority service are included."],
              ["Large menus", "Contact us for bulk or custom pricing."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
                <h3 className="text-lg font-black uppercase tracking-[-0.02em]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sample" className="relative overflow-hidden border-t border-white/10 bg-black px-5 py-14 text-center sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_36%)]" />
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[38px] border border-cyan-300/26 bg-white/[0.055] p-8 shadow-[0_0_78px_rgba(34,211,238,0.14)] backdrop-blur-xl sm:p-10">
          <h2 className="relative text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-6xl">
            Ready to <span className="text-[#ff7a00]">ignite</span> your orders?
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-white/60">
            Start with 3 free watermarked images. See the upgrade before you commit.
          </p>
          <div className="relative mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <OrangeButton href="#sample">Get Free Sample</OrangeButton>
            <GhostButton href="#pricing">View Packages</GhostButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050505] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-sm text-white/45 sm:flex-row">
          <Logo className="scale-[0.72] origin-left" />
          <div>Delivery Ignite — premium restaurant visual upgrades. All prices exclude GST unless stated otherwise.</div>
        </div>
      </footer>
    </main>
  );
}
