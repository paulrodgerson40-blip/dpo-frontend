"use client";

import React from "react";
import Image from "next/image";

const STOCK = {
  hero:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=90&w=2200&auto=format&fit=crop",
  hero2:
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=90&w=1800&auto=format&fit=crop",
  sushi:
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=90&w=1800&auto=format&fit=crop",
  ribs:
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=90&w=1600&auto=format&fit=crop",
  fries:
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=90&w=1600&auto=format&fit=crop",
  dessert:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=90&w=1600&auto=format&fit=crop",
  pizza:
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=90&w=1800&auto=format&fit=crop",
  noodles:
    "https://images.unsplash.com/photo-1555126634-323283e090fa?q=90&w=1800&auto=format&fit=crop",
  steak:
    "https://images.unsplash.com/photo-1558030006-450675393462?q=90&w=1800&auto=format&fit=crop",
};

function FlameLogo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-12 w-12 items-center justify-center rounded-[18px] border border-orange-500/45 bg-orange-500/10 shadow-[0_0_38px_rgba(255,107,0,0.40)]">
        <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
          <path
            d="M35.2 3.5C37.6 17.4 53 22.5 53 39.4C53 51.9 43.8 61 32 61C20.2 61 11 51.9 11 39.4C11 28.3 18 20.4 25.7 12.1C25.9 21.8 29.2 26.4 33 30.2C35.4 23 38.6 15.2 35.2 3.5Z"
            fill="#ff6b00"
          />
          <path
            d="M31.7 32.8C36.6 38.4 42.2 41.6 42.2 48.5C42.2 54.5 37.8 59.1 32 59.1C26.2 59.1 21.8 54.5 21.8 48.5C21.8 42.8 26.5 38.3 31.7 32.8Z"
            fill="#fff0dc"
          />
        </svg>
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="text-[20px] font-black uppercase tracking-[0.08em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]">
            Delivery
          </div>
          <div className="-mt-1 text-[20px] font-black uppercase tracking-[0.13em] text-[#ff6b00] drop-shadow-[0_0_12px_rgba(255,107,0,0.65)]">
            Ignite
          </div>
        </div>
      )}
    </div>
  );
}

function OrangeButton({ children, href = "#sample" }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5a00] via-[#ff7200] to-[#ff9d20] px-7 py-4 text-sm font-black uppercase tracking-[0.05em] text-white shadow-[0_0_32px_rgba(255,107,0,0.46),inset_0_1px_0_rgba(255,255,255,0.28)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_62px_rgba(255,107,0,0.70),inset_0_1px_0_rgba(255,255,255,0.28)]"
    >
      {children}
      <span className="ml-2 transition group-hover:translate-x-1">→</span>
    </a>
  );
}

function GhostButton({ children, href = "#pricing" }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/[0.07] px-7 py-4 text-sm font-black uppercase tracking-[0.05em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur transition duration-300 hover:border-orange-500/70 hover:bg-orange-500/12"
    >
      {children}
    </a>
  );
}

function LocalImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return <Image src={src} alt={alt} fill priority={priority} className={`object-cover ${className}`} />;
}

function StockImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />;
}

function MiniBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/42 px-4 py-3 text-xs font-black uppercase tracking-[0.09em] text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
      {children}
    </div>
  );
}

function HeroIcon({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="group text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-orange-500/42 bg-orange-500/10 text-3xl shadow-[0_0_35px_rgba(255,107,0,0.20)] transition group-hover:border-orange-500 group-hover:bg-orange-500/18 group-hover:shadow-[0_0_52px_rgba(255,107,0,0.35)]">
        {icon}
      </div>
      <div className="mt-3 text-[12px] font-black uppercase leading-tight tracking-[0.05em] text-white">{title}</div>
      <div className="mt-1 text-[11px] leading-4 text-white/45">{sub}</div>
    </div>
  );
}

