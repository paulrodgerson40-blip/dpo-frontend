"use client";

import React from "react";
import Image from "next/image";

const STOCK = {
  hero:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1800&auto=format&fit=crop",
  sushi:
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1600&auto=format&fit=crop",
  ribs:
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop",
  fries:
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1400&auto=format&fit=crop",
  dessert:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1400&auto=format&fit=crop",
  pizza:
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1600&auto=format&fit=crop",
};

function FlameLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-500/40 bg-orange-500/10 shadow-[0_0_35px_rgba(255,107,0,0.35)]">
        <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
          <path
            d="M34.7 4C36.7 16.8 52 22.8 52 39.2C52 51.1 43.2 60 32 60C20.8 60 12 51.1 12 39.2C12 28.4 18.7 20.8 25.2 13.9C25.8 21.8 29.1 26.2 32.8 29.8C34.5 23.9 37.8 16.6 34.7 4Z"
            fill="#ff6b00"
          />
          <path
            d="M31.8 33.3C36 38.1 41.8 41.4 41.8 48.1C41.8 54.1 37.4 58.5 32 58.5C26.6 58.5 22.2 54.1 22.2 48.1C22.2 42.7 26.4 38.7 31.8 33.3Z"
            fill="#fff1df"
            opacity="0.95"
          />
        </svg>
      </div>
      <div className="leading-none">
        <div className="text-[19px] font-black uppercase tracking-[0.06em] text-white">
          Delivery
        </div>
        <div className="-mt-1 text-[19px] font-black uppercase tracking-[0.10em] text-[#ff6b00]">
          Ignite
        </div>
      </div>
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
      className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff6b00] via-[#ff7a00] to-[#ff9a1f] px-7 py-4 text-sm font-black uppercase tracking-[0.04em] text-white shadow-[0_0_35px_rgba(255,107,0,0.42)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_55px_rgba(255,107,0,0.62)]"
    >
      {children}
      <span className="ml-2 transition group-hover:translate-x-1">→</span>
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
      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-7 py-4 text-sm font-black uppercase tracking-[0.04em] text-white backdrop-blur transition duration-300 hover:border-orange-500/70 hover:bg-orange-500/10"
    >
      {children}
    </a>
  );
}

