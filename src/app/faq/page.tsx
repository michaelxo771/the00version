import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — The 00s Version",
  description: "Frequently asked questions about shipping, returns, sizing, payments, and more at The 00s Version.",
};

// ── FAQ data ──────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How long does shipping take?",
    a: (
      <>
        We offer three shipping options at checkout:
        <ul className="mt-3 space-y-2">
          {[
            ["Standard", "5–7 business days. Free on orders over €150."],
            ["Express", "2–3 business days."],
            ["Overnight", "Next business day (order before 1 pm)."],
          ].map(([method, detail]) => (
            <li key={method as string} className="flex gap-3">
              <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">—</span>
              <span>
                <span className="text-neutral-200 font-semibold">{method}:</span> {detail}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Delivery times are estimates and begin from the point of dispatch, not the order date.
          You&apos;ll receive a tracking link via email once your order ships.
        </p>
      </>
    ),
  },
  {
    q: "How do I return an item?",
    a: (
      <>
        <p>
          You have a <span className="text-neutral-200 font-semibold">14-day return window</span> from
          the date of delivery, in line with EU Consumer Rights Directive 2011/83/EU.
        </p>
        <p className="mt-3">
          To start a return, email us at{" "}
          <a
            href="mailto:returns@the00sversion.com"
            className="text-[#C9A84C] hover:underline"
          >
            returns@the00sversion.com
          </a>{" "}
          with your order number and the item(s) you&apos;d like to return. We&apos;ll send you a
          pre-paid returns label for all EU orders. Items must be unworn, unwashed, and with original
          tags attached. Full details are in our{" "}
          <Link href="/returns" className="text-[#C9A84C] hover:underline">
            Returns Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    q: "What sizes do you stock?",
    a: (
      <>
        <p>
          Most items — hoodies, sweatshirts, t-shirts, and joggers — are available in{" "}
          <span className="text-neutral-200 font-semibold">XS through XXL</span>.
        </p>
        <p className="mt-3">
          Cargo pants are sized in waist inches and available in{" "}
          <span className="text-neutral-200 font-semibold">W28 through W36</span>. Accessories and
          caps are one size with an adjustable fit for head circumferences of 54–60 cm.
        </p>
        <p className="mt-3">
          For full measurements, visit our{" "}
          <Link href="/size-guide" className="text-[#C9A84C] hover:underline">
            Size Guide
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    q: "Do you ship across the EU?",
    a: (
      <>
        <p>
          Yes — we ship to all EU member states. Standard delivery is free on orders over{" "}
          <span className="text-neutral-200 font-semibold">€150</span>. Orders under €150 incur a
          flat-rate shipping fee displayed at checkout.
        </p>
        <p className="mt-3">
          We also ship internationally outside the EU. International shipping rates and estimated
          delivery times are calculated at checkout based on your location. Please note that import
          duties and taxes for non-EU destinations are the responsibility of the customer.
        </p>
      </>
    ),
  },
  {
    q: "How do I use a discount code?",
    a: (
      <p>
        Discount codes can be entered during checkout. On the checkout page, look for the{" "}
        <span className="text-neutral-200 font-semibold">Promo Code</span> field and type or paste
        your code before completing payment. The discount will be applied to your order total
        automatically. Codes are case-insensitive and cannot be combined with other promotions
        unless explicitly stated.
      </p>
    ),
  },
  {
    q: "Are your clothes pre-shrunk?",
    a: (
      <p>
        Yes. All garments are pre-washed and pre-shrunk before dispatch, so the measurements you
        see in our{" "}
        <Link href="/size-guide" className="text-[#C9A84C] hover:underline">
          Size Guide
        </Link>{" "}
        are post-wash stable. We recommend washing at 30°C on a gentle cycle and air drying to
        maintain the quality and shape of your garment over time.
      </p>
    ),
  },
  {
    q: "When will sold out items be back in stock?",
    a: (
      <>
        <p>
          We drop new stock in limited runs, and items can sell out fast. The best way to stay
          ahead of restocks and new releases is to follow us on TikTok at{" "}
          <span className="text-neutral-200 font-semibold">@the00sversion</span>, where we announce
          drops before they go live.
        </p>
        <p className="mt-3">
          You can also sign up to our newsletter at the bottom of the homepage to get drop
          notifications directly to your inbox.
        </p>
      </>
    ),
  },
  {
    q: "What payment methods do you accept?",
    a: (
      <>
        <p>
          We accept all major credit and debit cards — Visa, Mastercard, American Express, and
          Maestro — processed securely through{" "}
          <span className="text-neutral-200 font-semibold">Stripe</span>. All transactions are
          encrypted with SSL/TLS and we do not store your card details.
        </p>
        <p className="mt-3">
          Additional payment methods may be available at checkout depending on your location
          (such as Apple Pay or Google Pay where supported by your browser and device).
        </p>
      </>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Support"
          title="FAQ"
          subtitle="Got a question? Here are the answers to the ones we get asked most."
        />

        <div className="space-y-4">
          {FAQS.map(({ q, a }) => (
            <FAQCard key={q} question={q} answer={a} />
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-14 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-7">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-2">Still need help?</p>
          <p className="text-sm text-neutral-400 leading-relaxed mb-4">
            If your question isn&apos;t covered above, reach out and we&apos;ll get back to you
            within one business day.
          </p>
          <a
            href="mailto:hello@the00sversion.com"
            className="inline-block text-xs font-black uppercase tracking-widest text-[#C9A84C] border border-[#C9A84C]/40 px-5 py-2.5 hover:bg-[#C9A84C]/10 transition-colors"
          >
            Contact Us
          </a>
        </div>

        <FooterNav />
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

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
        <p className="text-sm text-neutral-400 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

function FAQCard({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-6">
      <h2 className="text-sm font-black uppercase tracking-wide text-[#C9A84C] mb-3">
        {question}
      </h2>
      <div className="text-sm text-neutral-400 leading-relaxed">{answer}</div>
    </div>
  );
}

function FooterNav() {
  return (
    <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-4">
      {[
        { href: "/size-guide", label: "Size Guide" },
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
