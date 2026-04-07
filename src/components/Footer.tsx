import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#1a1a1a] mt-20">
      {/* Gold divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="gold-shimmer text-3xl font-black tracking-[0.08em] uppercase leading-none block">
                THE 00s VERSION
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
              Premium streetwear rooted in early 2000s culture.
              Every piece tells a story. Every drop is an era.
            </p>
            <div className="flex gap-4 mt-6">
              {["IG", "TW", "TT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 border border-[#2a2a2a] hover:border-[#C9A84C] text-neutral-500 hover:text-[#C9A84C] rounded flex items-center justify-center text-[10px] font-bold tracking-widest transition-all"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-4">Shop</h4>
            <ul className="space-y-3">
              {["All Products", "Hoodies", "T-Shirts", "Bottoms", "Outerwear", "Accessories"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/products${item !== "All Products" ? `?category=${item}` : ""}`}
                    className="text-sm text-neutral-500 hover:text-neutral-200 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-4">Info</h4>
            <ul className="space-y-3">
              {["About", "Size Guide", "Shipping & Returns", "Care Instructions", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-neutral-500 hover:text-neutral-200 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-neutral-600 text-xs tracking-widest uppercase">
            &copy; {new Date().getFullYear()} The 00s Version. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a key={item} href="#" className="text-neutral-600 text-xs hover:text-neutral-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