function Check({ children, orange = true }: { children: React.ReactNode; orange?: boolean }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-white/70">
      <span
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-black ${
          orange ? "bg-orange-500/15 text-[#ff7a00]" : "bg-green-500/15 text-green-400"
        }`}
      >
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function FoodTile({ src, title }: { src: string; title: string }) {
  return (
    <div className="group relative h-52 overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.05] shadow-[0_22px_80px_rgba(0,0,0,0.38)]">
      <StockImage src={src} alt={title} className="transition duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
      <div className="absolute bottom-4 left-4 max-w-[140px] text-2xl font-black uppercase leading-[0.84] tracking-[-0.04em] text-white">
        {title}
      </div>
    </div>
  );
}

function DataCard({ number, label, footnote }: { number: string; label: string; footnote: string }) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-7 shadow-[0_22px_80px_rgba(0,0,0,0.35)]">
      <div className="text-5xl font-black tracking-[-0.06em] text-[#ff7a00]">{number}</div>
      <p className="mt-4 text-lg font-black leading-6 text-white">{label}</p>
      <p className="mt-4 text-xs leading-5 text-white/42">{footnote}</p>
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

const pricing = [
  {
    name: "Starter DIY",
    price: "$499",
    detail: "Up to 20 images",
    button: "Start DIY",
    features: ["Premium image enhancement", "Ready-to-upload files", "Use anywhere, no restrictions", "Client uploads images"],
  },
  {
    name: "Standard DIY",
    price: "$799",
    detail: "Up to 50 images",
    button: "Choose Standard DIY",
    badge: "Best DIY",
    features: ["Premium image enhancement", "Ready-to-upload files", "Larger menu coverage", "Client uploads images"],
  },
  {
    name: "Starter Managed",
    price: "$899",
    detail: "Up to 20 items",
    button: "Choose Managed",
    features: ["Image enhancement", "Drinks handled", "Headers included", "Uber Eats image upload", "Priority service"],
  },
  {
    name: "Standard Managed",
    price: "$1,299",
    detail: "Up to 50 items",
    button: "Choose Standard Managed",
    badge: "Most Popular",
    highlight: true,
    features: ["Image enhancement", "Drinks handled", "Headers included", "Uber Eats image upload", "Priority service"],
  },
];

export default function PremiumPricingPage() {
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
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(0.7deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: .38; transform: scale(1); }
          50% { opacity: .72; transform: scale(1.09); }
        }
        @keyframes shine {
          0% { transform: translateX(-120%) skewX(-16deg); }
          100% { transform: translateX(220%) skewX(-16deg); }
        }
        html { scroll-behavior: smooth; }
        .di-marquee-left { animation: marquee-left 34s linear infinite; }
        .di-marquee-right { animation: marquee-right 38s linear infinite; }
        .di-float { animation: float-slow 7s ease-in-out infinite; }
        .di-pulse { animation: pulse-glow 4s ease-in-out infinite; }
        .di-shine::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 38%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
          animation: shine 5s ease-in-out infinite;
        }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/72 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <FlameLogo />
          <nav className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.12em] text-white/55 md:flex">
            <a href="#sample" className="transition hover:text-[#ff7a00]">Free sample</a>
            <a href="#proof" className="transition hover:text-[#ff7a00]">Proof</a>
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

      {/* HERO */}
      <section className="relative min-h-[890px] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(255,107,0,0.42),transparent_30%),radial-gradient(circle_at_88%_42%,rgba(255,153,0,0.18),transparent_32%),linear-gradient(90deg,#050505_0%,#050505_36%,rgba(5,5,5,.84)_55%,rgba(5,5,5,.35)_100%)]" />

        {/* MASSIVE HERO IMAGE - replace with /images/hero-burger.png later */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[66%]">
          <StockImage src={STOCK.hero} alt="Cinematic premium burger" className="scale-110 object-[60%_50%] opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/62 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_73%_24%,transparent_0%,rgba(0,0,0,0.12)_32%,rgba(0,0,0,0.86)_88%)]" />
        </div>

        <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="di-pulse absolute right-[-150px] top-[-180px] h-[560px] w-[560px] rounded-full bg-orange-500/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="max-w-[710px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/35 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-orange-200 shadow-[0_0_30px_rgba(255,107,0,0.20)]">
              <span className="h-2 w-2 rounded-full bg-[#ff7a00] shadow-[0_0_18px_rgba(255,107,0,0.9)]" />
              Free 3 image preview available
            </div>

            <div className="mt-7">
              <FlameLogo />
            </div>

            <h1 className="mt-8 text-[66px] font-black uppercase leading-[0.78] tracking-[-0.085em] sm:text-[92px] lg:text-[118px]">
              Premium
              <span className="block">Images.</span>
              <span className="block bg-gradient-to-r from-[#ff5a00] via-[#ff7600] to-[#ffb24a] bg-clip-text text-transparent drop-shadow-[0_0_34px_rgba(255,107,0,0.22)]">
                More Orders.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/72">
              We transform average menu photos into premium delivery-platform visuals designed to increase clicks, improve perceived quality, and make customers order faster.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <MiniBadge>Uber Eats</MiniBadge>
              <MiniBadge>DoorDash</MiniBadge>
              <MiniBadge>Websites</MiniBadge>
              <MiniBadge>Franchise assets</MiniBadge>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <OrangeButton href="#sample">Get Free Sample</OrangeButton>
              <GhostButton href="#pricing">View Packages</GhostButton>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-5 sm:grid-cols-4">
              <HeroIcon icon="📸" title="No Photoshoot" sub="Use existing images" />
              <HeroIcon icon="⚡" title="Fast Turnaround" sub="Preview first" />
              <HeroIcon icon="📈" title="More Clicks" sub="Stronger appeal" />
              <HeroIcon icon="🏆" title="Premium Brand" sub="Storefront polish" />
            </div>
          </div>

          <div className="absolute bottom-14 right-6 hidden max-w-[230px] rounded-full border border-orange-500/65 bg-black/78 p-5 text-center shadow-[0_0_48px_rgba(255,107,0,0.38)] backdrop-blur-xl lg:block">
            <div className="text-lg font-black uppercase leading-tight text-white">
              More Clicks
              <span className="block text-white/70">More Orders</span>
              <span className="block text-[#ff7a00]">More Profit</span>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER FEATURE */}
      <section id="proof" className="relative border-b border-white/10 bg-[#080808] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute left-[-260px] top-20 h-[520px] w-[520px] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-orange-200">
              Transformation proof
            </div>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              Before they read,
              <span className="block text-[#ff7a00]">they look.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/60">
              The biggest impact is not one hero shot — it is making the whole menu feel clean, premium, consistent, and worth ordering from.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-[42px] border border-white/12 bg-white/[0.045] p-4 shadow-[0_35px_130px_rgba(0,0,0,0.62)]">
            <div className="relative grid min-h-[520px] overflow-hidden rounded-[34px] lg:grid-cols-2">
              <div className="relative bg-[#101010] p-7">
                <div className="absolute left-7 top-7 z-10 rounded-xl bg-white/15 px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">
                  Before
                </div>
                <div className="relative h-full min-h-[450px] overflow-hidden rounded-[28px]">
                  <LocalImage src="/images/dish-before.png" alt="Before image" priority className="saturate-[0.72] contrast-[0.86]" />
                  <div className="absolute inset-0 bg-black/52" />
                  <ul className="absolute bottom-7 left-7 space-y-3">
                    {["Dark lighting", "Low quality", "Inconsistent", "Low appetite appeal", "Fewer clicks"].map((x) => (
                      <li key={x} className="flex items-center gap-3 text-sm font-bold text-white/82">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90 text-xs">×</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="relative bg-black p-7">
                <div className="absolute right-7 top-7 z-10 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff9a1f] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">
                  After
                </div>
                <div className="relative h-full min-h-[450px] overflow-hidden rounded-[28px] shadow-[0_0_80px_rgba(255,107,0,0.24)]">
                  <LocalImage src="/images/dish-after.png" alt="After image" priority className="saturate-[1.16] contrast-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-transparent to-transparent" />
                  <ul className="absolute bottom-7 right-7 space-y-3 text-right">
                    {["Bright & vibrant", "High quality", "Consistent style", "High appetite appeal", "More clicks & orders"].map((x) => (
                      <li key={x} className="flex items-center justify-end gap-3 text-sm font-bold text-white/92">
                        {x}
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/90 text-xs">✓</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-orange-500/65 bg-gradient-to-r from-[#ff5a00] to-[#ff9a1f] text-4xl font-black shadow-[0_0_55px_rgba(255,107,0,0.55)] lg:flex">
                →
              </div>
              <div className="absolute bottom-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-orange-500 to-transparent lg:block" />
            </div>
          </div>

          {/* scrolling before/after rail */}
          <div className="mt-12 overflow-hidden">
            <div className="di-marquee-left flex w-max">
              {[...Array(2)].flatMap(() => [
                ["/images/sample-original.png", "/images/sample-enhanced.png", "Burger upgrade"],
                ["/images/header-before.png", "/images/header-after.png", "Storefront banner"],
                ["/images/menu-before.png", "/images/menu-after.png", "Full menu cleanup"],
                ["/images/dish-before.png", "/images/dish-after.png", "Menu item polish"],
              ]).map(([before, after, title], idx) => (
                <div key={idx} className="mx-3 w-[440px] shrink-0 rounded-[30px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="relative h-56 overflow-hidden rounded-2xl bg-black">
                      <LocalImage src={before} alt={`${title} before`} className="saturate-[0.75]" />
                      <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-black">BEFORE</span>
                    </div>
                    <div className="relative h-56 overflow-hidden rounded-2xl bg-black">
                      <LocalImage src={after} alt={`${title} after`} />
                      <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-black">AFTER</span>
                    </div>
                  </div>
                  <div className="mt-4 text-lg font-black uppercase tracking-[-0.03em]">{title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DATA / WHY IT WORKS */}
      <section id="data" className="relative border-b border-white/10 bg-[#050505] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute right-[-220px] top-8 h-[500px] w-[500px] rounded-full bg-orange-500/12 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-orange-200">
              Why images sell
            </div>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              Food photos are not decoration.
              <span className="block text-[#ff7a00]">They are sales assets.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
              Delivery customers make fast visual decisions. Better photos improve clarity, perceived quality, trust, and appetite appeal before the customer even opens the item description.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <DataCard
              number="Photo-first"
              label="Uber Eats tells merchants to showcase food in its best light and gives detailed photo standards."
              footnote="Source: Uber Eats merchant photography guidance and menu catalog photo requirements."
            />
            <DataCard
              number="Platform-ready"
              label="DoorDash requires clear, well-lit, unblurry item photos that properly show the dish."
              footnote="Source: DoorDash merchant photo requirements and Merchant Portal photo guidance."
            />
            <DataCard
              number="Purchase intent"
              label="Research links food photo style with perceived food quality, experiential value, and purchase intention."
              footnote="Source: Liu et al., International Journal of Hospitality Management, 2022."
            />
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl rounded-[30px] border border-white/10 bg-white/[0.045] p-6 text-xs leading-6 text-white/45">
          <p className="font-bold text-white/65">Sources used for supporting claims:</p>
          <p className="mt-2">
            1. Uber Eats, “Restaurant menu photography guidelines” and “User-submitted photo guidelines”.
            2. DoorDash Merchant Learning Center, “What are DoorDash Photo Requirements?” and “How to Add Photos to Your DoorDash Menu”.
            3. Liu, H. et al. (2022), “Process vs. outcome: Effects of food photo types in online consumer reviews on purchase intention”, International Journal of Hospitality Management.
          </p>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="relative bg-[#070707] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute left-[-180px] top-20 h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
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

          <div className="grid gap-5">
            <div className="relative h-80 overflow-hidden rounded-[36px] border border-white/12 bg-black shadow-[0_35px_120px_rgba(0,0,0,0.50)]">
              <StockImage src={STOCK.sushi} alt="Premium sushi banner" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/84 via-black/28 to-transparent" />
              <div className="absolute left-8 top-8 max-w-sm">
                <h3 className="text-5xl font-black uppercase leading-[0.86] tracking-[-0.065em]">
                  Authentic Flavours.
                  <span className="block text-[#ff7a00]">Delivered Fast.</span>
                </h3>
                <div className="mt-5">
                  <OrangeButton href="#sample">Order Now</OrangeButton>
                </div>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <FoodTile src={STOCK.ribs} title="BBQ Ribs" />
              <FoodTile src={STOCK.fries} title="Truffle Fries" />
              <FoodTile src={STOCK.hero2} title="Chicken Burger" />
              <FoodTile src={STOCK.dessert} title="Lotus Dessert" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-white/10 bg-[#0b0b0b] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-5xl font-black uppercase tracking-[-0.06em] sm:text-6xl">
            How it <span className="text-[#ff7a00]">works</span>
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              ["1", "Send us your store link", "Share your Uber Eats or DoorDash store link. We extract your existing menu images."],
              ["2", "We enhance everything", "Your photos are transformed into premium, high-converting visuals that match your brand."],
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

      {/* TESTIMONIALS */}
      <section className="bg-[#070707] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-orange-200">
                Temporary proof section
              </div>
              <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
                Restaurants want
                <span className="block text-[#ff7a00]">the upgrade.</span>
              </h2>
            </div>
            <p className="max-w-md text-white/55">
              Placeholder testimonials for layout only. Replace with real restaurant feedback once the first paid jobs are completed.
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-hidden">
          <div className="di-marquee-right flex w-max">
            {[...Array(2)].flatMap(() => [
              ["Our menu finally looks like the food we actually serve.", "Restaurant owner", "Burger shop · Melbourne"],
              ["The preview made the decision easy. It looked instantly more premium.", "Operator", "Asian restaurant · VIC"],
              ["This made our delivery store feel like a proper brand.", "Manager", "Cafe · South East Melbourne"],
              ["The before and after difference was massive.", "Owner", "Pizza store · Melbourne"],
            ]).map(([quote, name, meta], idx) => (
              <Testimonial key={idx} quote={quote} name={name} meta={meta} />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative border-y border-white/10 bg-[#0b0b0b] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute right-[-200px] top-16 h-[480px] w-[480px] rounded-full bg-orange-500/12 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-orange-200">
              Packages
            </div>
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

      {/* UPDATES / OWNERSHIP */}
      <section id="updates" className="bg-[#070707] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[38px] border border-orange-500/30 bg-orange-500/[0.06] p-8 shadow-[0_0_64px_rgba(255,107,0,0.12)]">
            <div className="inline-flex rounded-full bg-orange-500/15 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-orange-200">
              Managed only
            </div>
            <h2 className="mt-6 text-5xl font-black uppercase tracking-[-0.06em]">Growth Plan</h2>
            <p className="mt-5 text-white/60">Keep your menu current as you add new dishes. Managed clients receive priority updates.</p>
            <div className="mt-7 flex items-end gap-2">
              <span className="text-6xl font-black tracking-[-0.06em]">$149</span>
              <span className="pb-2 text-sm font-black text-white/45">+ GST / month</span>
            </div>
            <p className="mt-2 font-black text-[#ff7a00]">Cheaper than one-off updates</p>
            <ul className="mt-7 space-y-3">
              <Check>Up to 10 new items per month</Check>
              <Check>Image enhancement included</Check>
              <Check>Uber Eats updates handled for you</Check>
              <Check>Priority service</Check>
            </ul>
          </div>

          <div className="rounded-[38px] border border-white/10 bg-white/[0.045] p-8">
            <FlameLogo />
            <h2 className="mt-7 text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em]">
              You own every image.
            </h2>
            <p className="mt-5 max-w-xl text-white/60">
              Use your completed images across Uber Eats, DoorDash, your website, social media, print menus, and future campaigns. No restrictions.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {["Uber Eats", "DoorDash", "Website", "Social Media", "Print Menus", "Franchise Assets"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <span className="text-[#ff7a00]">✓</span>
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE CTA */}
      <section id="sample" className="relative overflow-hidden border-t border-white/10 bg-black px-5 py-20 text-center sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,107,0,0.25),transparent_36%)]" />
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[44px] border border-orange-500/28 bg-white/[0.055] p-9 shadow-[0_0_96px_rgba(255,107,0,0.18)] backdrop-blur-xl sm:p-14">
          <div className="di-shine absolute inset-0 overflow-hidden" />
          <div className="relative flex justify-center">
            <FlameLogo />
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
          <FlameLogo />
          <div>Delivery Ignite — premium restaurant visual upgrades. All prices exclude GST unless stated otherwise.</div>
        </div>
      </footer>
    </main>
  );
}
