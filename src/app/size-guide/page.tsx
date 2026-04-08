import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Size Guide — The 00s Version",
  description: "Size guide and measurement charts for hoodies, t-shirts, joggers, cargo pants, and accessories from The 00s Version.",
};

// ── Sizing data ──────────────────────────────────────────────────────────────

const HOODIE_SIZES = [
  { size: "XS", chest: "88–91", length: "65", sleeve: "83" },
  { size: "S",  chest: "92–96", length: "67", sleeve: "85" },
  { size: "M",  chest: "97–101", length: "70", sleeve: "87" },
  { size: "L",  chest: "102–107", length: "72", sleeve: "89" },
  { size: "XL", chest: "108–114", length: "74", sleeve: "91" },
  { size: "XXL", chest: "115–122", length: "76", sleeve: "93" },
];

const TEE_SIZES = [
  { size: "XS", chest: "86–89", length: "67", shoulder: "41" },
  { size: "S",  chest: "90–94", length: "69", shoulder: "43" },
  { size: "M",  chest: "95–99", length: "72", shoulder: "45" },
  { size: "L",  chest: "100–105", length: "74", shoulder: "47" },
  { size: "XL", chest: "106–112", length: "77", shoulder: "50" },
  { size: "XXL", chest: "113–120", length: "79", shoulder: "52" },
];

const JOGGER_SIZES = [
  { size: "XS", waist: "64–67", hip: "86–89", inseam: "74" },
  { size: "S",  waist: "68–72", hip: "90–94", inseam: "75" },
  { size: "M",  waist: "73–78", hip: "95–99", inseam: "76" },
  { size: "L",  waist: "79–85", hip: "100–105", inseam: "77" },
  { size: "XL", waist: "86–93", hip: "106–112", inseam: "78" },
  { size: "XXL", waist: "94–102", hip: "113–120", inseam: "79" },
];

const CARGO_SIZES = [
  { size: "W28", waist: "28\"", hip: "86–89", inseam: "30\"" },
  { size: "W30", waist: "30\"", hip: "90–94", inseam: "30\"" },
  { size: "W32", waist: "32\"", hip: "95–100", inseam: "31\"" },
  { size: "W34", waist: "34\"", hip: "101–106", inseam: "31\"" },
  { size: "W36", waist: "36\"", hip: "107–112", inseam: "32\"" },
];

const MEASURE_TIPS = [
  {
    label: "Chest",
    tip: "Measure around the fullest part of your chest, keeping the tape horizontal under your arms. Keep one finger between the tape and your body for a comfortable fit.",
  },
  {
    label: "Waist",
    tip: "Measure around your natural waistline — the narrowest part of your torso, typically about an inch above your navel. Keep the tape snug but not tight.",
  },
  {
    label: "Hip",
    tip: "Stand with your feet together and measure around the fullest part of your hips and seat, approximately 20 cm below your natural waist.",
  },
  {
    label: "Length",
    tip: "For tops: measure from the highest point of your shoulder down to where you want the garment to end. For inseam: measure from the crotch seam down to the ankle.",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Fit"
          title="Size Guide"
          subtitle="All measurements are in cm unless stated. If you are between sizes, we recommend sizing up."
        />

        {/* Hoodies & Sweatshirts */}
        <SizeSection title="Hoodies & Sweatshirts">
          <SizeTable
            columns={["Size", "Chest (cm)", "Length (cm)", "Sleeve (cm)"]}
            rows={HOODIE_SIZES.map((r) => [r.size, r.chest, r.length, r.sleeve])}
          />
        </SizeSection>

        {/* T-Shirts */}
        <SizeSection title="T-Shirts">
          <SizeTable
            columns={["Size", "Chest (cm)", "Length (cm)", "Shoulder (cm)"]}
            rows={TEE_SIZES.map((r) => [r.size, r.chest, r.length, r.shoulder])}
          />
        </SizeSection>

        {/* Bottoms / Joggers */}
        <SizeSection title="Bottoms / Joggers">
          <SizeTable
            columns={["Size", "Waist (cm)", "Hip (cm)", "Inseam (cm)"]}
            rows={JOGGER_SIZES.map((r) => [r.size, r.waist, r.hip, r.inseam])}
          />
        </SizeSection>

        {/* Cargo Pants */}
        <SizeSection title="Cargo Pants">
          <p className="text-sm text-neutral-500 mb-4">
            Cargo pants are sized in waist inches. Inseam is also given in inches. Hip measurements are in cm.
          </p>
          <SizeTable
            columns={["Size", "Waist (in)", "Hip (cm)", "Inseam (in)"]}
            rows={CARGO_SIZES.map((r) => [r.size, r.waist, r.hip, r.inseam])}
          />
        </SizeSection>

        {/* Accessories / Caps */}
        <SizeSection title="Accessories / Caps">
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-6">
            <p className="text-sm font-black uppercase tracking-wider text-[#C9A84C] mb-2">One Size</p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              All caps and headwear are designed to fit head circumferences of approximately{" "}
              <span className="text-neutral-200 font-semibold">54–60 cm</span>. Most styles feature
              an adjustable strap or snapback closure to accommodate the full range. If your head
              circumference is outside this range, please contact us before ordering.
            </p>
          </div>
        </SizeSection>

        {/* How to Measure */}
        <div className="mb-12">
          <h2 className="text-base font-black uppercase tracking-tight text-[#C9A84C] mb-6">
            How to Measure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MEASURE_TIPS.map(({ label, tip }) => (
              <div
                key={label}
                className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5"
              >
                <p className="text-sm font-black uppercase tracking-wide text-neutral-200 mb-2">
                  {label}
                </p>
                <p className="text-sm text-neutral-400 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sizing note */}
        <div className="mb-12 border-l-2 border-[#C9A84C]/40 pl-5">
          <p className="text-sm text-neutral-400 leading-relaxed">
            <span className="text-neutral-200 font-semibold">Note:</span> All garments are
            pre-washed and pre-shrunk, so measurements are post-wash stable. Measurements are taken
            from the garment lying flat and may vary ± 1–2 cm due to manufacturing tolerances.
            If you are between sizes, we recommend sizing up for a relaxed fit.
          </p>
        </div>

        <FooterNav />
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-12">
      <p className="text-[11px] uppercase tracking-[0.4em] text-[#C9A84C] mb-3">{eyebrow}</p>
      <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4">{title}</h1>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#C9A84C]/30 to-transparent" />
      </div>
      {subtitle && (
        <p className="text-sm text-neutral-500 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

function SizeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-base font-black uppercase tracking-tight text-[#C9A84C] mb-5">{title}</h2>
      {children}
    </div>
  );
}

function SizeTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-sm border border-[#1a1a1a]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#111111] border-b border-[#1a1a1a]">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-[#C9A84C]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row[0]}
              className={`border-b border-[#1a1a1a] last:border-0 ${
                i % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#0a0a0a]"
              }`}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 ${
                    j === 0
                      ? "font-black text-neutral-200 uppercase tracking-wide text-[11px]"
                      : "text-neutral-400"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FooterNav() {
  return (
    <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-4">
      {[
        { href: "/faq", label: "FAQ" },
        { href: "/returns", label: "Returns Policy" },
        { href: "/cookie-policy", label: "Cookie Policy" },
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms & Conditions" },
      ].map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-xs text-neutral-500 hover:text-[#C9A84C] transition-colors uppercase tracking-wider"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
