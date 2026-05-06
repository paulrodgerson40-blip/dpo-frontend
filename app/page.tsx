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
    title: "Burger Upgrade",
    before: img("beforeA.png"),
    after: img("aftera.png"),
    note: "Same burger. Premium presentation.",
  },
  {
    title: "Spring Rolls",
    before: img("beforeb.png"),
    after: img("afterb.png"),
    note: "Same product. Better appetite appeal.",
  },
  {
    title: "Pizza Upgrade",
    before: img("beforec.png"),
    after: img("afterc.png"),
    note: "Same menu item. Cleaner conversion image.",
  },
  {
    title: "Sushi Upgrade",
    before: img("befored.png"),
    after: img("afterd.png"),
    note: "Same rolls. Premium food photography.",
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
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
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
      className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/[0.07] px-7 py-4 text-sm font-black uppercase tracking-[0.05em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur transition duration-300 hover:border-orange-500/70 hover:bg-orange-500/12"
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
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-orange-500/42 bg-orange-500/10 text-3xl shadow-[0_0_35px_rgba(255,107,0,0.20)] transition group-hover:border-orange-500 group-hover:bg-orange-500/18 group-hover:shadow-[0_0_52px_rgba(255,107,0,0.35)]">
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
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-xs font-black text-[#ff7a00]">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-orange-200 shadow-[0_0_24px_rgba(255,107,0,0.14)]">
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
        <div className="relative h-56 overflow-hidden rounded-2xl bg-black shadow-[0_0_32px_rgba(255,107,0,0.22)]">
          <LocalImage src={after} alt={`${title} after`} className="object-contain" sizes="240px" />
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ff9d20] px-3 py-1 text-xs font-black">
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
      <div className="text-[#ff7a00]">★★★★★</div>
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Logo className="scale-[1.55] origin-left" />
          <nav className="hidden items-center gap-7 text-xs font-black uppercase tracking-[0.13em] text-white/55 md:flex">
            <a href="#proof" className="transition hover:text-[#ff7a00]">Proof</a>
            <a href="#menu" className="transition hover:text-[#ff7a00]">Menu Upgrade</a>
            <a href="#data" className="transition hover:text-[#ff7a00]">Why it works</a>
            <a href="#pricing" className="transition hover:text-[#ff7a00]">Pricing</a>
          </nav>
          <a
            href="#sample"
            className="rounded-full border border-orange-500/45 bg-orange-500/15 px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-white shadow-[0_0_28px_rgba(255,107,0,0.24)] transition hover:bg-orange-500"
          >
            Get Free Sample →
          </a>
        </div>
      </header>

      <section className="relative min-h-[880px] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_73%_20%,rgba(255,107,0,0.43),transparent_30%),radial-gradient(circle_at_44%_78%,rgba(255,107,0,0.10),transparent_34%),linear-gradient(90deg,#050505_0%,#050505_35%,rgba(5,5,5,.80)_55%,rgba(5,5,5,.25)_100%)]" />

        <div className="absolute inset-y-0 right-0 w-full lg:w-[66%]">
          <LocalImage
            src={ASSETS.hero}
            alt="Premium burger hero image"
            priority
            className="scale-[0.96] object-[72%_50%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/52 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />
        </div>

        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="di-pulse absolute right-[-150px] top-[-180px] h-[560px] w-[560px] rounded-full bg-orange-500/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="max-w-[720px]">
            <SectionEyebrow>Free 3 image preview available</SectionEyebrow>

            <h1 className="mt-8 text-[64px] font-black uppercase leading-[0.78] tracking-[-0.085em] sm:text-[92px] lg:text-[118px]">
              Premium
              <span className="block">Images.</span>
              <span className="block bg-gradient-to-r from-[#ff5a00] via-[#ff7600] to-[#ffb24a] bg-clip-text text-transparent drop-shadow-[0_0_34px_rgba(255,107,0,0.22)]">
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

          <div className="absolute bottom-14 right-6 hidden max-w-[230px] rounded-full border border-orange-500/65 bg-black/78 p-5 text-center shadow-[0_0_48px_rgba(255,107,0,0.38)] backdrop-blur-xl lg:block">
            <div className="text-lg font-black uppercase leading-tight text-white">
              Same Food
              <span className="block text-white/70">Better Photos</span>
              <span className="block text-[#ff7a00]">More Orders</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-white/10 bg-[#070707] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute left-[-240px] top-[-40px] h-[520px] w-[520px] rounded-full bg-orange-500/10 blur-3xl" />
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
            <div className="absolute bottom-6 left-6 rounded-2xl border border-orange-500/35 bg-black/70 px-5 py-4 backdrop-blur">
              <div className="text-xs font-black uppercase tracking-[0.12em] text-orange-200">Multi-cuisine ready</div>
              <div className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">Burger · Pizza · Sushi · Dessert</div>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="relative border-b border-white/10 bg-[#080808] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute right-[-260px] top-10 h-[560px] w-[560px] rounded-full bg-orange-500/12 blur-3xl" />
        <div className="mx-auto max-w-7xl">
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

          <div className="mt-12 overflow-hidden rounded-[42px] border border-white/12 bg-white/[0.045] p-4 shadow-[0_35px_130px_rgba(0,0,0,0.64)]">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="relative overflow-hidden rounded-[30px] bg-white">
                <div className="absolute left-4 top-4 z-10 rounded-full bg-black/75 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">
                  Before
                </div>
                <div className="relative h-[760px]">
                  <LocalImage src={ASSETS.beforeMenu} alt="Before menu" className="object-contain object-top" sizes="650px" />
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[30px] bg-white shadow-[0_0_60px_rgba(255,107,0,0.20)]">
                <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ff9d20] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">
                  After
                </div>
                <div className="relative h-[760px]">
                  <LocalImage src={ASSETS.afterMenu} alt="After menu" className="object-contain object-top" sizes="650px" />
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
            <div className="relative h-56 overflow-hidden rounded-[32px] border border-white/10 bg-black">
              <LocalImage src={ASSETS.beforeBanner} alt="Before banner" className="object-contain" />
              <span className="absolute left-5 top-5 rounded-full bg-black/75 px-4 py-2 text-xs font-black uppercase tracking-[0.08em]">Before</span>
            </div>
            <div className="relative h-56 overflow-hidden rounded-[32px] border border-orange-500/35 bg-black shadow-[0_0_70px_rgba(255,107,0,0.20)]">
              <LocalImage src={ASSETS.afterBanner} alt="After banner" className="object-contain" />
              <span className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ff9d20] px-4 py-2 text-xs font-black uppercase tracking-[0.08em]">After</span>
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
        </div>

        <div className="mt-12 overflow-hidden">
          <div className="di-marquee-left flex w-max">
            {[...transformations, ...transformations].map((item, idx) => (
              <BeforeAfterCard key={`${item.title}-${idx}`} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section id="data" className="relative border-b border-white/10 bg-[#050505] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute left-[-240px] top-20 h-[520px] w-[520px] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <SectionEyebrow>Why images sell</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              Your photos decide the first click.
              <span className="block text-[#ff7a00]">Then your food does the rest.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
              Delivery customers judge fast. Better images improve clarity, trust, appetite appeal and perceived quality before the customer even opens the item description.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Photo-first", "Uber Eats gives merchants detailed photo guidance because images shape how customers evaluate food."],
              ["Platform-ready", "DoorDash requires clear, well-lit, unblurry item photos that properly show the dish."],
              ["Purchase intent", "Hospitality research links food photo style with perceived food quality and purchase intention."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[34px] border border-white/10 bg-white/[0.055] p-7 shadow-[0_22px_80px_rgba(0,0,0,0.35)]">
                <div className="text-3xl font-black tracking-[-0.06em] text-[#ff7a00]">{title}</div>
                <p className="mt-4 text-sm leading-7 text-white/60">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl rounded-[30px] border border-white/10 bg-white/[0.045] p-6 text-xs leading-6 text-white/45">
          <p className="font-bold text-white/65">Supporting sources:</p>
          <p className="mt-2">
            Uber Eats merchant photography guidance; DoorDash merchant photo requirements; hospitality research on food photo style, perceived food quality and purchase intention.
          </p>
        </div>
      </section>

      <section className="relative bg-[#070707] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <h2 className="text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              What <span className="text-[#ff7a00]">you get</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/60">
              A complete image upgrade package designed to make your store stand out and convert more customers.
            </p>
            <ul className="mt-8 space-y-3">
              <Check>AI-enhanced food photos</Check>
              <Check>Consistent branding and style</Check>
              <Check>Uber Eats optimized images</Check>
              <Check>Storefront banners</Check>
              <Check>Ready-to-upload files</Check>
              <Check>Before and after comparison</Check>
            </ul>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {transformations.map((item) => (
              <div key={item.title} className="group relative h-64 overflow-hidden rounded-[32px] border border-white/12 bg-black shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
                <LocalImage src={item.after} alt={item.title} className="transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                <div className="absolute bottom-5 left-5 max-w-[220px] text-3xl font-black uppercase leading-[0.86] tracking-[-0.055em]">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b0b0b] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-5xl font-black uppercase tracking-[-0.06em] sm:text-6xl">
            How it <span className="text-[#ff7a00]">works</span>
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              ["1", "Send us your store link", "Share your Uber Eats or DoorDash store link. We extract your existing menu images."],
              ["2", "We enhance everything", "Your photos are transformed into premium, high-converting visuals that match your food."],
              ["3", "Receive your package", "Get enhanced images, banners, headers, and all files ready to upload."],
            ].map(([num, title, text]) => (
              <div key={num} className="rounded-[34px] border border-white/10 bg-white/[0.045] p-7 shadow-[0_24px_84px_rgba(0,0,0,0.30)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/55 text-3xl font-black text-[#ff7a00] shadow-[0_0_35px_rgba(255,107,0,0.22)]">
                  {num}
                </div>
                <h3 className="mt-6 text-xl font-black uppercase tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{text}</p>
              </div>
            ))}
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
        <div className="absolute right-[-200px] top-16 h-[480px] w-[480px] rounded-full bg-orange-500/12 blur-3xl" />
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
                    ? "scale-[1.02] border border-orange-500 bg-gradient-to-b from-orange-500/20 to-white/[0.055] shadow-[0_0_76px_rgba(255,107,0,0.28)]"
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
                      : "border border-white/12 bg-white/[0.06] text-white hover:border-orange-500/60"
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

      <section id="sample" className="relative overflow-hidden border-t border-white/10 bg-black px-5 py-20 text-center sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,107,0,0.25),transparent_36%)]" />
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[44px] border border-orange-500/28 bg-white/[0.055] p-9 shadow-[0_0_96px_rgba(255,107,0,0.18)] backdrop-blur-xl sm:p-14">
          <div className="relative flex justify-center">
            <Logo className="scale-110" />
          </div>
          <h2 className="relative mt-8 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
            Ready to <span className="text-[#ff7a00]">ignite</span> your orders?
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-white/60">
            Start with 3 free watermarked images. See the upgrade before you commit.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <OrangeButton href="#sample">Get Free Sample</OrangeButton>
            <GhostButton href="#pricing">View Packages</GhostButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050505] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-sm text-white/45 sm:flex-row">
          <Logo />
          <div>Delivery Ignite — premium restaurant visual upgrades. All prices exclude GST unless stated otherwise.</div>
        </div>
      </footer>
    </main>
  );
}
