"use client";

import React from "react";
import Image from "next/image";


function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-neutral-700">
      <span className="mt-1 shrink-0 text-[#06C167]">✓</span>
      <span>{children}</span>
    </li>
  );
}

export default function PremiumPricingPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F4] text-black">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F7F7F4]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
              ✦
            </div>
            <div>
              <div className="text-sm font-black tracking-tight">Delivery Ignite</div>
              <div className="text-xs text-neutral-500">Restaurant image upgrades</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-neutral-600 md:flex">
            <a href="#sample" className="hover:text-black">Free sample</a>
            <a href="#proof" className="hover:text-black">Proof</a>
            <a href="#pricing" className="hover:text-black">Pricing</a>
            <a href="#updates" className="hover:text-black">Updates</a>
          </nav>

          <a
            href="#sample"
            className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            Get Free Sample →
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute right-[-10rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#06C167]/12 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-[-14rem] h-[30rem] w-[30rem] rounded-full bg-black/5 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">
              <span className="text-[#06C167]">●</span>
              Free 3 image preview available
            </div>

            <h1 className="mt-7 max-w-2xl text-6xl font-black leading-[0.88] tracking-[-0.08em] sm:text-7xl lg:text-8xl">
              Make your menu look worth ordering.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-600">
              Premium food image upgrades for restaurants. Use the files yourself,
              or let us update your Uber Eats visuals for you.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#sample" className="rounded-full bg-[#06C167] px-7 py-4 text-sm font-black text-black shadow-[0_10px_30px_rgba(6,193,103,0.25)] transition hover:bg-[#05ad5c]">
                Get Free Sample →
              </a>
              <a href="#pricing" className="rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-black text-black transition hover:bg-neutral-50">
                View Pricing →
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="text-3xl font-black tracking-tight">3</div>
                <div className="mt-1 text-xs font-medium text-neutral-500">Free sample</div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="text-3xl font-black tracking-tight">$499</div>
                <div className="mt-1 text-xs font-medium text-neutral-500">DIY from</div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="text-3xl font-black tracking-tight">$899</div>
                <div className="mt-1 text-xs font-medium text-neutral-500">Managed from</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[40px] border border-black/10 bg-white p-4 shadow-[0_30px_100px_rgba(0,0,0,0.16)]">
              <div className="rounded-[32px] bg-black p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-3 w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">Before</div>
                    <div className="relative h-72 w-full overflow-hidden rounded-[28px] bg-neutral-800">
                      <Image
                        src="/images/dish-before.png"
                        alt="Burger before image enhancement"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <p className="mt-4 text-xs leading-5 text-white/50">Flat lighting, inconsistent framing, low appetite appeal.</p>
                  </div>
                  <div>
                    <div className="mb-3 w-fit rounded-full bg-[#06C167] px-3 py-1 text-xs font-black text-black">After</div>
                    <div className="relative h-72 w-full overflow-hidden rounded-[28px] bg-black">
                      <Image
                        src="/images/dish-after.png"
                        alt="Burger after image enhancement"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <p className="mt-4 text-xs leading-5 text-white/70">Premium style, stronger texture, platform-ready presentation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-6 hidden rounded-3xl border border-black/10 bg-white p-5 shadow-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#06C167]/15 text-[#06C167]">✓</div>
                <div>
                  <div className="text-sm font-black">You own every image</div>
                  <div className="text-xs text-neutral-500">Use anywhere. No restrictions.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* FULL MENU BEFORE / AFTER */}
      <section id="proof" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">
            Full menu proof
          </div>
          <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-6xl">
            One good image helps. A consistent menu changes everything.
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-600">
            The biggest impact is not one hero shot — it is making the whole menu feel clean,
            premium, and worth ordering from.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[36px] border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-4 w-fit rounded-full bg-neutral-100 px-4 py-2 text-sm font-black">Before</div>
            <div className="relative h-[620px] w-full overflow-hidden rounded-[28px] bg-white">
              <Image
                src="/images/menu-before.png"
                alt="Full menu before image upgrade"
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-5 text-sm leading-6 text-neutral-600">
              Inconsistent lighting, random angles, low quality photos, and no visual brand consistency.
            </p>
          </div>

          <div className="rounded-[36px] border border-black bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
            <div className="mb-4 w-fit rounded-full bg-[#06C167] px-4 py-2 text-sm font-black text-black">After</div>
            <div className="relative h-[620px] w-full overflow-hidden rounded-[28px] bg-white">
              <Image
                src="/images/menu-after.png"
                alt="Full menu after image upgrade"
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-5 text-sm leading-6 text-neutral-600">
              Consistent image style, stronger appetite appeal, cleaner presentation, and a more premium store presence.
            </p>
          </div>
        </div>
      </section>




      {/* HEADER BEFORE / AFTER */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">
              Header upgrade
            </div>
            <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.06em]">
              Your storefront banner should sell the restaurant instantly.
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Headers are often the first thing customers see. We create premium visual headers
              that make the store feel more established and more appetising.
            </p>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[34px] border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-3 w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-black">Before header</div>
              <div className="flex h-44 items-center justify-center rounded-[24px] bg-neutral-200 text-center font-black text-neutral-500">
                IMAGE: HEADER BEFORE<br />Current Uber Eats banner
              </div>
            </div>

            <div className="rounded-[34px] border border-black bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
              <div className="mb-3 w-fit rounded-full bg-[#06C167] px-3 py-1 text-xs font-black text-black">After header</div>
              <div className="flex h-44 items-center justify-center rounded-[24px] bg-gradient-to-r from-black via-neutral-900 to-[#06C167]/40 text-center font-black text-white">
                IMAGE: HEADER AFTER<br />Premium delivery platform banner
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* FREE SAMPLE SECTION */}
      <section id="sample" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="rounded-[40px] bg-black p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.16)] sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold">Free proof of value</div>
              <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                See the upgrade before you pay.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
                We enhance 3 of your images and send a watermarked preview. If you like it, we continue.
              </p>
              <div className="mt-8">
                <a href="#pricing" className="inline-flex rounded-full bg-[#06C167] px-6 py-3 text-sm font-black text-black">
                  Request Free Sample →
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex h-48 items-center justify-center rounded-2xl bg-neutral-700 text-center text-sm font-black text-white/60">
                  IMAGE<br />ORIGINAL
                </div>
                <div className="mt-4 text-sm font-bold">Original</div>
                <div className="mt-1 text-xs text-white/45">Current menu photo</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-300 via-red-500 to-black text-center text-sm font-black text-white">
                  IMAGE<br />ENHANCED
                </div>
                <div className="mt-4 text-sm font-bold">Enhanced</div>
                <div className="mt-1 text-xs text-white/45">Premium upgrade</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06C167] via-orange-400 to-black text-center text-sm font-black text-white">
                  IMAGE<br />WATERMARKED
                </div>
                <div className="mt-4 text-sm font-bold">Watermarked</div>
                <div className="mt-1 text-xs text-white/45">Free preview</div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">Pricing</div>
          <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-6xl">
            DIY or Managed. See both clearly.
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-600">
            No confusing switch. Choose files only, or let us handle the Uber image upload for you.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          <div className="rounded-[30px] border border-neutral-200 bg-white p-7 shadow-sm">
            <h3 className="text-2xl font-bold tracking-tight">Starter DIY</h3>
            <p className="mt-3 min-h-[48px] text-sm leading-6 text-neutral-600">
              We enhance your images and deliver upload-ready files.
            </p>
            <div className="mt-7 text-5xl font-black tracking-tight">$499</div>
            <div className="mt-2 text-sm font-semibold text-neutral-500">Up to 20 images</div>
            <button className="mt-7 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black">Start DIY →</button>
            <div className="my-7 h-px bg-neutral-100" />
            <ul className="space-y-3">
              <CheckItem>Premium image enhancement</CheckItem>
              <CheckItem>Ready-to-upload files</CheckItem>
              <CheckItem>Use anywhere, no restrictions</CheckItem>
              <CheckItem>Client uploads images</CheckItem>
            </ul>
          </div>

          <div className="rounded-[30px] border border-neutral-300 bg-white p-7 shadow-sm">
            <div className="mb-4 w-fit rounded-full bg-black px-3 py-1 text-xs font-black text-white">Best DIY</div>
            <h3 className="text-2xl font-bold tracking-tight">Standard DIY</h3>
            <p className="mt-3 min-h-[48px] text-sm leading-6 text-neutral-600">
              For restaurants upgrading most of their menu visuals.
            </p>
            <div className="mt-7 text-5xl font-black tracking-tight">$799</div>
            <div className="mt-2 text-sm font-semibold text-neutral-500">Up to 50 images</div>
            <button className="mt-7 rounded-full bg-black px-6 py-3 text-sm font-black text-white">Choose Standard DIY →</button>
            <div className="my-7 h-px bg-neutral-100" />
            <ul className="space-y-3">
              <CheckItem>Premium image enhancement</CheckItem>
              <CheckItem>Ready-to-upload files</CheckItem>
              <CheckItem>Larger menu coverage</CheckItem>
              <CheckItem>Client uploads images</CheckItem>
            </ul>
          </div>

          <div className="rounded-[30px] border border-neutral-200 bg-white p-7 shadow-sm">
            <h3 className="text-2xl font-bold tracking-tight">Starter Managed</h3>
            <p className="mt-3 min-h-[48px] text-sm leading-6 text-neutral-600">
              We enhance your visuals and update your Uber Eats images.
            </p>
            <div className="mt-7 text-5xl font-black tracking-tight">$899</div>
            <div className="mt-2 text-sm font-semibold text-neutral-500">Up to 20 items</div>
            <button className="mt-7 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black">Choose Managed →</button>
            <div className="my-7 h-px bg-neutral-100" />
            <ul className="space-y-3">
              <CheckItem>Image enhancement</CheckItem>
              <CheckItem>Drinks handled</CheckItem>
              <CheckItem>Headers included</CheckItem>
              <CheckItem>Uber Eats image upload</CheckItem>
              <CheckItem>Priority service</CheckItem>
            </ul>
          </div>

          <div className="scale-[1.03] rounded-[30px] border border-black bg-black p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <div className="mb-4 w-fit rounded-full bg-[#06C167] px-3 py-1 text-xs font-black text-black">Most Popular</div>
            <h3 className="text-2xl font-bold tracking-tight">Standard Managed</h3>
            <p className="mt-3 min-h-[48px] text-sm leading-6 text-white/65">
              The full done-for-you visual upgrade for serious restaurants.
            </p>
            <div className="mt-7 text-5xl font-black tracking-tight">$1,299</div>
            <div className="mt-2 text-sm font-semibold text-white/60">Up to 50 items</div>
            <button className="mt-7 rounded-full bg-[#06C167] px-6 py-3 text-sm font-black text-black">Choose Standard Managed →</button>
            <div className="my-7 h-px bg-white/10" />
            <ul className="space-y-3">
              <li>✓ Image enhancement</li>
              <li>✓ Drinks handled</li>
              <li>✓ Headers included</li>
              <li>✓ Uber Eats image upload</li>
              <li>✓ Priority service</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="font-black">DIY add-ons</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Drinks Pack $99. Header Pack $99.</p>
          </div>
          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="font-black">Managed includes more</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Headers, drinks, Uber upload, and priority service are included.</p>
          </div>
          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="font-black">Large menus</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Contact us for bulk or custom pricing.</p>
          </div>
        </div>
      </section>




      {/* COMPARISON */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">Comparison</div>
            <h2 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-5xl">
              The difference is who does the work.
            </h2>
            <p className="mt-5 text-neutral-600">
              DIY gives you premium images. Managed gives you premium images plus Uber image upload and priority service.
            </p>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-sm">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-neutral-50 text-sm font-black">
              <div className="px-4 py-4">Feature</div>
              <div className="px-4 py-4">DIY</div>
              <div className="px-4 py-4">Managed</div>
            </div>
            {[
              ["Image enhancement", "Included", "Included"],
              ["Drinks", "$99 add-on", "Included"],
              ["Header banners", "$99 add-on", "Included"],
              ["Uber Eats image upload", "You handle it", "We handle it"],
              ["Priority service", "Standard queue", "Included"],
              ["Best for", "Hands-on owners", "Busy owners"],
            ].map(([a, b, c]) => (
              <div key={a} className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-neutral-100 text-sm last:border-b-0">
                <div className="px-4 py-4 font-semibold text-neutral-800">{a}</div>
                <div className="px-4 py-4 text-neutral-600">{b}</div>
                <div className="px-4 py-4 font-semibold text-black">{c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* UPDATES + COMPLETION */}
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
            <p className="mt-2 font-bold text-[#06C167]">Cheaper than one-off updates</p>
            <ul className="mt-8 space-y-3">
              <CheckItem>Up to 10 new items per month</CheckItem>
              <CheckItem>Image enhancement included</CheckItem>
              <CheckItem>Uber Eats updates handled for you</CheckItem>
              <CheckItem>Priority service</CheckItem>
            </ul>
            <button className="mt-8 rounded-full bg-[#06C167] px-6 py-3 text-sm font-black text-black">Add Updates Plan →</button>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[36px] border border-neutral-200 bg-white p-8 shadow-sm">
              <h3 className="text-3xl font-black tracking-[-0.04em]">Finish your menu</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Completion Packs are available after purchasing a Starter or Standard package to finish remaining menu items.
              </p>
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
              <h3 className="text-2xl font-black tracking-tight">Multi-location restaurants</h3>
              <p className="mt-2 text-sm text-neutral-600">Custom pricing for franchises and groups.</p>
              <button className="mt-7 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black">Contact Us →</button>
            </div>
          </div>
        </div>
      </section>




      {/* OWNERSHIP */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[40px] bg-black p-8 text-white sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="mt-6 text-4xl font-black tracking-[-0.05em]">You own every image.</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
                Use your completed images across Uber Eats, DoorDash, your website, social media,
                print menus, and future campaigns. No restrictions.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Uber Eats", "DoorDash", "Website", "Social Media", "Print Menus", "Franchise Assets"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <span className="text-[#06C167]">✓</span>
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>




      {/* FINAL CTA */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:px-10">
        <div className="rounded-[40px] border border-neutral-200 bg-white p-10 shadow-[0_25px_90px_rgba(0,0,0,0.08)] sm:p-14">
          <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.06em]">Start with 3 free images.</h2>
          <p className="mx-auto mt-5 max-w-xl text-neutral-600">We’ll show the upgrade before you commit. Watermarked samples. No pressure.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button className="rounded-full bg-[#06C167] px-7 py-4 text-sm font-black text-black">Get Free Sample →</button>
            <button className="rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-black text-black">Contact Us →</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 px-5 py-8 text-center text-sm text-neutral-500 sm:px-8 lg:px-10">
        Delivery Ignite — premium restaurant visual upgrades.
      </footer>
    </main>
  );
}
