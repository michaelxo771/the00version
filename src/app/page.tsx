import Link from "next/link";
import { getFeaturedProducts, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import EmailSignup from "@/components/EmailSignup";
import CountdownTimer from "@/components/CountdownTimer";
import CyclingText from "@/components/CyclingText";

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div className="flex flex-col">
      {/* ===== HERO ===== */}
      <section className="relative flex items-center justify-center overflow-hidden pt-24 pb-12 min-h-[92vh]">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.08)_0%,_transparent_65%)]" />

        {/* Side decorative lines */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 h-48 w-[1px] bg-gradient-to-b from-transparent via-[#C9A84C]/30 to-transparent hidden lg:block" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 h-48 w-[1px] bg-gradient-to-b from-transparent via-[#C9A84C]/30 to-transparent hidden lg:block" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-10 bg-[#C9A84C]/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A84C]">
              Est. 2024 — Premium Streetwear
            </span>
            <div className="h-[1px] w-10 bg-[#C9A84C]/50" />
          </div>

          {/* Main title */}
          <h1 className="font-black leading-none mb-1">
            <span
              className="block gold-shimmer leading-none"
              style={{ fontWeight: 900, fontSize: "clamp(3rem,10vw,8rem)" }}
            >
              THE 00s
            </span>
            <span
              className="block text-neutral-200 tracking-[0.3em] uppercase"
              style={{ fontWeight: 900, fontSize: "clamp(1.4rem,4.5vw,4rem)" }}
            >
              VERSION
            </span>
          </h1>

          {/* Cycling era text */}
          <p className="text-[#C9A84C]/80 text-sm sm:text-base font-semibold uppercase tracking-[0.2em] mt-4 mb-3 h-6">
            <CyclingText />
          </p>

          {/* Tagline */}
          <p className="text-neutral-500 text-sm mt-2 mb-7 max-w-sm mx-auto leading-relaxed">
            Premium streetwear rooted in early 2000s culture.
            Every piece tells a story. Every drop is an era.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="btn-gold px-8 py-3.5 text-sm rounded inline-block"
            >
              Shop the Collection
            </Link>
            <Link
              href="/products?category=New"
              className="btn-outline-gold px-8 py-3.5 text-sm rounded inline-block"
            >
              New Drops
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 mt-10 pt-8 border-t border-[#1a1a1a]">
            {[
              { value: "100%", label: "Premium Cotton" },
              { value: "00s", label: "Era Inspired" },
              { value: "Ltd.", label: "Drops Only" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg sm:text-xl font-black gold-text">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080808] to-transparent" />
      </section>

      {/* ===== MARQUEE TICKER ===== */}
      <div className="bg-[#C9A84C] overflow-hidden py-3">
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{ animation: "marquee 25s linear infinite" }}
        >
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="flex gap-8 flex-shrink-0">
                {[
                  "New Drop Available",
                  "Free Shipping on €150+",
                  "Limited Edition Pieces",
                  "Premium Quality",
                  "Early 2000s Aesthetic",
                  "Shop Now",
                ].map((text, j) => (
                  <span
                    key={j}
                    className="text-[#080808] text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-8"
                  >
                    {text}
                    <span className="text-[#080808]/40">✦</span>
                  </span>
                ))}
              </div>
            ))}
        </div>
      </div>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-2">The Selection</p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-neutral-400 hover:text-[#C9A84C] transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link href="/products" className="btn-outline-gold px-8 py-3 text-xs rounded inline-block">
            View All Products
          </Link>
        </div>
      </section>

      {/* ===== COUNTDOWN TIMER ===== */}
      <CountdownTimer />

      {/* ===== BRAND STORY SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#0d0d0d]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(201,168,76,0.06)_0%,_transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-4">The Story</p>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight mb-6">
                Born From
                <br />
                <span className="gold-text">The Era</span>
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Early 2000s rap culture wasn&apos;t just music — it was an entire visual language.
                Rocawear. Sean John. G-Unit. Those labels built something bigger than clothes.
                They built an identity.
              </p>
              <p className="text-neutral-400 leading-relaxed mb-8">
                The 00s Version is our tribute to that era, rebuilt with premium materials and
                a modern cut. We didn&apos;t copy the aesthetic — we evolved it.
              </p>
              <Link href="/products" className="btn-gold px-8 py-4 text-sm rounded inline-block">
                Shop the Vision
              </Link>
            </div>

            {/* Visual element */}
            <div className="relative">
              <div className="aspect-square bg-[#111111] rounded-sm border border-[#1a1a1a] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 border-8 border-[#C9A84C]/5 m-6 rounded-sm" />
                <div className="absolute inset-0 border border-[#C9A84C]/10 m-3" />
                <div className="text-center z-10">
                  <div className="gold-shimmer text-6xl sm:text-8xl font-black tracking-tighter leading-none mb-2">
                    00s
                  </div>
                  <div className="text-neutral-600 text-sm uppercase tracking-[0.4em]">
                    Version
                  </div>
                </div>
                {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-4 h-4`}>
                    <div className="w-full h-[1px] bg-[#C9A84C]/60" />
                    <div className={`w-[1px] h-full bg-[#C9A84C]/60 ${i % 2 === 0 ? "ml-0" : "ml-auto"}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-2">Reviews</p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            What They&apos;re Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Jordan M.",
              location: "London, UK",
              rating: 5,
              review:
                "Copped the OG Hoodie and it's insane quality. The weight of the fabric feels like proper premium — not that cheap stuff other brands pass off. The embroidery is clean and precise. Worth every penny.",
              product: "OG Heavyweight Hoodie",
              verified: true,
            },
            {
              name: "Chris T.",
              location: "Paris, FR",
              rating: 5,
              review:
                "The Velour Tracksuit is everything. Brings back those 2000s vibes but feels current at the same time. Got so many compliments wearing it out. The fit is perfect — not boxy, not skinny. Just right.",
              product: "Velour Tracksuit Set",
              verified: true,
            },
            {
              name: "Marcus L.",
              location: "Amsterdam, NL",
              rating: 5,
              review:
                "Slept on this brand until a friend put me on. The Platinum Tee is a different level of quality. Heavy, soft, and the gold foil print hasn't cracked after multiple washes. The 00s Version is the real thing.",
              product: "Platinum Edition Tee",
              verified: true,
            },
          ].map((review) => (
            <div
              key={review.name}
              className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-6 flex flex-col gap-4 hover:border-[#C9A84C]/20 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array(review.rating).fill(null).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#C9A84C]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Review text */}
              <p className="text-neutral-400 text-sm leading-relaxed flex-1">
                &ldquo;{review.review}&rdquo;
              </p>

              {/* Gold divider */}
              <div className="h-[1px] bg-gradient-to-r from-[#C9A84C]/30 to-transparent" />

              {/* Author */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-neutral-200">{review.name}</p>
                    {review.verified && (
                      <span className="text-[9px] uppercase tracking-wider text-green-400/80 font-semibold">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-600 mt-0.5">{review.location}</p>
                </div>
                <p className="text-[10px] text-neutral-700 text-right leading-tight">
                  {review.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES STRIP ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-2">Browse</p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: "Hoodies", count: "2 styles" },
            { name: "T-Shirts", count: "2 styles" },
            { name: "Bottoms", count: "2 styles" },
            { name: "Outerwear", count: "1 style" },
            { name: "Sets", count: "1 style" },
            { name: "Accessories", count: "1 style" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="group relative bg-[#111111] border border-[#1a1a1a] hover:border-[#C9A84C]/40 rounded-sm p-8 flex flex-col justify-between transition-all duration-200 hover:bg-[#111111]/80"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] mb-2">{cat.count}</p>
                <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-[#C9A84C] transition-colors">
                  {cat.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-6 text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">
                <span className="uppercase tracking-widest">Shop</span>
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-0 right-0 w-[1px] h-8 bg-[#C9A84C]" />
                <div className="absolute top-0 right-0 w-8 h-[1px] bg-[#C9A84C]" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ALL PRODUCTS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-2">Full Collection</p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              All Pieces
            </h2>
          </div>
          <span className="text-sm text-neutral-600">{products.length} items</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== AS SEEN ON TIKTOK ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#1a1a1a]">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-2">Social</p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-2">
            As Seen On TikTok
          </h2>
          <a
            href="https://tiktok.com/@the00sversion"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow @the00sversion on TikTok"
            className="inline-flex items-center gap-2 text-sm text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors font-semibold"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.01a8.17 8.17 0 004.78 1.52V7.08a4.85 4.85 0 01-1.01-.39z"/>
            </svg>
            @the00sversion
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <a
              key={i}
              href="https://tiktok.com/@the00sversion"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch video ${i} on TikTok`}
              className="group relative bg-[#111111] aspect-[9/16] sm:aspect-square rounded-sm border border-[#1a1a1a] hover:border-[#C9A84C]/40 overflow-hidden transition-all"
            >
              {/* Placeholder thumbnail */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center group-hover:bg-[#C9A84C]/20 transition-colors">
                  <svg className="w-5 h-5 text-[#C9A84C] ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-600">Watch on TikTok</span>
              </div>
              {/* Corner decoration */}
              <div className="absolute top-2 left-2 text-[9px] uppercase tracking-widest text-[#C9A84C]/40 font-bold">@the00sversion</div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://tiktok.com/@the00sversion"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold px-8 py-3 text-xs rounded inline-block"
          >
            Follow Us on TikTok
          </a>
        </div>
      </section>

      {/* ===== EMAIL SIGNUP ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#111111] to-[#0d0d0d]" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

        <div className="relative max-w-xl mx-auto text-center px-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-3">First to Know</p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
            Join the Inner Circle
          </h2>
          <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
            Get early access to new drops, exclusive discounts,
            and updates straight to your inbox.
          </p>
          <EmailSignup />
        </div>
      </section>
    </div>
  );
}
