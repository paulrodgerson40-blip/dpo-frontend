"use client";

import React from "react";
import Image from "next/image";

const img = (name: string) => `/images/${name}`;

const ASSETS = {
  logo: img("logo-delivery-ignite.png"),
  hero: img("burger-hero.png"),
  spread: img("banner-food-spread.png"),
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
    note: "Same parma. Cleaner, sharper and more worth ordering.",
  },
  {
    title: "Sushi Upgrade",
    before: img("beforeb.png"),
    after: img("afterb.png"),
    note: "Same sushi. Better lighting, better first impression.",
  },
  {
    title: "Burger Upgrade",
    before: img("beforec.png"),
    after: img("afterc.png"),
    note: "Same burger. Looks fresher, bigger and more professional.",
  },
  {
    title: "Pizza Upgrade",
    before: img("befored.png"),
    after: img("afterd.png"),
    note: "Same pizza. Warmer, cleaner and easier to choose.",
  },
  {
    title: "Spring Roll Upgrade",
    before: img("beforeA.png"),
    after: img("aftera.png"),
    note: "Same spring roll. More polished without changing the dish.",
  },
];

const pricing = [
  {
    name: "Starter DIY",
    price: "$499",
    detail: "Up to 20 images",
    button: "Start DIY",
    features: [
      "Professional food image upgrade",
      "Ready-to-upload image files",
      "Use anywhere, no restrictions",
      "You upload the finished images",
      "Drinks pack +$99 + GST",
      "Banner pack +$99 + GST",
    ],
  },
  {
    name: "Standard DIY",
    price: "$799",
    detail: "Up to 50 images",
    button: "Choose DIY",
    badge: "Best DIY",
    features: [
      "Professional food image upgrade",
      "Ready-to-upload image files",
      "Larger menu coverage",
      "You upload the finished images",
      "Drinks pack +$99 + GST",
      "Banner pack +$99 + GST",
    ],
  },
  {
    name: "Starter Managed",
    price: "$899",
    detail: "Up to 20 items",
    button: "Choose Managed",
    features: [
      "Professional food image upgrade",
      "Drinks and simple items handled",
      "Store banners included",
      "Uber Eats upload support",
      "Priority turnaround",
    ],
  },
  {
    name: "Standard Managed",
    price: "$1,299",
    detail: "Up to 50 items",
    button: "Choose Managed",
    badge: "Most Popular",
    highlight: true,
    features: [
      "Professional food image upgrade",
      "Drinks and simple items handled",
      "Store banners included",
      "Uber Eats upload support",
      "Priority turnaround",
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

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex min-h-[28px] items-start gap-3 text-sm leading-6 text-white/72">
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


function EvidenceCard({
  number,
  title,
  text,
  source,
  sourceSub,
}: {
  number: string;
  title: string;
  text: string;
  source: string;
  sourceSub: string;
}) {
  return (
    <div className="group flex h-full min-h-[330px] flex-col rounded-[30px] border border-white/10 bg-black/28 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.34)] transition duration-300 hover:border-cyan-300/22 hover:bg-white/[0.045]">
      <div className="flex min-h-[74px] items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-400/8 text-lg font-black text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.14)]">
          {number}
        </div>
        <h3 className="text-xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white">
          {title}
        </h3>
      </div>

      <p className="mt-5 min-h-[126px] text-sm leading-7 text-white/72">{text}</p>

      <div className="mt-auto h-px bg-white/10" />

      <div className="mt-5 flex min-h-[58px] items-center justify-between gap-4">
        <div>
          <div className="text-lg font-black uppercase leading-none tracking-[-0.04em] text-white transition group-hover:text-[#ff7a00]">
            {source}
          </div>
          <div className="mt-1 text-xs font-bold leading-5 text-cyan-100/75">{sourceSub}</div>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/8 text-cyan-100 transition group-hover:border-orange-400/60 group-hover:text-[#ff7a00]">
          ↗
        </div>
      </div>
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



function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] open:border-cyan-300/35 open:bg-cyan-400/[0.06]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-lg font-black uppercase tracking-[-0.02em] text-white">
        <span>{question}</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-black/35 text-2xl leading-none text-cyan-200 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">{answer}</p>
    </details>
  );
}

const faqs = [
  {
    question: "Is this my real food?",
    answer:
      "Yes. We work from your actual menu photos and improve the presentation while keeping the food recognisable and realistic.",
  },
  {
    question: "Why can't I just use AI myself?",
    answer:
      "You can, but getting consistent, realistic and delivery-app-ready results is usually harder than it looks. Most AI tools can change the dish, make food look fake, create inconsistent lighting or produce images that do not match the rest of the menu. Delivery Ignite is built around keeping your actual food recognisable while improving presentation, lighting, atmosphere, sizing and consistency across the whole menu.",
  },
  {
    question: "Do I need a professional photoshoot?",
    answer:
      "No. Most restaurants send normal phone photos. We upgrade what you already have, so you can improve your menu without organising a full shoot.",
  },
  {
    question: "Will the food still look realistic?",
    answer:
      "Yes. The goal is not fake AI food. The goal is to make your real menu look cleaner, more appetising and more professional online.",
  },
  {
    question: "Can I use the images on Uber Eats and DoorDash?",
    answer:
      "Yes. Files are prepared for delivery apps, websites and social media. Managed packages also include Uber Eats upload support.",
  },
  {
    question: "Do I own the final images?",
    answer:
      "Yes. Once completed, the finished images are yours to use on Uber Eats, DoorDash, your website, social media and other restaurant marketing material.",
  },
  {
    question: "Can you match my restaurant style?",
    answer:
      "Yes. A pizza shop, burger store, sushi bar, Chinese restaurant, cafe and dessert store should not all look the same. We style the final images to suit the cuisine, brand feel and delivery-platform presentation.",
  },
  {
    question: "What if my current photos are poor quality?",
    answer:
      "That is completely normal. Many restaurants start with basic phone photos, mixed lighting or inconsistent menu images. That is exactly what this service is designed to improve.",
  },
  {
    question: "What if my menu has drinks too?",
    answer:
      "Drinks can be included. DIY packages can add a drinks pack, and managed packages include drinks and simple items so the whole storefront feels more consistent.",
  },
  {
    question: "How long does it usually take?",
    answer:
      "Most packages are completed within 24 to 72 hours depending on menu size, image quality and whether you choose DIY or managed.",
  },
  {
    question: "What do I receive?",
    answer:
      "Depending on your package, you receive upgraded food images, ready-to-upload files, store banners, drink handling and before-and-after preview examples.",
  },
  {
    question: "What if I have a large menu?",
    answer:
      "For larger menus, multi-location stores or custom requirements, contact us for bulk or custom pricing.",
  },
  {
    question: "Do you guarantee more orders?",
    answer:
      "No one can honestly guarantee sales. What we do is improve the first impression customers see before they choose where to order from.",
  },
];

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
            <a href="#faq" className="transition hover:text-[#ff7a00]">FAQ</a>
          </nav>
          <a
            href="#sample"
            className="whitespace-nowrap rounded-full border border-cyan-300/35 bg-cyan-400/8 px-5 py-3 text-[11px] font-black uppercase tracking-[0.08em] text-white shadow-[0_0_28px_rgba(34,211,238,0.20)] transition hover:border-orange-500/70 hover:bg-orange-500"
          >
            Free Sample →
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
              We help restaurants turn average menu photos into cleaner, more professional delivery-app images that look more worth ordering.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Pill>Uber Eats</Pill>
              <Pill>DoorDash</Pill>
              <Pill>Websites</Pill>
              <Pill>Socials</Pill>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <OrangeButton href="#sample">Free Sample</OrangeButton>
              <GhostButton href="#proof">See Transformations</GhostButton>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-white/10 bg-[#070707] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute left-[-240px] top-[-40px] h-[520px] w-[520px] rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <SectionEyebrow>Built for delivery apps</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              Not fake food.
              <span className="block text-[#ff7a00]">Real food, upgraded.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/72">
              We work from your actual food photos. The dish stays recognisable — it just looks cleaner, fresher and more professional online.
            </p>
            <ul className="mt-8 space-y-3">
              <Check>Keeps your real food recognisable</Check>
              <Check>Gives the whole menu a cleaner look</Check>
              <Check>Helps customers feel confident before they order</Check>
            </ul>
          </div>

          <div className="relative h-[420px] overflow-hidden rounded-[42px] border border-white/12 bg-black shadow-[0_35px_130px_rgba(0,0,0,0.60),0_0_80px_rgba(34,211,238,0.12)]">
            <LocalImage src={ASSETS.spread} alt="Premium multi-cuisine food spread" className="scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section id="menu" className="relative border-b border-white/10 bg-[#080808] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute right-[-260px] top-10 h-[560px] w-[560px] rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="mx-auto max-w-[1500px]">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Menu image upgrade</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              Same menu.
              <span className="block text-[#ff7a00]">Better first impression.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/60">
              Same food, same prices, same restaurant. The upgraded version simply looks cleaner, more trustworthy and easier to order from.
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
                <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ff9d20] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white shadow-[0_0_18px_rgba(34,211,238,0.18)]">
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
            <SectionEyebrow>Storefront first impression</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              From phone photos
              <span className="block text-[#ff7a00]">to a store that looks established.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/72">
              We can also create storefront banners from your own food images, so the whole store feels more consistent and professional.
            </p>
          </div>

          <div className="grid gap-5">
            <div className="relative h-64 overflow-hidden rounded-[32px] border border-white/10 bg-black">
              <LocalImage src={ASSETS.beforeBanner} alt="Before banner" className="object-contain" />
              <span className="absolute left-5 top-5 rounded-full bg-black/75 px-4 py-2 text-xs font-black uppercase tracking-[0.08em]">Before</span>
            </div>
            <div className="relative h-64 overflow-hidden rounded-[32px] border border-cyan-300/35 bg-black shadow-[0_0_70px_rgba(34,211,238,0.18)]">
              <LocalImage src={ASSETS.afterBanner} alt="After banner" className="object-contain" />
              <span className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ff9d20] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] shadow-[0_0_18px_rgba(34,211,238,0.18)]">After</span>
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
              The goal is not fake AI food. The goal is to make your real menu look cleaner, more professional and more worth ordering.
            </p>
          </div>

          <div className="mx-auto mt-9 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Real food photo upgrades",
              "Consistent menu style",
              "Delivery-app ready images",
              "Storefront banners",
              "Ready-to-upload image files",
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
            <SectionEyebrow>Why better photos matter</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
              Your photos decide
              <span className="block">the first click.</span>
              <span className="block text-[#ff7a00]">Then your food does the rest.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/72">
              On delivery apps, customers decide quickly. Before they read the full menu, your photos tell them whether the food feels fresh, safe and worth ordering.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[34px] border border-cyan-300/24 bg-gradient-to-br from-cyan-400/[0.10] to-white/[0.035] p-7 shadow-[0_0_60px_rgba(34,211,238,0.10)]">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Owner takeaway</div>
              <p className="mt-4 text-3xl font-black uppercase leading-[0.94] tracking-[-0.055em] text-white sm:text-4xl">
                Better photos do not just make food look nicer.
                <span className="block text-[#ff7a00]">They make the restaurant feel safer, cleaner and more valuable.</span>
              </p>
            </div>

            <div className="rounded-[34px] border border-cyan-300/24 bg-gradient-to-br from-white/[0.055] to-cyan-400/[0.08] p-7 shadow-[0_0_60px_rgba(34,211,238,0.10)]">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Delivery app reality</div>
              <p className="mt-4 text-3xl font-black uppercase leading-[0.94] tracking-[-0.055em] text-white sm:text-4xl">
                Customers compare your photos before they compare your prices.
                <span className="block text-[#ff7a00]">Better-looking menus win attention first.</span>
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-[40px] border border-cyan-300/24 bg-gradient-to-br from-cyan-400/[0.08] via-white/[0.035] to-black/20 p-6 shadow-[0_0_70px_rgba(34,211,238,0.08),0_30px_110px_rgba(0,0,0,0.45)] sm:p-8">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                  Backed by real customer behaviour
                </div>
                <h3 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[0.88] tracking-[-0.065em] text-white sm:text-5xl">
                  Why better photos make a real difference.
                </h3>
              </div>
              <p className="max-w-md text-sm leading-7 text-white/58">
                Real research and platform guidance point to the same thing: customers judge quickly, visuals shape trust, and food photos need to look clear, accurate and appetising.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              <EvidenceCard
                number="01"
                title="People judge visuals fast."
                text="Princeton research found that people can form visual first impressions after very brief exposure. Online food ordering works the same way: customers make fast visual judgements before they read every detail."
                source="Princeton"
                sourceSub="Psychological Science"
              />
              <EvidenceCard
                number="02"
                title="Food photos affect perceived quality."
                text="Food marketing research has linked photo style with perceived food quality, experience value and purchase intention. Better presentation helps the food feel more desirable before the customer tastes it."
                source="IJHM"
                sourceSub="Hospitality research"
              />
              <EvidenceCard
                number="03"
                title="Platforms care about photo quality."
                text="Uber Eats and DoorDash both publish merchant photo guidance covering lighting, framing, composition and accurate representation. That matters because your photos are part of the customer decision environment."
                source="Uber Eats · DoorDash"
                sourceSub="Merchant photo guidance"
              />
            </div>
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
              Choose DIY if you just want the finished files, or managed if you want us to help handle the image upload work too.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="flex h-full flex-col rounded-[38px] border border-white/10 bg-white/[0.045] p-7 shadow-[0_28px_95px_rgba(0,0,0,0.38)]">
              <div className="flex min-h-[96px] items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Pathway one</div>
                  <h3 className="mt-3 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
                    DIY <span className="text-[#ff7a00]">image files</span>
                  </h3>
                </div>
                <div className="rounded-full border border-white/12 bg-black/45 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white/65">Fastest</div>
              </div>

              <div className="mt-7 grid flex-1 gap-4">
                {[
                  ["1", "You send the images", "Send your current menu photos or share the files you want improved."],
                  ["2", "We upgrade the photos", "We clean up the look, improve the presentation and keep the food realistic."],
                  ["3", "You get the finished files", "Download your new images and use them on delivery apps, your website or socials."],
                ].map(([num, title, text]) => (
                  <div key={num} className="flex min-h-[118px] items-center gap-4 rounded-[26px] border border-white/10 bg-black/28 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/55 text-2xl font-black text-cyan-200 shadow-[0_0_26px_rgba(34,211,238,0.18)]">{num}</div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-[-0.02em] text-white">{title}</h4>
                      <p className="mt-1 text-sm leading-6 text-white/56">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex h-full flex-col rounded-[38px] border border-cyan-300/34 bg-gradient-to-b from-cyan-400/[0.10] to-white/[0.045] p-7 shadow-[0_0_80px_rgba(34,211,238,0.13),0_28px_95px_rgba(0,0,0,0.38)]">
              <div className="flex min-h-[96px] items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Pathway two</div>
                  <h3 className="mt-3 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
                    Managed <span className="text-[#ff7a00]">done with you</span>
                  </h3>
                </div>
                <div className="rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ff9d20] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] shadow-[0_0_18px_rgba(34,211,238,0.18)] text-white shadow-[0_0_28px_rgba(255,107,0,0.26)]">Easiest</div>
              </div>

              <div className="mt-7 grid flex-1 gap-4">
                {[
                  ["1", "Send us your store link", "Share your Uber Eats or DoorDash store link. We review the menu and work out what needs upgrading."],
                  ["2", "We build the package", "Food images, drinks and store banners are prepared in one consistent style."],
                  ["3", "We help with upload", "You get the finished package, with Uber Eats upload support included in managed plans."],
                ].map(([num, title, text]) => (
                  <div key={num} className="flex min-h-[118px] items-center gap-4 rounded-[26px] border border-cyan-300/18 bg-black/30 p-5">
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
              Real feedback can be added here as pilot jobs come in. For now, keep the wording plain and believable.
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-hidden">
          <div className="di-marquee-right flex w-max">
            {[
              ["Our menu finally looks like the food we actually serve.", "Restaurant owner", "Burger shop · Melbourne"],
              ["The before and after made the choice easy.", "Operator", "Asian restaurant · VIC"],
              ["The store looked much cleaner straight away.", "Manager", "Cafe · South East Melbourne"],
              ["Same food, but the menu looks way more professional.", "Owner", "Pizza store · Melbourne"],
              ["Our menu finally looks like the food we actually serve.", "Restaurant owner", "Burger shop · Melbourne"],
              ["The before and after made the choice easy.", "Operator", "Asian restaurant · VIC"],
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
              <span className="block text-[#ff7a00]">Choose what suits you.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/55">
              Start with finished image files, or choose managed if you want upload support included.
            </p>
            <p className="mt-3 text-sm font-black uppercase tracking-[0.08em] text-orange-200/80">
              All prices exclude GST unless stated otherwise.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex h-full min-h-[640px] flex-col rounded-[34px] p-6 ${
                  plan.highlight
                    ? "scale-[1.02] border border-cyan-300/55 bg-gradient-to-b from-cyan-400/[0.11] to-white/[0.045] shadow-[0_0_76px_rgba(34,211,238,0.20),0_0_32px_rgba(255,107,0,0.08)]"
                    : "border border-white/10 bg-white/[0.045]"
                }`}
              >
                <div className="mb-4 flex h-7 items-start">
                  {plan.badge && (
                    <div className="w-fit rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff9a1f] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-white shadow-[0_0_18px_rgba(34,211,238,0.14)]">
                      {plan.badge}
                    </div>
                  )}
                </div>
                <h3 className="min-h-[34px] text-2xl font-black tracking-[-0.03em] text-white">{plan.name}</h3>
                <p className="mt-4 min-h-[78px] text-sm leading-6 text-white/55">
                  For restaurants that want their menu to look cleaner, more professional and more worth ordering.
                </p>
                <div className="mt-5 min-h-[78px]">
                  <div className="text-5xl font-black tracking-[-0.05em]">
                    {plan.price} <span className="text-base text-white/45">+ GST</span>
                  </div>
                  <div className="mt-2 text-sm font-bold text-white/50">{plan.detail}</div>
                </div>
                <a
                  href="#sample"
                  className={`mt-5 flex min-h-[64px] w-full items-center justify-center rounded-full px-5 py-4 text-center text-[13px] font-black uppercase tracking-[0.04em] transition sm:whitespace-nowrap ${
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
        </div>
      </section>



      <section id="contact" className="relative overflow-hidden border-t border-white/10 bg-[#050505] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute left-[-260px] top-[-160px] h-[560px] w-[560px] rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="absolute right-[-220px] bottom-[-180px] h-[520px] w-[520px] rounded-full bg-orange-500/8 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-[42px] border border-cyan-300/22 bg-gradient-to-br from-cyan-400/[0.09] via-white/[0.035] to-black/20 p-8 shadow-[0_0_70px_rgba(34,211,238,0.08),0_30px_110px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
            <div className="max-w-3xl">
              <SectionEyebrow>Contact us</SectionEyebrow>
              <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
                Send your menu.
                <span className="block text-[#ff7a00]">We’ll show you what it could look like.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                Email your Uber Eats link, DoorDash link or a few current menu photos. We can start with 3 free watermarked samples so you can see the upgrade before committing.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <OrangeButton href="mailto:sales@deliveryignite.com.au?subject=Free%20Sample%20Request%20-%20Delivery%20Ignite">
                  Email Sales
                </OrangeButton>
                <GhostButton href="#pricing">View Packages</GhostButton>
              </div>

              <a
                href="mailto:sales@deliveryignite.com.au"
                className="mt-7 inline-flex break-all text-lg font-black tracking-[-0.02em] text-cyan-100 underline decoration-cyan-300/30 underline-offset-8 transition hover:text-[#ff7a00] hover:decoration-orange-400/50"
              >
                sales@deliveryignite.com.au
              </a>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  "Send store link or photos",
                  "Phone photos are fine",
                  "Usually reply same day",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/24 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.08em] text-white/64"
                  >
                    <span className="mr-2 text-cyan-200">✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="relative border-t border-white/10 bg-[#070707] px-5 py-20 sm:px-8 lg:px-10">
        <div className="absolute left-[-220px] top-[-120px] h-[520px] w-[520px] rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Common questions</SectionEyebrow>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-7xl">
              Before you
              <span className="block text-[#ff7a00]">send photos.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/58">
              Simple answers for restaurant owners who want better menu photos without a complicated process.
            </p>
          </div>

          <div className="mt-12 grid gap-4">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      <section id="sample" className="relative overflow-hidden border-t border-white/10 bg-black px-5 py-14 text-center sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.20),transparent_36%)]" />
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[38px] border border-cyan-300/26 bg-white/[0.055] p-8 shadow-[0_0_78px_rgba(34,211,238,0.14)] backdrop-blur-xl sm:p-10">
          <h2 className="relative text-5xl font-black uppercase leading-[0.86] tracking-[-0.075em] sm:text-6xl">
            Ready to make your menu <span className="text-[#ff7a00]">look worth ordering?</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-white/60">
            Start with 3 free watermarked images and see the difference before you commit.
          </p>
          <div className="relative mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <OrangeButton href="mailto:sales@deliveryignite.com.au?subject=Free%20Sample%20Request%20-%20Delivery%20Ignite">Free Sample</OrangeButton>
            <GhostButton href="#pricing">View Packages</GhostButton>
          </div>
        </div>
      </section>

      
<footer className="border-t border-white/10 bg-black px-5 py-10 sm:px-8 lg:px-10">
  <div className="mx-auto grid max-w-7xl gap-8 text-center sm:text-left lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
    <div>
      <div className="text-lg font-black uppercase tracking-[-0.04em] text-white">
        Delivery Ignite
      </div>
      <div className="mt-2 max-w-sm text-sm leading-6 text-white/42">
        Premium restaurant visual upgrades built for Uber Eats, DoorDash, websites and modern delivery brands.
      </div>
    </div>

    <div>
      <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Contact</div>
      <a href="mailto:sales@deliveryignite.com.au" className="mt-3 block text-sm font-bold text-white/62 transition hover:text-[#ff7a00]">
        sales@deliveryignite.com.au
      </a>
      <div className="mt-2 text-xs text-white/38">Melbourne, Australia</div>
    </div>

    <div>
      <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Quick links</div>
      <div className="mt-3 flex flex-col gap-2 text-sm font-bold text-white/50">
        <a href="#pricing" className="transition hover:text-[#ff7a00]">Pricing</a>
        <a href="#faq" className="transition hover:text-[#ff7a00]">FAQ</a>
        <a href="#contact" className="transition hover:text-[#ff7a00]">Free Sample</a>
      </div>
    </div>
  </div>

  <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-center text-xs text-white/30 sm:text-left">
    © 2026 Delivery Ignite. All prices exclude GST unless stated otherwise.
  </div>
</footer>

    </main>
  );
}