function IconStat({
  label,
  sub,
  icon,
}: {
  label: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 text-center backdrop-blur-xl transition hover:border-orange-500/40 hover:bg-orange-500/[0.06]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/35 text-[#ff7a00] shadow-[0_0_26px_rgba(255,107,0,0.18)]">
        {icon}
      </div>
      <div className="mt-4 text-sm font-black uppercase tracking-[0.03em] text-white">{label}</div>
      <div className="mt-1 text-xs leading-5 text-white/50">{sub}</div>
    </div>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-white/70">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-xs font-black text-[#ff7a00]">
        ✓
      </span>
      <span>{children}</span>
    </li>
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
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}

function StockImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />;
}

function FoodTile({ src, title }: { src: string; title: string }) {
  return (
    <div className="group relative h-48 overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.05] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <StockImage src={src} alt={title} className="transition duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4 text-2xl font-black uppercase leading-none tracking-[-0.04em] text-white">
        {title}
      </div>
    </div>
  );
}

function Testimonial({ quote, name, meta }: { quote: string; name: string; meta: string }) {
  return (
    <div className="mx-3 w-[340px] shrink-0 rounded-[30px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
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
    highlight: false,
    features: ["Premium image enhancement", "Ready-to-upload files", "Use anywhere, no restrictions", "Client uploads images"],
  },
  {
    name: "Standard DIY",
    price: "$799",
    detail: "Up to 50 images",
    button: "Choose Standard DIY",
    badge: "Best DIY",
    highlight: false,
    features: ["Premium image enhancement", "Ready-to-upload files", "Larger menu coverage", "Client uploads images"],
  },
  {
    name: "Starter Managed",
    price: "$899",
    detail: "Up to 20 items",
    button: "Choose Managed",
    highlight: false,
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
    <main className="min-h-screen overflow-hidden bg-[#070707] text-white">
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
          50% { transform: translateY(-16px) rotate(1deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: .45; transform: scale(1); }
          50% { opacity: .75; transform: scale(1.08); }
        }
        html { scroll-behavior: smooth; }
        .di-marquee-left { animation: marquee-left 34s linear infinite; }
        .di-marquee-right { animation: marquee-right 38s linear infinite; }
        .di-float { animation: float-slow 7s ease-in-out infinite; }
        .di-pulse { animation: pulse-glow 4s ease-in-out infinite; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/72 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <FlameLogo />

          <nav className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.12em] text-white/55 md:flex">
            <a href="#sample" className="transition hover:text-[#ff7a00]">Free sample</a>
            <a href="#proof" className="transition hover:text-[#ff7a00]">Proof</a>
            <a href="#pricing" className="transition hover:text-[#ff7a00]">Pricing</a>
            <a href="#updates" className="transition hover:text-[#ff7a00]">Updates</a>
          </nav>

          <a
            href="#sample"
            className="rounded-full border border-orange-500/40 bg-orange-500/15 px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,107,0,0.22)] transition hover:bg-orange-500"
          >
            Get Free Sample →
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[820px] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,107,0,0.36),transparent_32%),radial-gradient(circle_at_35%_80%,rgba(255,132,0,0.16),transparent_35%),linear-gradient(180deg,#050505_0%,#090909_54%,#0d0d0d_100%)]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="di-pulse absolute right-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-orange-500/25 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-20">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-orange-200 shadow-[0_0_30px_rgba(255,107,0,0.18)]">
              <span className="h-2 w-2 rounded-full bg-[#ff7a00] shadow-[0_0_18px_rgba(255,107,0,0.9)]" />
              Free 3 image preview available
            </div>

            <div className="mt-8">
              <FlameLogo />
            </div>

            <h1 className="mt-7 max-w-3xl text-[54px] font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-[76px] lg:text-[94px]">
              Premium Images.
              <span className="block bg-gradient-to-r from-[#ff6b00] via-[#ff7a00] to-[#ffc069] bg-clip-text text-transparent">
                More Orders.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">
              We transform average menu photos into high-converting delivery-platform-ready visuals that make your store look premium before customers even read the menu.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <OrangeButton href="#sample">Get Free Sample</OrangeButton>
              <GhostButton href="#pricing">View Packages</GhostButton>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Uber Eats", "DoorDash", "Websites", "Franchises"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-white/80 backdrop-blur-xl">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              <IconStat
                label="No Photoshoot"
                sub="Use current images"
                icon={<span className="text-2xl">📸</span>}
              />
              <IconStat
                label="Fast"
                sub="Quick turnaround"
                icon={<span className="text-2xl">⚡</span>}
              />
              <IconStat
                label="More Clicks"
                sub="Stronger visuals"
                icon={<span className="text-2xl">📈</span>}
              />
              <IconStat
                label="Premium"
                sub="Storefront branding"
                icon={<span className="text-2xl">🏆</span>}
              />
            </div>
          </div>

          <div className="relative z-10 min-h-[560px]">
            <div className="di-float absolute right-0 top-4 h-[520px] w-full max-w-[650px] overflow-hidden rounded-[42px] border border-orange-500/20 bg-black shadow-[0_30px_130px_rgba(0,0,0,0.7),0_0_90px_rgba(255,107,0,0.2)]">
              <StockImage src={STOCK.hero} alt="Premium burger hero image" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-6 left-0 max-w-[250px] rounded-full border border-orange-500/60 bg-black/80 p-5 text-center shadow-[0_0_45px_rgba(255,107,0,0.35)] backdrop-blur-xl sm:left-10">
              <div className="text-lg font-black uppercase leading-tight text-white">
                More Clicks
                <span className="block text-white/70">More Orders</span>
                <span className="block text-[#ff7a00]">More Profit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER FEATURE */}
      <section id="proof" className="relative border-b border-white/10 bg-[#090909] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-orange-200">
              Transformation proof
            </div>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl">
              Before they read,
              <span className="block text-[#ff7a00]">they look.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/60">
              The biggest impact is not one hero shot — it is making the whole menu feel clean, premium, consistent, and worth ordering from.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-[40px] border border-white/12 bg-white/[0.045] p-4 shadow-[0_30px_110px_rgba(0,0,0,0.55)]">
            <div className="grid min-h-[450px] overflow-hidden rounded-[32px] lg:grid-cols-2">
              <div className="relative bg-[#101010] p-7">
                <div className="absolute left-6 top-6 z-10 rounded-xl bg-white/15 px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">
                  Before
                </div>
                <div className="relative h-full min-h-[380px] overflow-hidden rounded-[28px]">
                  <LocalImage src="/images/dish-before.png" alt="Before image" priority />
                  <div className="absolute inset-0 bg-black/45" />
                  <ul className="absolute bottom-7 left-7 space-y-3">
                    {["Dark lighting", "Low quality", "Inconsistent", "Low appetite appeal", "Fewer clicks"].map((x) => (
                      <li key={x} className="flex items-center gap-3 text-sm font-bold text-white/80">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90 text-xs">×</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="relative bg-black p-7">
                <div className="absolute right-6 top-6 z-10 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff9a1f] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">
                  After
                </div>
                <div className="relative h-full min-h-[380px] overflow-hidden rounded-[28px] shadow-[0_0_70px_rgba(255,107,0,0.2)]">
                  <LocalImage src="/images/dish-after.png" alt="After image" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <ul className="absolute bottom-7 right-7 space-y-3 text-right">
                    {["Bright & vibrant", "High quality", "Consistent style", "High appetite appeal", "More clicks & orders"].map((x) => (
                      <li key={x} className="flex items-center justify-end gap-3 text-sm font-bold text-white/90">
                        {x}
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/90 text-xs">✓</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
                <div key={idx} className="mx-3 w-[420px] shrink-0 rounded-[30px] border border-white/10 bg-white/[0.055] p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="relative h-52 overflow-hidden rounded-2xl bg-black">
                      <LocalImage src={before} alt={`${title} before`} />
                      <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-black">BEFORE</span>
                    </div>
                    <div className="relative h-52 overflow-hidden rounded-2xl bg-black">
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

      {/* WHAT YOU GET */}
      <section className="relative bg-[#070707] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute left-[-180px] top-20 h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl">
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
            <div className="relative h-72 overflow-hidden rounded-[34px] border border-white/12 bg-black shadow-[0_30px_110px_rgba(0,0,0,0.45)]">
              <StockImage src={STOCK.sushi} alt="Premium sushi banner" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
              <div className="absolute left-7 top-7 max-w-sm">
                <h3 className="text-4xl font-black leading-[0.9] tracking-[-0.05em]">
                  Authentic Flavours. Delivered Fast.
                </h3>
                <OrangeButton href="#sample">Order Now</OrangeButton>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <FoodTile src={STOCK.ribs} title="BBQ Ribs" />
              <FoodTile src={STOCK.fries} title="Truffle Fries" />
              <FoodTile src={STOCK.hero} title="Chicken Burger" />
              <FoodTile src={STOCK.dessert} title="Lotus Dessert" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-white/10 bg-[#0b0b0b] px-5 py-18 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-5xl font-black uppercase tracking-[-0.06em]">
            How it <span className="text-[#ff7a00]">works</span>
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              ["1", "Send us your store link", "Share your Uber Eats or DoorDash store link. We extract your existing menu images."],
              ["2", "We enhance everything", "Your photos are transformed into premium, high-converting visuals that match your brand."],
              ["3", "Receive your package", "Get enhanced images, banners, headers, and all files ready to upload."],
            ].map(([num, title, text]) => (
              <div key={num} className="rounded-[32px] border border-white/10 bg-white/[0.045] p-7 shadow-[0_22px_80px_rgba(0,0,0,0.28)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/50 text-3xl font-black text-[#ff7a00] shadow-[0_0_35px_rgba(255,107,0,0.18)]">
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
              <h2 className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl">
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
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl">
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
                className={`relative rounded-[32px] p-6 ${
                  plan.highlight
                    ? "scale-[1.02] border border-orange-500 bg-gradient-to-b from-orange-500/18 to-white/[0.055] shadow-[0_0_70px_rgba(255,107,0,0.26)]"
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
              <div key={title} className="rounded-[26px] border border-white/10 bg-white/[0.045] p-6">
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
          <div className="rounded-[36px] border border-orange-500/30 bg-orange-500/[0.06] p-8 shadow-[0_0_60px_rgba(255,107,0,0.12)]">
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

          <div className="rounded-[36px] border border-white/10 bg-white/[0.045] p-8">
            <FlameLogo />
            <h2 className="mt-7 text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em]">
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,107,0,0.22),transparent_34%)]" />
        <div className="relative mx-auto max-w-4xl rounded-[42px] border border-orange-500/25 bg-white/[0.055] p-9 shadow-[0_0_90px_rgba(255,107,0,0.16)] backdrop-blur-xl sm:p-14">
          <div className="flex justify-center">
            <FlameLogo />
          </div>
          <h2 className="mt-8 text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] sm:text-7xl">
            Ready to <span className="text-[#ff7a00]">ignite</span> your orders?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-white/60">
            Start with 3 free watermarked images. See the upgrade before you commit.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
